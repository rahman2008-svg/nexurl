export interface ClickEvent {
  timestamp: string;
  referer: string;
  country: string;
  countryCode: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
}

export interface ShortLink {
  id: string;
  originalUrl: string;
  shortUrl: string;
  domain: string;
  alias: string;
  title?: string;
  createdAt: string;
  clicks: number;
  qrCodeDataUrl?: string;
  tags?: string[];
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  clickHistory: ClickEvent[];
  isCustomAlias: boolean;
  expiresAt?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}

export interface UserProfile {
  isLoggedIn: boolean;
  name: string;
  email: string;
  plan: 'Free' | 'Pro' | 'Bulk 50K' | 'Enterprise';
  avatar?: string;
}
