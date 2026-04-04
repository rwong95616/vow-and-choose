'use client';

import { useEffect, useRef, useState } from 'react';
import { US_STATES } from '@/data/usStates';
import { saveCouplePartial } from '@/lib/storage';
import { createBrowserClient } from '@/lib/supabase';

function IconChevronDown({ className }: { className?: string }) {
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
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Custom listbox (native select cannot style the open menu). */
function StateSelect({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (next: string) => void;
  id: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const selectedLabel = US_STATES.find((s) => s.value === value)?.label;
  const listId = `${id}-listbox`;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-[14px] border border-[#D1C8B8] bg-white px-4 py-3.5 text-left font-sans text-[15px] outline-none transition focus-visible:ring-2 focus-visible:ring-[#D1C8B8] focus-visible:ring-offset-2 ${
          value ? 'text-[#2D2926]' : 'text-[#8E8E8E]'
        }`}
      >
        <span>{selectedLabel ?? 'Select state'}</span>
        <IconChevronDown
          className={`h-5 w-5 shrink-0 text-[#8E8E8E] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Select state"
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-[min(50vh,280px)] overflow-y-auto rounded-[14px] border border-[#D1C8B8] bg-white py-1 shadow-ds-medium"
        >
          {US_STATES.map((s) => (
            <li key={s.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === s.value}
                className="w-full px-4 py-3.5 text-left font-sans text-[15px] text-[#2D2926] transition hover:bg-[#F9F7F5] active:bg-[#F3F1EE]"
                onClick={() => {
                  onChange(s.value);
                  setOpen(false);
                }}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type Props = {
  coupleId: string;
  onDone: (state: string, city?: string) => void;
  /** Completes onboarding without saving location */
  onSkip?: () => void;
};

export function StepLocation({ coupleId, onDone, onSkip }: Props) {
  const supabase = createBrowserClient();
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasState = state.trim().length > 0;
  const submitDisabled = !hasState || busy;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.trim()) {
      setError('Choose a state');
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const { error: upErr } = await supabase
        .from('couples')
        .update({
          location_state: state.trim(),
          location_city: city.trim() || null,
        })
        .eq('id', coupleId);
      if (upErr) {
        setError('Could not save location');
        return;
      }
      saveCouplePartial({ locationState: state.trim(), locationCity: city.trim() || undefined });
      onDone(state.trim(), city.trim() || undefined);
    } finally {
      setBusy(false);
    }
  };

  const cityFieldClass =
    'location-city-input w-full rounded-[14px] border border-[#D1C8B8] bg-white px-5 py-3.5 font-sans text-[15px] text-[#1D1D1B] outline-none ring-0 transition-[border-color,box-shadow] placeholder:text-[#8E8E8E] focus:border-[#BFB5A5] focus:ring-0 focus-visible:outline-none';

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-8 px-0.5">
      <div className="text-center">
        <h2 className="font-display text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-[#2D2926]">
          Where&apos;s the magic happening?
        </h2>
        <p className="mx-auto mt-3 max-w-[20rem] font-display text-body-md italic leading-relaxed text-[#8C827A]">
          We&apos;ll find venues near you
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <StateSelect id="location-state" value={state} onChange={setState} />

        <input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City (optional)"
          autoComplete="address-level2"
          className={cityFieldClass}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50/90 px-3 py-2 text-center text-sm text-red-800 ring-1 ring-red-200/80">
          {error}
        </p>
      )}

      <div className="flex flex-col items-stretch gap-6">
        <button
          type="submit"
          disabled={submitDisabled}
          className={`w-full appearance-none rounded-full border-0 py-4 font-sans text-[15px] font-semibold leading-none outline-none transition-[transform,filter] disabled:cursor-not-allowed ${
            hasState ? 'shadow-ds-medium hover:brightness-[1.05] active:scale-[0.99]' : ''
          }`}
          style={
            hasState
              ? {
                  backgroundColor: '#8B5753',
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff',
                }
              : {
                  backgroundColor: '#D6D0CB',
                  color: '#8E8E8E',
                  WebkitTextFillColor: '#8E8E8E',
                }
          }
        >
          {busy ? 'Saving…' : "Let's go"}
        </button>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-center font-sans text-[15px] text-[#6B5F58] underline underline-offset-[5px] transition hover:opacity-80"
          >
            Skip for now
          </button>
        )}
      </div>
    </form>
  );
}
