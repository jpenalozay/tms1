import { translations } from "../i18n";

export async function getStreetRoute(coords: [number, number][]): Promise<[number, number][]> {
  if (coords.length < 2) return coords;
  
  try {
    // OSRM expects: longitude,latitude
    const coordString = coords.map(c => `${c[1]},${c[0]}`).join(';');
    
    // Call public OSRM Demo API
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`);
    
    if (!res.ok) {
      throw new Error(`OSRM API Error: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      return coords; // fallback
    }
    
    // OSRM returns GeoJSON coordinates as [longitude, latitude]
    const geometry = data.routes[0].geometry;
    return geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
    
  } catch (err) {
    console.error("Routing error, falling back to straight lines:", err);
    return coords; // visually draw straight lines if network fails
  }
}
