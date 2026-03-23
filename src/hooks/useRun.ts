import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from './useLocation';
import type { RunState } from '@/types/run';
import type { LatLng } from '@/types/zone';

interface RunMetrics {
  distance: number;    // km
  pace: number;        // min/km
  duration: number;    // seconds
}

interface UseRunReturn extends RunMetrics {
  state: RunState;
  coords: LatLng | null;
  route: Array<LatLng & { timestamp: number }>;
  startRun: () => Promise<void>;
  pauseRun: () => void;
  resumeRun: () => void;
  stopRun: () => void;
}

function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLng = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function useRun(): UseRunReturn {
  const [runState, setRunState] = useState<RunState>('idle');
  const [metrics, setMetrics] = useState<RunMetrics>({ distance: 0, pace: 0, duration: 0 });

  const { coords, startTracking, stopTracking, route } = useLocation();

  const durationRef = useRef(0);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevReading = useRef<LatLng | null>(null);
  const distAcc     = useRef(0);

  // Accumulate distance as coords update
  useEffect(() => {
    if (runState !== 'active' || !coords) return;

    if (prevReading.current) {
      const delta = haversineKm(prevReading.current, coords);
      if (delta > 0.005 && delta < 0.5) { // filter GPS noise
        distAcc.current += delta;
        const paceMinPerKm =
          distAcc.current > 0 ? durationRef.current / 60 / distAcc.current : 0;
        setMetrics({
          distance: distAcc.current,
          pace: paceMinPerKm,
          duration: durationRef.current,
        });
      }
    }
    prevReading.current = coords;
  }, [coords, runState]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      durationRef.current += 1;
      setMetrics((m) => ({ ...m, duration: durationRef.current }));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRun = useCallback(async () => {
    const ok = await startTracking();
    if (!ok) return;
    durationRef.current = 0;
    distAcc.current = 0;
    prevReading.current = null;
    setMetrics({ distance: 0, pace: 0, duration: 0 });
    setRunState('active');
    startTimer();
  }, [startTracking]);

  const pauseRun = useCallback(() => {
    stopTimer();
    setRunState('paused');
  }, []);

  const resumeRun = useCallback(() => {
    setRunState('active');
    startTimer();
  }, []);

  const stopRun = useCallback(() => {
    stopTimer();
    stopTracking();
    setRunState('ended');
  }, [stopTracking]);

  return {
    state: runState,
    coords,
    route,
    ...metrics,
    startRun,
    pauseRun,
    resumeRun,
    stopRun,
  };
}
