import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from 'auth-fingerprint'
import dbConnect from '@/lib/mongodb'
import { BotConfig }from '@/lib/models/BotConfig'

interface BotStatusRequest {
  userId: number
  timestamp: string
  signature: string
  hash: string
}

 

export async function POST(request: NextRequest) {
  try {
    const body: BotStatusRequest = await request.json()
    const { timestamp, signature, hash } = body

    // Verify signature for security
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || ''
    const isValidSignature = verifySignature({ timestamp, signature, hash }, secretKey) // 5 minutes tolerance

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature or request expired' },
        { status: 401 }
      )
    }

    // Connect to database
    await dbConnect()

    // Find bot configuration record
    const botConfig = await BotConfig.findOne({ })

    if (!botConfig) {
      return NextResponse.json(
        { success: false, message: 'Bot not Configured' },
        { status: 404 }
      )
    }

    // Update last seen timestamp
    botConfig.lastUpdated = new Date()
    await botConfig.save()

    const response  = {
      success: true,
      data: {
        botUsername: botConfig.botUsername,
        botStatus: botConfig.Status,
        botVersion: '1.0.0'
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

 