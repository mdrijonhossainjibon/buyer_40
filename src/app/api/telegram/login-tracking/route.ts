import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { API_CALL } from 'auth-fingerprint'
import { baseURL } from '@/lib/api-string'

// Interface for login tracking data
interface LoginTrackingData {
  action: 'login'
  userId: number
  username?: string
  timestamp: number
  sessionId: string
  platform?: string
  version?: string
  colorScheme?: string
  userAgent?: string
  telegramUser?: {
    id: number
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
    is_premium?: boolean
  }
}

// Create a simple login tracking model
const createLoginLog = async (data: any) => {
  try {
    await dbConnect()
    
    // You can create a proper MongoDB model here
    // For now, we'll just log to console and potentially send notification
    console.log('📊 Login tracking data received:', {
      timestamp: new Date().toISOString(),
      userId: data.userId,
      username: data.username,
      telegramUser: data.telegramUser,
      platform: data.platform,
      sessionId: data.sessionId
    })

    return {
      success: true,
      message: 'Login tracked successfully',
      logId: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  } catch (error) {
    console.error('❌ Failed to create login log:', error)
    throw error
  }
}

// Send login notification via bot (if configured)
const sendLoginNotification = async (data: LoginTrackingData) => {
  try {
    // Check if we have a Telegram user to send notification to
    if (!data.telegramUser?.id) {
      console.log('⚠️ No Telegram user ID, skipping notification')
      return { success: false, message: 'No Telegram user ID' }
    }

    // Get current time in Bangladesh timezone
    const loginTime = new Date(data.timestamp).toLocaleString('bn-BD', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })

    // Create notification message
    const message = `🔐 **নিরাপত্তা সতর্কতা - নতুন লগইন**

👤 **ব্যবহারকারী:** ${data.username || `User #${data.userId}`}
⏰ **সময়:** ${loginTime}
📱 **প্ল্যাটফর্ম:** ${data.platform || 'Web'}
🌐 **ব্রাউজার:** ${data.userAgent ? data.userAgent.split(' ')[0] : 'Unknown'}
🎨 **থিম:** ${data.colorScheme === 'dark' ? 'ডার্ক মোড' : 'লাইট মোড'}

✅ **এটি কি আপনি ছিলেন?**

যদি এই লগইন আপনার না হয়, তাহলে:
• অবিলম্বে আপনার পাসওয়ার্ড পরিবর্তন করুন
• আপনার অ্যাকাউন্ট সেটিংস চেক করুন

🛡️ **নিরাপত্তার জন্য ধন্যবাদ!**
📞 সাহায্যের জন্য: @EarnFromAdsBD_Support`

    // Send notification using existing bot API
    const { response } = await API_CALL({
      baseURL,
      method: 'POST',
      url: '/admin/bots/send-message',
      body: {
        chatId: data.telegramUser.id,
        message: message,
        parseMode: 'Markdown'
      }
    })

    if (response?.success) {
      console.log('✅ Login notification sent to user:', data.telegramUser.id)
      return { success: true, message: 'Notification sent' }
    } else {
      console.warn('⚠️ Failed to send login notification:', response?.message)
      return { success: false, message: response?.message || 'Failed to send notification' }
    }

  } catch (error) {
    console.error('❌ Error sending login notification:', error)
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: LoginTrackingData = await request.json()

    // Validate required fields
    if (!data.action || data.action !== 'login') {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      )
    }

    if (!data.userId && !data.telegramUser?.id) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    // Log the login attempt
    const logResult = await createLoginLog(data)

    // Send notification (optional, don't fail if this fails)
    let notificationResult = { success: false, message: 'Not attempted' }
    try {
      notificationResult = await sendLoginNotification(data)
    } catch (error) {
      console.warn('⚠️ Notification failed but continuing:', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Login tracking completed',
      data: {
        logged: logResult.success,
        logId: logResult.logId,
        notificationSent: notificationResult.success,
        notificationMessage: notificationResult.message
      }
    })

  } catch (error) {
    console.error('❌ Login tracking API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Telegram login tracking API is running',
    endpoints: {
      POST: '/api/telegram/login-tracking - Track user login events'
    },
    timestamp: new Date().toISOString()
  })
}
