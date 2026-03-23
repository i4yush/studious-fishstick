export const Config = {
  appName: 'RUNNR',
  version:  '1.0.0',
  supabaseUrl:   process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
} as const;
