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

export const syncUserProfile = async (userName) => {
  if (!configured || !client || !userName) return;
  const trimmed = userName.trim();
  if (!trimmed) return;

  try {
    // 1. Try upsert with onConflict
    const { error: upsertError } = await client.from('ese_profiles').upsert(
      [{ user_name: trimmed }],
      { onConflict: 'user_name' }
    );

    if (!upsertError) {
      console.log(`Successfully synced profile to Supabase: ${trimmed}`);
      return;
    }

    console.warn(`Supabase upsert warning for "${trimmed}":`, upsertError.message);

    // 2. Fallback: Check if user already exists
    const { data: existing } = await client
      .from('ese_profiles')
      .select('user_name')
      .eq('user_name', trimmed);

    if (!existing || existing.length === 0) {
      // Insert if not present
      const { error: insertError } = await client
        .from('ese_profiles')
        .insert([{ user_name: trimmed }]);

      if (insertError) {
        console.error(`Supabase insert failed for "${trimmed}":`, insertError.message);
      } else {
        console.log(`Successfully inserted profile to Supabase via fallback: ${trimmed}`);
      }
    }
  } catch (err) {
    console.warn(`Supabase profile sync exception for "${trimmed}":`, err);
  }
};

export const syncAllLocalProfiles = async () => {
  if (!configured || !client) return;
  try {
    const stored = localStorage.getItem('ese_2027_auth_users');
    if (!stored) return;
    const usersObj = JSON.parse(stored);
    const names = Object.values(usersObj)
      .map(u => u.displayName || u.name)
      .filter(Boolean);

    for (const name of names) {
      await syncUserProfile(name);
    }
  } catch (e) {
    console.warn('Error syncing all local profiles:', e);
  }
};

