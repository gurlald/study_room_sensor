from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class OccupancyData(BaseModel):
    occupied: bool
    distance: float

last_data: OccupancyData | None = None

"""
@app.get("/occupancy")
def root():
    return {"message": "Study room sensor API is running"}
"""


@app.get("/occupancy")
def view_last():
    return last_data or {"message": "No data received yet"}

@app.post("/occupancy")
def receive_occupancy(data: OccupancyData):
    global last_data
    last_data = data

    print("\n===== DATA RECEIVED =====")
    print(f"Occupied: {data.occupied}")
    print(f"Distance: {data.distance} m")
    print("=========================\n")

    return {
        "success": True,
        "message": "Occupancy data received"
    }