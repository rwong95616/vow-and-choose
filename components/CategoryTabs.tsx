'use client';

import { CATEGORY_LABELS, CATEGORY_ORDER, type CategoryId } from '@/data/options';

type Props = {
  active: CategoryId;
  onChange: (c: CategoryId) => void;
};

export function CategoryTabs({ active, onChange }: Props) {
  return (
    <div
      className="no-scrollbar flex snap-x snap-mandatory items-center gap-2 overflow-x-auto py-1.5"
      role="tablist"
    >
      {CATEGORY_ORDER.map((id) => {
        const { label } = CATEGORY_LABELS[id];
        const isOn = active === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isOn}
            onClick={() => onChange(id)}
            className={`vow-category-tab relative inline-flex shrink-0 snap-start items-center justify-center whitespace-nowrap rounded-[50px] border-0 px-4 py-2 text-[13px] font-medium leading-[19.5px] shadow-none outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#884e50]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2] ${
              isOn ? 'bg-[#884e50] text-white' : 'bg-transparent text-[#2c2420]'
            }`}
          >
            {!isOn && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 rounded-[50px] border-[0.5px] border-solid border-[#2c2420]"
              />
            )}
            <span
              className="relative z-[1]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
