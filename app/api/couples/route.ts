import { NextResponse } from 'next/server';
import { generateCoupleCode } from '@/lib/generateCode';
import { createServiceRoleClient } from '@/lib/supabase-admin';
import { createServerClient } from '@/lib/supabase';

/**
 * Creates a couple row. Prefers the service role key so RLS cannot block insert/returning.
 * Falls back to the anon key if the service role is not configured (requires permissive RLS).
 */
export async function POST() {
  const admin = createServiceRoleClient();
  const supabase = admin ?? createServerClient();

  let lastMessage: string | null = null;

  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateCoupleCode();
    const { data, error } = await supabase
      .from('couples')
      .insert({ code })
      .select('id, code')
      .single();

    if (!error && data) {
      return NextResponse.json({
        coupleId: data.id,
        coupleCode: data.code,
      });
    }

    lastMessage = error?.message ?? null;
    // Postgres unique violation — try another code
    if (error?.code === '23505') continue;
    break;
  }

  const msg = lastMessage?.toLowerCase() ?? '';
  const likelyRls =
    msg.includes('row-level security') ||
    msg.includes('permission denied') ||
    msg.includes('violates') ||
    msg.includes('0 rows') ||
    msg.includes('pgrst');

  return NextResponse.json(
    {
      error: lastMessage ?? 'Could not create a couple.',
      hint:
        !admin && likelyRls
          ? 'Add SUPABASE_SERVICE_ROLE_KEY to .env.local (copy service_role from Supabase → Settings → API), or run supabase-policies.sql so anon can use couples.'
          : undefined,
    },
    { status: 400 }
  );
}
