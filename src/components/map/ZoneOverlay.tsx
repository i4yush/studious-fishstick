import React from 'react';
import { StyleSheet } from 'react-native';
// import { Polygon } from 'react-native-maps';
import { Colors } from '@/constants/colors';
import type { Zone } from '@/types/zone';
import { zoneToPolygon } from '@/lib/territory';

interface ZoneOverlayProps {
  zone: Zone;
  /** ID of the current user to determine ownership */
  currentUserId?: string | null;
}

export function ZoneOverlay({ zone, currentUserId }: ZoneOverlayProps) {
  const isOwn = zone.owner_id != null && zone.owner_id === currentUserId;
  const isRival = zone.owner_id != null && zone.owner_id !== currentUserId;

  const coords = zoneToPolygon(zone);

  const fillColor = isOwn
    ? Colors.red + '55'
    : isRival
    ? Colors.rival + '55'
    : Colors.muted + '22';

  const strokeColor = isOwn ? Colors.red : isRival ? Colors.rival : Colors.border;

  return null;
  /*
  return (
    <Polygon
      coordinates={coords}
      fillColor={fillColor}
      strokeColor={strokeColor}
      strokeWidth={1.5}
    />
  );
  */
}
