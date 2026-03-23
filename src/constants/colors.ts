export const Colors = {
  red:     '#FF4D2E',
  black:   '#0A0A0A',
  lime:    '#C8F135',
  white:   '#F0ECE4',
  card:    '#111111',
  surface: '#1A1A1A',
  border:  '#1E1E1E',
  muted:   '#555555',
  rival:   '#E24B4A',
} as const;

export type ColorKey = keyof typeof Colors;
