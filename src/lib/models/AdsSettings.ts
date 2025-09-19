import mongoose, { Schema, Document } from 'mongoose'

// AdsSettings interface
export interface IAdsSettings extends Document {
  _id: string
  enableGigaPubAds: boolean
  gigaPubAppId: string
  defaultAdsReward: number
  adsWatchLimit: number
  adsRewardMultiplier: number
  minWatchTime: number
  monetagEnabled: boolean
  monetagZoneId: string
  createdAt: Date
  updatedAt: Date
}

// AdsSettings schema
const AdsSettingsSchema: Schema = new Schema({
  enableGigaPubAds: {
    type: Boolean,
    required: true,
    default: true
  },
  gigaPubAppId: {
    type: String,
    required: true,
    default: ''
  },
  defaultAdsReward: {
    type: Number,
    required: true,
    default: 50,
    min: 0
  },
  adsWatchLimit: {
    type: Number,
    required: true,
    default: 10,
    min: 1
  },
  adsRewardMultiplier: {
    type: Number,
    required: true,
    default: 1.0,
    min: 0.1,
    max: 10.0
  },
  minWatchTime: {
    type: Number,
    required: true,
    default: 30,
    min: 5
  },
  monetagEnabled: {
    type: Boolean,
    required: true,
    default: true
  },
  monetagZoneId: {
    type: String,
    required: true,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'ads_settings'
})

// Ensure only one settings document exists
AdsSettingsSchema.index({}, { unique: true })

// Export the model
export default mongoose.models.AdsSettings || mongoose.model<IAdsSettings>('AdsSettings', AdsSettingsSchema)
