import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let client = null;
let configured = false;

if (
  supabaseUrl && 
  supabaseAnonKey && 
  typeof supabaseUrl === 'string' &&
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your_supabase')
) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
    configured = true;
  } catch (e) {
    console.warn('Supabase client initialization warning:', e);
    client = null;
    configured = false;
  }
}

export const isSupabaseConfigured = configured;
export const supabase = client;
