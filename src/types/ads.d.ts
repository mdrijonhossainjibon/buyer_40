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

// Ad Provider Types
export interface AdProvider {
  name: string;
  displayName: string;
  category: 'giga' | 'monetag'; // Provider category for distribution
  isAvailable: () => boolean;
  execute: () => Promise<any>;
  priority: number; // Higher number = higher priority
}

export interface AdSelectionResult {
  provider: AdProvider;
  success: boolean;
  error?: string;
  response?: any;
}

declare global {
  interface Window {
    showGiga?: () => Promise<GigaAdsResponse>;
    [key: string]: any; // For dynamic Monetag functions like show_9890517
  }
}

export {};
