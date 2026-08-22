import { createClient } from '@supabase/supabase-js';
import type { PlayerRow } from './tiers';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your project credentials.'
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

export async function fetchPlayers(): Promise<PlayerRow[]> {
  const { data, error } = await supabase.from('tiers').select('*');
  if (error) throw error;
  return (data ?? []) as PlayerRow[];
}
