import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-admin';
import { createServerClient } from '@/lib/supabase';

/** Fixed code for local/dev testing — matches charset in lib/generateCode.ts */
const TEST_COUPLE_CODE = 'TEST01';

/**
 * Ensures a row with code TEST01 exists so "Join couple" always has a known code in dev.
 * GET or POST — only when NODE_ENV !== 'production'.
 */
function forbidden() {
  return NextResponse.json({ error: 'Not available in production.' }, { status: 403 });
}

async function ensureTestCouple() {
  const admin = createServiceRoleClient();
  const supabase = admin ?? createServerClient();

  const { data: existing, error: selectError } = await supabase
    .from('couples')
    .select('id, code')
    .ilike('code', TEST_COUPLE_CODE)
    .maybeSingle();

  if (selectError) {
    return NextResponse.json(
      {
        error: selectError.message,
        hint:
          !admin &&
          (selectError.message?.toLowerCase().includes('row-level security') ||
            selectError.message?.toLowerCase().includes('permission'))
            ? 'Add SUPABASE_SERVICE_ROLE_KEY to .env.local, or run supabase-policies.sql.'
            : undefined,
      },
      { status: 400 }
    );
  }

  if (existing) {
    return NextResponse.json({
      ok: true,
      code: existing.code,
      coupleId: existing.id,
      message: `Use "${TEST_COUPLE_CODE}" in Join couple.`,
      created: false,
    });
  }

  const { data: inserted, error: insertError } = await supabase
    .from('couples')
    .insert({ code: TEST_COUPLE_CODE })
    .select('id, code')
    .single();

  if (insertError) {
    const msg = insertError.message?.toLowerCase() ?? '';
    const likelyRls =
      msg.includes('row-level security') ||
      msg.includes('permission denied') ||
      msg.includes('violates');

    return NextResponse.json(
      {
        error: insertError.message,
        hint:
          !admin && likelyRls
            ? 'Add SUPABASE_SERVICE_ROLE_KEY to .env.local, or run supabase-policies.sql.'
            : undefined,
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    code: inserted!.code,
    coupleId: inserted!.id,
    message: `Use "${TEST_COUPLE_CODE}" in Join couple.`,
    created: true,
  });
}

export async function GET() {
  if (process.env.NODE_ENV === 'production') return forbidden();
  return ensureTestCouple();
}

export async function POST() {
  if (process.env.NODE_ENV === 'production') return forbidden();
  return ensureTestCouple();
}
