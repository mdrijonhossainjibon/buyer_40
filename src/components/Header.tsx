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

interface HeaderProps {
  userState: UserState
}

export default function Header({ userState }: HeaderProps) {
  return (
    <header className="profile-header">
      <div className="profile-info">
        <img 
          className="user-photo" 
          src="https://picsum.photos/60/60?random=1" 
          alt="User Photo" 
        />
        <div className="user-details">
          <h1>
            User {userState.userId || 'Guest'} 
            <i className="fas fa-check-circle verified-icon"></i>
          </h1>
          <p>ব্যালেন্স: <span>{userState.balanceTK}</span> টাকা 💰</p>
        </div>
      </div>
      <div className="mini-app-badge">
        <i className="fa-solid fa-hand-peace"></i> 
        <span>ওয়েলকাম</span>
      </div>
    </header>
  )
}
