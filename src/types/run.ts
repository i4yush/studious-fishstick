export interface Run {
  id: string;
  user_id: string;
  route: Array<{ latitude: number; longitude: number; timestamp: number }>;
  distance: number;   // km
  pace: number;       // min/km
  duration: number;   // seconds
  zones_captured: string[];
  xp_earned: number;
  started_at: string;
  ended_at: string;
  created_at: string;
}

export type RunState = 'idle' | 'active' | 'paused' | 'ended';
