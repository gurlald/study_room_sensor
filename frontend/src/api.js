export const POLL_INTERVAL = 3000

export async function fetchOccupancy() {
  const res = await fetch('/occupancy')
  if (!res.ok) throw new Error(`Fetch error ${res.status}`)
  const data = await res.json();
  // If backend returns an object, wrap it in an array
  return Array.isArray(data) ? data : [data];
}