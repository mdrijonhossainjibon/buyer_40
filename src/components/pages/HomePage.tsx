'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { PullToRefresh, Skeleton, Popup } from 'antd-mobile'
 
import { RootState } from '@/store'
import { fetchBotStatusRequest } from '@/store/modules/botStatus'
import { fetchAdsSettingsRequest } from '@/store/modules/adsSettings'
import { fetchUserDataRequest } from '@/store/modules/user'
import { fetchUserTicketsRequest } from '@/store/modules/spinWheel'
import ReferralPage from './ReferralPage'
import SpinWheelPage from './SpinWheelPage'
import WatchAdsPage from './WatchAdsPage'
import WalletPage from './WalletPage'
import CoinConverterPage from './CoinConverterPage'
import PurchaseTicketsPage from './PurchaseTicketsPage'
import SupportPage from './SupportPage';
import TasksPage from './TasksPage'
import WithdrawHistoryPopup from '../wallet/WithdrawHistoryPopup'
 

export default function HomePage() {
  const dispatch = useDispatch()
 
  const user = useSelector((state: RootState) => state.user)
  const spinWheel = useSelector((state: RootState) => state.spinWheel)
  const [isLoading, setIsLoading] = useState(false)
  const [showReferralPopup, setShowReferralPopup] = useState(false)
  const [showSpinPopup, setShowSpinPopup] = useState(false)
  const [showTasksPopup, setShowTasksPopup] = useState(false)
  const [showWatchAdsPopup, setShowWatchAdsPopup] = useState(false)
  const [showWalletPopup, setShowWalletPopup] = useState(false)
  const [showConverterPopup, setShowConverterPopup] = useState(false)
  const [showPurchaseTicketsPopup, setShowPurchaseTicketsPopup] = useState(false)
  const [showSupportPopup, setShowSupportPopup] = useState(false)
  const [showWithdrawHistoryPopup, setShowWithdrawHistoryPopup] = useState(false);

  const adsSettings = useSelector((state: RootState) => state.adsSettings)

  const onRefresh = async () => {
    setIsLoading(true)
    dispatch(fetchUserDataRequest())
    dispatch(fetchBotStatusRequest())
    dispatch(fetchAdsSettingsRequest())
    if (user.userId) {
      dispatch(fetchUserTicketsRequest(user.userId))
    }
    setTimeout(() => setIsLoading(false), 1000)
  }

  useEffect(() => {
    dispatch(fetchUserDataRequest())
    dispatch(fetchBotStatusRequest())
    dispatch(fetchAdsSettingsRequest())
  }, [dispatch])

  useEffect(() => {
    if (user.userId) {
      dispatch(fetchUserTicketsRequest(user.userId))
    }
  }, [dispatch, user.userId])

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
      icon: 'fas fa-headset',
      title: 'Support',
      subtitle: 'Get Help',
      color: 'from-cyan-500 to-blue-600',
      popupType: 'support',
    },
    {
      icon: 'fas fa-history',
      title: 'History',
      subtitle: 'Withdrawals',
      color: 'from-gray-500 to-gray-600',
      popupType: 'history',
    },
  ]

  const handleQuickAction = (action: typeof quickActions[0]) => {
    switch (action.popupType) {
      case 'tasks':
        setShowTasksPopup(true)
        break
      case 'watchads':
        setShowWatchAdsPopup(true)
        break
      case 'spin':
        setShowSpinPopup(true)
        break
      case 'tickets':
        setShowPurchaseTicketsPopup(true)
        break
      case 'referral':
        setShowReferralPopup(true)
        break
      case 'converter':
        setShowConverterPopup(true)
        break
      case 'wallet':
        setShowWalletPopup(true)
        break
      case 'support':
        setShowSupportPopup(true)
        break
      case 'history':
        setShowWithdrawHistoryPopup(true)
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Balance</p>
                  <button className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <i className="fas fa-eye text-[8px] text-gray-500 dark:text-gray-400"></i>
                  </button>
                </div>
                {isLoading ? (
                  <Skeleton.Title animated className="w-40 h-10" />
                ) : (
                  <div className="flex items-baseline gap-2 mb-1">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {Number(user.wallet.available.usdt || 0).toPrecision(8)}
                    </h1>
                    <span className="text-base font-semibold text-gray-500 dark:text-gray-400">USDT</span>
                  </div>
                )}
                {/* Estimated Value */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ≈ ${Number(user.wallet.available.usdt || 0).toPrecision(8)} USDT
                  </span>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 dark:bg-green-900/20 rounded">
                    <i className="fas fa-arrow-up text-[8px] text-green-600 dark:text-green-400"></i>
                    <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">0.00%</span>
                  </div>
                </div>
              </div>
        
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-4 gap-1.5 mt-3">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-2 border border-purple-200 dark:border-purple-800/30">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-4 h-4 rounded bg-purple-500 flex items-center justify-center">
                    <i className="fas fa-star text-white text-[8px]"></i>
                  </div>
                  <p className="text-[9px] text-purple-700 dark:text-purple-300 font-medium">XP</p>
                </div>
                {isLoading ? (
                  <Skeleton.Title animated className="w-10 h-4" />
                ) : (
                  <p className="text-sm font-bold text-purple-700 dark:text-purple-300">{user.xp || 0}</p>
                )}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800/30">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center">
                    <i className="fas fa-play-circle text-white text-[8px]"></i>
                  </div>
                  <p className="text-[9px] text-blue-700 dark:text-blue-300 font-medium">Ads</p>
                </div>
                {isLoading ? (
                  <Skeleton.Title animated className="w-10 h-4" />
                ) : (
                  <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{user.watchedToday}/{ 1000}</p>
                )}
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-2 border border-green-200 dark:border-green-800/30">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center">
                    <i className="fas fa-users text-white text-[8px]"></i>
                  </div>
                  <p className="text-[9px] text-green-700 dark:text-green-300 font-medium">Refs</p>
                </div>
                {isLoading ? (
                  <Skeleton.Title animated className="w-10 h-4" />
                ) : (
                  <p className="text-sm font-bold text-green-700 dark:text-green-300">{user.referralCount}</p>
                )}
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-2 border border-orange-200 dark:border-orange-800/30">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-4 h-4 rounded bg-orange-500 flex items-center justify-center">
                    <i className="fas fa-ticket-alt text-white text-[8px]"></i>
                  </div>
                  <p className="text-[9px] text-orange-700 dark:text-orange-300 font-medium">Tickets</p>
                </div>
                {isLoading ? (
                  <Skeleton.Title animated className="w-10 h-4" />
                ) : (
                  <p className="text-sm font-bold text-orange-700 dark:text-orange-300">
                    {spinWheel.userTicketsInfo?.ticketCount ?? spinWheel.spinTickets ?? 0}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section - Quick Actions */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setShowTasksPopup(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
              >
                <i className="fas fa-tasks text-blue-500 text-xs"></i>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Tasks</span>
              </button>
              <button
                onClick={() => setShowSpinPopup(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
              >
                <i className="fas fa-dharmachakra text-purple-500 text-xs"></i>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Spin</span>
              </button>
              <button
                onClick={() => setShowWatchAdsPopup(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
              >
                <i className="fas fa-play-circle text-red-500 text-xs"></i>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Ads</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions - Binance Grid Style */}
        <div className="p-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 px-1">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-400 transition-all active:scale-95 flex flex-col items-center"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-1.5 shadow-sm`}>
                  <i className={`${action.icon} text-white text-lg`}></i>
                </div>
                <h3 className="text-[11px] font-semibold text-gray-900 dark:text-white text-center leading-tight">{action.title}</h3>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 text-center mt-0.5">{action.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Floating Spin Button */}
        <button
          onClick={() => setShowSpinPopup(true)}
          className="fixed bottom-24 right-6 z-50 group"
          aria-label="Spin Wheel"
        >
          {/* Outer pulsing rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 opacity-75 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 opacity-50 animate-pulse"></div>
          
          {/* Rotating outer ring */}
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-dashed border-purple-300/40 animate-spin-slow"></div>
          
          {/* Main button container with 3D effect */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 shadow-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-active:scale-95"
               style={{ transformStyle: 'preserve-3d' }}>
            
            {/* Inner rotating circle */}
            <div className="absolute inset-2 rounded-full border-2 border-white/30 animate-spin-reverse"></div>
            
            {/* Center spinning wheel icon */}
            <div className="relative z-10">
              <i className="fas fa-dharmachakra text-white text-2xl animate-spin-slow drop-shadow-lg"></i>
            </div>
            
            {/* Rotating sparkles */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute top-1 left-1/2 w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50"></div>
              <div className="absolute bottom-1 left-1/2 w-1.5 h-1.5 bg-pink-300 rounded-full shadow-lg shadow-pink-300/50"></div>
            </div>
            <div className="absolute inset-0 animate-spin-reverse">
              <div className="absolute top-1/2 left-1 w-1.5 h-1.5 bg-blue-300 rounded-full shadow-lg shadow-blue-300/50"></div>
              <div className="absolute top-1/2 right-1 w-1.5 h-1.5 bg-purple-300 rounded-full shadow-lg shadow-purple-300/50"></div>
            </div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin-slow"></div>
            
            {/* Glowing edge */}
            <div className="absolute inset-0 rounded-full ring-2 ring-white/20 ring-offset-2 ring-offset-purple-500/50"></div>
          </div>
          
          {/* Badge notification with pulse */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-white text-[10px] font-black">!</span>
            <div className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-75"></div>
          </div>
        </button>

      </div>

      {/* Referral Popup */}
      <Popup
        visible={showReferralPopup}
        onMaskClick={() => setShowReferralPopup(false)}
        bodyStyle={{
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          height: '90vh',
          backgroundColor: 'var(--adm-color-background)',
        }}
      >
        <div className="h-full flex flex-col">
          {/* Popup Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <i className="fas fa-users text-green-500"></i>
              Referral Program
            </h2>
            <button
              onClick={() => setShowReferralPopup(false)}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-times text-gray-600 dark:text-gray-400"></i>
            </button>
          </div>

          {/* Popup Content */}
          <div className="flex-1 overflow-y-auto">
            <ReferralPage />
          </div>
        </div>
      </Popup>

      {/* Spin Wheel Popup */}
      <Popup
        visible={showSpinPopup}
        onMaskClick={() => setShowSpinPopup(false)}
        bodyStyle={{
          
          height: '100vh',
          backgroundColor: 'var(--adm-color-background)',
        }}
      >
        <div className="h-full flex flex-col">
          {/* Popup Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <i className="fas fa-dharmachakra text-purple-500"></i>
              Spin Wheel
            </h2>
            <button
              onClick={() => setShowSpinPopup(false)}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-times text-gray-600 dark:text-gray-400"></i>
            </button>
          </div>

          {/* Popup Content */}
          <div className="flex-1 overflow-y-auto">
            <SpinWheelPage />
          </div>
        </div>
      </Popup>

      {/* Purchase Tickets Popup */}
      <Popup
        visible={showPurchaseTicketsPopup}
        onMaskClick={() => setShowPurchaseTicketsPopup(false)}
        bodyStyle={{
          
          height: '100vh',
          backgroundColor: 'var(--adm-color-background)',
        }}
      >
        <div className="h-full flex flex-col">
          {/* Popup Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <i className="fas fa-ticket-alt text-yellow-500"></i>
              Purchase Spin Tickets
            </h2>
            <button
              onClick={() => setShowPurchaseTicketsPopup(false)}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-times text-gray-600 dark:text-gray-400"></i>
            </button>
          </div>

          {/* Popup Content */}
          <div className="flex-1 overflow-y-auto">
            <PurchaseTicketsPage />
          </div>
        </div>
      </Popup>

      {/* Tasks Popup */}
      <Popup
        visible={showTasksPopup}
        onMaskClick={() => setShowTasksPopup(false)}
        bodyStyle={{
      
          height: '100vh',
          backgroundColor: 'var(--adm-color-background)',
        }}
      >
        <div className="h-full flex flex-col">
          {/* Popup Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <i className="fas fa-tasks text-blue-500"></i>
              Tasks
            </h2>
            <button
              onClick={() => setShowTasksPopup(false)}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-times text-gray-600 dark:text-gray-400"></i>
            </button>
          </div>

          {/* Popup Content */}
          <div className="flex-1 overflow-y-auto">
            <TasksPage />
          </div>
        </div>
      </Popup>

      {/* Watch Ads Popup */}
      <Popup
        visible={showWatchAdsPopup}
        onMaskClick={() => setShowWatchAdsPopup(false)}
        bodyStyle={{
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          height: '90vh',
          backgroundColor: 'var(--adm-color-background)',
        }}
      >
        <div className="h-full flex flex-col">
          {/* Popup Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <i className="fas fa-play-circle text-red-500"></i>
              Watch Ads
            </h2>
            <button
              onClick={() => setShowWatchAdsPopup(false)}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-times text-gray-600 dark:text-gray-400"></i>
            </button>
          </div>

          {/* Popup Content */}
          <div className="flex-1 overflow-y-auto">
            <WatchAdsPage />
          </div>
        </div>
      </Popup>

      {/* Converter Popup */}
      <Popup
        visible={showConverterPopup}
        onMaskClick={() => setShowConverterPopup(false)}
        bodyStyle={{
          height: '100vh',
          backgroundColor: 'var(--adm-color-background)',
        }}
      >
        <div className="h-full flex flex-col">
      

          {/* Popup Content */}
          <div className="flex-1 overflow-y-auto">
            <CoinConverterPage onClose={() => setShowConverterPopup(false)} />
          </div>
        </div>
      </Popup>

      {/* Wallet Popup */}
      <Popup
        visible={showWalletPopup}
        onMaskClick={() => setShowWalletPopup(false)}
        bodyStyle={{
          height: '100vh',
          backgroundColor: 'var(--adm-color-background)',
        }}
      >
        <div className="h-full flex flex-col">
          {/* Popup Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <i className="fas fa-wallet text-yellow-500"></i>
              Wallet
            </h2>
            <button
              onClick={() => setShowWalletPopup(false)}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-times text-gray-600 dark:text-gray-400"></i>
            </button>
          </div>

          {/* Popup Content */}
          <div className="flex-1 overflow-y-auto">
            <WalletPage />
          </div>
        </div>
      </Popup>

      {/* Support Popup */}
      <Popup
        visible={showSupportPopup}
        onMaskClick={() => setShowSupportPopup(false)}
        bodyStyle={{
          height: '100vh',
          backgroundColor: 'var(--adm-color-background)',
        }}
      >
        <div className="h-full flex flex-col">
          {/* Popup Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <i className="fas fa-headset text-cyan-500"></i>
              Support
            </h2>
            <button
              onClick={() => setShowSupportPopup(false)}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-times text-gray-600 dark:text-gray-400"></i>
            </button>
          </div>

          {/* Popup Content */}
          <div className="flex-1 overflow-y-auto">
            <SupportPage />
          </div>
        </div>
      </Popup>

      {/* Withdraw History Popup */}
      <WithdrawHistoryPopup
        visible={showWithdrawHistoryPopup}
        onClose={() => setShowWithdrawHistoryPopup(false)}
      />
    </PullToRefresh>
  )
}
