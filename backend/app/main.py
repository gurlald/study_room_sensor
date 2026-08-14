from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class OccupancyData(BaseModel):
    occupied: bool
    distance: float

@app.get("/")
def root():
    return {"message": "Study room sensor API is running"}

@app.post("/occupancy")
def receive_occupancy(data: OccupancyData):
    print("\n===== DATA RECEIVED =====")
    print(f"Occupied: {data.occupied}")
    print(f"Distance: {data.distance} m")
    print("=========================\n")

    return {
        "success": True,
        "message": "Occupancy data received"
    }