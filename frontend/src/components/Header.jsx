import { useState } from "react";

// ============================================================
// FLOOR LIST — add new floors here (must match PNG filenames
// placed in /public, and match the floor keys in roomCoords.js)
// ============================================================
const FLOORS = [
  { num: 7, file: "floor7.png" },
  { num: 6, file: "floor6.png" },
];

export default function Header({ selectedFloor, onFloorChange }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="dropdown">
        <button
          className="dropdown-btn"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>FLOOR {selectedFloor.num}</span>
          <svg className="chevron" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>

        {menuOpen && (
          <ul className="dropdown-menu open">
            {FLOORS.map((floor) => (
              <li
                key={floor.num}
                onClick={() => {
                  onFloorChange(floor);
                  setMenuOpen(false);
                }}
              >
                Floor {floor.num}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dropdown">
        <button className="dropdown-btn" id="time-btn">
          <span>6:15 p.m.</span>
          <svg className="chevron" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
      </div>

      <input
        type="range"
        className="time-slider"
        min="0"
        max="100"
        defaultValue="80"
      />
    </header>
  );
}
