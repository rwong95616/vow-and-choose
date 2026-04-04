import { createClient, SupabaseClient } from '@supabase/supabase-js';

/** Placeholders allow Next.js build when env is not set; configure real values for runtime. */
const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.placeholder';

function resolveUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || PLACEHOLDER_URL;
}

function resolveKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || PLACEHOLDER_KEY;
}

export function createBrowserClient(): SupabaseClient {
  return createClient(resolveUrl(), resolveKey());
}

export function createServerClient(): SupabaseClient {
  return createClient(resolveUrl(), resolveKey());
}
