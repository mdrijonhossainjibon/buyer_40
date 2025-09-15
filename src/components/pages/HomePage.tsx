'use client'
 
import { useState } from 'react'
import { Toast , PullToRefresh , Skeleton  } from 'antd-mobile'
import { API_CALL , generateSignature } from 'auth-fingerprint'
 
interface UserState {
  userId: number | null
  balanceTK: number
  referralCount: number
  dailyAdLimit: number
  watchedToday: number
  telegramBonus: number
  youtubeBonus: number
  isBotVerified: number
}

interface HomePageProps {
  userState: UserState
  setUserState: (state: UserState | ((prev: UserState) => UserState)) => void
}

export default function HomePage({ userState, setUserState }: HomePageProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  // Generate a default user ID if none exists
  const userId = userState.userId || Math.floor(Math.random() * 1000000) + 100000
  
  const referralLink = `https://t.me/earnfromadsbd_bot/app?startapp=${userId}`

  // API call to get bot status
  const getBotStatus = async () => {
    try {
      const {response }= await API_CALL({
        method: 'POST',
        url: '/bot_status',
        body : {
           
          ...generateSignature('123456789', process.env.NEXT_PUBLIC_SECRET_KEY || '')
        }
      })
      
      if (response) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to get bot status')
      }
    } catch (error) {
      console.error('Error fetching bot status:', error)
      Toast.show({
        content: 'Failed to fetch bot status',
        position: 'bottom',
        duration: 2000,
        icon: 'fail'
      })
      throw error
    }
  }

  const onRefresh = async () => {
    setIsLoading(true)
    try {
      // Get bot status from API
      const botStatusData = await getBotStatus()
      
      // Update user state with fresh data from API
  /*     setUserState(prev => ({
        ...prev,
        watchedToday: botStatusData.watchedToday || prev.watchedToday,
        referralCount: botStatusData.referralCount || prev.referralCount,
        balanceTK: botStatusData.balanceTK || prev.balanceTK,
        dailyAdLimit: botStatusData.dailyAdLimit || prev.dailyAdLimit,
        telegramBonus: botStatusData.telegramBonus || prev.telegramBonus,
        youtubeBonus: botStatusData.youtubeBonus || prev.youtubeBonus,
        isBotVerified: botStatusData.isBotVerified || prev.isBotVerified
      })) */
      
      Toast.show({
        content: 'refreshed successfully!',
        position: 'bottom',
        duration: 1500,
      })
    } catch (error) {
      // Error already handled in getBotStatus function
    } finally {
      setIsLoading(false)
    }
  }

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      Toast.show({
        content: 'Referral link copied!',
        position: 'bottom',
        duration: 2000,
         
      })
    } catch (err) {
      console.error('Failed to copy: ', err)
      Toast.show({
        content: 'Failed to copy link',
        position: 'center',
        duration: 2000,
        icon: 'fail'
      })
    }
  }

  const shareOnTelegram = () => {
    const text = encodeURIComponent(`🎉 Join me on Earn From Ads BD and start earning money by watching ads! Use my referral link: ${referralLink}`)
    window.open(`https://t.me/share/url?url=${referralLink}&text=${text}`, '_blank')
    
  }

  return (
    <PullToRefresh onRefresh={onRefresh}>
      <div className="block animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Dashboard</h2>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <div className="p-5 rounded-xl text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-sm mb-2.5 text-gray-600 dark:text-gray-400">Daily Ads Watched</h3>
            {isLoading ? (
              <Skeleton.Title animated className="w-20 mx-auto" />
            ) : (
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userState.watchedToday} / {userState.dailyAdLimit}</p>
            )}
          </div>
          <div className="p-5 rounded-xl text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-sm mb-2.5 text-gray-600 dark:text-gray-400">Total Referrals</h3>
            {isLoading ? (
              <Skeleton.Title animated className="w-16 mx-auto" />
            ) : (
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userState.referralCount}</p>
            )}
          </div>
        </div>

        <div className="mt-8 p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-center text-lg font-semibold mb-3 text-gray-900 dark:text-white">Refer & Earn More!</h3>
          <p className="text-center mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            রেফার বোনাস পেতে লিংকটি কপি করে আপনার বন্ধুদের কাছে শেয়ার করুন। প্রতি রেফারে আয় <b>30</b> টাকা.
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
                <Skeleton.Title animated className="flex-1 min-w-[150px] h-12 rounded-lg" />
                <Skeleton.Title animated className="flex-1 min-w-[150px] h-12 rounded-lg" />
              </>
            ) : (
              <>
                <button 
                  className="flex-1 min-w-[150px] px-3 py-3 border-none rounded-lg text-white cursor-pointer font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200" 
                  onClick={copyReferralLink}
                >
                  Copy Referral Link
                </button>
                <button 
                  className="flex-1 min-w-[150px] px-3 py-3 border-none rounded-lg text-white cursor-pointer font-semibold bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-200" 
                  onClick={shareOnTelegram}
                >
                  <i className="fas fa-share-alt mr-2"></i> Share Now
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
