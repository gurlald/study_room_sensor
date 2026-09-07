import os, datetime
import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from psycopg_pool import ConnectionPool

app = FastAPI()

# Load environment variables from .env file
load_dotenv()                                        
DB_URL = os.getenv(
    "DATABASE_URL",
)

# Maintain a pool of connections so that database connections can be resused across requests
pool = ConnectionPool(
    conninfo=DB_URL,
    min_size=1,
    max_size=5,
    kwargs={"row_factory": dict_row},
)

def with_cursor():
    with pool.connection() as conn:
        with conn.cursor() as cur:
            yield cur

# Defines the data expected from the ESP32
class OccupancyData(BaseModel):
    occupied: bool
    distance: float
    room_id: int

# Stores the most recently received sensor data in memory
last_data: OccupancyData | None = None

# GET endpoint used by the frontend for the latest occupancy data
@app.get("/occupancy")
def view_last(cur=Depends(with_cursor)):
    # Return the most recent reading if the server has received occupancy data since starting
    if last_data:
        return last_data

    # If the server just started retrieve the most recent reading from PostgreSQL
    cur.execute(
        "SELECT room_id, occupied, distance_m, recorded_at "
        "FROM occupancy_events "
        "ORDER BY recorded_at DESC LIMIT 1;"
     )
    row = cur.fetchone()
    if not row:
        return {"message": "No data received yet"}
    return {
        "room_id":   row["room_id"],
        "occupied":  row["occupied"],
        "distance":  row["distance_m"],
        "updated_at": row["recorded_at"],
    }

@app.post("/occupancy")
    
def receive_occupancy(data: OccupancyData, cur=Depends(with_cursor)):
    global last_data
    last_data = data

    # Store the reading in PostgreSQL database for historical data
    cur.execute(
        "INSERT INTO occupancy_events (room_id, occupied, distance_m)"
        "VALUES (%s, %s, %s);",
        (data.room_id, data.occupied, data.distance),
    )
    cur.connection.commit()

    # Print received data to the backend terminal
    print("\n===== DATA RECEIVED =====")
    print(f"Room     : {data.room_id}")
    print(f"Occupied : {data.occupied}")
    print(f"Distance : {data.distance} m")
    print("=========================\n")

    return {"success": True, "message": "Occupancy data stored"}