export const isTelegramWebApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for Telegram WebApp API
  return !!(window as any).Telegram?.WebApp;
};

export const isTelegramBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  return userAgent.includes('telegram');
};

export const isInTelegram = (): boolean => {
  return isTelegramWebApp() || isTelegramBrowser();
};

export const generateQRCodeDataURL = (text: string): string => {
  // Simple QR code generation using a public API
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
};
