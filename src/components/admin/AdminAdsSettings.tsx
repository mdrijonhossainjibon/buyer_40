'use client'

import { useState } from 'react'
import { Card, Switch,   Selector, Toast, Stepper } from 'antd-mobile'
import { 
  EyeOutline,
  PlayOutline,
  StopOutline,
  SetOutline,
  ClockCircleOutline,
  BankcardOutline,
  GlobalOutline
} from 'antd-mobile-icons'

interface AdminAdsSettingsProps {
  loading?: boolean
}

// Interface matching the database model           
interface AdsSettings {
  enableGigaPubAds: boolean;
  gigaPubAppId: string;
  defaultAdsReward: number;
  adsWatchLimit: number;
  adsRewardMultiplier: number;
  minWatchTime: number;
  monetagEnabled: boolean;
  monetagZoneId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminAdsSettings({ loading = false }: AdminAdsSettingsProps) {
  const [adsSettings, setAdsSettings] = useState<AdsSettings>({
    enableGigaPubAds: true,
    gigaPubAppId: '',
    defaultAdsReward: 50,
    adsWatchLimit: 10,
    adsRewardMultiplier: 1.0,
    minWatchTime: 30,
    monetagEnabled: true,
    monetagZoneId: '',
    createdAt: new Date(),
    updatedAt: new Date()
  })
  const [isEditing, setIsEditing] = useState(false)

  const updateAdsSettings = (field: keyof AdsSettings, value: any) => {
    setAdsSettings(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date()
    }))
  }

  const handleSaveSettings = () => {
    setIsEditing(false)
    Toast.show({
      content: 'অ্যাড সেটিংস সংরক্ষণ করা হয়েছে',
      duration: 2000
    })
    // TODO: Implement actual API call to save settings
  }

  const handleResetSettings = () => {
    setAdsSettings({
      enableGigaPubAds: true,
      gigaPubAppId: '',
      defaultAdsReward: 50,
      adsWatchLimit: 10,
      adsRewardMultiplier: 1.0,
      minWatchTime: 30,
      monetagEnabled: false,
      monetagZoneId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    setIsEditing(false)
    
    Toast.show({
      content: 'সেটিংস রিসেট করা হয়েছে',
      duration: 2000
    })
  }

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
    <div className="space-y-4">
      {/* Header */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
       

          {/* Main Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">অ্যাড সিস্টেম</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                বিজ্ঞাপন প্রদর্শন চালু/বন্ধ করুন
              </p>
            </div>
            <Switch
              checked={adsSettings.enableGigaPubAds}
              onChange={(checked) => updateAdsSettings('enableGigaPubAds', checked)}
              disabled={!isEditing}
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
              <h3 className="font-semibold text-gray-900 dark:text-white">GigaPub অ্যাড সেটিংস</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                GigaPub বিজ্ঞাপন নেটওয়ার্ক কনফিগারেশন
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GigaPub অ্যাপ আইডি:
              </label>
              <input
                type="text"
                value={adsSettings.gigaPubAppId}
                onChange={(e) => updateAdsSettings('gigaPubAppId', e.target.value)}
                placeholder="অ্যাপ আইডি লিখুন"
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors duration-200"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Monetag সক্রিয়</span>
              <Switch
                checked={adsSettings.monetagEnabled}
                onChange={(checked) => updateAdsSettings('monetagEnabled', checked)}
                disabled={!isEditing}
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
                  Monetag জোন আইডি:
                </label>
                <input
                  type="text"
                  value={adsSettings.monetagZoneId}
                  onChange={(e) => updateAdsSettings('monetagZoneId', e.target.value)}
                  placeholder="জোন আইডি লিখুন"
                  disabled={!isEditing}
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
              <h3 className="font-semibold text-gray-900 dark:text-white">অ্যাড কনফিগারেশন</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                বিজ্ঞাপনের সময় এবং সেটিংস
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                সর্বনিম্ন দেখার সময় (সেকেন্ড):
              </label>
              <Stepper
                value={adsSettings.minWatchTime}
                onChange={(val) => updateAdsSettings('minWatchTime', val)}
                min={5}
                max={300}
                step={5}
                disabled={!isEditing}
                style={{
                  '--border': '1px solid #d1d5db',
                  '--border-radius': '8px'
                }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                বর্তমান: {adsSettings.minWatchTime} সেকেন্ড
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                পুরস্কার গুণক:
              </label>
              <Stepper
                value={adsSettings.adsRewardMultiplier}
                onChange={(val) => updateAdsSettings('adsRewardMultiplier', val)}
                min={0.1}
                max={10.0}
                step={0.1}
                disabled={!isEditing}
                digits={1}
                style={{
                  '--border': '1px solid #d1d5db',
                  '--border-radius': '8px'
                }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                বর্তমান: {adsSettings.adsRewardMultiplier}x
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
              <h3 className="font-semibold text-gray-900 dark:text-white">পুরস্কার সেটিংস</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                অ্যাড দেখার জন্য পুরস্কার কনফিগারেশন
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ডিফল্ট অ্যাড পুরস্কার (পয়সা):
              </label>
              <Stepper
                value={adsSettings.defaultAdsReward}
                onChange={(val) => updateAdsSettings('defaultAdsReward', val)}
                min={1}
                max={1000}
                step={1}
                disabled={!isEditing}
                style={{
                  '--border': '1px solid #d1d5db',
                  '--border-radius': '8px'
                }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                বর্তমান: {adsSettings.defaultAdsReward} পয়সা
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                অ্যাড দেখার সীমা:
              </label>
              <Stepper
                value={adsSettings.adsWatchLimit}
                onChange={(val) => updateAdsSettings('adsWatchLimit', val)}
                min={1}
                max={100}
                step={1}
                disabled={!isEditing}
                style={{
                  '--border': '1px solid #d1d5db',
                  '--border-radius': '8px'
                }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                বর্তমান: {adsSettings.adsWatchLimit} টি অ্যাড
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
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <SetOutline className="text-lg" />
              <span>সেটিংস সম্পাদনা করুন</span>
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleSaveSettings}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>সংরক্ষণ করুন</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors duration-200"
              >
                বাতিল
              </button>
            </div>
          )}
          
          <button
            onClick={handleResetSettings}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            ডিফল্ট সেটিংস পুনরুদ্ধার করুন
          </button>
          
          <button
            onClick={() => {
              Toast.show('টেস্ট অ্যাড চালু করা হচ্ছে...')
              // TODO: Implement test ad functionality
            }}
            className="w-full px-4 py-3 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <PlayOutline className="text-lg" />
            <span>টেস্ট অ্যাড চালান</span>
          </button>
        </div>
      </Card>
    </div>
  )
}
