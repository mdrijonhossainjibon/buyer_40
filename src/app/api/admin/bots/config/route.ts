import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { BotConfig } from '@/lib/models/BotConfig'
import { getBotInfo } from '@/services/webhook'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    // Find bot configuration (assuming there's only one bot config)
    const botConfig = await BotConfig.findOne({})
    
    if (!botConfig) {
      // Return default config if none exists
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
          }
        },
        message: 'No bot configuration found, returning default'
      })
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
        }
      }
    })

  } catch (error) {
    console.error('Bot config GET API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch bot configuration'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { botToken,   webhookUrl, Status } = body

    // Validation
    if (botToken && typeof botToken !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Bot token must be a string'
      }, { status: 400 })
    }

     

    if (webhookUrl && typeof webhookUrl !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Webhook URL must be a string'
      }, { status: 400 })
    }

    if (Status && !['online', 'offline'].includes(Status)) {
      return NextResponse.json({
        success: false,
        message: 'Status must be either online or offline'
      }, { status: 400 })
    }

    // Prepare update data
    const updateData: any = {
      lastUpdated: new Date()
    }



    if (botToken !== undefined) updateData.botToken = botToken
   
    if (webhookUrl !== undefined) updateData.webhookUrl = webhookUrl
    if (Status !== undefined) updateData.Status = Status;


   

 

    const info = await getBotInfo(botToken);

    if(info.success && info.data){
       updateData.botUsername = info.data.username;
    }

    const botConfig = await BotConfig.findOneAndUpdate({}, updateData, { new: true });
     

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
        }
      },
      message: 'Bot configuration updated successfully'
    })

  } catch (error : any) {
    console.error('Bot config PUT API error:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Validation error: ' + error.message
      }, { status: 400 })
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: 'Bot token already exists'
      }, { status: 409 })
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to update bot configuration'
    }, { status: 500 })
  }
}
