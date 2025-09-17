import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { BotConfig } from '@/lib/models/BotConfig'
import User from '@/lib/models/User'
import Activity from '@/lib/models/Activity'
import { sendMessage } from '@/services/webhook'

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
    } else if (text.startsWith('/withdraw')) {
      await handleWithdrawCommand(chatId, userId, botToken)
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
    } else if (data.startsWith('withdraw_')) {
      await handleWithdrawCallback(chatId, userId, data, botToken)
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
🎁 Total Earned: ${user.totalEarned} TK

📋 Available Commands:
/help - Show help menu
/balance - Check your balance
/tasks - View available tasks
/withdraw - Withdraw earnings

Start earning money by completing simple tasks! 🚀`

    await sendMessage(botToken, chatId, welcomeMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '💰 Check Balance', callback_data: 'check_balance' },
            { text: '📋 View Tasks', callback_data: 'view_tasks' }
          ],
          [
            { text: '💸 Withdraw', callback_data: 'withdraw_menu' },
            { text: '👥 Referrals', callback_data: 'referral_info' }
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
/withdraw - Withdraw your earnings

💡 How to Earn:
• Complete ad viewing tasks
• Refer friends to earn bonus
• Complete daily tasks
• Participate in special events

💸 Withdrawal:
• Minimum withdrawal: 100 TK
• Available methods: bKash, Nagad, Rocket
• Processing time: 24-48 hours

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
Total Earned: ${user.totalEarned} TK
Referral Code: ${user.referralCode}

📊 Recent Activities:`

    // Get recent activities
    const recentActivities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)

    let activitiesText = ''
    recentActivities.forEach(activity => {
      const date = activity.createdAt.toLocaleDateString()
      const status = activity.status === 'completed' ? '✅' : activity.status === 'pending' ? '⏳' : '❌'
      activitiesText += `\n${status} ${activity.description} - ${activity.amount} TK (${date})`
    })

    await sendMessage(botToken, chatId, balanceMessage + activitiesText, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📋 View All Tasks', callback_data: 'view_tasks' },
            { text: '💸 Withdraw', callback_data: 'withdraw_menu' }
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

🎥 Ad Viewing Tasks:
• Watch 30-second ads - 2 TK each
• Complete video surveys - 5 TK each
• Install recommended apps - 10 TK each

🎯 Daily Tasks:
• Daily check-in - 5 TK
• Share referral code - 3 TK
• Complete profile - 10 TK (one-time)

👥 Referral Tasks:
• Invite friends - 20 TK per referral
• Friend completes first task - 10 TK bonus

🎁 Special Events:
• Weekend bonus tasks - Up to 50 TK
• Monthly challenges - Up to 200 TK

Click below to start earning! 💰`

  await sendMessage(botToken, chatId, tasksMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🎥 Watch Ads', callback_data: 'task_watch_ads' },
          { text: '📱 App Tasks', callback_data: 'task_apps' }
        ],
        [
          { text: '✅ Daily Check-in', callback_data: 'task_daily_checkin' },
          { text: '👥 Invite Friends', callback_data: 'task_referral' }
        ]
      ]
    }
  })
}

async function handleWithdrawCommand(chatId: number, userId: number | undefined, botToken: string) {
  try {
    if (!userId) return

    const user = await User.findOne({ userId })
    
    if (!user) {
      await sendMessage(botToken, chatId, '❌ User not found. Please use /start to register.')
      return
    }

    if (user.balanceTK < 100) {
      await sendMessage(botToken, chatId, `💸 Withdrawal Information

Current Balance: ${user.balanceTK} TK
Minimum Withdrawal: 100 TK

❌ Insufficient balance for withdrawal.
Complete more tasks to reach the minimum amount! 📋`)
      return
    }

    const withdrawMessage = `💸 Withdrawal Options

Current Balance: ${user.balanceTK} TK
Available for Withdrawal: ${user.balanceTK} TK

📱 Available Methods:
• bKash - Instant transfer
• Nagad - Instant transfer  
• Rocket - Instant transfer

⏰ Processing Time: 24-48 hours
💰 Minimum Amount: 100 TK

Select your preferred method:`

    await sendMessage(botToken, chatId, withdrawMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📱 bKash', callback_data: 'withdraw_bkash' },
            { text: '📱 Nagad', callback_data: 'withdraw_nagad' }
          ],
          [
            { text: '📱 Rocket', callback_data: 'withdraw_rocket' },
            { text: '❌ Cancel', callback_data: 'cancel_withdraw' }
          ]
        ]
      }
    })

  } catch (error) {
    console.error('Error in withdraw command:', error)
  }
}

async function handleRegularMessage(chatId: number, userId: number | undefined, text: string, botToken: string) {
  // Handle regular text messages
  const response = `🤖 I received your message: "${text}"

Use these commands to interact with me:
/help - Show available commands
/balance - Check your balance
/tasks - View earning opportunities
/withdraw - Withdraw your earnings

Type /help for more information! 💡`

  await sendMessage(botToken, chatId, response)
}

async function handleTaskCallback(chatId: number, userId: number, data: string, botToken: string) {
  try {
    if (data === 'task_watch_ads') {
      await sendMessage(botToken, chatId, '🎥 Ad Watching Task\n\nRedirecting you to available ads...\nComplete the ad and return here for your reward! 💰')
    } else if (data === 'task_daily_checkin') {
      // Check if user already checked in today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const existingCheckin = await Activity.findOne({
        userId,
        activityType: 'login',
        createdAt: { $gte: today }
      })

      if (existingCheckin) {
        await sendMessage(botToken, chatId, '✅ You have already checked in today!\nCome back tomorrow for your next daily bonus! 📅')
        return
      }

      // Create daily check-in activity
      const checkinActivity = new Activity({
        userId,
        activityType: 'login',
        description: 'Daily check-in via Telegram bot',
        amount: 5,
        status: 'completed',
        metadata: { platform: 'telegram' },
        createdAt: new Date(),
        completedAt: new Date()
      })
      await checkinActivity.save()

      // Update user balance
      await User.findOneAndUpdate(
        { userId },
        { 
          $inc: { 
            balanceTK: 5,
            totalEarned: 5
          }
        }
      )

      await sendMessage(botToken, chatId, '🎉 Daily Check-in Complete!\n\n💰 +5 TK added to your balance\n\nCome back tomorrow for another bonus! 📅')
    }
  } catch (error) {
    console.error('Error handling task callback:', error)
  }
}

async function handleWithdrawCallback(chatId: number, userId: number, data: string, botToken: string) {
  try {
    const method = data.replace('withdraw_', '')
    
    if (method === 'cancel') {
      await sendMessage(botToken, chatId, '❌ Withdrawal cancelled.\n\nUse /withdraw when you\'re ready to cash out! 💰')
      return
    }

    await sendMessage(botToken, chatId, `💸 ${method.toUpperCase()} Withdrawal

Please provide your ${method.toUpperCase()} number in this format:
${method.toUpperCase()}: 01XXXXXXXXX

Example: ${method.toUpperCase()}: 01712345678

Send your number and we'll process your withdrawal request! 📱`)

  } catch (error) {
    console.error('Error handling withdraw callback:', error)
  }
}
