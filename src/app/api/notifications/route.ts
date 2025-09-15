import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from 'auth-fingerprint'
import dbConnect from '@/lib/mongodb'
import Notification from '@/lib/models/Notification'
import User from '@/lib/models/User'

interface NotificationRequest {
    userId: number
    timestamp: string
    signature: string
    hash: string
    action?: 'list' | 'markRead' | 'unreadCount'
    notificationIds?: string[]
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const body: NotificationRequest = await request.json()
        const { userId, timestamp, signature, hash, action = 'list', notificationIds } = body

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
                const notifications = await Notification.find({ userId })
                return NextResponse.json({
                    success: true,
                    data: {
                        notifications: notifications.map(notification => ({
                            id: notification._id,
                            title: notification.title,
                            description: notification.description,
                            type: notification.type,
                            isRead: notification.isRead,
                            priority: notification.priority,
                            timeAgo: getTimeAgo(notification.createdAt),
                            metadata: notification.metadata,
                            message: notification.message,
                            createdAt: notification.createdAt
                        }))
                    }
                })

            case 'markRead':
                if (!notificationIds || notificationIds.length === 0) {
                    return NextResponse.json(
                        { success: false, message: 'Notification IDs are required' },
                        { status: 400 }
                    )
                }

                await Notification.updateMany({ userId, _id: { $in: notificationIds } }, { isRead: true })
                return NextResponse.json({
                    success: true,
                    message: 'Notifications marked as read'
                })

            case 'unreadCount':
                const unreadCount = await Notification.countDocuments({ userId, isRead: false })
                return NextResponse.json({
                    success: true,
                    data: { unreadCount }
                })

            default:
                return NextResponse.json(
                    { success: false, message: 'Invalid action' },
                    { status: 400 }
                )
        }

    } catch (error) {
        console.error('Notifications API error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}

// Helper function to calculate time ago in Bengali
function getTimeAgo(createdAt: Date): string {
    const now = new Date()
    const diff = now.getTime() - createdAt.getTime()

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
        return `${minutes} মিনিট আগে`
    } else if (hours < 24) {
        return `${hours} ঘন্টা আগে`
    } else {
        return `${days} দিন আগে`
    }
}
