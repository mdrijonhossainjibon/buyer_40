// Mock Telegram WebApp data for development
export const mockTelegramUser = {
  telegramId: 5252587410,
  username: 'Md Rijon Hossain Jibon YT',
  telegramUsername: 'MdRijonHossainJibon',
  profilePicUrl: 'https://t.me/i/userpic/320/NzPzP-8sLLNQZkSxzx-VauBHAcE6hnGyFyDg6LxoA28.svg',
  start_param: 'UID7952eeE'
};

// Get current user from Telegram WebApp or mock data
export function getCurrentUser() {
  // If in development mode, always return mock data
  if (process.env.NODE_ENV === 'development') {
    return mockTelegramUser;
  }
  
  // In production, get data from Telegram WebApp
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
    const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
    const start_param = window.Telegram.WebApp.initDataUnsafe?.start_param;
    return {
      telegramId: tgUser.id,
      username: tgUser.first_name + (tgUser.last_name ? ` ${tgUser.last_name}` : ''),
      telegramUsername: tgUser.username || `user${tgUser.id}`,
      profilePicUrl: tgUser.photo_url,
      start_param,
  
    };
  }
  
 
}



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