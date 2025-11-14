'use client'

import { useState, useEffect } from 'react'
 
import { useSelector, useDispatch } from 'react-redux'
import { LoadAds } from 'lib/ads';
import { RootState } from 'modules';
import { watchAdRequest } from 'modules/watchAds';
import toast from 'react-hot-toast';

 

export async function showAlternatingAds(zoneId: string) {
  // Define all ad providers in rotation
  const ads = ["giga", "adexora" ,'load']

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

  // Save state
  localStorage.setItem("lastAd", nextAd)

  return nextAd
}

export default function WatchAdsPage() {
  const [isWatchingAd, setIsWatchingAd] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const user = useSelector((state: RootState) => state.user)
  const adsSettings = useSelector((state: RootState) => state.adsSettings);
  const watchAd = useSelector((state: RootState) => state.watchAds)

  const dispatch = useDispatch();

  

  useEffect(() => {
    // Show confetti when reaching milestones
    if (watchAd.watchedToday % 10 === 0 && watchAd.watchedToday > 0) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [watchAd.watchedToday])

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown])

  const watchAds = async () => {
    if (watchAd.watchedToday >= (adsSettings.adsWatchLimit || 5000)) {
      toast.error('Daily ad limit reached!')
      return
    }
  
    setIsWatchingAd(true)
    setCountdown(15) // Start 15-second countdown
    
    try {
       showAlternatingAds(adsSettings.monetagZoneId).then(() => {
        // Dispatch ad watch request
       dispatch(watchAdRequest())
       })  

         
 
    } catch (error) {
      console.error('Ad error:', error)
      //toast.error('Failed to load ad')
    } finally {
      setIsWatchingAd(false)
    }
  }

  const watchedPercentage = ((watchAd.watchedToday || 0) / (adsSettings.adsWatchLimit || 5000)) * 100
  const remainingAds = (adsSettings.adsWatchLimit || 5000) - (watchAd.watchedToday || 0)
  const totalEarned = (watchAd.watchedToday || 0) * (adsSettings.defaultAdsReward || 3)
  const potentialEarnings = remainingAds * (adsSettings.defaultAdsReward || 3)
  const isLimitReached = (watchAd.watchedToday || 0) >= (adsSettings.adsWatchLimit || 5000)
  const canWatchAd = !isWatchingAd && !isLimitReached && user.status !== 'suspend' && countdown === 0

  // XP calculations
  const xpPerAd = adsSettings.defaultAdsReward || 3// XP earned per ad watched
  const totalXpEarned = (watchAd.watchedToday || 0) * xpPerAd




  return (
    <div className="block animate-fade-in p-3 max-w-4xl mx-auto relative">
      {/* Confetti Effect - Compact */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}
      {/* Suspended Account Warning - Compact */}
      {user.status === 'suspend' && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-red-800 dark:text-red-300 font-semibold text-sm">
                Account Suspended
              </h4>
              <p className="text-red-600 dark:text-red-400 text-xs mt-0.5">
                Contact support to resolve this issue.
              </p>
            </div>
          </div>
        </div>
      )}



      {/* Compact Stats Grid - Binance Style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {/* XP Earned Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all group">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-5 h-5 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <i className="fas fa-star text-purple-600 dark:text-purple-400 text-[10px]"></i>
            </div>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">XP Today</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">{totalXpEarned}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">+{xpPerAd} per ad</p>
        </div>

        {/* Total Ads Watched Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all group">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <i className="fas fa-eye text-blue-600 dark:text-blue-400 text-[10px]"></i>
            </div>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Ads</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">{watchAd.watchedToday || 0}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">watched today</p>
        </div>

        {/* Today's Earnings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all group">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-5 h-5 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <i className="fas fa-dollar-sign text-green-600 dark:text-green-400 text-[10px]"></i>
            </div>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Earned</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">{totalEarned.toFixed(2)}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">XP</p>
        </div>

        {/* Potential Earnings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all group">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <i className="fas fa-chart-line text-blue-600 dark:text-blue-400 text-[10px]"></i>
            </div>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Potential</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">{potentialEarnings.toFixed(2)}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">XP Left</p>
        </div>
      </div>


      {/* Progress Card - Compact */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-3">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
              </svg>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Daily Progress
              </span>
            </div>
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              {watchedPercentage.toFixed(1)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(watchedPercentage, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-600 dark:text-gray-400">
              {watchAd.watchedToday || 0} / {adsSettings.adsWatchLimit || 5000} ads
            </span>
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
              {remainingAds} left
            </span>
          </div>
        </div>
      </div>

      {/* Main Ad Card - Compact */}
      <div className="relative overflow-hidden rounded-lg text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
        </div>

        <div className="relative z-10 p-4">
          {/* Icon with Animation */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-3 shadow-md animate-bounce-slow">
            <i className="fas fa-play-circle text-white text-2xl"></i>
          </div>

          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Watch & Earn</h3>

          {/* Reward Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-3 shadow-sm">
            <i className="fas fa-coins text-white text-xs"></i>
            <span className="text-white font-bold text-xs">+{adsSettings.defaultAdsReward || 0} XP per ad</span>
          </div>

          <p className="text-xs mb-4 text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            Watch ads and earn rewards instantly!
          </p>

          {/* Main CTA Button */}
          <button
            className={`w-full max-w-md mx-auto px-4 py-3 text-sm font-bold text-white border-none rounded-lg cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 ${canWatchAd
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              }`}
            onClick={watchAds}
            disabled={!canWatchAd}
          >
            {countdown > 0 ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-clock text-sm"></i>
                Wait {countdown}s
              </span>
            ) : isWatchingAd ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-spinner fa-spin text-sm"></i>
                Loading Ad...
              </span>
            ) : user.status === 'suspend' ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-ban text-sm"></i>
                Account Suspended
              </span>
            ) : isLimitReached ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-check-circle text-sm"></i>
                Daily Limit Reached
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-play text-sm"></i>
                Watch Ad Now
              </span>
            )}
          </button>

          {/* Info Text */}
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
            <i className="fas fa-clock"></i>
            <span>Watch for {adsSettings.minWatchTime || 30}s to earn</span>
          </div>
        </div>
      </div>


    </div>
  )
}
