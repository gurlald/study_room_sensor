export const POLL_INTERVAL = 3000

export async function fetchOccupancy() {
  const res = await fetch('/occupancy')
  if (!res.ok) throw new Error(`Fetch error ${res.status}`)
  const data = await res.json();
  // Wrap the returned object in an array
  return Array.isArray(data) ? data : [data];
}