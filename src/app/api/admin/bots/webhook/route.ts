import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { BotConfig } from '@/lib/models/BotConfig'
import { getWebhookInfo, setupWebhook } from '@/services/webhook'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { webhookUrl } = body

    // Validation
    if (!webhookUrl || typeof webhookUrl !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Webhook URL is required and must be a string'
      }, { status: 400 })
    }

    // Basic URL validation
    try {
      new URL(webhookUrl)
    } catch {
      return NextResponse.json({
        success: false,
        message: 'Invalid webhook URL format'
      }, { status: 400 })
    }

    // Get bot configuration
    const botConfig = await BotConfig.findOne({})
    
    if (!botConfig || !botConfig.botToken) {
      return NextResponse.json({
        success: false,
        message: 'Bot token not configured. Please configure bot token first.'
      }, { status: 400 })
    }
 
    try {

      if(!webhookUrl.startsWith('https://')) {
        return NextResponse.json({
          success: false,
          message: 'Webhook URL must be an HTTPS URL'
        }, { status: 400 })
      }

      const webhookInfo = await getWebhookInfo(botConfig.botToken)
     if(!webhookInfo?.url){
       await setupWebhook(botConfig.botToken, webhookUrl)
     }
      
     
      // For now, just update the webhook URL in our database
      const updatedConfig = await BotConfig.findOneAndUpdate(
        {},
        { 
          webhookUrl,
          lastUpdated: new Date()
        },
        { new: true, upsert: true }
      )

      return NextResponse.json({
        success: true,
        data: {
          webhookUrl: updatedConfig.webhookUrl,
          isSet: true
        },
        message: 'Webhook set successfully'
      })

    } catch (telegramError) {
      console.error('Telegram API error:', telegramError)
      return NextResponse.json({
        success: false,
        message: 'Failed to set webhook with Telegram API'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Webhook API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to set webhook'
    }, { status: 500 })
  }
}
