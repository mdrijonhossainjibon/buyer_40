import mongoose, { Schema, Document } from 'mongoose'

// Activity interface
export interface IActivity extends Document {
  _id: string
  userId: string
  username?: string
  activityType: string
  description: string
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  metadata?: {
    adId?: string
    taskId?: string
    referralUserId?: string
    withdrawalMethod?: string
    ipAddress?: string
    userAgent?: string
    [key: string]: any
  }
}

// Activity schema
const ActivitySchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  username: {
    type: String,
    index: true
  },
  activityType: {
    type: String,
    required: true,
    enum: ['ad_watch', 'task_complete', 'referral', 'bonus', 'withdrawal', 'login', 'signup', 'other'],
    index: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  completedAt: {
    type: Date
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'activities'
})

// Indexes for better query performance
ActivitySchema.index({ userId: 1, createdAt: -1 })
ActivitySchema.index({ status: 1, createdAt: -1 })
ActivitySchema.index({ activityType: 1, createdAt: -1 })
ActivitySchema.index({ username: 1, createdAt: -1 })

// Export the model
export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema)
