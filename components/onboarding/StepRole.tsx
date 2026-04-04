'use client';

import { useState } from 'react';
import { saveCouplePartial } from '@/lib/storage';
import type { UserRole } from '@/lib/types';

type Props = {
  onPick: (role: UserRole) => void;
};

export function StepRole({ onPick }: Props) {
  const [selected, setSelected] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    saveCouplePartial({ userRole: selected });
    onPick(selected);
  };

  const cardLayout =
    'flex flex-col items-center justify-center rounded-[24px] border px-3 py-9 transition-[transform,box-shadow,background-color,border-color] active:scale-[0.99] min-h-[148px] sm:min-h-[160px]';

  return (
    <div className="flex w-full flex-col items-stretch justify-center gap-10 px-0.5">
      <h2 className="text-center font-display text-[32px] font-semibold leading-tight tracking-[-0.02em] text-ink">
        Who&apos;s swiping?
      </h2>

      <div className="grid w-full grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setSelected('bride')}
          aria-pressed={selected === 'bride'}
          className={`${cardLayout} ${
            selected === 'bride'
              ? 'border-2 border-[#E8A0A0] bg-[#F9EEEE] shadow-ds-soft'
              : 'border-2 border-transparent bg-white shadow-ds-soft'
          }`}
        >
          <span className="text-[52px] leading-none" aria-hidden>
            👰
          </span>
          <span className="mt-4 font-sans text-[17px] font-bold leading-none text-ink">
            Bride
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelected('groom')}
          aria-pressed={selected === 'groom'}
          className={`${cardLayout} ${
            selected === 'groom'
              ? 'border-2 border-[#96B09E] bg-[#F0F5F0] shadow-ds-soft'
              : 'border-2 border-transparent bg-white shadow-ds-soft'
          }`}
        >
          <span className="text-[52px] leading-none" aria-hidden>
            🤵
          </span>
          <span className="mt-4 font-sans text-[14px] font-bold leading-none text-[#333333]">
            Groom
          </span>
        </button>
      </div>

      <button
        type="button"
        disabled={!selected}
        onClick={handleContinue}
        className="w-full appearance-none rounded-full border-0 py-4 font-sans text-[15px] font-semibold leading-none outline-none transition-[transform,filter] disabled:cursor-not-allowed enabled:cursor-pointer enabled:shadow-ds-medium enabled:hover:brightness-[1.05] enabled:active:scale-[0.99]"
        style={
          selected
            ? {
                backgroundColor: 'var(--vow-primary)',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
              }
            : {
                backgroundColor: '#D6D0C9',
                color: '#8A8580',
                WebkitTextFillColor: '#8A8580',
              }
        }
      >
        Continue
      </button>
    </div>
  );
}
