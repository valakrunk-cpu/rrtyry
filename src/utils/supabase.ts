import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set up your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UDGKey {
  id: string;
  key: string;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
  usage_count: number;
  max_usage?: number;
  last_used_at?: string;
  created_by?: string;
  notes?: string;
}