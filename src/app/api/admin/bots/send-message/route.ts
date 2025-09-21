import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'

// Interface for sending messages
interface SendMessageRequest {
  chatId: number
  message: string
  parseMode?: 'Markdown' | 'HTML'
  disableWebPagePreview?: boolean
  disableNotification?: boolean
}

// Get bot configuration from database
const getBotConfig = async () => {
  try {
    await dbConnect()
    
    // This should match your existing BotConfig model
    // For now, we'll return a mock config - you should implement proper DB query
    return {
      botToken: process.env.TELEGRAM_BOT_TOKEN || '',
      botUsername: process.env.TELEGRAM_BOT_USERNAME || '',
      isActive: true
    }
  } catch (error) {
    console.error('❌ Failed to get bot config:', error)
    throw error
  }
}

// Send message via Telegram Bot API
const sendTelegramMessage = async (
  botToken: string, 
  chatId: number, 
  message: string, 
  options: Partial<SendMessageRequest> = {}
) => {
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`
    
    const payload = {
      chat_id: chatId,
      text: message,
      parse_mode: options.parseMode || 'Markdown',
      disable_web_page_preview: options.disableWebPagePreview || true,
      disable_notification: options.disableNotification || false
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`Telegram API error: ${result.description || 'Unknown error'}`)
    }

    return {
      success: true,
      messageId: result.result.message_id,
      data: result.result
    }

  } catch (error) {
    console.error('❌ Telegram API error:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { chatId, message, parseMode, disableWebPagePreview, disableNotification }: SendMessageRequest = await request.json()

    // Validate required fields
    if (!chatId || !message) {
      return NextResponse.json(
        { success: false, message: 'chatId and message are required' },
        { status: 400 }
      )
    }

    // Get bot configuration
    const botConfig = await getBotConfig()
    
    if (!botConfig.botToken) {
      return NextResponse.json(
        { success: false, message: 'Bot token not configured' },
        { status: 500 }
      )
    }

    if (!botConfig.isActive) {
      return NextResponse.json(
        { success: false, message: 'Bot is not active' },
        { status: 503 }
      )
    }

    // Send message
    const result = await sendTelegramMessage(
      botConfig.botToken,
      chatId,
      message,
      { parseMode, disableWebPagePreview, disableNotification }
    )

    console.log('✅ Message sent successfully:', {
      chatId,
      messageId: result.messageId,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: {
        messageId: result.messageId,
        chatId,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Send message API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to send message' 
      },
      { status: 500 }
    )
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Bot send message API is running',
    usage: {
      POST: {
        endpoint: '/api/admin/bots/send-message',
        body: {
          chatId: 'number - Telegram chat/user ID',
          message: 'string - Message text',
          parseMode: 'optional - Markdown or HTML',
          disableWebPagePreview: 'optional - boolean',
          disableNotification: 'optional - boolean'
        }
      }
    },
    timestamp: new Date().toISOString()
  })
}
