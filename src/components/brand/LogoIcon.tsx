import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '@/constants/colors';

interface Props {
  size?: number;
  color?: string;
}

/** Small icon-size RUNNR R mark (no background box) */
export function LogoIcon({ size = 24, color = Colors.red }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={5} cy={5} r={2} fill={color} />
      <Path
        d={[
          'M 5 7 L 5 20',
          'M 5 7 C 5 7 17 7 17 11',
          'C 17 15 5 15 5 15',
          'L 17 20',
        ].join(' ')}
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
