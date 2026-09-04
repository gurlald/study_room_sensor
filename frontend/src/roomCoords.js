// ============================================================
// ROOM COORDINATES
// ============================================================
// Each entry defines where a room's clickable/colorable box sits
// on top of the floor plan PNG, as PERCENTAGES of the image's
// width/height (not raw pixels). Using percentages means the
// overlay stays aligned with the image at any screen size.
//
// HOW TO GET THESE VALUES:
// Open coordinate-picker.html (in this same folder) in a browser,
// load your floor7.png, and click-drag a box over each room.
// It will print the {top, left, width, height} values to use below.
//
// Keyed by floor number so you can add floor6, floor8, etc.
// ============================================================

export const ROOM_COORDS = {
  7: [
    // { room_id: 204, top: 12.5, left: 8.0, width: 6.0, height: 4.5 },
    // { room_id: 205, top: 12.5, left: 15.0, width: 6.0, height: 4.5 },
    {room_id: 204, shape: 'circle', cx: 528, cy: 426, r: 7 },
    //{room_id: 732, shape: 'circle', cx: 528, cy: 426, r: 7 },
    {room_id: 733, shape: 'circle', cx: 562, cy: 407, r: 7 },
    {room_id: 734, shape: 'circle', cx: 600, cy: 385, r: 7 },
    {room_id: 735, shape: 'circle', cx: 633, cy: 365, r: 7 },
  ]
};
