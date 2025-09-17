'use client'

import { useState, useEffect } from 'react'
import { Card, Switch, Selector, Toast, Stepper, PullToRefresh } from 'antd-mobile'
import { 
  EyeOutline,
  PlayOutline,
  StopOutline,
  SetOutline,
  ClockCircleOutline,
  BankcardOutline,
  GlobalOutline
} from 'antd-mobile-icons'
import { adsAPI, AdsSettings } from '@/lib/api/ads'

export default function AdminAdsSettings() {
  const [adsSettings, setAdsSettings] = useState<AdsSettings>({
    enableGigaPubAds: true,
    gigaPubAppId: '',
    defaultAdsReward: 50,
    adsWatchLimit: 10,
    adsRewardMultiplier: 1.0,
    minWatchTime: 30,
    monetagEnabled: true,
    monetagZoneId: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const updateAdsSettings = (field: keyof AdsSettings, value: any) => {
    setAdsSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const response = await adsAPI.updateSettings({
        enableGigaPubAds: adsSettings.enableGigaPubAds,
        gigaPubAppId: adsSettings.gigaPubAppId,
        defaultAdsReward: adsSettings.defaultAdsReward,
        adsWatchLimit: adsSettings.adsWatchLimit,
        adsRewardMultiplier: adsSettings.adsRewardMultiplier,
        minWatchTime: adsSettings.minWatchTime,
        monetagEnabled: adsSettings.monetagEnabled,
        monetagZoneId: adsSettings.monetagZoneId
      })

      if (response.success && response.data) {
        setAdsSettings(response.data)
        setIsEditing(false)
        Toast.show({
          content: 'Ad settings saved successfully',
          duration: 2000
        })
      } else {
        Toast.show({
          content: response.error || 'Failed to save settings',
          duration: 3000
        })
      }
    } catch (error) {
      console.error('Error saving ads settings:', error)
      Toast.show({
        content: 'Failed to save settings',
        duration: 3000
      })
    } finally {
      setSaving(false)
    }
  }

  // Load ads settings function
  const loadAdsSettings = async (showToast = false) => {
    try {
      const response = await adsAPI.getSettings()
      if (response.success && response.data) {
        setAdsSettings(response.data)
        if (showToast) {
          Toast.show({
            content: 'Settings refreshed successfully',
            duration: 2000
          })
        }
      } else {
        Toast.show({
          content: response.error || 'Failed to load settings',
          duration: 3000
        })
      }
    } catch (error) {
      console.error('Error loading ads settings:', error)
      Toast.show({
        content: 'Failed to load settings',
        duration: 3000
      })
    }
  }

  // Handle pull to refresh
  const handleRefresh = async () => {
    await loadAdsSettings(true)
  }

  // Load ads settings on component mount
  useEffect(() => {
    const initialLoad = async () => {
      await loadAdsSettings()
      setLoading(false)
    }
    initialLoad()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-4">
      {/* Header */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
       

          {/* Main Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Ad System</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enable/disable advertisement display
              </p>
            </div>
            <Switch
              checked={adsSettings.enableGigaPubAds}
              onChange={(checked) => updateAdsSettings('enableGigaPubAds', checked)}
              disabled={!isEditing || saving}
              style={{
                '--checked-color': '#10b981',
                '--height': '28px',
                '--width': '48px'
              }}
            />
          </div>
        </div>
      </Card>

      {/* GigaPub Settings */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <GlobalOutline className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">GigaPub Ad Settings</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                GigaPub advertisement network configuration
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GigaPub App ID:
              </label>
              <input
                type="text"
                value={adsSettings.gigaPubAppId}
                onChange={(e) => updateAdsSettings('gigaPubAppId', e.target.value)}
                placeholder="Enter App ID"
                disabled={!isEditing || saving}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors duration-200"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Monetag Enabled</span>
              <Switch
                checked={adsSettings.monetagEnabled}
                onChange={(checked) => updateAdsSettings('monetagEnabled', checked)}
                disabled={!isEditing || saving}
                style={{
                  '--checked-color': '#3b82f6',
                  '--height': '24px',
                  '--width': '44px'
                }}
              />
            </div>

            {adsSettings.monetagEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monetag Zone ID:
                </label>
                <input
                  type="text"
                  value={adsSettings.monetagZoneId}
                  onChange={(e) => updateAdsSettings('monetagZoneId', e.target.value)}
                  placeholder="Enter Zone ID"
                  disabled={!isEditing || saving}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors duration-200"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Ad Configuration */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <SetOutline className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Ad Configuration</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Advertisement timing and settings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Watch Time (seconds):
              </label>
              <Stepper
                value={adsSettings.minWatchTime}
                onChange={(val) => updateAdsSettings('minWatchTime', val)}
                min={5}
                max={300}
                step={5}
                disabled={!isEditing || saving}
                style={{
                  '--border': '1px solid #d1d5db',
                  '--border-radius': '8px'
                }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Current: {adsSettings.minWatchTime} seconds
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reward Multiplier:
              </label>
              <Stepper
                value={adsSettings.adsRewardMultiplier}
                onChange={(val) => updateAdsSettings('adsRewardMultiplier', val)}
                min={0.1}
                max={10.0}
                step={0.1}
                disabled={!isEditing || saving}
                digits={1}
                style={{
                  '--border': '1px solid #d1d5db',
                  '--border-radius': '8px'
                }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Current: {adsSettings.adsRewardMultiplier}x
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Reward Settings */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <BankcardOutline className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Reward Settings</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reward configuration for watching ads
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Ad Reward (BDT):
              </label>
              <Stepper
                value={adsSettings.defaultAdsReward}
                onChange={(val) => updateAdsSettings('defaultAdsReward', val)}
                min={1}
                max={1000}
                step={1}
                disabled={!isEditing || saving}
                style={{
                  '--border': '1px solid #d1d5db',
                  '--border-radius': '8px'
                }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Current: {adsSettings.defaultAdsReward} BDT
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ad Watch Limit:
              </label>
              <Stepper
                value={adsSettings.adsWatchLimit}
                onChange={(val) => updateAdsSettings('adsWatchLimit', val)}
                min={1}
                max={100}
                step={1}
                disabled={!isEditing || saving}
                style={{
                  '--border': '1px solid #d1d5db',
                  '--border-radius': '8px'
                }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Current: {adsSettings.adsWatchLimit} ads
              </p>
            </div>
          </div>
        </div>
      </Card>

    
      {/* Action Buttons */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4 space-y-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              disabled={saving}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <SetOutline className="text-lg" />
              <span>Edit Settings</span>
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 font-medium rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </Card>
      </div>
    </PullToRefresh>
  )
}
