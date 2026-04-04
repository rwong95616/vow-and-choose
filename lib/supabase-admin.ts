import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Service role client — bypasses RLS. Use only on the server.
 * Set SUPABASE_SERVICE_ROLE_KEY in .env.local (Dashboard → Settings → API).
 */
export function createServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
