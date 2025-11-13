
interface TelegramWebAppData {
  query_id?: string;
  user?: Record<string, any>;
  auth_date?: string;
  hash?: string;
  [key: string]: any;
}


export const decodeTgWebAppData = (encoded: string): TelegramWebAppData => {
  const params = new URLSearchParams(encoded);
  const result: TelegramWebAppData = {};

  params.forEach((value, key) => {
    try {
      const decoded = decodeURIComponent(value);
      // try parsing JSON if possible
      result[key] = JSON.parse(decoded);
    } catch {
      result[key] = decodeURIComponent(value);
    }
  });

  return result;
};