import { useState, useEffect } from "react";
import FloorPlan from "./components/FloorPlan";
import "./index.css";

const POLL_INTERVAL = 3000;

async function fetchOccupancy() {
  const res = await fetch("/occupancy");

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();

  // Backend currently returns one room object,
  // so wrap it in an array for FloorPlan.
  return Array.isArray(data) ? data : [data];
}

export default function App() {
  const [floor, setFloor]   = useState("7");
  const [status, setStatus] = useState([]);   // always an array

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const data = await fetchOccupancy();
        console.log('fetchOccupancy →', data);
        if (alive) setStatus(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    }
    load();
    const id = setInterval(load, POLL_INTERVAL);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="dropdown">
          <button className="dropdown-btn">FLOOR {floor} ▾</button>
        </div>
        {/* time picker and slider removed */}
      </header>

      <FloorPlan
        floor={floor}
        floorFile={`/floor${floor}.png`}
        status={status}
      />
    </div>
  );
}