'use client'

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
  // Generate a default user ID if none exists
  const userId = userState.userId || Math.floor(Math.random() * 1000000) + 100000
  
  const referralLink = `https://t.me/earnfromadsbd_bot/app?startapp=${userId}`

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      alert('Referral link copied!')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const shareOnTelegram = () => {
    const text = encodeURIComponent(`🎉 Join me on Earn From Ads BD and start earning money by watching ads! Use my referral link: ${referralLink}`)
    window.open(`https://t.me/share/url?url=${referralLink}&text=${text}`, '_blank')
  }

  return (
    <div className="page active">
      <h2>Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Daily Ads Watched</h3>
          <p>{userState.watchedToday} / {userState.dailyAdLimit}</p>
        </div>
        <div className="stat-card">
          <h3>Total Referrals</h3>
          <p>{userState.referralCount}</p>
        </div>
      </div>

      <div className="referral-section">
        <h3>Refer & Earn More!</h3>
        <p className="ref-text">
          রেফার বোনাস পেতে লিংকটি কপি করে আপনার বন্ধুদের কাছে শেয়ার করুন। প্রতি রেফারে আয় <b>30</b> টাকা.
        </p>
        <input 
          type="text" 
          className="referral-link" 
          value={referralLink}
          readOnly 
        />
        <div className="ref-btns">
          <button className="copy-ref-btn" onClick={copyReferralLink}>
            Copy Referral Link
          </button>
          <button className="share-telegram-btn" onClick={shareOnTelegram}>
            <i className="fas fa-share-alt"></i> Share Now
          </button>
        </div>
        <small style={{ display: 'block', marginTop: '6px', opacity: 0.75 }}>
          Share your referral link to earn bonus!
        </small>
      </div>
    </div>
  )
}
