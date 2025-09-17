import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AdsSettings from '@/lib/models/AdsSettings';

// GET - Fetch ads settings
export async function GET() {
  try {
    await dbConnect()
    
    // Get the first (and should be only) ads settings document
    let adsSettings = await AdsSettings.findOne();
    
    // If no settings exist, create default settings
    if (!adsSettings) {
      adsSettings = new AdsSettings({
        enableGigaPubAds: true,
        gigaPubAppId: '',
        defaultAdsReward: 50,
        adsWatchLimit: 10,
        adsRewardMultiplier: 1.0,
        minWatchTime: 30,
        monetagEnabled: false,
        monetagZoneId: ''
      });
      await adsSettings.save();
    }

    return NextResponse.json({
      success: true,
      data: adsSettings
    });

  } catch (error) {
    console.error('Error fetching ads settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch ads settings' 
      },
      { status: 500 }
    );
  }
}

// PUT - Update ads settings
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    const {
      enableGigaPubAds,
      gigaPubAppId,
      defaultAdsReward,
      adsWatchLimit,
      adsRewardMultiplier,
      minWatchTime,
      monetagEnabled,
      monetagZoneId
    } = body;

    // Validation
    if (typeof enableGigaPubAds !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'enableGigaPubAds must be a boolean' },
        { status: 400 }
      );
    }

    if (defaultAdsReward < 1 || defaultAdsReward > 1000) {
      return NextResponse.json(
        { success: false, error: 'defaultAdsReward must be between 1 and 1000' },
        { status: 400 }
      );
    }

    if (adsWatchLimit < 1 || adsWatchLimit > 100) {
      return NextResponse.json(
        { success: false, error: 'adsWatchLimit must be between 1 and 100' },
        { status: 400 }
      );
    }

    if (adsRewardMultiplier < 0.1 || adsRewardMultiplier > 10.0) {
      return NextResponse.json(
        { success: false, error: 'adsRewardMultiplier must be between 0.1 and 10.0' },
        { status: 400 }
      );
    }

    if (minWatchTime < 5 || minWatchTime > 300) {
      return NextResponse.json(
        { success: false, error: 'minWatchTime must be between 5 and 300 seconds' },
        { status: 400 }
      );
    }

    // Find and update the settings, or create if doesn't exist
    let adsSettings = await AdsSettings.findOne();
    
    if (adsSettings) {
      // Update existing settings
      adsSettings.enableGigaPubAds = enableGigaPubAds;
      adsSettings.gigaPubAppId = gigaPubAppId || '';
      adsSettings.defaultAdsReward = defaultAdsReward;
      adsSettings.adsWatchLimit = adsWatchLimit;
      adsSettings.adsRewardMultiplier = adsRewardMultiplier;
      adsSettings.minWatchTime = minWatchTime;
      adsSettings.monetagEnabled = monetagEnabled || false;
      adsSettings.monetagZoneId = monetagZoneId || '';
      
      await adsSettings.save();
    } else {
      // Create new settings
      adsSettings = new AdsSettings({
        enableGigaPubAds,
        gigaPubAppId: gigaPubAppId || '',
        defaultAdsReward,
        adsWatchLimit,
        adsRewardMultiplier,
        minWatchTime,
        monetagEnabled: monetagEnabled || false,
        monetagZoneId: monetagZoneId || ''
      });
      await adsSettings.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Ads settings updated successfully',
      data: adsSettings
    });

  } catch (error) {
    console.error('Error updating ads settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update ads settings' 
      },
      { status: 500 }
    );
  }
}
