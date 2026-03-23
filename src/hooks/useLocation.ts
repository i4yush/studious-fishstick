import { useState, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import type { LatLng } from '@/types/zone';

interface LocationState {
  coords: LatLng | null;
  error: string | null;
  isTracking: boolean;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    coords: null,
    error: null,
    isTracking: false,
  });

  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const routeRef = useRef<Array<LatLng & { timestamp: number }>>([]);

  const startTracking = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setState((s) => ({ ...s, error: 'Location permission denied' }));
      return false;
    }

    routeRef.current = [];
    setState((s) => ({ ...s, isTracking: true, error: null }));

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 5, // update every 5 meters
        timeInterval: 1000,
      },
      (location) => {
        const point: LatLng & { timestamp: number } = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: location.timestamp,
        };
        routeRef.current.push(point);
        setState((s) => ({
          ...s,
          coords: { latitude: point.latitude, longitude: point.longitude },
        }));
      },
    );

    return true;
  }, []);

  const stopTracking = useCallback(() => {
    watchRef.current?.remove();
    watchRef.current = null;
    setState((s) => ({ ...s, isTracking: false }));
    return routeRef.current;
  }, []);

  return {
    coords: state.coords,
    error: state.error,
    isTracking: state.isTracking,
    route: routeRef.current,
    startTracking,
    stopTracking,
  };
}
