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

declare global {
  interface Window {
    showGiga?: () => Promise<GigaAdsResponse>;
  }
}

export {};
