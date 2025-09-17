import TelegramBot from 'node-telegram-bot-api';

/**
 * Set up webhook for Telegram bot
 */
export async function setupWebhook(botToken: string, webhookUrl: string): Promise<boolean> {
  try {
    const bot = new TelegramBot(botToken, { polling: false });
    
    // Set webhook
    const result = await bot.setWebHook(webhookUrl, {
      allowed_updates: ['message', 'callback_query', 'inline_query']
    });
    
    return result;
  } catch (error :any) {
      return false;
  }
}

/**
 * Remove webhook (useful for development/testing)
 */
export async function removeWebhook(botToken: string): Promise<boolean> {
  try {
    const bot = new TelegramBot(botToken, { polling: false });
    
    const result = await bot.deleteWebHook();
    return result;
  } catch (error :any) {
    console.error('Error removing webhook:', error.message);
    return false;
  }
}

/**
 * Get webhook info
 */
export async function getWebhookInfo(botToken: string) {
  try {
    const bot = new TelegramBot(botToken, { polling: false });
    
    const info = await bot.getWebHookInfo();
    return info;
  } catch (error) {
    console.error('Error getting webhook info:', error);
    return null;
  }
}

/**
 * Send message to user
 */
export async function sendMessage(
  botToken: string, 
  chatId: number | string, 
  text: string, 
  options?: any
) {
  try {
    const bot = new TelegramBot(botToken, { polling: false });
    return await bot.sendMessage(chatId, text, options);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}


export async function getBotInfo(botToken: string) {
  try {
    const bot = new TelegramBot(botToken, { polling: false });
    
    const info = await bot.getMe();
     return { success: true , data: info }
  } catch (error) {
   return  { success: false , message: 'Bot not found or api key invalid' }
  }
}


export async function getChatMember(botToken: string , chatId: number | string , userId: number) {
  try {
    const bot = new TelegramBot(botToken, { polling: false });
    
    const info = await bot.getChatMember(chatId, userId);
    return info;
  } catch (error) {
    console.error('Error getting bot info:', error);
    return null;
  }
}