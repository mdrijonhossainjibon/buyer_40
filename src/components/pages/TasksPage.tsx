'use client'

import { useState } from 'react'

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

  const watchAd = async () => {
    if (userState.watchedToday >= userState.dailyAdLimit) {
      alert('Daily ad limit reached!')
      return
    }

    setIsWatchingAd(true)
    
    // Simulate ad watching
    setTimeout(() => {
      setUserState(prev => ({
        ...prev,
        balanceTK: prev.balanceTK + 5,
        watchedToday: prev.watchedToday + 1
      }))
      setIsWatchingAd(false)
      alert('Ad watched! You earned 5 TK!')
    }, 3000)
  }

  const openChannel = () => {
    window.open('https://t.me/earnfromadsbd', '_blank')
  }

  const checkChannel = async () => {
    // Simulate channel check
    setTimeout(() => {
      if (!channelClaimed) {
        setUserState(prev => ({
          ...prev,
          balanceTK: prev.balanceTK + 50,
          telegramBonus: 1
        }))
        setChannelClaimed(true)
        alert('Channel bonus claimed! You earned 50 TK!')
      } else {
        alert('Channel bonus already claimed!')
      }
    }, 1000)
  }

  const openYoutube = () => {
    window.open('https://youtube.com/@earnfromadsbd', '_blank')
  }

  const claimYoutube = async () => {
    // Simulate YouTube check
    setTimeout(() => {
      if (!youtubeClaimed) {
        setUserState(prev => ({
          ...prev,
          balanceTK: prev.balanceTK + 75,
          youtubeBonus: 1
        }))
        setYoutubeClaimed(true)
        alert('YouTube bonus claimed! You earned 75 TK!')
      } else {
        alert('YouTube bonus already claimed!')
      }
    }, 1000)
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
        <p>চ্যানেলে জয়েন করুন, তারপর ফিরে এসে "Check & Claim" দিন।</p>
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
        <p>Open YouTube এ ক্লিক করুন, সাবস্ক্রাইব করুন, তারপর "Check & Claim" দিন।</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="action-btn" onClick={openYoutube}>
            <span>Open YouTube</span>
          </button>
          <button className="action-btn" onClick={claimYoutube}>
            <span>Check & Claim</span>
          </button>
        </div>
        <p style={{ marginTop: '10px', fontSize: '0.85rem', opacity: 0.8 }}>
          Earn 75 TK by subscribing to our YouTube channel!
        </p>
        {youtubeClaimed && (
          <small style={{ display: 'block', marginTop: '6px', opacity: 0.8 }}>
            ✅ YouTube bonus claimed!
          </small>
        )}
      </div>
    </div>
  )
}
