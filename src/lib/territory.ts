import type { LatLng, Zone } from '@/types/zone';

/**
 * Check if a point is inside a polygon (Ray Casting algorithm).
 */
function pointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  let inside = false;
  const { latitude: py, longitude: px } = point;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const pI = polygon[i];
    const pJ = polygon[j];
    if (!pI || !pJ) continue;
    const xi = pI.longitude, yi = pI.latitude;
    const xj = pJ.longitude, yj = pJ.latitude;
    const intersect =
      yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Check if a route polygon encircles a zone's centroid.
 * The route must form a closed loop (first point ~= last point).
 */
export function getZonesCaptured(route: LatLng[], zones: Zone[]): Zone[] {
  if (route.length < 3) return [];

  return zones.filter((zone) => {
    const centroid: LatLng = {
      latitude: (zone.lat_min + zone.lat_max) / 2,
      longitude: (zone.lng_min + zone.lng_max) / 2,
    };
    return pointInPolygon(centroid, route);
  });
}

/**
 * Returns a zone's bounding box corners as LatLng coordinates.
 */
export function zoneToPolygon(zone: Zone): LatLng[] {
  return [
    { latitude: zone.lat_min, longitude: zone.lng_min },
    { latitude: zone.lat_min, longitude: zone.lng_max },
    { latitude: zone.lat_max, longitude: zone.lng_max },
    { latitude: zone.lat_max, longitude: zone.lng_min },
  ];
}

/**
 * Calculate XP earned from a run.
 * Base: 50 XP/km + 50 XP/zone captured.
 */
export function calculateRunXP(distanceKm: number, zonesCaptured: number): number {
  return Math.round(distanceKm * 50) + zonesCaptured * 50;
}
