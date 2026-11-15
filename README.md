# Study Room Sensor Occupancy Monitoring System

A real time occupancy monitoring system for study rooms. An ESP32 reads presence and distance data from an LD2410C mmWave sensor, sends it over WiFi to a FastAPI backend, and a React dashboard shows which rooms are free on a color coded floor plan.

## Demo Video:

https://github.com/user-attachments/assets/ccd723e6-5662-46ab-99a4-7f985c2c73e0

## Features:
- Presence and distance detection up to 6 m using the LD2410C sensor
- ESP32 firmware that interprets sensor data over UART and posts readings to a REST API over Wi-Fi
- FastAPI backend that stores readings in PostgreSQL
- React dashboard that polls the API every 3 seconds and overlays room status (available or occupied) on a floor plan
- Event history in PostgreSQL, including occupancy events, distance measurements, timestamps with 50+ events logged during testing
