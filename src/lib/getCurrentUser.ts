import { decodeTgWebAppData } from "./decodeTg";

// Mock Telegram WebApp data for development
export const mockTelegramUser = {
  telegramId: 5252587410,
  username: 'Md Rijon Hossain Jibon YT',
  telegramUsername: 'MdRijonHossainJibon',
  profilePicUrl: 'https://t.me/i/userpic/320/NzPzP-8sLLNQZkSxzx-VauBHAcE6hnGyFyDg6LxoA28.svg',
  start_param: 'UID7952eeE'
};

// Get current user from Telegram WebApp or mock data



export function getTelegramUser() {
    const hash = window.location.hash.substring(1); // remove '#'

      // Convert encoded params into a usable format
      const searchParams = new URLSearchParams(hash);

      const parsedParams: any = {};

      searchParams.forEach((value, key) => {
        // Try decoding JSON-like values (like user info)
        try {
          const decoded = decodeURIComponent(value);
          if (decoded.startsWith('{') || decoded.startsWith('%7B')) {
            parsedParams[key] = JSON.parse(
              decodeURIComponent(decoded.replace(/\\u0022/g, '"'))
            );
          } else {
            parsedParams[key] = decoded;
          }
        } catch {
          parsedParams[key] = value;
        }
      });

      return parsedParams;
}

export function getCurrentUser() {
   const params = getTelegramUser();
   const startParam = new URLSearchParams(window.location.search);
   const start_param = startParam.get("tgWebAppStartParam");


   const { user } = decodeTgWebAppData(params.tgWebAppData as string);
   

  // In production, get data from Telegram WebApp
  
  if (user) {
     return {
      telegramId: user.id,
      username: user.first_name + (user.last_name ? ` ${user.last_name}` : ''),
      telegramUsername: user.username || `user${user.id}`,
      profilePicUrl: user.photo_url,
      start_param,
  
    };
  }
 
  return mockTelegramUser;
    
   
}
