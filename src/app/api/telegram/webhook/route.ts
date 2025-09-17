import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { BotConfig } from '@/lib/models/BotConfig'
import User from '@/lib/models/User'
import Activity from '@/lib/models/Activity'
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

    // Handle different types of updates
    if (update.message) {
      await handleMessage(update.message, botConfig.botToken)
    } else if (update.callback_query) {
      await handleCallbackQuery(update.callback_query, botConfig.botToken)
    } else if (update.inline_query) {
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
    } else if (text.startsWith('/balance')) {
      await handleBalanceCommand(chatId, userId, botToken)
    } else if (text.startsWith('/tasks')) {
      await handleTasksCommand(chatId, userId, botToken)
    } else {
      // Handle regular messages
      await handleRegularMessage(chatId, userId, text, botToken)
    }

  } catch (error) {
    console.error('Error handling message:', error)
  }
}

// Handle callback queries (inline keyboard buttons)
async function handleCallbackQuery(callbackQuery: TelegramCallbackQuery, botToken: string) {
  try {
    const chatId = callbackQuery.message?.chat.id
    const userId = callbackQuery.from.id
    const data = callbackQuery.data || ''

    if (!chatId) return

    // Handle different callback data
    if (data.startsWith('task_')) {
      await handleTaskCallback(chatId, userId, data, botToken)
    } else if (data === 'check_balance') {
      await handleBalanceCommand(chatId, userId, botToken)
    }

  } catch (error) {
    console.error('Error handling callback query:', error)
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

    // Check if user exists, create if not
    let user = await User.findOne({ userId })

    if (!user) {
      sendMessage(botToken, chatId, 'User not found. Please use /start to open mini app')
      return
    }

    const welcomeMessage = `🎉 Welcome to EarnFromAds BD!

Hello ${username}! 👋

💰 Current Balance: ${user.balanceTK} TK


📋 Available Commands:
/help - Show help menu
/balance - Check your balance
/tasks - View available tasks

Start earning money by completing simple tasks! 🚀`

    const miniAppUrl = await getMiniAppUrl(botToken)

    await sendMessage(botToken, chatId, welcomeMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '💰 Check Balance', callback_data: 'check_balance' },
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
/balance - Check your current balance
/tasks - View available earning tasks

💡 How to Earn:
• Complete ad viewing tasks
• Refer friends to earn bonus
• Complete daily tasks
• Participate in special events

Need more help? Contact our support team! 📞`

  await sendMessage(botToken, chatId, helpMessage)
}

async function handleBalanceCommand(chatId: number, userId: number | undefined, botToken: string) {
  try {
    if (!userId) return

    const user = await User.findOne({ userId })

    if (!user) {
      await sendMessage(botToken, chatId, '❌ User not found. Please use /start to register.')
      return
    }

    const balanceMessage = `💰 Your Balance Information

Current Balance: ${user.balanceTK} TK
Referral Code: ${user.referralCode}`

    const miniAppUrl = await getMiniAppUrl(botToken)

    await sendMessage(botToken, chatId, balanceMessage, {
      reply_markup: {
        inline_keyboard: [
          [

            {
              text: '🚀 Open Mini App',
              web_app: { url: `${miniAppUrl}?section=dashboard&userId=${userId}` }
            }
          ]
        ]
      }
    })

  } catch (error) {
    console.error('Error in balance command:', error)
  }
}

async function handleTasksCommand(chatId: number, userId: number | undefined, botToken: string) {
  const tasksMessage = `📋 Available Tasks

👥 Referral Tasks:
• Invite friends - 20 TK per referral
• Friend completes first task - 10 TK bonus

🎁 Special Events:
• Weekend bonus tasks - Up to 50 TK
• Monthly challenges - Up to 200 TK

Click below to start earning! 💰`

  const miniAppUrl = await getMiniAppUrl(botToken)

  await sendMessage(botToken, chatId, tasksMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '👥 Invite Friends', callback_data: 'task_referral' }
        ],
        [
          {
            text: '🚀 Open Mini App',
            web_app: { url: `${miniAppUrl}?section=tasks&userId=${userId}` }
          }
        ]
      ]
    }
  })
}


async function handleRegularMessage(chatId: number, userId: number | undefined, text: string, botToken: string) {
  // Handle regular text messages
  const response = `🤖 I received your message: "${text}"

Use these commands to interact with me:
/help - Show available commands
/balance - Check your balance
/tasks - View earning opportunities

Type /help for more information! 💡`

  await sendMessage(botToken, chatId, response)
}

async function handleTaskCallback(chatId: number, userId: number, data: string, botToken: string) {
  try {
    const miniAppUrl = await getMiniAppUrl(botToken)

    if (data === 'task_referral') {
      await sendMessage(botToken, chatId, '👥 Referral Program\n\nClick the button below to open our mini app and manage your referrals! 🎁', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '👥 Open Mini App',
                web_app: { url: `${miniAppUrl}?task=referral&userId=${userId}` }
              }
            ]
          ]
        }
      })
    } else if (data === 'view_tasks') {
      await sendMessage(botToken, chatId, '📋 All Available Tasks\n\nClick the button below to open our mini app and see all available earning opportunities! 🚀', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '📋 Open Mini App',
                web_app: { url: `${miniAppUrl}?section=tasks&userId=${userId}` }
              }
            ]
          ]
        }
      })
    }
  } catch (error) {
    console.error('Error handling task callback:', error)
  }
}

