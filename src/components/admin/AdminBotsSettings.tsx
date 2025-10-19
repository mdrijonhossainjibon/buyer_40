'use client'

import { useState, useEffect } from 'react'
import { Card, Switch, Toast, Form, PullToRefresh } from 'antd-mobile'
import { API_CALL } from 'auth-fingerprint'
import { baseURL } from '@/lib/api-string'
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

// Interfaces are now imported from the API module

export default function AdminBotsSettings({ loading = false }: AdminBotsSettingsProps) {
  
  const [botConfig, setBotConfig] = useState<any>({
    botToken: '',
    botUsername: '',
    Status: 'offline',
    botVersion : '',
    lastUpdated: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  })

  
 
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // TODO: Fetch bot config and status from API
    fetchBotData()
  }, [])

  const fetchBotData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      
      // Fetch bot data from API using auth-fingerprint
      const { response } = await API_CALL({
        baseURL,
        method: 'GET',
        url: '/admin/bots/data'
      })
      
      if (response && response.success && response.data) {
        setBotConfig(response.data.config || {})
     
        if (isRefresh) {
          Toast.show({
            content: 'Bot data refreshed successfully',
            duration: 1500
          })
        }
      } else {
        throw new Error(response?.message || 'Failed to fetch bot data')
      }
    } catch (error) {
      console.error('Failed to fetch bot data:', error)
      Toast.show({
        content: 'Failed to load bot data',
        duration: 2000
      })
     
      
      
    } finally {
      if (isRefresh) {
        setIsRefreshing(false)
      } else {
        setIsLoading(false)
      }
    }
  }

  const handleRefresh = async () => {
    await fetchBotData(true)
  }

  const handleToggleBotStatus = async () => {
    try {
      setIsLoading(true)
      const newStatus = botConfig.Status === 'online' ? 'offline' : 'online'
      
      // Call API to update bot status using auth-fingerprint
      const { response } = await API_CALL({
        baseURL,
        method: 'PUT',
        url: '/admin/bots/status',
        body: { status: newStatus }
      })
      
      if (response && response.success) {
        setBotConfig((prev : any) => ({ ...prev, Status: newStatus, lastUpdated: new Date() }))
      

        Toast.show({
          content: `Bot ${newStatus === 'online' ? 'started' : 'stopped'}`,
          duration: 2000
        })
      } else {
        throw new Error(response?.message || 'Failed to update bot status')
      }
    } catch (error) {
      console.error('Failed to toggle bot status:', error)
      Toast.show({
        content: 'Failed to update bot status',
        duration: 2000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveBotConfig = async () => {
    try {
      setIsLoading(true)
      
      // Validate bot configuration
      if (!botConfig.botToken.trim()) {
        Toast.show({
          content: 'Bot token is required',
          duration: 2000
        })
        return
      }
      
     
      
      // Call API to save bot configuration using auth-fingerprint
      const { response } = await API_CALL({
        baseURL,
        method: 'PUT',
        url: '/admin/bots/config',
        body: {
          botToken: botConfig.botToken,
        }
      })
      
      if (response && response.success && response.data?.config) {
        setBotConfig(response.data.config)
        setIsEditing(false)
        
        Toast.show({
          content: 'Bot configuration saved successfully',
          duration: 2000
        })
      } else {
        throw new Error(response?.message || 'Failed to save bot configuration')
      }
    } catch (error) {
      console.error('Failed to save bot config:', error)
      Toast.show({
        content: 'Failed to save bot configuration',
        duration: 2000
      })
    } finally {
      setIsLoading(false)
    }
  }

 
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircleOutline className="text-green-500" />
      case 'offline': return <CloseCircleOutline className="text-red-500" />
      default: return <CloseCircleOutline className="text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online'
      case 'offline': return 'Offline'
      default: return 'Unknown'
    }
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A'
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return 'Invalid Date'
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const formatTimeAgo = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A'
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return 'Invalid Date'
      
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60))
      
      if (diffInMinutes < 1) return 'Just now'
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
      
      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) return `${diffInHours} hours ago`
      
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    } catch (error) {
      return 'Invalid Date'
    }
  }
  if (loading || isLoading) {
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
    <PullToRefresh
      onRefresh={handleRefresh}
      pullingText="Pull to refresh bot data"
      canReleaseText="Release to refresh"
      refreshingText="Refreshing bot data..."
      completeText="Refresh complete"
    >
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bot Settings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Telegram bot configuration and management
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
                {getStatusIcon(botConfig.Status)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Bot Status</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {botConfig.botUsername} • {getStatusText(botConfig.Status)}
                </p>
              </div>
            </div>
            
            <Switch
              checked={botConfig.Status === 'online'}
              onChange={handleToggleBotStatus}
              disabled={isLoading}
              style={{
                '--checked-color': '#10b981',
                '--height': '28px',
                '--width': '48px'
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
 
              <span className="text-gray-500 dark:text-gray-400">Version:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {botConfig.botVersion}
              </div>
            </div>
            
            <div>
              <span className="text-gray-500 dark:text-gray-400">Last Seen:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatTimeAgo(botConfig?.lastUpdated)}
              </div>
            </div>
            
            <div>
              <span className="text-gray-500 dark:text-gray-400">Created:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatDate(botConfig.createdAt)}
              </div>
            </div>
            
            <div>
              <span className="text-gray-500 dark:text-gray-400">Updated:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatDate(botConfig.updatedAt)}
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
                <h3 className="font-semibold text-gray-900 dark:text-white">Bot Configuration</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Token and webhook settings
                </p>
              </div>
            </div>
            
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1"
              onClick={() => setIsEditing(!isEditing)}
            >
              <EditSOutline className="text-sm" />
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bot Token:
              </label>
              <input
                type={isEditing ? 'text' : 'password'}
                value={botConfig.botToken}
                onChange={(e) => setBotConfig((prev :any) => ({ ...prev, botToken: e.target.value }))}
                placeholder="Enter bot token"
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bot Username:
              </label>
              <input
                type="text"
                value={botConfig.botUsername}
                onChange={(e) => setBotConfig((prev :any) => ({ ...prev, botUsername: e.target.value }))}
                placeholder="@username"
                disabled={true}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
              />
            </div>

         

            {isEditing && (
              <div className="flex space-x-3">
                <button
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  onClick={handleSaveBotConfig}
                  disabled={isLoading}
                >
                  Save
                </button>
                <button
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

  
      {/* Bot Information */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Bot Information</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
              <span className="text-gray-700 dark:text-gray-300">
                {formatTimeAgo(botConfig.lastUpdated)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Created Date:</span>
              <span className="text-gray-700 dark:text-gray-300">
                {formatDate(botConfig.createdAt)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Configuration ID:</span>
              <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">
                {botConfig._id || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </Card>
      </div>
    </PullToRefresh>
  )
}
