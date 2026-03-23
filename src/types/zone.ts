export interface Zone {
  id: string;
  city: string;
  lat_min: number;
  lat_max: number;
  lng_min: number;
  lng_max: number;
  owner_id: string | null;
  captured_at: string | null;
  zone_type: 'block' | 'landmark' | 'park';
  created_at: string;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}
