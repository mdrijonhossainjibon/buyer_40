'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import HomePage from '@/components/pages/HomePage'
import TasksPage from '@/components/pages/TasksPage'
import SupportPage from '@/components/pages/SupportPage'
import WithdrawPage from '@/components/pages/WithdrawPage'
import LoadingOverlay from '@/components/LoadingOverlay'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isLoading, setIsLoading] = useState(true)
  const [userState, setUserState] = useState({
    userId: null,
    balanceTK: 0,
    referralCount: 0,
    dailyAdLimit: 10,
    watchedToday: 0,
    telegramBonus: 0,
    youtubeBonus: 0,
    isBotVerified: 0
  })

  useEffect(() => {
    // Initialize Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
      
      // Get user data from Telegram
      const user = tg.initDataUnsafe?.user
      if (user) {
        setUserState(prev => ({
          ...prev,
          userId: user.id,
        }))
      }
    }

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage userState={userState} setUserState={setUserState} />
      case 'tasks':
        return <TasksPage userState={userState} setUserState={setUserState} />
      case 'support':
        return <SupportPage />
      case 'withdraw':
        return <WithdrawPage userState={userState} />
      default:
        return <HomePage userState={userState} setUserState={setUserState} />
    }
  }

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div id="app" style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        <Header userState={userState} />
        <main id="main-content">
          {renderCurrentPage()}
        </main>
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </>
  )
}
