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
    <div className="page active">
      <h2>Complete Tasks</h2>

      <div className="task-container">
        <i className="fas fa-video task-icon"></i>
        <h3>Rewarded Ad</h3>
        <p>প্রতিটি বিজ্ঞাপনের জন্য <b>5</b> টাকা আয় করুন।</p>
        <p>অ্যাড দেখে আয় করতে ভেরিফাই করুন!</p>
        <button
          className="action-btn"
          onClick={watchAd}
          disabled={isWatchingAd || userState.watchedToday >= userState.dailyAdLimit}
        >
          <span>{isWatchingAd ? 'Watching Ad...' : 'Watch Ad'}</span>
        </button>
        <p style={{ marginTop: '10px', fontSize: '0.85rem', opacity: 0.8 }}>
          পুরস্কার পেতে 15 সেকেন্ডের জন্য বিজ্ঞাপনে থাকুন।
        </p>
      </div>

      <div className="task-container">
        <i className="fab fa-telegram task-icon"></i>
        <h3>Join our Telegram Channel</h3>
        <p>চ্যানেলে জয়েন করুন, তারপর ফিরে এসে &quot;Check &amp; Claim&quot; দিন।</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="action-btn" onClick={openChannel}>
            <span>Open Channel</span>
          </button>
          <button className="action-btn" onClick={checkChannel}>
            <span>Check & Claim</span>
          </button>
        </div>
        <p style={{ marginTop: '10px', fontSize: '0.85rem', opacity: 0.8 }}>
          Earn 50 TK by joining our Telegram channel!
        </p>
        {channelClaimed && (
          <small style={{ display: 'block', marginTop: '6px', opacity: 0.8 }}>
            ✅ Channel bonus claimed!
          </small>
        )}
      </div>

      <div className="task-container">
        <i className="fab fa-youtube task-icon"></i>
        <h3>Subscribe our YouTube</h3>
        <p>Open YouTube এ ক্লিক করুন, সাবস্ক্রাইব করুন, তারপর &quot;Check &amp; Claim&quot; দিন।</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="action-btn" onClick={openYoutube}>
            <span>Open YouTube</span>
          </button>
          <button
            className="action-btn"
            onClick={claimYoutube}
            disabled={isCheckingYoutube || youtubeClaimed}
          >
            <span>{isCheckingYoutube ? 'Checking...' : 'Check & Claim'}</span>
          </button>
        </div>
        <p style={{ marginTop: '10px', fontSize: '0.85rem', opacity: 0.8 }}>
          Earn 75 TK by subscribing to our YouTube channel!
        </p>
        {subscriberCount && (
          <small style={{ display: 'block', marginTop: '6px', opacity: 0.8, color: '#4CAF50' }}>
            📊 Current subscribers: {subscriberCount.toLocaleString()}
          </small>
        )}
        {youtubeError && (
          <small style={{ display: 'block', marginTop: '6px', color: '#f44336' }}>
            ❌ {youtubeError}
          </small>
        )}
        {youtubeClaimed && (
          <small style={{ display: 'block', marginTop: '6px', opacity: 0.8 }}>
            ✅ YouTube bonus claimed!
          </small>
        )}
      </div>
    </div>
  )
}
