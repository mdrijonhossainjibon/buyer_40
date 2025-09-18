import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { BotConfig } from '@/lib/models/BotConfig'
import User from '@/lib/models/User'
import { sendMessage, getWebhookInfo } from '@/services/webhook'

// Telegram Update types
interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}
 

interface TelegramChat {
  id: number
  type: 'private' | 'group' | 'supergroup' | 'channel'
  title?: string
  username?: string
  first_name?: string
  last_name?: string
}

interface TelegramMessage {
  message_id: number
  from?: TelegramUser
  chat: TelegramChat
  date: number
  text?: string
  entities?: Array<{
    type: string
    offset: number
    length: number
  }>
}

interface TelegramCallbackQuery {
  id: string
  from: TelegramUser
  message?: TelegramMessage
  data?: string
}

interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
  callback_query?: TelegramCallbackQuery
  inline_query?: any
}

// Global variable to cache mini app URL
let cachedMiniAppUrl: string | null = null

// Function to get mini app URL from webhook info
async function getMiniAppUrl(botToken: string): Promise<string> {
  if (cachedMiniAppUrl) {
    return cachedMiniAppUrl
  }

  try {
    const webhookInfo = await getWebhookInfo(botToken)
    if (webhookInfo?.url) {
      // Extract domain from webhook URL
      const url = new URL(webhookInfo.url)
      cachedMiniAppUrl = `${url.protocol}//${url.host}`
      return cachedMiniAppUrl
    }
  } catch (error) {
    console.error('Error getting webhook info:', error)
  }

  // Fallback to environment variable or default
  cachedMiniAppUrl = process.env.NEXT_PUBLIC_APP_URL || ''
  return cachedMiniAppUrl
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    // Get bot configuration
    const botConfig = await BotConfig.findOne({})

    if (!botConfig || !botConfig.botToken) {
      return NextResponse.json({
        success: false,
        message: 'Bot not configured'
      }, { status: 400 })
    }

    // Parse incoming update
    const update: TelegramUpdate = await request.json()

    // Check bot status before processing updates
    if (botConfig.Status === 'offline') {
      // Handle offline status - send offline message for user interactions
      if (update.message) {
        await handleOfflineMessage(update.message, botConfig.botToken)
      } else if (update.callback_query) {
        await handleOfflineCallback(update.callback_query, botConfig.botToken)
      }
      return NextResponse.json({ success: true, status: 'offline' })
    }

    // Handle different types of updates when bot is online
    if (update.message) {
      await handleMessage(update.message, botConfig.botToken)
    }  else if (update.inline_query) {
      await handleInlineQuery(update.inline_query, botConfig.botToken)
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({
      success: false,
      message: 'Webhook processing failed'
    }, { status: 500 })
  }
}

// Handle incoming messages
async function handleMessage(message: TelegramMessage, botToken: string) {
  try {
    const chatId = message.chat.id
    const userId = message.from?.id
    const text = message.text || ''
    const username = message.from?.username || message.from?.first_name || 'Unknown'

    // Handle different commands
    if (text.startsWith('/start')) {
      await handleStartCommand(chatId, userId, username, botToken)
    } else if (text.startsWith('/help')) {
      await handleHelpCommand(chatId, botToken)
    } else {
      // Handle regular messages
      await handleRegularMessage(chatId, userId, text, botToken)
    }

  } catch (error) {
    console.error('Error handling message:', error)
  }
}

 

// Handle inline queries
async function handleInlineQuery(inlineQuery: any, botToken: string) {
  try {
    // Handle inline queries if needed
    console.log('Inline query received:', inlineQuery)
  } catch (error) {
    console.error('Error handling inline query:', error)
  }
}

// Command handlers
async function handleStartCommand(chatId: number, userId: number | undefined, username: string, botToken: string) {
  try {
    if (!userId) return

    const miniAppUrl = await getMiniAppUrl(botToken)
    // Check if user exists, create if not
    let user = await User.findOne({ userId })
 
    
    if (!user) {
     sendMessage(botToken, chatId, 'Welcome to EarnFromAds BD!' , { 
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Open Mini App',
              web_app: { url: `${miniAppUrl}?userId=${userId}` }
            }
          ]
        ]
      }
     })
      return
    }

    const welcomeMessage = `🎉 Welcome to EarnFromAds BD!

Hello ${username}! 👋

💰 Current Balance: ${user.balanceTK} TK
 
Start earning money by completing simple tasks! 🚀`


    await sendMessage(botToken, chatId, welcomeMessage, {
      reply_markup: {
        inline_keyboard: [
          [

            {
              text: '📋 Open Mini App',
              web_app: { url: `${miniAppUrl}?userId=${userId}` }
            }
          ]
        ]
      }
    })

  } catch (error) {
    console.error('Error in start command:', error)
  }
}

async function handleHelpCommand(chatId: number, botToken: string) {
  const helpMessage = `🤖 EarnFromAds BD Help

📋 Available Commands:
/start - Start using the bot
/help - Show this help menu
  
💡 How to Earn:
• Complete ad viewing tasks
• Refer friends to earn bonus
• Complete daily tasks
• Participate in special events

Need more help? Contact our support team! 📞`

  await sendMessage(botToken, chatId, helpMessage)
}



async function handleRegularMessage(chatId: number, userId: number | undefined, text: string, botToken: string) {
  // Handle regular text messages
  const response = ` 

Use these commands to interact with me:
/help - Show available commands
 
Type /help for more information! 💡`

  await sendMessage(botToken, chatId, response)
}

 

// Handle messages when bot is offline
async function handleOfflineMessage(message: TelegramMessage, botToken: string) {
  try {
    const chatId = message.chat.id
    const username = message.from?.username || message.from?.first_name || 'User'

    const offlineMessage = `🤖 Bot Status: Offline

Hello ${username}! 👋

I'm currently offline for maintenance. 🔧

⏰ Please try again later or contact our support team if you need immediate assistance.

🛠️ We're working to get everything back online as soon as possible!

Thank you for your patience! 🙏`

    await sendMessage(botToken, chatId, offlineMessage)

  } catch (error) {
    console.error('Error handling offline message:', error)
  }
}

// Handle callback queries when bot is offline
async function handleOfflineCallback(callbackQuery: TelegramCallbackQuery, botToken: string) {
  try {
    const chatId = callbackQuery.message?.chat.id
    const username = callbackQuery.from.username || callbackQuery.from.first_name || 'User'

    if (!chatId) return

    const offlineMessage = `🤖 Bot Status: Offline

Hello ${username}! 👋

I'm currently offline for maintenance. 🔧

⏰ The feature you're trying to access is temporarily unavailable.

🛠️ We're working to get everything back online as soon as possible!

Thank you for your patience! 🙏`

    await sendMessage(botToken, chatId, offlineMessage)

  } catch (error) {
    console.error('Error handling offline callback:', error)
  }
}

