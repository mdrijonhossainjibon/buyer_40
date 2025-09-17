import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { BotConfig } from '@/lib/models/BotConfig'
import { getBotInfo  } from '@/services/webhook'
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    // Find bot configuration
    const botConfig = await BotConfig.findOne({})

    const botInfo = await getBotInfo(botConfig.botToken)
 
    if (!botConfig) {
      // Return default data if no config exists
      return NextResponse.json({
        success: true,
        data: {
          config: {
            botToken: '',
            botUsername: '',
            Status: 'offline',
            webhookUrl: '',
            lastUpdated: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          },
          status: {
            botUsername: '',
            botStatus: 'offline',
            botLastSeen: new Date(),
            botVersion: 'v2.1.0',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        },
        message: 'No bot configuration found, returning default data'
      })
    }

    if(botInfo.success && botInfo.data){
      botConfig.botUsername = botInfo.data.username;
      await botConfig.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        config: {
          _id: botConfig._id,
          botToken: botConfig.botToken,
          botUsername: botConfig.botUsername,
          Status: botConfig.Status,
          webhookUrl: botConfig.webhookUrl,
          lastUpdated: botConfig.lastUpdated,
          createdAt: botConfig.createdAt,
          updatedAt: botConfig.updatedAt
        },
        status: {
          _id: botConfig._id,
          botUsername: botConfig.botUsername,
          botStatus: botConfig.Status,
          botLastSeen: botConfig.lastUpdated,
          botVersion: 'v2.1.0',
          createdAt: botConfig.createdAt,
          updatedAt: botConfig.updatedAt
        }
      }
    })

  } catch (error) {
    console.error('Bot data GET API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch bot data'
    }, { status: 500 })
  }
}
