import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from 'auth-fingerprint'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import Activity from '@/lib/models/Activity'
import Notification from '@/lib/models/Notification'
interface UserRequest {
  userId: number
  timestamp: string
  signature: string
  hash: string
}

 
export async function POST(request: NextRequest) {
  try {
    const body: UserRequest = await request.json()
    const {  timestamp, signature, hash } = body

    // Verify signature for security
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || ''
    const  result  = verifySignature({ timestamp, signature, hash } , secretKey)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature or request expired' },
        { status: 401 }
      )
    }
       const { userId , start_param , username } = JSON.parse(result.data  as string)
    // Connect to database
    await dbConnect()

    // Find or create user
    let user = await User.findOne({ userId })

    
    if (!user) {
      // Check if it's feast time (special hours for bonus)
      const now = new Date()
      const currentHour = now.getHours()
      const isFeastTime = (currentHour >= 18 && currentHour <= 23) || (currentHour >= 6 && currentHour <= 10)
      const feastBonus = isFeastTime ? 25 : 3  


      // Handle referral logic if start_param is provided
      let referrerBonus = 0
      if (start_param) {
        try {
            
          const referrer = await User.findOne({ referralCode : start_param})
          
          if (referrer) {
            // Update referrer's referral count and give bonus
            referrerBonus = 25 // 25 TK bonus for referrer
            await User.findOneAndUpdate(
              { referralCode : start_param },
              { 
                $inc: { 
                  referralCount: 1,
                  balanceTK: referrerBonus,
                  totalEarned: referrerBonus
                }
              }
            )

            // Create referral notification for referrer
            await Notification.create({
              userId: referrer.userId,
              title: '🎁 রেফারেল বোনাস!',
              message: `অভিনন্দন! আপনার রেফারেলের মাধ্যমে একজন নতুন ব্যবহারকারী যোগ দিয়েছেন। আপনি ${referrerBonus} টাকা বোনাস পেয়েছেন!`,
              type: 'success',
              priority: 'high',
              isRead: false,
              metadata: {
                bonusAmount: referrerBonus,
                referredUserId: userId,
                bonusType: 'referral'
              }
            })

            // Log referral activity for referrer
            await Activity.create({
              userId:  referrer.userId,
              activityType: 'referral',
              description: `রেফারেল বোনাস: নতুন ব্যবহারকারী (${userId}) যোগদান`,
              amount: referrerBonus,
              status: 'completed',
              metadata: {
                referredUserId: userId,
                bonusType: 'referral'
              }
            })
          }
        } catch (error) {
          console.log('Referral processing error:', error)
        }
      }

      // Create new user with default values and feast bonus
      user = await User.create({
        userId,
        balanceTK: feastBonus,
        referralCount: 0,
        telegramBonus: 0,
        youtubeBonus: 0,
        totalEarned: feastBonus,
        username
      })

      // Create welcome notification
      await Notification.create({
        userId,
        title: '🎉 EarnFromAds এ স্বাগতম!',
        message: `আমাদের প্ল্যাটফর্মে স্বাগতম! আপনি রেজিস্ট্রেশন বোনাস হিসেবে ${feastBonus} টাকা পেয়েছেন। আরো আয় করতে বিজ্ঞাপন দেখা শুরু করুন!`,
        type: 'info',
        priority: 'high',
        isRead: false,
        metadata: {
          bonusAmount: feastBonus,
          registrationTime: now.toISOString(),
          isFeastTime
        }
      })

      // Create feast time bonus notification if applicable
      if (isFeastTime) {
        await Notification.create({
          userId,
          title: '🎊 ভোজের সময় বোনাস!',
          message: `আপনি ভাগ্যবান! আপনি ভোজের সময় (সকাল ৬-১০টা অথবা সন্ধ্যা ৬-১১টা) রেজিস্ট্রেশন করেছেন এবং অতিরিক্ত ${feastBonus} টাকা বোনাস পেয়েছেন!`,
          type: 'info',
          priority: 'high',
          isRead: false,
          metadata: {
            bonusType: 'feast_time',
            extraBonus: 10,
            feastTimeHours: 'সকাল ৬-১০টা ও সন্ধ্যা ৬-১১টা'
          }
        })
      }

      // Log user registration activity with bonus
      await Activity.create({
        userId,
        activityType: 'signup',
        description: `ব্যবহারকারী রেজিস্ট্রেশন করেছেন এবং ${feastBonus} টাকা বোনাস পেয়েছেন${isFeastTime ? ' (ভোজের সময়)' : ''}${start_param ? ' (রেফারেল)' : ''}`,
        amount: feastBonus,
        status: 'completed',
        metadata: {
          isFirstLogin: true,
          isFeastTime,
          bonusAmount: feastBonus,
          referredBy: start_param || null,
          userAgent: request.headers.get('user-agent'),
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        }
      })

      // Log login activity
      await Activity.create({
        userId,
        activityType: 'login',
        description: 'রেজিস্ট্রেশনের পর প্রথম লগইন',
        amount: 0,
        status: 'completed',
        metadata: {
          isFirstLogin: true,
          userAgent: request.headers.get('user-agent'),
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        }
      })
    } else {
      // Update last login
      user.lastLogin = new Date()
      await user.save()

      // Log login activity
      await Activity.create({
        userId,
        activityType: 'login',
        description: 'User login',
        amount: 0,
        status: 'completed',
        metadata: {
          userAgent: request.headers.get('user-agent'),
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        }
      })
    }

    // Get recent activities (last 10)
    const recentActivities = await Activity.getUserActivities(userId, 10)

    // Get today's activities count
    const todayActivities = await Activity.getTodayActivities(userId)

    // Get activity stats
    const activityStats = await Activity.getUserActivityStats(userId, 30)
    const totalEarnings = activityStats.reduce((sum: number, stat: any) => sum + stat.totalAmount, 0)

    const response  = {
      success: true,
      data: {
        userId: user.userId,
        balanceTK: user.balanceTK,
        referralCount: user.referralCount,
        dailyAdLimit: user.dailyAdLimit,
        watchedToday: user.watchedToday,
        telegramBonus: user.telegramBonus,
        youtubeBonus: user.youtubeBonus,
        isBotVerified: user.isBotVerified,
        username: user.username,
        status: user.status,
        profile: {
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
          avatar: user.profile?.avatar
        },
        totalEarned: user.totalEarned,
        availableBalance: user.balanceTK,
        referralCode: user.referralCode,
        recentActivities: recentActivities.map((activity: any) => ({
          _id: activity._id,
          activityType: activity.activityType,
          description: activity.description,
          amount: activity.amount,
          status: activity.status,
          createdAt: activity.createdAt,
          metadata: activity.metadata
        })),
        activityStats: {
          todayActivities: todayActivities.length,
          totalActivities: recentActivities.length,
          totalEarnings
        }
      },
      message: 'User data retrieved successfully'
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
