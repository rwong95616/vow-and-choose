'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { isExistingCoupleCreator, saveCouplePartial } from '@/lib/storage';
import { createBrowserClient } from '@/lib/supabase';

/** Disabled: greige; enabled: primary — inline bg avoids Safari ignoring Tailwind bg on <button> */
function JoinCoupleButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`join-couple-btn mt-5 w-full rounded-full border-0 py-[14px] text-[15px] font-sans leading-none tracking-normal outline-none transition-[transform,filter,box-shadow] ${
        disabled
          ? 'cursor-not-allowed font-normal shadow-none'
          : 'cursor-pointer font-semibold shadow-ds-medium hover:brightness-[1.05] active:scale-[0.99]'
      }`}
      style={
        disabled
          ? {
              backgroundColor: '#d7d2cc',
              color: '#827b75',
              WebkitTextFillColor: '#827b75',
            }
          : {
              backgroundColor: 'var(--vow-primary)',
              color: '#ffffff',
              WebkitTextFillColor: '#ffffff',
            }
      }
    >
      Join couple
    </button>
  );
}

function IconShare({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCopy({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  joinCodePrefill?: string;
  /** When user finishes "Start a new couple", hide main onboarding header for code-only layout */
  onConnectLayoutChange?: (layout: 'connect' | 'couple-code') => void;
  onCreatedOrJoined: (payload: {
    coupleId: string;
    coupleCode: string;
    isCreator: boolean;
    locationState?: string | null;
    locationCity?: string | null;
  }) => void;
};

/** Serif letters slightly larger than numbers — matches design ref (e.g. ROSE vs 42) */
function CoupleCodeDisplay({ code }: { code: string }) {
  const segments: { kind: 'alpha' | 'digit'; s: string }[] = [];
  for (const ch of code) {
    const isDigit = /\d/.test(ch);
    const kind = isDigit ? ('digit' as const) : ('alpha' as const);
    const last = segments[segments.length - 1];
    if (last && last.kind === kind) last.s += ch;
    else segments.push({ kind, s: ch });
  }
  return (
    <div
      className="flex flex-wrap items-baseline justify-center gap-x-[0.15em]"
      aria-label={`Couple code ${code}`}
    >
      {segments.map((seg, i) => (
        <span
          key={`${seg.kind}-${i}-${seg.s}`}
          className={
            seg.kind === 'alpha'
              ? 'font-display text-[2.35rem] font-bold leading-none tracking-[0.06em] text-ink sm:text-[2.85rem]'
              : 'font-display text-[1.78rem] font-bold leading-none tracking-[0.14em] text-ink sm:text-[2.2rem]'
          }
        >
          {seg.s}
        </span>
      ))}
    </div>
  );
}

export function StepConnect({
  joinCodePrefill,
  onConnectLayoutChange,
  onCreatedOrJoined,
}: Props) {
  const supabase = createBrowserClient();
  const [codeInput, setCodeInput] = useState(joinCodePrefill?.toUpperCase() ?? '');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [createdInfo, setCreatedInfo] = useState<{
    code: string;
    coupleId: string;
    shareUrl: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    onConnectLayoutChange?.(createdInfo ? 'couple-code' : 'connect');
  }, [createdInfo, onConnectLayoutChange]);

  const baseUrl =
    typeof window !== 'undefined'
      ? process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      : '';

  const startNew = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/couples', { method: 'POST' });
      const json = (await res.json()) as {
        coupleId?: string;
        coupleCode?: string;
        error?: string;
        hint?: string;
      };

      if (!res.ok || !json.coupleId || !json.coupleCode) {
        const detail = [json.error, json.hint].filter(Boolean).join(' ');
        setError(
          detail ||
            'Could not create a couple — try again.'
        );
        return;
      }

      saveCouplePartial({
        coupleId: json.coupleId,
        coupleCode: json.coupleCode,
        isCreator: true,
      });
      const shareUrl = `${baseUrl}/join/${json.coupleCode}`;
      setCreatedInfo({
        code: json.coupleCode,
        coupleId: json.coupleId,
        shareUrl,
      });
    } catch {
      setError('Network error — check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const shareLink = async () => {
    if (!createdInfo) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join our Vow & Choose couple',
          text: `Join me on Vow & Choose with code ${createdInfo.code}`,
          url: createdInfo.shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(createdInfo.shareUrl);
        alert('Link copied to clipboard');
      }
    } catch {
      /* user cancelled share */
    }
  };

  const copyCode = async () => {
    if (!createdInfo) return;
    try {
      await navigator.clipboard.writeText(createdInfo.code);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      /* clipboard denied */
    }
  };

  const afterCreateContinue = () => {
    if (!createdInfo) return;
    onCreatedOrJoined({
      coupleId: createdInfo.coupleId,
      coupleCode: createdInfo.code,
      isCreator: true,
    });
  };

  const joinWithCode = async () => {
    setError(null);
    const raw = codeInput.trim().toUpperCase();
    if (!raw) {
      setError('Enter a code');
      return;
    }
    setBusy(true);
    try {
      const { data, error: qErr } = await supabase
        .from('couples')
        .select('id, code, location_state, location_city')
        .ilike('code', raw)
        .maybeSingle();
      if (qErr || !data) {
        setError('Code not found — double check with your partner');
        return;
      }
      const creatorOnDevice = isExistingCoupleCreator(data.id);
      const joinSavePatch = {
        coupleId: data.id,
        coupleCode: data.code,
        isCreator: creatorOnDevice,
        locationState: data.location_state ?? undefined,
        locationCity: data.location_city ?? undefined,
      };
      saveCouplePartial(joinSavePatch);
      onCreatedOrJoined({
        coupleId: data.id,
        coupleCode: data.code,
        isCreator: creatorOnDevice,
        locationState: data.location_state,
        locationCity: data.location_city,
      });
    } finally {
      setBusy(false);
    }
  };

  if (createdInfo) {
    return (
      <div className="flex w-full flex-col items-center overflow-visible px-0.5">
        <h2 className="text-center font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-ink">
          Your couple code
        </h2>

        <div className="mt-6 w-full rounded-3xl border-[0.5px] border-code-border bg-white px-6 py-11 sm:py-12">
          <CoupleCodeDisplay code={createdInfo.code} />
        </div>

        <p className="mt-10 w-full text-center whitespace-nowrap font-sans text-[14px] leading-relaxed text-muted">
          Share this with your partner so they can join
        </p>

        <div className="mt-6 flex w-full max-w-full flex-col gap-3 overflow-visible py-px">
          <button
            type="button"
            onClick={shareLink}
            className="flex w-full appearance-none items-center justify-center gap-2 rounded-full border-0 px-8 py-4 font-sans text-[15px] font-medium leading-none text-white transition hover:brightness-[1.05] active:scale-[0.99]"
            style={{
              backgroundColor: 'var(--vow-primary)',
              color: '#ffffff',
              WebkitTextFillColor: '#ffffff',
            }}
          >
            <IconShare className="h-5 w-5 shrink-0 text-white" />
            Share link
          </button>
          <div className="w-full overflow-visible pt-px">
            <button
              type="button"
              onClick={copyCode}
              className="flex w-full items-center justify-center gap-2.5 rounded-full border-[0.5px] border-ink bg-transparent py-[14px] font-sans text-body-md font-semibold text-ink transition hover:bg-white/60 active:scale-[0.99]"
            >
              <IconCopy className="h-5 w-5 shrink-0" />
              {copiedCode ? 'Copied!' : 'Copy code'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={afterCreateContinue}
          className="mt-12 font-sans text-body-md text-ink underline underline-offset-[5px] transition hover:opacity-80"
        >
          Continue to app
        </button>
      </div>
    );
  }

  /** Connect ref: cards 24–32px radius, 24px inset */
  const connectCardClass =
    'rounded-[24px] bg-white p-6 text-left shadow-ds-soft transition active:scale-[0.995]';

  const startCardClass = `${connectCardClass} disabled:opacity-60`;

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <div className="rounded-2xl bg-red-50/90 px-4 py-3 text-sm text-red-900 ring-1 ring-red-200/80">
          {error}
        </div>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={startNew}
        className={`${startCardClass} grid w-full grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-left`}
      >
        <div className="row-start-1 flex items-center justify-center" aria-hidden>
          <Image
            src="/images/start-new-couple-icon.png"
            alt=""
            width={48}
            height={48}
            className="h-5 w-5 shrink-0 object-contain"
            sizes="20px"
            quality={100}
            unoptimized
          />
        </div>
        <span className="row-start-1 col-start-2 min-w-0 font-sans text-body-lg font-semibold leading-snug text-ink">
          Start a new couple
        </span>
        <span className="col-start-2 row-start-2 min-w-0 text-body-md font-normal leading-relaxed text-muted">
          Get a code to share with your partner
        </span>
      </button>

      <div className={connectCardClass}>
        <p className="mb-5 font-sans text-body-lg font-semibold leading-snug text-ink">
          Join with a code
        </p>
        <input
          id="code"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
          placeholder="Enter code"
          aria-label="Couple code"
          className={`w-full appearance-none rounded-2xl border-[0.5px] border-landing-input-border bg-white px-4 py-[14px] font-sans text-body-md tracking-[0.04em] text-ink shadow-none outline-none ring-0 placeholder:font-normal placeholder:font-sans placeholder:tracking-normal placeholder:text-[#8E8E8E] focus:border-[#C4A96B] focus:shadow-none focus:ring-0 ${codeInput.trim() ? 'font-semibold' : 'font-normal'}`}
          maxLength={8}
          autoCapitalize="characters"
        />
        <JoinCoupleButton
          disabled={busy || !codeInput.trim()}
          onClick={joinWithCode}
        />
      </div>
    </div>
  );
}
