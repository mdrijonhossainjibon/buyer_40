'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { PullToRefresh, Skeleton } from 'antd-mobile'
import CustomToast from '@/components/CustomToast'
import { RootState } from '@/store'
import { fetchBotStatusRequest } from '@/store/modules/botStatus'
import { fetchAdsSettingsRequest } from '@/store/modules/adsSettings'
import { fetchUserDataRequest } from '@/store/modules/user'
import { getStoredUserData } from '@/lib/localStorage'
 


export default function HomePage() {
  const dispatch = useDispatch()
  const botStatus = useSelector((state: RootState) => state.botStatus)
  const user = useSelector((state: RootState) => state.user)
  const [isLoading, setIsLoading] = useState(false)
 
  const referralLink = `https://t.me/${botStatus.botUsername || undefined}/?ref=${user.referralCode || ''}`



  const onRefresh = async () => {
    setIsLoading(true)
    try {
      
      // Initialize Telegram WebApp
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp

        // Get user data from Telegram
        const telegramUser = tg.initDataUnsafe?.user
        if (telegramUser && telegramUser.username) {
          const userId = telegramUser.id
          const username = telegramUser.username
  
          // Proceed with user data fetch if validation passes
          dispatch(fetchUserDataRequest({ 
            userId, 
            start_param: tg.initDataUnsafe.start_param, 
            username 
          }))
          dispatch(fetchBotStatusRequest())
        }
      }

      CustomToast.show({
        content: 'Refreshed successfully!',
        position: 'bottom',
        duration: 1500,
      })
    } catch (error) {
      console.error('Refresh error:', error)
      CustomToast.show({
        content: 'Refresh failed. Please try again.',
        position: 'bottom',
        duration: 2000,
      })
    } finally {
      setIsLoading(false)
    }


 
  }

  const copyReferralLink = async () => {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(referralLink)
        CustomToast.show({
          content: 'Referral link copied!',
          position: 'bottom',
          duration: 2000,
        })
        return
      }

      // Fallback for Telegram WebView and other restricted environments
      const textArea = document.createElement('textarea')
      textArea.value = referralLink
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)

      if (successful) {
        CustomToast.show({
          content: 'Referral link copied!',
          position: 'bottom',
          duration: 2000,
        })
      } else {
        throw new Error('Copy command failed')
      }
    } catch (err) {
      console.error('Failed to copy: ', err)

      // Final fallback - show the link for manual copying
      CustomToast.show({
        content: 'Copy not supported. Link shown above for manual copy.',
        position: 'center',
        duration: 3000,
      })

      // Select the input field text for easy manual copying
      const linkInput = document.querySelector('input[readonly]') as HTMLInputElement
      if (linkInput) {
        linkInput.focus()
        linkInput.select()
      }
    }
  }

  const shareOnTelegram = () => {
    const text = encodeURIComponent(
      `🎉 Join me on Earn From Ads and start earning by watching ads! You'll get 0.02$ USDT bonus for referring! Use my referral link: ${referralLink}`
    );
    window.open(`https://t.me/share/url?url=${referralLink}&text=${text}`, '_blank')
  }



  // Load ads settings on component mount
  useEffect(() => {
    dispatch(fetchBotStatusRequest())
    dispatch(fetchAdsSettingsRequest())
  }, [dispatch])

  // Check for existing stored account data on mount
  useEffect(() => {
    const storedData = getStoredUserData()
    if (storedData) {
      console.log('Found stored account data:', storedData)
    }
  }, [])

  return (
    <PullToRefresh onRefresh={onRefresh}>
      <div className="block animate-fade-in bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Dashboard</h2>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <div className="p-5 rounded-xl text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-sm mb-2.5 text-gray-600 dark:text-gray-400">Daily Ads Watched</h3>
            {isLoading ? (
              <Skeleton.Title animated className="w-20 mx-auto" />
            ) : (
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{user.watchedToday} / {user.dailyAdLimit}</p>
            )}
          </div>
          <div className="p-5 rounded-xl text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-sm mb-2.5 text-gray-600 dark:text-gray-400">Total Referrals</h3>
            {isLoading ? (
              <Skeleton.Title animated className="w-16 mx-auto" />
            ) : (
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{user.referralCount}</p>
            )}
          </div>
        </div>



        <div className="mt-8 p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-center text-lg font-semibold mb-3 text-gray-900 dark:text-white">Refer & Earn More!</h3>
          <p className="text-center mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            Copy the link and share it with your friends to get referral bonus. Earn <b>0.02$</b> USDT per referral.
          </p>
          {isLoading ? (
            <Skeleton.Paragraph lineCount={1} animated className="my-2.5" />
          ) : (
            <input
              type="text"
              className="w-full p-2.5 text-center border border-dashed border-blue-600 dark:border-blue-400 rounded-lg my-2.5 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={referralLink}
              readOnly
            />
          )}
          <div className="flex justify-center gap-3 mt-2.5 flex-wrap">
            {isLoading ? (
              <>
                <Skeleton.Title animated className="flex-1 min-w-[150px] h-12 rounded-lg dark:bg-gray-700" />
                <Skeleton.Title animated className="flex-1 min-w-[150px] h-12 rounded-lg dark:bg-gray-700" />
              </>
            ) : (
              <>
                <button
                  className="flex-1 min-w-[150px] px-3 py-3 border-none rounded-lg text-white cursor-pointer font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 shadow-md dark:shadow-lg"
                  onClick={copyReferralLink}
                >
                  Copy Referral Link
                </button>
                <button
                  className="flex-1 min-w-[150px] px-3 py-3 border-none rounded-lg text-white cursor-pointer font-semibold bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-200 shadow-md dark:shadow-lg"
                  onClick={shareOnTelegram}
                >
                  <i className="fas fa-share-alt mr-2 dark:text-white"></i> Share Now
                </button>
              </>
            )}
          </div>
          <small className="block mt-1.5 opacity-75 text-center text-gray-600 dark:text-gray-400">
            Share your referral link to earn bonus!
          </small>
        </div>

      

      </div>
    </PullToRefresh>
  )
}
