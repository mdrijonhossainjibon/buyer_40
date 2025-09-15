'use client'

import { useState } from 'react'
import { Toast} from 'antd-mobile'
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

interface TasksPageProps {
  userState: UserState
  setUserState: (state: UserState | ((prev: UserState) => UserState)) => void
} 

export default function TasksPage({ userState, setUserState }: TasksPageProps) {
  const [isWatchingAd, setIsWatchingAd] = useState(false)
  const [channelClaimed, setChannelClaimed] = useState(false)
  const [youtubeClaimed, setYoutubeClaimed] = useState(false)
  const [isCheckingYoutube, setIsCheckingYoutube] = useState(false)
  const [youtubeError, setYoutubeError] = useState<string | null>(null)
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null)

  const watchAd = async () => {
    if (userState.watchedToday >= userState.dailyAdLimit) {
      Toast.show({
        content: 'Daily ad limit reached!',
        duration: 2000,
      })
      return
    }

    setIsWatchingAd(true)
    
    Toast.show({
      content: 'Watching ad...',
      duration: 3000,
    })

    // Simulate ad watching
    setTimeout(() => {
      setIsWatchingAd(false)
      Toast.show({
        content: 'Ad watched! You earned 5 TK!',
        duration: 2000,
      })
    }, 3000)
  }

  const openChannel = () => {
    window.open('https://t.me/earnfromadsbd', '_blank')
  }

  const checkChannel = async () => {
    Toast.show({
      content: 'Checking channel...',
      duration: 2000,
    })
    
    setTimeout(() => {
      Toast.show({
        content: 'Channel bonus claimed! You earned 50 TK!',
        duration: 2000,
      })
 
    }, 2000)
  }

  const openYoutube = () => {
    window.open('https://www.youtube.com/@earnfromads-1', '_blank')
  }

  const checkYouTubeSubscribers = async () => {
    Toast.show({
      content: 'Checking YouTube subscription...',
      duration: 2000,
    })
    
  
    
    setTimeout(() => {
      
      setSubscriberCount(1250) // Mock subscriber count
      Toast.show({
        content: 'YouTube check completed!',
        duration: 2000,
      })
    }, 2000)
  }

  const claimYoutube = async () => {
    await checkYouTubeSubscribers()
    
    setTimeout(() => {
      Toast.show({
        content: 'YouTube bonus claimed! You earned 75 TK!',
        duration: 2000,
      })
    
    }, 2500)
  }

  return (
    <div className="block animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Complete Tasks</h2>

      <div className="p-5 rounded-xl text-center mb-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <i className="fas fa-video text-5xl mb-4 text-blue-600 dark:text-blue-400"></i>
        <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Rewarded Ad</h3>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">প্রতিটি বিজ্ঞাপনের জন্য <b>5</b> টাকা আয় করুন।</p>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">অ্যাড দেখে আয় করতে ভেরিফাই করুন!</p>
        <button
          className="w-full p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={watchAd}
          disabled={isWatchingAd || userState.watchedToday >= userState.dailyAdLimit}
        >
          <span>{isWatchingAd ? 'Watching Ad...' : 'Watch Ad'}</span>
        </button>
        <p className="mt-2.5 text-sm opacity-80 text-gray-600 dark:text-gray-400">
          পুরস্কার পেতে 15 সেকেন্ডের জন্য বিজ্ঞাপনে থাকুন।
        </p>
      </div>

      <div className="p-5 rounded-xl text-center mb-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <i className="fab fa-telegram text-5xl mb-4 text-blue-600 dark:text-blue-400"></i>
        <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Join our Telegram Channel</h3>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">চ্যানেলে জয়েন করুন, তারপর ফিরে এসে &quot;Check &amp; Claim&quot; দিন।</p>
        <div className="flex gap-2.5">
          <button className="flex-1 p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200" onClick={openChannel}>
            <span>Open Channel</span>
          </button>
          <button className="flex-1 p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-200" onClick={checkChannel}>
            <span>Check & Claim</span>
          </button>
        </div>
        <p className="mt-2.5 text-sm opacity-80 text-gray-600 dark:text-gray-400">
          Earn 50 TK by joining our Telegram channel!
        </p>
        {channelClaimed && (
          <small className="block mt-1.5 opacity-80 text-gray-600 dark:text-gray-400">
            ✅ Channel bonus claimed!
          </small>
        )}
      </div>

      <div className="p-5 rounded-xl text-center mb-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <i className="fab fa-youtube text-5xl mb-4 text-red-600 dark:text-red-400"></i>
        <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Subscribe our YouTube</h3>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">Open YouTube এ ক্লিক করুন, সাবস্ক্রাইব করুন, তারপর &quot;Check &amp; Claim&quot; দিন।</p>
        <div className="flex gap-2.5">
          <button className="flex-1 p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors duration-200" onClick={openYoutube}>
            <span>Open YouTube</span>
          </button>
          <button
            className="flex-1 p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={claimYoutube}
            disabled={isCheckingYoutube || youtubeClaimed}
          >
            <span>{isCheckingYoutube ? 'Checking...' : 'Check & Claim'}</span>
          </button>
        </div>
        <p className="mt-2.5 text-sm opacity-80 text-gray-600 dark:text-gray-400">
          Earn 75 TK by subscribing to our YouTube channel!
        </p>
        {subscriberCount && (
          <small className="block mt-1.5 opacity-80 text-green-600 dark:text-green-400">
            📊 Current subscribers: {subscriberCount.toLocaleString()}
          </small>
        )}
        {youtubeError && (
          <small className="block mt-1.5 text-red-600 dark:text-red-400">
            ❌ {youtubeError}
          </small>
        )}
        {youtubeClaimed && (
          <small className="block mt-1.5 opacity-80 text-gray-600 dark:text-gray-400">
            ✅ YouTube bonus claimed!
          </small>
        )}
      </div>
    </div>
  )
}
