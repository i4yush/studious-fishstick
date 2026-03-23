export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  level: number;
  xp: number;
  streak: number;
  avatar_color: string;
  created_at: string;
  updated_at: string;
}

export interface Squad {
  id: string;
  name: string;
  city: string | null;
  territory_count: number;
  created_at: string;
}
