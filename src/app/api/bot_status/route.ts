import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from 'auth-fingerprint'
import dbConnect from '@/lib/mongodb'
import BotStatus from '@/lib/models/BotStatus'

interface BotStatusRequest {
  userId: number
  timestamp: string
  signature: string
  hash: string
}

interface BotStatusResponse {
  success: boolean
  data?: {
    botUsername: string
    botStatus: 'online' | 'offline' | 'maintenance'
    botLastSeen: string
    botVersion: string
  }
  message?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: BotStatusRequest = await request.json()
    const { userId, timestamp, signature, hash } = body

    // Verify signature for security
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || ''
    const isValidSignature = verifySignature(timestamp, secretKey, signature, hash, 2000) // 5 minutes tolerance
    
    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature or request expired' },
        { status: 401 }
      )
    }

    // Connect to database
    await dbConnect()

    // Find or create bot status record
    let botStatus = await BotStatus.findOne({ botUsername: '@earnfromadsbd_bot' })
    
    if (!botStatus) {
      // Create initial bot status if doesn't exist
      botStatus = new BotStatus({
        botUsername: '@earnfromadsbd_bot',
        botStatus: 'online',
        botLastSeen: new Date(),
        botVersion: 'v2.1.0'
      })
      await botStatus.save()
    } else {
      // Update last seen if bot is online
      if (botStatus.botStatus === 'online') {
        botStatus.botLastSeen = new Date()
        await botStatus.save()
      }
    }

    const response: BotStatusResponse = {
      success: true,
      data: {
        botUsername: botStatus.botUsername,
        botStatus: botStatus.botStatus,
        botLastSeen: botStatus.botStatus === 'online' ? 'Now' : botStatus.botLastSeen.toISOString(),
        botVersion: botStatus.botVersion
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Bot status API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle GET requests (optional)
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { success: false, message: 'Use POST method with proper authentication' },
    { status: 405 }
  )
}
