import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Notification from '@/lib/models/Notification'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const userId = 123456789 // Default user ID

    // Sample notifications in Bengali
    const sampleNotifications = [
      {
        userId,
        title: 'নতুন বিজ্ঞাপন উপলব্ধ!',
        description: 'টাস্ক পেজে গিয়ে নতুন বিজ্ঞাপন দেখুন এবং টাকা আয় করুন।',
        type: 'info',
        priority: 'high',
        metadata: {
          category: 'ads',
          actionUrl: '/tasks',
          actionText: 'দেখুন'
        }
      },
      {
        userId,
        title: 'রেফারেল বোনাস!',
        description: 'আপনার বন্ধুদের রেফার করুন এবং প্রতি রেফারে ৩০ টাকা পান।',
        type: 'success',
        priority: 'medium',
        metadata: {
          category: 'referral',
          actionUrl: '/home',
          actionText: 'শেয়ার করুন'
        }
      },
      {
        userId,
        title: 'সিস্টেম আপডেট',
        description: 'নতুন ফিচার যোগ করা হয়েছে। অ্যাপ রিস্টার্ট করুন।',
        type: 'warning',
        priority: 'medium',
        metadata: {
          category: 'system'
        }
      },
      {
        userId,
        title: 'উইথড্র সফল!',
        description: 'আপনার ৫০০ টাকা বিকাশে পাঠানো হয়েছে।',
        type: 'success',
        priority: 'high',
        metadata: {
          category: 'withdraw',
          relatedId: 'WD001'
        }
      },
      {
        userId,
        title: 'উইথড্র প্রসেসিং',
        description: 'আপনার উইথড্র অনুরোধটি বর্তমানে প্রক্রিয়াধীন রয়েছে।',
        type: 'info',
        priority: 'medium',
        metadata: {
          category: 'withdraw',
          relatedId: 'WD002'
        }
      },
      {
        userId,
        title: 'উইথড্র ব্যর্থ!',
        description: 'লেনদেন সম্পন্ন হয়নি, আবার চেষ্টা করুন বা সাপোর্টে যোগাযোগ করুন।',
        type: 'warning',
        priority: 'high',
        metadata: {
          category: 'withdraw',
          actionUrl: '/support',
          actionText: 'সাপোর্ট'
        }
      },
      {
        userId,
        title: 'ডেইলি বোনাস',
        description: 'আজকের ডেইলি বোনাস সংগ্রহ করতে ভুলবেন না!',
        type: 'info',
        priority: 'low',
        metadata: {
          category: 'bonus',
          actionUrl: '/tasks',
          actionText: 'সংগ্রহ করুন'
        }
      },
      {
        userId,
        title: 'উইথড্র রিকোয়েস্ট গ্রহণ করা হয়েছে',
        description: 'আপনার ১০০০ টাকার উইথড্র রিকোয়েস্ট রেকর্ড করা হয়েছে।',
        type: 'info',
        priority: 'medium',
        metadata: {
          category: 'withdraw',
          relatedId: 'WD003'
        }
      }
    ]

    // Clear existing notifications for this user
    await Notification.deleteMany({ userId })

    // Insert sample notifications with different timestamps
    const notifications = []
    for (let i = 0; i < sampleNotifications.length; i++) {
      const notification = {
        ...sampleNotifications[i],
        createdAt: new Date(Date.now() - (i * 2 * 60 * 60 * 1000)) // 2 hours apart
      }
      notifications.push(notification)
    }

    await Notification.insertMany(notifications)

    return NextResponse.json({
      success: true,
      message: `${notifications.length} sample notifications created successfully`,
      data: { count: notifications.length }
    })

  } catch (error) {
    console.error('Notification seed error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to seed notifications' },
      { status: 500 }
    )
  }
}
