import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import TaskActivity from '@/lib/models/TaskActivity'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { action, userId  } = await request.json()
 
    switch (action) {
      case 'watch_ad':
        return await handleWatchAd(userId)
      
      case 'claim_telegram':
        return await handleTelegramBonus(userId)
      
      case 'claim_youtube':
        return await handleYoutubeBonus(userId )
      
      case 'check_youtube':
        return await handleYoutubeCheck()
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleWatchAd(userId: number) {
  try {
    // Find user and check if they can watch ads
    const user = await User.findOne({ userId })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.canWatchAd()) {
      return NextResponse.json(
        { error: 'Daily ad limit reached or user inactive' },
        { status: 400 }
      )
    }

    // Update user balance and watched count
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      {
        $inc: {
          balanceTK: 5,
          watchedToday: 1,
          totalEarned: 5
        },
        lastAdWatch: new Date()
      },
      { new: true, upsert: true }
    )

    // Log the activity
    await TaskActivity.create({
      userId,
      taskType: 'ad_watch',
      amount: 5
    })

    return NextResponse.json({
      success: true,
      message: 'Ad watched successfully!',
      user: {
        balanceTK: updatedUser.balanceTK,
        watchedToday: updatedUser.watchedToday,
        totalEarned: updatedUser.totalEarned
      },
      earned: 5
    })
  } catch (error) {
    console.error('Watch ad error:', error)
    return NextResponse.json(
      { error: 'Failed to process ad watch' },
      { status: 500 }
    )
  }
}

async function handleTelegramBonus(userId: number) {
  try {
    // Check if user already claimed telegram bonus
    const user = await User.findOne({ userId })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.telegramBonus > 0) {
      return NextResponse.json(
        { error: 'Telegram bonus already claimed' },
        { status: 400 }
      )
    }

    // Update user balance and telegram bonus
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      {
        $inc: { 
          balanceTK: 50,
          totalEarned: 50
        },
        telegramBonus: 1
      },
      { new: true, upsert: true }
    )

    // Log the activity
    await TaskActivity.create({
      userId,
      taskType: 'telegram_bonus',
      amount: 50
    })

    return NextResponse.json({
      success: true,
      message: 'Telegram bonus claimed successfully!',
      user: {
        balanceTK: updatedUser.balanceTK,
        telegramBonus: updatedUser.telegramBonus,
        totalEarned: updatedUser.totalEarned
      },
      earned: 50
    })
  } catch (error) {
    console.error('Telegram bonus error:', error)
    return NextResponse.json(
      { error: 'Failed to process telegram bonus' },
      { status: 500 }
    )
  }
}

async function handleYoutubeBonus(userId: number, subscriberCount?: number) {
  try {
    // Check if user already claimed youtube bonus
    const user = await User.findOne({ userId })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.youtubeBonus > 0) {
      return NextResponse.json(
        { error: 'YouTube bonus already claimed' },
        { status: 400 }
      )
    }

    // Update user balance and youtube bonus
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      {
        $inc: { 
          balanceTK: 75,
          totalEarned: 75
        },
        youtubeBonus: 1
      },
      { new: true, upsert: true }
    )

    // Log the activity with subscriber count
    await TaskActivity.create({
      userId,
      taskType: 'youtube_bonus',
      amount: 75,
      metadata: {
        subscriberCount
      }
    })

    return NextResponse.json({
      success: true,
      message: 'YouTube bonus claimed successfully!',
      user: {
        balanceTK: updatedUser.balanceTK,
        youtubeBonus: updatedUser.youtubeBonus,
        totalEarned: updatedUser.totalEarned
      },
      earned: 75,
      subscriberCount
    })
  } catch (error) {
    console.error('YouTube bonus error:', error)
    return NextResponse.json(
      { error: 'Failed to process YouTube bonus' },
      { status: 500 }
    )
  }
}


const YOUTUBE_API_KEY = 'AIzaSyCt6LmhEqwywbjyn_NASijDDfK-Cr5sTsg'
const CHANNEL_ID = 'UCIZAXemyhC5YC8f3vk7vJ1w'


async function handleYoutubeCheck( ) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Channel not found or no data available')
    }
    
    const stats = data.items[0].statistics
    const subscriberCount = parseInt(stats.subscriberCount)
    console.log(subscriberCount)
    return NextResponse.json({
      success: true,
      subscriberCount,
      stats: {
        subscribers: subscriberCount,
        views: parseInt(stats.viewCount),
        videos: parseInt(stats.videoCount)
      }
    })
  } catch (error) {
    console.error('YouTube check error:', error)
    return NextResponse.json(
      { error: `Failed to check YouTube: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (action === 'user_stats') {
      const user = await User.findOne({ userId: parseInt(userId) })
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        user: {
          userId: user.userId,
          balanceTK: user.balanceTK,
          watchedToday: user.watchedToday,
          dailyAdLimit: user.dailyAdLimit,
          telegramBonus: user.telegramBonus,
          youtubeBonus: user.youtubeBonus,
          totalEarned: user.totalEarned,
          availableBalance: user.availableBalance,
          canWatchAd: user.canWatchAd()
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
