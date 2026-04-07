'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';

export type ItemDetailModalItem = {
  name: string;
  category: string;
  location?: string;
  description?: string;
  /** Color-theme palette dots (same styling as PickCard). */
  swatchColors?: string[];
  badge: 'our-pick' | 'bride' | 'groom' | 'both';
  imageUrl: string;
};

type ItemDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: ItemDetailModalItem | null;
};

const BADGE_LABEL: Record<ItemDetailModalItem['badge'], string> = {
  'our-pick': 'Our Pick',
  bride: 'Bride',
  groom: 'Groom',
  both: 'Our Pick',
};

const BADGE_SURFACE: Record<ItemDetailModalItem['badge'], string> = {
  'our-pick': 'bg-[#B5973A]',
  bride: 'bg-[#E8857A]',
  groom: 'bg-[#6B8F71]',
  both: 'bg-[#C4A96B]',
};

const sheetTransition = {
  type: 'spring' as const,
  damping: 25,
  stiffness: 200,
};

const dmSans = { fontFamily: 'var(--font-dm-sans)' } as const;

export function ItemDetailModal({ isOpen, onClose, item }: ItemDetailModalProps) {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            key="item-detail-backdrop"
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            key="item-detail-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="item-detail-title"
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[min(90vh,100%)] overflow-y-auto rounded-t-[28px] bg-white"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={sheetTransition}
          >
            <div className="relative w-full overflow-hidden">
              <div style={{ width: '100%', height: '320px', flexShrink: 0 }}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '320px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Close"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2C2420]"
                onClick={onClose}
              >
                <X size={20} strokeWidth={1.5} aria-hidden />
              </button>
            </div>

            <div
              className="flex flex-col items-start gap-4 px-6 pb-5 pt-8"
              style={dmSans}
            >
              <p className="text-xs font-semibold tracking-widest text-[#C4A96B]">
                {item.category}
              </p>
              <h2
                id="item-detail-title"
                className="font-[family-name:var(--font-playfair)] text-[32px] font-semibold leading-[1.2] text-[#2C2420]"
              >
                {item.name}
              </h2>
              {item.description && (
                <p
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    color: '#6B5F58',
                    margin: 0,
                  }}
                >
                  {item.description}
                </p>
              )}
              {item.swatchColors && item.swatchColors.length > 0 && (
                <div className="flex min-h-0 min-w-0 flex-row items-center gap-2 overflow-hidden">
                  {item.swatchColors.map((color, i) => (
                    <span
                      key={`swatch-${i}`}
                      className="h-6 w-6 shrink-0 rounded-full shadow-[0_1px_3px_0_rgba(44,36,32,0.08)]"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
              {item.location ? (
                <div className="flex items-center gap-1 text-sm text-[#6B5F58]">
                  <MapPin size={14} className="shrink-0" aria-hidden />
                  <span>{item.location}</span>
                </div>
              ) : null}
              <div
                className={`inline-flex h-[35px] w-fit shrink-0 items-center justify-center self-start rounded-full px-4 py-0 text-[14px] font-medium text-white ${BADGE_SURFACE[item.badge]}`}
              >
                {BADGE_LABEL[item.badge]}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ItemDetailModal;
