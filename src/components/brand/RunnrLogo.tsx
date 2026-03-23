import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Colors } from '@/constants/colors';

type Colorway = 'void-red' | 'sprint' | 'lime' | 'void-lime';

interface Props {
  size?: number;
  colorway?: Colorway;
}

const colorMap: Record<Colorway, { primary: string; bg: string }> = {
  'void-red':  { primary: Colors.red,  bg: Colors.black },
  'sprint':    { primary: Colors.white, bg: Colors.red },
  'lime':      { primary: Colors.lime, bg: Colors.black },
  'void-lime': { primary: Colors.black, bg: Colors.lime },
};

/**
 * RUNNR Logo — an "R" drawn as a GPS route with a dot-start indicator.
 * The shape traces: top-left → top-right arc (R bowl) → diagonal leg → bottom.
 */
export function RunnrLogo({ size = 48, colorway = 'void-red' }: Props) {
  const { primary, bg } = colorMap[colorway];
  const s = size;
  const pad = s * 0.12;
  const w = s - pad * 2;

  return (
    <Svg width={s} height={s} viewBox="0 0 48 48">
      {/* Background */}
      <Rect width={48} height={48} rx={10} fill={bg} />
      {/* Route dot — start indicator */}
      <Circle cx={10} cy={10} r={3.5} fill={primary} />
      {/* R stroke path */}
      <Path
        d={[
          'M 10 14',      // start below dot
          'L 10 40',      // vertical stem down
          'M 10 14',      // back to top
          'C 10 14 34 14 34 22', // top of R bowl
          'C 34 30 10 30 10 30', // bottom of R bowl
          'L 34 40',      // diagonal leg
        ].join(' ')}
        stroke={primary}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
