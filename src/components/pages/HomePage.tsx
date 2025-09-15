'use client'
 
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Toast , PullToRefresh , Skeleton  } from 'antd-mobile'
import { RootState } from '@/store'
import { fetchBotStatusRequest } from '@/store/modules/botStatus'
 
 

export default function HomePage({ userState, setUserState } :any) {
  const dispatch = useDispatch()
  const botStatus = useSelector((state: RootState) => state.botStatus)
  const [isLoading, setIsLoading] = useState(false)
 
  const referralLink = `https://t.me/${botStatus.botUsername}/?startapp=${userState.referralCode}`

  // Dispatch Redux saga to get bot status
  const getBotStatus = () => {
    dispatch(fetchBotStatusRequest())
  }

  useEffect(() => {
    getBotStatus()
  }, [])

  const onRefresh = async () => {
    setIsLoading(true)
    try {
      // Dispatch Redux saga to get bot status
      getBotStatus()
      
      Toast.show({
        content: 'refreshed successfully!',
        position: 'bottom',
        duration: 1500,
      })
    } catch (error) {
      // Error handled by Redux saga
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
    const text = encodeURIComponent(
      `🎉 আমার সাথে Earn From Ads BD-এ যোগ দিন এবং বিজ্ঞাপন দেখার মাধ্যমে আয় শুরু করুন! রেফারেল করলে আপনি পাবেন ৩০ টাকা বোনাস! আমার রেফারেল লিঙ্ক ব্যবহার করুন: ${referralLink}`
    );
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
