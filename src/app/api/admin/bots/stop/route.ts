import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { BotConfig } from '@/lib/models/BotConfig'
import { getWebhookInfo, removeWebhook } from '@/services/webhook'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    // Get bot configuration
    const botConfig = await BotConfig.findOne({})
    
    if (!botConfig) {
      return NextResponse.json({
        success: false,
        message: 'Bot configuration not found'
      }, { status: 404 })
    }
 
    
    const botInfo = await getWebhookInfo(botConfig.botToken);
    if(botInfo?.url){
      await removeWebhook(botConfig.botToken);
    }

    const updatedConfig = await BotConfig.findOneAndUpdate(
      {},
      { 
        Status: 'offline',
        lastUpdated: new Date()
      },
      { new: true }
    )

    return NextResponse.json({
      success: true,
      data: {
        config: {
          _id: updatedConfig._id,
          botToken: updatedConfig.botToken,
          botUsername: updatedConfig.botUsername,
          Status: updatedConfig.Status,
          webhookUrl: updatedConfig.webhookUrl,
          lastUpdated: updatedConfig.lastUpdated,
          createdAt: updatedConfig.createdAt,
          updatedAt: updatedConfig.updatedAt
        }
      },
      message: 'Bot stopped successfully'
    })

  } catch (error) {
    console.error('Bot stop API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to stop bot'
    }, { status: 500 })
  }
}
