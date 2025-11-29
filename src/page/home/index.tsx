'use client'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { PullToRefresh, Skeleton  } from 'antd-mobile'
 
import {
  toggleReferralPopup,
  toggleSpinPopup,
  toggleTasksPopup,
  toggleWatchAdsPopup,
  toggleWalletPopup,
  toggleConverterPopup,
  togglePurchaseTicketsPopup,
  toggleSupportPopup,
  toggleWithdrawHistoryPopup,
  toggleMysteryBoxPopup
} from 'modules/ui'
import { RootState } from 'modules'

// Format number with K, M, B suffixes
const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  }
  return num.toFixed(2)
}

export default function HomePage() {
  const dispatch = useDispatch()

  const user = useSelector((state: RootState) => state.user)
  const spinWheel = useSelector((state: RootState) => state.spinWheel);
  const adsSettings = useSelector((state : RootState)=> state.adsSettings);
  const watchads = useSelector((state : RootState)=> state.watchAds);

  const [isLoading] = useState(false)
  

  const onRefresh = async () => {
     
  }
 
 

  // Quick action cards data
  const quickActions = [
    {
      icon: 'fas fa-tasks',
      title: 'Tasks',
      subtitle: 'Earn USDT',
      color: 'from-blue-500 to-blue-600',
      popupType: 'tasks',
    },
    {
      icon: 'fas fa-play-circle',
      title: 'Watch Ads',
      subtitle: 'Earn Rewards',
      color: 'from-red-500 to-pink-600',
      popupType: 'watchads',
    },
    {
      icon: 'fas fa-dharmachakra',
      title: 'Spin Wheel',
      subtitle: 'Win Prizes',
      color: 'from-purple-500 to-pink-600',
      popupType: 'spin',
    },
    {
      icon: 'fas fa-ticket-alt',
      title: 'Buy Tickets',
      subtitle: 'Use XP',
      color: 'from-yellow-500 to-orange-600',
      popupType: 'tickets',
    },
  
    
    {
      icon: 'fas fa-users',
      title: 'Referrals',
      subtitle: 'Invite Friends',
      color: 'from-green-500 to-emerald-600',
      popupType: 'referral',
    },
    {
      icon: 'fas fa-exchange-alt',
      title: 'Convert',
      subtitle: 'Exchange',
      color: 'from-indigo-500 to-purple-600',
      popupType: 'converter',
    },
    {
      icon: 'fas fa-wallet',
      title: 'Wallet',
      subtitle: 'XP to Cash',
      color: 'from-emerald-500 to-teal-600',
      popupType: 'wallet',
    },
  
    {
      icon: 'fas fa-history',
      title: 'History',
      subtitle: 'Withdrawals',
      color: 'from-gray-500 to-gray-600',
      popupType: 'history',
    },
    {
      icon: 'fas fa-headset',
      title: 'Support',
      subtitle: 'Get Help',
      color: 'from-cyan-500 to-blue-600',
      popupType: 'support',
    },
  ]

  const handleQuickAction = (action: typeof quickActions[0]) => {
    switch (action.popupType) {
      case 'tasks':
        dispatch(toggleTasksPopup(true))
        break
      case 'watchads':
        dispatch(toggleWatchAdsPopup(true))
        break
      case 'spin':
        dispatch(toggleSpinPopup(true))
        break
      case 'tickets':
        dispatch(togglePurchaseTicketsPopup(true))
        break
      case 'mysterybox':
        dispatch(toggleMysteryBoxPopup(true))
        break
      case 'referral':
        dispatch(toggleReferralPopup(true))
        break
      case 'converter':
        dispatch(toggleConverterPopup(true))
        break
      case 'wallet':
        dispatch(toggleWalletPopup(true))
        break
      case 'support':
        dispatch(toggleSupportPopup(true))
        break
      case 'history':
        dispatch(toggleWithdrawHistoryPopup(true))
        break
    }
  }
 
  return (
    <PullToRefresh onRefresh={onRefresh}>
      <div className="pb-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Enhanced Binance-Style Balance Card */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {/* Top Section - Balance */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Balance</p>
                </div>
                {isLoading ? (
                  <Skeleton.Title animated className="w-40 h-10" />
                ) : (
                  <div className="flex items-baseline gap-2 mb-1">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {formatNumber(user.wallet.available.usdt || 0)}
                    </h1>
                    <span className="text-base font-semibold text-gray-500 dark:text-gray-400">USDT</span>
                  </div>
                )}

              </div>

            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-2.5 border border-purple-200 dark:border-purple-800/30 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                    <i className="fas fa-star text-white text-[9px]"></i>
                  </div>
                  <p className="text-[9px] text-purple-700 dark:text-purple-300 font-semibold">XP</p>
                </div>
                {isLoading ? (
                  <Skeleton.Title animated className="w-10 h-4" />
                ) : (
                  <p className="text-sm font-bold text-purple-700 dark:text-purple-300">{formatNumber(user.wallet.available.xp || 0)}</p>
                )}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-2.5 border border-blue-200 dark:border-blue-800/30 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                    <i className="fas fa-play-circle text-white text-[9px]"></i>
                  </div>
                  <p className="text-[9px] text-blue-700 dark:text-blue-300 font-semibold">Ads</p>
                </div>
                {isLoading ? (
                  <Skeleton.Title animated className="w-10 h-4" />
                ) : (
                  <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{watchads.watchedToday}/{ adsSettings.adsWatchLimit}</p>
                )}
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-2.5 border border-green-200 dark:border-green-800/30 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                    <i className="fas fa-users text-white text-[9px]"></i>
                  </div>
                  <p className="text-[9px] text-green-700 dark:text-green-300 font-semibold">Refs</p>
                </div>
                {isLoading ? (
                  <Skeleton.Title animated className="w-10 h-4" />
                ) : (
                  <p className="text-sm font-bold text-green-700 dark:text-green-300">{user.referralCount}</p>
                )}
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-2.5 border border-orange-200 dark:border-orange-800/30 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <i className="fas fa-ticket-alt text-white text-[9px]"></i>
                  </div>
                  <p className="text-[9px] text-orange-700 dark:text-orange-300 font-semibold">Tickets</p>
                </div>
                {isLoading ? (
                  <Skeleton.Title animated className="w-10 h-4" />
                ) : (
                  <p className="text-sm font-bold text-orange-700 dark:text-orange-300">
                    {spinWheel.spinTickets || 0}
                  </p>
                )}
              </div>
            </div>
          </div>

        
        </div>
 
        {/* Quick Actions - Binance Grid Style */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
              <i className="fas fa-fire text-yellow-500 text-[10px]"></i>
              <span className="text-[10px] font-bold text-yellow-700 dark:text-yellow-400">Popular</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="relative bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-400 hover:shadow-lg transition-all active:scale-95 flex flex-col items-center group"
              >
                {/* Hot badge for featured actions */}
                {(action.popupType === 'spin' || action.popupType === 'tasks') && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    <i className="fas fa-fire text-white text-[8px]"></i>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-2 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <i className={`${action.icon} text-white text-lg`}></i>
                </div>
                <h3 className="text-[11px] font-bold text-gray-900 dark:text-white text-center leading-tight mb-0.5">{action.title}</h3>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 text-center">{action.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

      
      </div>


    </PullToRefresh>
  )
}
