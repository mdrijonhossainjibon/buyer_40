import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import AdsSettings from '@/lib/models/AdsSettings'

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect()

    // Get ads settings
    const adsSettings = await AdsSettings.findOne().sort({ createdAt: -1 })
    
    if (!adsSettings) {
      return NextResponse.json(
        { success: false, message: 'Ads settings not found' },
        { status: 404 }
      )
    }
 
    return NextResponse.json({
      success: true,
      data:  adsSettings
    })

  } catch (error) {
    console.error('Ads settings API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
