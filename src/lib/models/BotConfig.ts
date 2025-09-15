import mongoose, { Document, Schema } from 'mongoose';

export interface IBotConfig extends Document {
  botToken: string;
  botUsername: string;
  Status:  'online' | 'offline'
  lastUpdated: Date;
  createdAt: Date;
  webhookUrl: string;
  updatedAt: Date;
}

const BotConfigSchema: Schema = new Schema({
  botToken: {
    type: String,
    required: true,
    unique: true
  },
  botUsername: {
    type: String,
    required: true
  },
   Status: {
    type: String,
    enum: ['online', 'offline'],
    required: true,
    default: 'offline'
  },
  webhookUrl: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

 

export const BotConfig = mongoose.models.BotConfig || mongoose.model<IBotConfig>('BotConfig', BotConfigSchema);
