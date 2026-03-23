import React from 'react';
// import { Polyline } from 'react-native-maps';
import { Colors } from '@/constants/colors';
import type { LatLng } from '@/types/zone';

interface RouteTracerProps {
  route: LatLng[];
  color?: string;
  width?: number;
}

export function RouteTracer({ route, color = Colors.lime, width = 4 }: RouteTracerProps) {
  if (route.length < 2) return null;

  return null;
  /*
  return (
    <Polyline
      coordinates={route}
      strokeColor={color}
      strokeWidth={width}
      lineCap="round"
      lineJoin="round"
    />
  );
  */
}
