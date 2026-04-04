export type WeddingOption = {
  id: string;
  category: string;
  title: string;
  description: string;
  emoji: string;
  gradient: string;
  imageUrl?: string;
  rating?: number;
  address?: string;
  website?: string | null;
};

export type UserRole = 'bride' | 'groom';

export type CoupleStorage = {
  coupleId: string;
  coupleCode: string;
  userRole?: UserRole;
  locationState?: string;
  locationCity?: string;
  /** True when this device created the couple (shows location step) */
  isCreator?: boolean;
};
