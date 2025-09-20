// Ads SDK type declarations

interface GigaAdsResponse {
  success?: boolean;
  message?: string;
  reward?: number;
}

interface GigaAdsError {
  code?: string;
  message?: string;
}

interface MonetagResponse {
  success?: boolean;
  message?: string;
  reward?: number;
}

declare global {
  interface Window {
    showGiga?: () => Promise<GigaAdsResponse>;
    showGigaAd?: () => Promise<GigaAdsResponse>;
    showMonetagAd?: () => Promise<MonetagResponse>;
    [key: string]: any; // For dynamic Monetag functions like show_9890517
  }
}

export {};
