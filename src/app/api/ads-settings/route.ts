import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from 'auth-fingerprint'
import dbConnect from '@/lib/mongodb'
import AdsSettings from '@/lib/models/AdsSettings'
import User from '@/lib/models/User'

interface AdsSettingsRequest {
  userId: number
  timestamp: string
  signature: string
  hash: string
  action?: 'list' | 'get' | 'create' | 'update' | 'delete' 
  settingId?: string
  settingData?: {
    enableGigaPubAds?: boolean
    gigaPubAppId?: string
    defaultAdsReward?: number
    adsWatchLimit?: number
    adsRewardMultiplier?: number
    minWatchTime?: number
    monetagEnabled?: boolean
    monetagZoneId?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body: AdsSettingsRequest = await request.json()
    const { userId, timestamp, signature, hash, action = 'list', settingId, settingData } = body

    // Verify signature
    const isValidSignature = verifySignature({
      timestamp,
      signature,
      hash
    }, process.env.NEXT_PUBLIC_SECRET_KEY || '')

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Find user
    const user = await User.findOne({ userId })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is suspended
    if (user.status === 'suspend') {
      return NextResponse.json(
        { success: false, message: 'Your account has been suspended!' },
        { status: 403 }
      )
    }

    switch (action) {
      case 'list':
        const allSettings = await AdsSettings.find({})
        return NextResponse.json({
          success: true,
          data: {
            adsSettings: allSettings.map(setting => ({
              id: setting._id,
              enableGigaPubAds: setting.enableGigaPubAds,
              gigaPubAppId: setting.gigaPubAppId,
              defaultAdsReward: setting.defaultAdsReward,
              adsWatchLimit: setting.adsWatchLimit,
              adsRewardMultiplier: setting.adsRewardMultiplier,
              minWatchTime: setting.minWatchTime,
              monetagEnabled: setting.monetagEnabled,
              monetagZoneId: setting.monetagZoneId,
              createdAt: setting.createdAt,
              updatedAt: setting.updatedAt
            }))
          }
        })

      case 'get':
        if (!settingId) {
          return NextResponse.json(
            { success: false, message: 'Setting ID is required' },
            { status: 400 }
          )
        }

        const adSetting = await AdsSettings.findById(settingId)
        if (!adSetting) {
          return NextResponse.json(
            { success: false, message: 'Ad setting not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({
          success: true,
          data: {
            adSetting: {
              id: adSetting._id,
              enableGigaPubAds: adSetting.enableGigaPubAds,
              gigaPubAppId: adSetting.gigaPubAppId,
              defaultAdsReward: adSetting.defaultAdsReward,
              adsWatchLimit: adSetting.adsWatchLimit,
              adsRewardMultiplier: adSetting.adsRewardMultiplier,
              minWatchTime: adSetting.minWatchTime,
              monetagEnabled: adSetting.monetagEnabled,
              monetagZoneId: adSetting.monetagZoneId,
              createdAt: adSetting.createdAt,
              updatedAt: adSetting.updatedAt
            }
          }
        })

      case 'create':
        if (!settingData) {
          return NextResponse.json(
            { success: false, message: 'Setting data is required' },
            { status: 400 }
          )
        }

        // Validate required fields
        const {
          enableGigaPubAds = true,
          gigaPubAppId = '',
          defaultAdsReward = 50,
          adsWatchLimit = 10,
          adsRewardMultiplier = 1.0,
          minWatchTime = 30,
          monetagEnabled = false,
          monetagZoneId = null
        } = settingData

        // Validate ranges
        if (defaultAdsReward < 1 || defaultAdsReward > 1000) {
          return NextResponse.json(
            { success: false, message: 'Default ads reward must be between 1 and 1000' },
            { status: 400 }
          )
        }

        if (adsWatchLimit < 1 || adsWatchLimit > 100) {
          return NextResponse.json(
            { success: false, message: 'Ads watch limit must be between 1 and 100' },
            { status: 400 }
          )
        }

        if (adsRewardMultiplier < 0.1 || adsRewardMultiplier > 10.0) {
          return NextResponse.json(
            { success: false, message: 'Ads reward multiplier must be between 0.1 and 10.0' },
            { status: 400 }
          )
        }

        if (minWatchTime < 5 || minWatchTime > 300) {
          return NextResponse.json(
            { success: false, message: 'Min watch time must be between 5 and 300 seconds' },
            { status: 400 }
          )
        }

        const newSetting = new AdsSettings({
          enableGigaPubAds,
          gigaPubAppId,
          defaultAdsReward,
          adsWatchLimit,
          adsRewardMultiplier,
          minWatchTime,
          monetagEnabled,
          monetagZoneId
        })

        const savedSetting = await newSetting.save()

        return NextResponse.json({
          success: true,
          data: {
            adSetting: {
              id: savedSetting._id,
              enableGigaPubAds: savedSetting.enableGigaPubAds,
              gigaPubAppId: savedSetting.gigaPubAppId,
              defaultAdsReward: savedSetting.defaultAdsReward,
              adsWatchLimit: savedSetting.adsWatchLimit,
              adsRewardMultiplier: savedSetting.adsRewardMultiplier,
              minWatchTime: savedSetting.minWatchTime,
              monetagEnabled: savedSetting.monetagEnabled,
              monetagZoneId: savedSetting.monetagZoneId,
              createdAt: savedSetting.createdAt,
              updatedAt: savedSetting.updatedAt
            }
          },
          message: 'Ad setting created successfully'
        }, { status: 201 })

      case 'update':
        if (!settingId) {
          return NextResponse.json(
            { success: false, message: 'Setting ID is required' },
            { status: 400 }
          )
        }

        if (!settingData) {
          return NextResponse.json(
            { success: false, message: 'Setting data is required' },
            { status: 400 }
          )
        }

        const existingSetting = await AdsSettings.findById(settingId)
        if (!existingSetting) {
          return NextResponse.json(
            { success: false, message: 'Ad setting not found' },
            { status: 404 }
          )
        }

        // Validate ranges for update
        if (settingData.defaultAdsReward !== undefined && (settingData.defaultAdsReward < 1 || settingData.defaultAdsReward > 1000)) {
          return NextResponse.json(
            { success: false, message: 'Default ads reward must be between 1 and 1000' },
            { status: 400 }
          )
        }

        if (settingData.adsWatchLimit !== undefined && (settingData.adsWatchLimit < 1 || settingData.adsWatchLimit > 100)) {
          return NextResponse.json(
            { success: false, message: 'Ads watch limit must be between 1 and 100' },
            { status: 400 }
          )
        }

        if (settingData.adsRewardMultiplier !== undefined && (settingData.adsRewardMultiplier < 0.1 || settingData.adsRewardMultiplier > 10.0)) {
          return NextResponse.json(
            { success: false, message: 'Ads reward multiplier must be between 0.1 and 10.0' },
            { status: 400 }
          )
        }

        if (settingData.minWatchTime !== undefined && (settingData.minWatchTime < 5 || settingData.minWatchTime > 300)) {
          return NextResponse.json(
            { success: false, message: 'Min watch time must be between 5 and 300 seconds' },
            { status: 400 }
          )
        }

        const updatedSetting = await AdsSettings.findByIdAndUpdate(
          settingId,
          { $set: settingData },
          { new: true, runValidators: true }
        )

        return NextResponse.json({
          success: true,
          data: {
            adSetting: {
              id: updatedSetting._id,
              enableGigaPubAds: updatedSetting.enableGigaPubAds,
              gigaPubAppId: updatedSetting.gigaPubAppId,
              defaultAdsReward: updatedSetting.defaultAdsReward,
              adsWatchLimit: updatedSetting.adsWatchLimit,
              adsRewardMultiplier: updatedSetting.adsRewardMultiplier,
              minWatchTime: updatedSetting.minWatchTime,
              monetagEnabled: updatedSetting.monetagEnabled,
              monetagZoneId: updatedSetting.monetagZoneId,
              createdAt: updatedSetting.createdAt,
              updatedAt: updatedSetting.updatedAt
            }
          },
          message: 'Ad setting updated successfully'
        })

      case 'delete':
        if (!settingId) {
          return NextResponse.json(
            { success: false, message: 'Setting ID is required' },
            { status: 400 }
          )
        }

        const settingToDelete = await AdsSettings.findById(settingId)
        if (!settingToDelete) {
          return NextResponse.json(
            { success: false, message: 'Ad setting not found' },
            { status: 404 }
          )
        }

        await AdsSettings.findByIdAndDelete(settingId)

        return NextResponse.json({
          success: true,
          message: 'Ad setting deleted successfully'
        })

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Ads Settings API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET method for public access to ads settings
export async function GET() {
  try {
    await dbConnect()

    const adsSettings = await AdsSettings.find({})
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      data: adsSettings
    })

  } catch (error) {
    console.error('Ads Settings GET error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
