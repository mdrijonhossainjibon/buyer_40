import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  userId: number
  username?: string
  email?: string
  phone?: string
  balanceTK: number
  referralCount: number
  dailyAdLimit: number
  watchedToday: number
  telegramBonus: number
  youtubeBonus: number
  isBotVerified: number
  isActive: boolean
  lastAdWatch?: Date
  lastLogin?: Date
  referredBy?: number
  totalEarned: number
  withdrawnAmount: number
  profile: {
    firstName?: string
    lastName?: string
    avatar?: string
    bio?: string
  }
  settings: {
    notifications: boolean
    language: string
    timezone: string
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  userId: {
    type: Number,
    required: [true, 'User ID is required'],
    unique: true,
    index: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  balanceTK: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  referralCount: {
    type: Number,
    default: 0,
    min: [0, 'Referral count cannot be negative']
  },
  dailyAdLimit: {
    type: Number,
    default: 10,
    min: [1, 'Daily ad limit must be at least 1'],
    max: [100, 'Daily ad limit cannot exceed 100']
  },
  watchedToday: {
    type: Number,
    default: 0,
    min: [0, 'Watched today cannot be negative']
  },
  telegramBonus: {
    type: Number,
    default: 0,
    min: [0, 'Telegram bonus cannot be negative']
  },
  youtubeBonus: {
    type: Number,
    default: 0,
    min: [0, 'YouTube bonus cannot be negative']
  },
  isBotVerified: {
    type: Number,
    default: 0,
    enum: [0, 1]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastAdWatch: {
    type: Date
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  referredBy: {
    type: Number,
    ref: 'User'
  },
  totalEarned: {
    type: Number,
    default: 0,
    min: [0, 'Total earned cannot be negative']
  },
  withdrawnAmount: {
    type: Number,
    default: 0,
    min: [0, 'Withdrawn amount cannot be negative']
  },
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    avatar: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    }
  },
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'bn']
    },
    timezone: {
      type: String,
      default: 'Asia/Dhaka'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better performance
UserSchema.index({ userId: 1 })
UserSchema.index({ email: 1 })
UserSchema.index({ username: 1 })
UserSchema.index({ referredBy: 1 })
UserSchema.index({ isActive: 1 })
UserSchema.index({ createdAt: -1 })

// Virtual for available balance (balance - withdrawn)
UserSchema.virtual('availableBalance').get(function() {
  return this.balanceTK - this.withdrawnAmount
})

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`
  }
  return this.profile.firstName || this.profile.lastName || this.username || `User ${this.userId}`
})

// Instance methods
UserSchema.methods.canWatchAd = function() {
  return this.watchedToday < this.dailyAdLimit && this.isActive
}

UserSchema.methods.addEarnings = function(amount: number) {
  this.balanceTK += amount
  this.totalEarned += amount
  return this.save()
}

UserSchema.methods.resetDailyLimit = function() {
  this.watchedToday = 0
  return this.save()
}

// Static methods
UserSchema.statics.findByUserId = function(userId: number) {
  return this.findOne({ userId })
}

UserSchema.statics.getActiveUsers = function() {
  return this.find({ isActive: true })
}

UserSchema.statics.getUserStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
        totalBalance: { $sum: '$balanceTK' },
        totalEarned: { $sum: '$totalEarned' },
        totalWithdrawn: { $sum: '$withdrawnAmount' }
      }
    }
  ])
}

// Pre-save middleware
UserSchema.pre('save', function(next) {
  // Update last login on save
  if (this.isModified() && !this.isNew) {
    this.lastLogin = new Date()
  }
  next()
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
