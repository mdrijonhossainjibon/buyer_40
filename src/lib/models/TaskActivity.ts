import mongoose, { Schema, Document } from 'mongoose'

export interface ITaskActivity extends Document {
  userId: number
  taskType: 'ad_watch' | 'telegram_bonus' | 'youtube_bonus'
  amount: number
  metadata?: {
    subscriberCount?: number
    apiResponse?: any
  }
  createdAt: Date
}

const TaskActivitySchema = new Schema<ITaskActivity>({
  userId: {
    type: Number,
    required: true
  },
  taskType: {
    type: String,
    required: true,
    enum: ['ad_watch', 'telegram_bonus', 'youtube_bonus']
  },
  amount: {
    type: Number,
    required: true
  },
  metadata: {
    subscriberCount: Number,
    apiResponse: Schema.Types.Mixed
  }
}, {
  timestamps: true
})

export default mongoose.models.TaskActivity || mongoose.model<ITaskActivity>('TaskActivity', TaskActivitySchema)
