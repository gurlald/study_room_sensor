import React, { useRef, useState } from 'react';
import { ROOM_COORDS } from '../roomCoords';
import '../index.css';

const NATURAL_W = 900;
const NATURAL_H = 1000;

// The rooms not used for the demo were colored statically 
const STATIC_OCCUPANCY = {
  733: false, 
  734: false, 
  735: true 
};

const DEMO_ROOM_ID = 204;

export default function FloorPlan({ floor, floorFile, status }) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  const arr = Array.isArray(status) ? status : [];

  const statusMap = arr.reduce((m, { room_id, occupied }) => {
    m[room_id] = occupied;
    return m;
  }, {});

  const coords = ROOM_COORDS[floor] || [];
  const zoomIn  = () => setZoom(z => Math.min(3, z + 0.15));
  const zoomOut = () => setZoom(z => Math.max(0.5, z - 0.15));

  return (
    <main className="blueprint-wrapper">
      <div className="svg-container">
        <div
          ref={containerRef}
          className="png-floorplan"
          style={{
            backgroundImage: `url(${floorFile})`,
            transform: `scale(${zoom})`
          }}
        >
          {coords.map(cfg => {
            let occupied;
            if (cfg.room_id === DEMO_ROOM_ID) {
              // Changes based on occupancy status
              occupied = statusMap[DEMO_ROOM_ID];
            } else if (cfg.room_id in STATIC_OCCUPANCY) {
              // Non-demo rooms, stay one static color
              occupied = STATIC_OCCUPANCY[cfg.room_id];
            } else {
              occupied = undefined;
            }

            const stateClass =
              occupied === true  ? 'occ'  :
              occupied === false ? 'free' :
              '';

            if (cfg.shape === 'circle') {
              const sizePct = (cfg.r * 2 / NATURAL_W) * 100;
              const leftPct = ((cfg.cx - cfg.r) / NATURAL_W) * 100;
              const topPct  = ((cfg.cy - cfg.r) / NATURAL_H) * 100;
              return (
                <div
                  key={cfg.room_id}
                  className={`room-overlay circle ${stateClass}`}
                  style={{
                    left:   `${leftPct}%`,
                    top:    `${topPct}%`,
                    width:  `${sizePct}%`,
                    height: `${sizePct}%`
                  }}
                  title={`Room ${cfg.room_id}`}
                />
              );
            } else {
              return (
                <div
                  key={cfg.room_id}
                  className={`room-overlay ${stateClass}`}
                  style={{
                    top:    `${cfg.top}%`,
                    left:   `${cfg.left}%`,
                    width:  `${cfg.width}%`,
                    height: `${cfg.height}%`
                  }}
                  title={`Room ${cfg.room_id}`}
                />
              );
            }
          })}
        </div>

        <div className="zoom-controls">
          <button onClick={zoomIn}>+</button>
          <button onClick={zoomOut}>&minus;</button>
        </div>
      </div>
    </main>
  );
}