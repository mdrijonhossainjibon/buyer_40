import mongoose, { Schema, Document } from 'mongoose'

export interface INotification extends Document {
  userId: number
  title: string
  description: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
  metadata?: {
    actionUrl?: string
    actionText?: string
    category?: string
    relatedId?: string
  }
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: Number,
    required: [true, 'User ID is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info',
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  metadata: {
    actionUrl: {
      type: String,
      trim: true
    },
    actionText: {
      type: String,
      trim: true,
      maxlength: [50, 'Action text cannot exceed 50 characters']
    },
    category: {
      type: String,
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters']
    },
    relatedId: {
      type: String,
      trim: true
    }
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

 
// Virtual for time ago
NotificationSchema.virtual('timeAgo').get(function() {
  const now = new Date()
  const diff = now.getTime() - this.createdAt.getTime()
  
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
})

// Static method to create notification
NotificationSchema.statics.createNotification = async function(notificationData: {
  userId: number
  title: string
  description: string
  type?: 'info' | 'success' | 'warning' | 'error'
  priority?: 'low' | 'medium' | 'high'
  metadata?: any
  expiresAt?: Date
}) {
  return this.create(notificationData)
}

// Static method to get user notifications
NotificationSchema.statics.getUserNotifications = async function(userId: number, limit = 20) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
}

// Static method to mark as read
NotificationSchema.statics.markAsRead = async function(userId: number, notificationIds: string[]) {
  return this.updateMany(
    { userId, _id: { $in: notificationIds } },
    { isRead: true }
  )
}

// Static method to get unread count
NotificationSchema.statics.getUnreadCount = async function(userId: number) {
  return this.countDocuments({ userId, isRead: false })
}

const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema)

export default Notification
