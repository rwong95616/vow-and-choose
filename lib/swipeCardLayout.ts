/**
 * Figma Make SwipeCard: 20px radius, soft shadow (no border).
 */
/** Single rounded rect — image + caption; clip children to 20px corners */
export const SWIPE_CARD_SHELL_CLASS =
  'flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-[20px] bg-white shadow-[0px_4px_16px_0px_rgba(44,36,32,0.12)]';

/** Fills space above caption — flex-grow; image covers this region */
export const SWIPE_PHOTO_STRIP_CLASS =
  'relative min-h-0 flex-1 basis-0 overflow-hidden rounded-t-[20px] bg-[#EAE8E4]';

/**
 * Figma: padding 32px 16px, column gap 8px
 */
export const SWIPE_CAPTION_STRIP_CLASS =
  'flex w-full shrink-0 flex-col gap-2 rounded-b-[20px] bg-white px-4 py-8';

export const SWIPE_PHOTO_IMG_CLASS = 'block h-full min-h-0 w-full object-cover';
