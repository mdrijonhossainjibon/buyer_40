'use client'

import { useState, useEffect } from 'react'
import { Card, Switch,  Toast, Form } from 'antd-mobile'
import { 
  PlayOutline,
  StopOutline,
  SetOutline,
  ClockCircleOutline,
  EditSOutline,
  UserOutline,
  CheckCircleOutline,
  CloseCircleOutline
} from 'antd-mobile-icons'

interface AdminBotsSettingsProps {
  loading?: boolean
}

interface BotConfig {
  _id?: string
  botToken: string
  botUsername: string
  Status: 'online' | 'offline'
  webhookUrl: string
  lastUpdated: Date
  createdAt: Date
  updatedAt: Date
}

interface BotStatus {
  _id?: string
  botUsername: string
  botStatus: 'online' | 'offline' | 'maintenance'
  botLastSeen: Date
  botVersion: string
  createdAt: Date
  updatedAt: Date
}

export default function AdminBotsSettings({ loading = false }: AdminBotsSettingsProps) {
  const [botConfig, setBotConfig] = useState<BotConfig>({
    botToken: '',
    botUsername: '@earnfromadsbd_bot',
    Status: 'offline',
    webhookUrl: '',
    lastUpdated: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const [botStatus, setBotStatus] = useState<BotStatus>({
    botUsername: '@earnfromadsbd_bot',
    botStatus: 'offline',
    botLastSeen: new Date(),
    botVersion: 'v2.1.0',
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // TODO: Fetch bot config and status from API
    fetchBotData()
  }, [])

  const fetchBotData = async () => {
    try {
      // Mock data - replace with actual API calls
      setBotConfig({
        botToken: '7234567890:AAHdqTcvbXorQeR-5WP1arjdpEHHhvlhvlh',
        botUsername: '@earnfromadsbd_bot',
        Status: 'online',
        webhookUrl: 'https://api.earnfromadsbd.com/webhook',
        lastUpdated: new Date(Date.now() - 5 * 60 * 1000),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000)
      })

      setBotStatus({
        botUsername: '@earnfromadsbd_bot',
        botStatus: 'online',
        botLastSeen: new Date(Date.now() - 2 * 60 * 1000),
        botVersion: 'v2.1.0',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 1000)
      })
    } catch (error) {
      console.error('Failed to fetch bot data:', error)
      Toast.show({
        content: 'বট ডেটা লোড করতে ব্যর্থ',
        duration: 2000
      })
    }
  }

  const handleToggleBotStatus = async () => {
    try {
      const newStatus = botConfig.Status === 'online' ? 'offline' : 'online'
      
      setBotConfig(prev => ({ ...prev, Status: newStatus, lastUpdated: new Date() }))
      setBotStatus(prev => ({ 
        ...prev, 
        botStatus: newStatus, 
        botLastSeen: new Date(),
        updatedAt: new Date()
      }))

      Toast.show({
        content: `বট ${newStatus === 'online' ? 'চালু' : 'বন্ধ'} করা হয়েছে`,
        duration: 2000
      })

      // TODO: Call API to update bot status
    } catch (error) {
      console.error('Failed to toggle bot status:', error)
      Toast.show({
        content: 'বট স্ট্যাটাস আপডেট করতে ব্যর্থ',
        duration: 2000
      })
    }
  }

  const handleSaveBotConfig = async () => {
    try {
      // TODO: Validate and save bot configuration
      setBotConfig(prev => ({ ...prev, updatedAt: new Date() }))
      setIsEditing(false)
      
      Toast.show({
        content: 'বট কনফিগারেশন সংরক্ষণ করা হয়েছে',
        duration: 2000
      })

      // TODO: Call API to save bot config
    } catch (error) {
      console.error('Failed to save bot config:', error)
      Toast.show({
        content: 'বট কনফিগারেশন সংরক্ষণ করতে ব্যর্থ',
        duration: 2000
      })
    }
  }

  const handleSetWebhook = async () => {
    try {
      Toast.show({
        content: 'ওয়েবহুক সেট করা হচ্ছে...',
        duration: 2000
      })

      // TODO: Call Telegram API to set webhook
      setBotConfig(prev => ({ ...prev, lastUpdated: new Date() }))
      
      setTimeout(() => {
        Toast.show({
          content: 'ওয়েবহুক সফলভাবে সেট করা হয়েছে',
          duration: 2000
        })
      }, 2000)
    } catch (error) {
      console.error('Failed to set webhook:', error)
      Toast.show({
        content: 'ওয়েবহুক সেট করতে ব্যর্থ',
        duration: 2000
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircleOutline className="text-green-500" />
      case 'offline': return <CloseCircleOutline className="text-red-500" />
      case 'maintenance': return <ClockCircleOutline className="text-yellow-500" />
      default: return <CloseCircleOutline className="text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'অনলাইন'
      case 'offline': return 'অফলাইন'
      case 'maintenance': return 'রক্ষণাবেক্ষণ'
      default: return 'অজানা'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'এখনই'
    if (diffInMinutes < 60) return `${diffInMinutes} মিনিট আগে`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} ঘন্টা আগে`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} দিন আগে`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <img 
                src="/logo.svg" 
                alt="EarnFromAdsBD Logo" 
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">বট সেটিংস</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                টেলিগ্রাম বট কনফিগারেশন এবং ম্যানেজমেন্ট
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Bot Status */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                {getStatusIcon(botStatus.botStatus)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">বট স্ট্যাটাস</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {botStatus.botUsername} • {getStatusText(botStatus.botStatus)}
                </p>
              </div>
            </div>
            
            <Switch
              checked={botConfig.Status === 'online'}
              onChange={handleToggleBotStatus}
              style={{
                '--checked-color': '#10b981',
                '--height': '28px',
                '--width': '48px'
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">ভার্সন:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {botStatus.botVersion}
              </div>
            </div>
            
            <div>
              <span className="text-gray-500 dark:text-gray-400">শেষ দেখা:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatTimeAgo(botStatus.botLastSeen)}
              </div>
            </div>
            
            <div>
              <span className="text-gray-500 dark:text-gray-400">তৈরি:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatTimeAgo(botStatus.createdAt)}
              </div>
            </div>
            
            <div>
              <span className="text-gray-500 dark:text-gray-400">আপডেট:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatTimeAgo(botStatus.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Bot Configuration */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <SetOutline className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">বট কনফিগারেশন</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  টোকেন এবং ওয়েবহুক সেটিংস
                </p>
              </div>
            </div>
            
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1"
              onClick={() => setIsEditing(!isEditing)}
            >
              <EditSOutline className="text-sm" />
              <span>{isEditing ? 'বাতিল' : 'সম্পাদনা'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                বট টোকেন:
              </label>
              <input
                type={isEditing ? 'text' : 'password'}
                value={botConfig.botToken}
                onChange={(e) => setBotConfig(prev => ({ ...prev, botToken: e.target.value }))}
                placeholder="বট টোকেন প্রবেশ করুন"
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                বট ইউজারনেম:
              </label>
              <input
                type="text"
                value={botConfig.botUsername}
                onChange={(e) => setBotConfig(prev => ({ ...prev, botUsername: e.target.value }))}
                placeholder="@username"
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ওয়েবহুক URL:
              </label>
              <input
                type="url"
                value={botConfig.webhookUrl}
                onChange={(e) => setBotConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                placeholder="https://your-domain.com/webhook"
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
              />
            </div>

            {isEditing && (
              <div className="flex space-x-3">
                <button
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  onClick={handleSaveBotConfig}
                >
                  সংরক্ষণ করুন
                </button>
                <button
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
                  onClick={() => setIsEditing(false)}
                >
                  বাতিল
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Bot Actions */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">বট অ্যাকশন</h3>
          
          <div className="space-y-3">
            <button
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
              onClick={handleSetWebhook}
              disabled={!botConfig.botToken || !botConfig.webhookUrl}
            >
              <SetOutline />
              <span>ওয়েবহুক সেট করুন</span>
            </button>
            
            <button
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
              onClick={() => {
                Toast.show('বট পুনরায় চালু করা হচ্ছে...')
                // TODO: Implement bot restart
              }}
            >
              <PlayOutline />
              <span>বট পুনরায় চালু করুন</span>
            </button>
            
            <button
              className="w-full px-4 py-3 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
              onClick={() => {
                Toast.show('বট বন্ধ করা হচ্ছে...')
                setBotConfig(prev => ({ ...prev, Status: 'offline' }))
                setBotStatus(prev => ({ ...prev, botStatus: 'offline' }))
              }}
            >
              <StopOutline />
              <span>বট বন্ধ করুন</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Bot Information */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">বট তথ্য</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">শেষ আপডেট:</span>
              <span className="text-gray-700 dark:text-gray-300">
                {formatTimeAgo(botConfig.lastUpdated)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">তৈরির তারিখ:</span>
              <span className="text-gray-700 dark:text-gray-300">
                {botConfig.createdAt.toLocaleDateString('bn-BD')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">কনফিগারেশন ID:</span>
              <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">
                {botConfig._id || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
