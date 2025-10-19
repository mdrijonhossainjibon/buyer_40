import mongoose, { Schema, Document } from 'mongoose'

// User interface
export interface IUser extends Document {
  _id: string
  username: string
  email?: string
  telegramId?: string
  balance: number
  totalEarned: number
  referralCount: number
  isActive: boolean
  isBlocked: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
  profile?: {
    firstName?: string
    lastName?: string
    avatar?: string
    bio?: string
  }
  settings?: {
    notifications: boolean
    language: string
    theme: 'light' | 'dark' | 'auto'
  }
  referral?: {
    referredBy?: string
    referralCode: string
    referralEarnings: number
  }
}

// User schema
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    index: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  telegramId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  totalEarned: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  referralCount: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
    index: true
  },
  isBlocked: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  },
  lastLoginAt: {
    type: Date
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String
  },
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    }
  },
  referral: {
    referredBy: {
      type: String,
      index: true
    },
    referralCode: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    referralEarnings: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, {
  timestamps: true,
  collection: 'users'
})

// Indexes for better query performance
UserSchema.index({ username: 1 })
UserSchema.index({ telegramId: 1 })
UserSchema.index({ 'referral.referralCode': 1 })
UserSchema.index({ 'referral.referredBy': 1 })
UserSchema.index({ isActive: 1, isBlocked: 1 })
UserSchema.index({ createdAt: -1 })

 
// Helper function to generate referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Export the model
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
