import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { BotConfig } from '@/lib/models/BotConfig'
import { getBotInfo } from '@/services/webhook'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    // Find bot configuration to get status
    const botConfig = await BotConfig.findOne({})

    
    if (!botConfig) {
      return NextResponse.json({
        success: false,
        message: 'No bot configuration found'
      }, { status: 404 })
    }


    const botInfo = await getBotInfo(botConfig.botToken);

    if(botInfo.success && botInfo.data){
      botConfig.botUsername = botInfo.data.username;
      await botConfig.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        status: {
          _id: botConfig._id,
          botUsername: botConfig.botUsername,
          botStatus: botConfig.Status,
          botLastSeen: botConfig.lastUpdated,
          botVersion: 'v2.1.0', // This could be stored in config or fetched from bot
          createdAt: botConfig.createdAt,
          updatedAt: botConfig.updatedAt
        }
      }
    })

  } catch (error) {
    console.error('Bot status GET API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch bot status'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { status } = body

    // Validation
    if (!status || !['online', 'offline'].includes(status)) {
      return NextResponse.json({
        success: false,
        message: 'Status must be one of: online, offline, maintenance'
      }, { status: 400 })
    }
 

    const botConfig = await BotConfig.findOne({})

    if (!botConfig) {
      return NextResponse.json({
        success: false,
        message: 'No bot configuration found'
      }, { status: 404 })
    }

    const botInfo = await getBotInfo(botConfig.botToken);

    if(botInfo.success && botInfo.data){
      botConfig.botUsername = botInfo.data.username;
      await botConfig.save();
    }
    botConfig.Status = status;
    await botConfig.save();

    
    return NextResponse.json({
      success: true,
      data: {
        status: {
          _id: botConfig._id,
          botUsername: botConfig.botUsername,
          botStatus: status, // Return the original status including maintenance
          botLastSeen: botConfig.lastUpdated,
          botVersion: 'v2.1.0',
          createdAt: botConfig.createdAt,
          updatedAt: botConfig.updatedAt
        }
      },
      message: `Bot status updated to ${status}`
    })

  } catch (error : any) {
    console.error('Bot status PUT API error:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Validation error: ' + error.message
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to update bot status'
    }, { status: 500 })
  }
}
