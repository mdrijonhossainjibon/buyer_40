'use client'

import { useState, useEffect } from 'react'
import { RootState } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import { LoadAds } from '@/lib/ads'
import { watchAdRequest } from '@/store/modules/user/actions'
import { toast } from 'react-toastify'

export async function showAlternatingAds(zoneId: string, userId: number, dispatch: any) {
  // Define all ad providers in rotation
  const ads = ["load", "giga", "adexora"]

  // Get last state from localStorage
  let lastAd = localStorage.getItem("lastAd")

  // Find index of last shown ad
  let lastIndex = ads.indexOf(lastAd || "")

  // Calculate next ad index (rotate)
  let nextIndex = (lastIndex + 1) % ads.length
  let nextAd = ads[nextIndex]

  // Show the next ad
  if (nextAd === "load") {
    await LoadAds(zoneId)
  } else if (nextAd === "giga") {
    await window.showGiga?.()
  } else if (nextAd === "adexora") {
    await window.showAdexora?.()
  }

  // Dispatch ad watch request
  dispatch(watchAdRequest(userId))

  // Save state
  localStorage.setItem("lastAd", nextAd)

  return nextAd
}

export default function WatchAdsPage() {
  const [isWatchingAd, setIsWatchingAd] = useState(false)
  const [animateStats, setAnimateStats] = useState(false)

  const user = useSelector((state: RootState) => state.user)
  const adsSettings = useSelector((state: RootState) => state.adsSettings)
  const dispatch = useDispatch()

  useEffect(() => {
    setAnimateStats(true)
  }, [])

  const watchAd = async () => {
    if (user.watchedToday >= (adsSettings.adsWatchLimit || 5000)) {
      toast.error('Daily ad limit reached!')
      return
    }

    if (user.status === 'suspend') {
      toast.error('Your account has been suspended!')
      return
    }

    setIsWatchingAd(true)
    try {
      await showAlternatingAds(adsSettings.monetagZoneId, user.userId as any, dispatch)
    } catch (error) {
      console.error('Ad error:', error)
      toast.error('Failed to load ad')
    } finally {
      setIsWatchingAd(false)
    }
  }

  const watchedPercentage = ((user.watchedToday || 0) / (adsSettings.adsWatchLimit || 5000)) * 100
  const remainingAds = (adsSettings.adsWatchLimit || 5000) - (user.watchedToday || 0)
  const totalEarned = (user.watchedToday || 0) * (adsSettings.defaultAdsReward || 3)
  const potentialEarnings = remainingAds * (adsSettings.defaultAdsReward || 3)

 

  return (
    <div className="block animate-fade-in p-4 max-w-7xl mx-auto">
      {/* Suspended Account Warning */}
      {user.status === 'suspend' && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-5 mb-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/40">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-red-800 dark:text-red-300 font-bold text-lg mb-1">
                Account Suspended
              </h4>
              <p className="text-red-700 dark:text-red-400 text-sm">
                Your account has been suspended. Please contact support to resolve this issue.
              </p>
            </div>
          </div>
        </div>
      )}

     

      {/* Progress Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
              </svg>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Daily Progress
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {watchedPercentage.toFixed(1)}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(watchedPercentage, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {user.watchedToday || 0} / {adsSettings.adsWatchLimit || 5000} ads
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {remainingAds} remaining
            </span>
          </div>
        </div>
      </div>

      {/* Main Ad Card */}
      <div className="p-5 rounded-xl text-center mb-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <i className="fas fa-video text-5xl mb-4 text-blue-600 dark:text-blue-400"></i>
        <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Rewarded Ad</h3>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">Earn <b>{adsSettings.defaultAdsReward || 0}</b> USDT for each ad.</p>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">Verify to start earning by watching ads!</p>

        <button
          className="w-full p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={watchAd}
          disabled={isWatchingAd || (user.watchedToday || 0) >= (adsSettings.adsWatchLimit || 5000) || user.status === 'suspend'}
        >
          {isWatchingAd ? 'Loading Ad...' : user.status === 'suspend' ? 'Account Suspended' : (user.watchedToday || 0) >= (adsSettings.adsWatchLimit || 5000) ? 'Daily Limit Reached' : 'watch Ads'}
        </button>
        <p className="mt-2.5 text-sm opacity-80 text-gray-600 dark:text-gray-400">
          Stay on the ad for {adsSettings.minWatchTime || 30} seconds to get the reward.
        </p>
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-2xl p-5 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/40">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-yellow-800 dark:text-yellow-300 font-bold mb-2">
              Pro Tips
            </h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
              <li>• Stay on the ad page for the full duration to earn rewards</li>
              <li>• Complete all daily ads to maximize your earnings</li>
              <li>• Check back daily for new opportunities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
