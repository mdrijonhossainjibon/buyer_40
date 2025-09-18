'use client'

import { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

interface AdResult {
  success: boolean
  reward?: number
  message: string
}

interface UseAdsReturn {
  isAdAvailable: boolean
  isWatching: boolean
  watchAd: () => Promise<AdResult>
  adsSettings: any
}

export const useAds = (): UseAdsReturn => {
  const adsSettings = useSelector((state: RootState) => state.adsSettings)
  const user = useSelector((state: RootState) => state.user)
  const [isWatching, setIsWatching] = useState(false)

  const isAdAvailable = useCallback(() => {
    // Check if ads are enabled
    if (!adsSettings.enableGigaPubAds) return false
    
    // Check if user has reached daily limit
    if (user.watchedToday >= adsSettings.adsWatchLimit) return false
    
    // Check if ads system is loaded
    if (typeof window !== 'undefined' && window.AdsManager) {
      return window.AdsManager.isAdAvailable()
    }
    
    return false
  }, [adsSettings.enableGigaPubAds, adsSettings.adsWatchLimit, user.watchedToday])

  const watchAd = useCallback(async (): Promise<AdResult> => {
    if (isWatching) {
      return { success: false, message: 'Ad is already playing' }
    }                 

    if (!isAdAvailable()) {
      return { success: false, message: 'No ads available' }
    }

    setIsWatching(true)

    try {
      // Try different ad providers
      let result: AdResult | null = null

      // Try GigaPub first
      if (window.gigapub && window.showAd) {
        try {
          await window.showAd('9486612')
          result = {
            success: true,
            reward: adsSettings.defaultAdsReward,
            message: 'Ad watched successfully!'
          }
        } catch (error) {
          console.error('GigaPub ad failed:', error)
        }
      }
  
      // Fallback - simulate ad watching
      if (!result) {
        await new Promise(resolve => setTimeout(resolve, adsSettings.minWatchTime * 1000))
        result = {
          success: true,
          reward: adsSettings.defaultAdsReward,
          message: 'Ad simulation completed!'
        }
      }

      return result
    } catch (error) {
      console.error('Ad watching failed:', error)
      return {
        success: false,
        message: 'Failed to load ad. Please try again.'
      }
    } finally {
      setIsWatching(false)
    }
  }, [isWatching, isAdAvailable, adsSettings.defaultAdsReward, adsSettings.minWatchTime])

  return {
    isAdAvailable: isAdAvailable(),
    isWatching,
    watchAd,
    adsSettings
  }
}

// Global type declarations
declare global {
  interface Window {
    AdsManager?: {
      settings: {
        enabled: boolean
        dailyLimit: number
        minWatchTime: number
        rewardAmount: number
        rewardMultiplier: number
      }
      showRewardedAd: (callback: (result: AdResult) => void) => void
      isAdAvailable: () => boolean
      getAdSettings: () => any
    }
    TelegramAds?: {
      showAd: () => Promise<{ success: boolean }>
    }
    gigapub?: any
    
  }
}
