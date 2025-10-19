// Mock Telegram WebApp data for development
export const mockTelegramUser = {
  telegramId: 709148502,
  username: 'Md Rijon Hossain Jibon YT ▪️',
  telegramUsername: 'MdRijonHossainJibon',
  profilePicUrl: 'https://t.me/i/userpic/320/NzPzP-8sLLNQZkSxzx-VauBHAcE6hnGyFyDg6LxoA28.svg',
  start_param: undefined
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
      telegramId: tgUser.id.toString(),
      username: tgUser.first_name + (tgUser.last_name ? ` ${tgUser.last_name}` : ''),
      telegramUsername: tgUser.username || `user${tgUser.id}`,
      profilePicUrl: tgUser.photo_url,
      start_param,
  
    };
  }
  
 
}