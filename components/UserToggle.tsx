'use client';

import type { UserRole } from '@/lib/types';

type Props = {
  role: UserRole;
  onChange: (r: UserRole) => void;
};

export function UserToggle({ role, onChange }: Props) {
  return (
    <div className="flex rounded-full bg-white/80 p-0.5 shadow-sm ring-1 ring-ink/10">
      <button
        type="button"
        onClick={() => onChange('bride')}
        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
          role === 'bride' ? 'bg-bride text-white shadow' : 'text-muted hover:text-ink'
        }`}
      >
        💐 Bride
      </button>
      <button
        type="button"
        onClick={() => onChange('groom')}
        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
          role === 'groom' ? 'bg-groom text-white shadow' : 'text-muted hover:text-ink'
        }`}
      >
        🤵 Groom
      </button>
    </div>
  );
}
