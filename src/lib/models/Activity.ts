import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IActivity extends Document {
  userId: number
  activityType: 'ad_watch' | 'task_complete' | 'referral' | 'bonus' | 'withdrawal' | 'login'
  description: string
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  metadata?: {
    adId?: string
    taskId?: string
    referralUserId?: number
    withdrawalMethod?: string
    ipAddress?: string
    userAgent?: string
    [key: string]: any
  }
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export interface IActivityModel extends Model<IActivity> {
  getUserActivities(userId: number, limit?: number, skip?: number): Promise<IActivity[]>
  getUserActivityStats(userId: number, days?: number): Promise<any[]>
  getTodayActivities(userId: number): Promise<IActivity[]>
}

const ActivitySchema = new Schema<IActivity>({
  userId: {
    type: Number,
    required: true,
    index: true
  },
  activityType: {
    type: String,
    required: true,
    enum: ['ad_watch', 'task_complete', 'referral', 'bonus', 'withdrawal', 'login'],
    index: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    index: true
  }
}, {
  timestamps: true,
  collection: 'activities'
})

// Indexes for better query performance
ActivitySchema.index({ userId: 1, createdAt: -1 })
ActivitySchema.index({ userId: 1, activityType: 1, createdAt: -1 })
ActivitySchema.index({ userId: 1, status: 1, createdAt: -1 })
ActivitySchema.index({ createdAt: -1 })

// Pre-save middleware to update completedAt when status changes to completed
ActivitySchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date()
  }
  this.updatedAt = new Date()
  next()
})

// Static methods for common queries
ActivitySchema.statics.getUserActivities = function(userId: number, limit = 50, skip = 0) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
}

ActivitySchema.statics.getUserActivityStats = function(userId: number, days = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  return this.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$activityType',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        completedCount: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    }
  ])
}

ActivitySchema.statics.getTodayActivities = function(userId: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return this.find({
    userId,
    createdAt: { $gte: today, $lt: tomorrow }
  }).sort({ createdAt: -1 }).lean()
}

const Activity = (mongoose.models.Activity || mongoose.model<IActivity, IActivityModel>('Activity', ActivitySchema)) as IActivityModel

export default Activity
