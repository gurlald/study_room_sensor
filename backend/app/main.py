import os, datetime
import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from psycopg_pool import ConnectionPool

app = FastAPI()

load_dotenv()                                        
DB_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/iot_rooms"
)

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


class OccupancyData(BaseModel):
    occupied: bool
    distance: float
    room_id: int

last_data: OccupancyData | None = None

"""
@app.get("/occupancy")
def root():
    return {"message": "Study room sensor API is running"}
"""


@app.get("/occupancy")
def view_last(cur=Depends(with_cursor)):
    if last_data:
        return last_data

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
 
    cur.execute(
        "INSERT INTO occupancy_events (room_id, occupied, distance_m)"
        "VALUES (%s, %s, %s);",
        (data.room_id, data.occupied, data.distance),
    )
    cur.connection.commit()

    print("\n===== DATA RECEIVED =====")
    print(f"Room     : {data.room_id}")
    print(f"Occupied : {data.occupied}")
    print(f"Distance : {data.distance} m")
    print("=========================\n")

    return {"success": True, "message": "Occupancy data stored"}