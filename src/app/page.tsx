'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import HomePage from '@/components/pages/HomePage'
import TasksPage from '@/components/pages/TasksPage'
import SupportPage from '@/components/pages/SupportPage'
import WithdrawPage from '@/components/pages/WithdrawPage'
import LoadingOverlay from '@/components/LoadingOverlay'
import NewsModal from '@/components/NewsModal'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isLoading, setIsLoading] = useState(true)
  const [showNewsModal, setShowNewsModal] = useState(false)
  const [userState, setUserState] = useState({
    userId: 123456789,
    balanceTK: 200000,
    referralCount: 50,
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
      // Show news modal after loading completes
      setShowNewsModal(true)
    }, 2000)
  }, [])

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage userState={userState} setUserState={setUserState as any} />
      case 'tasks':
        return <TasksPage userState={userState} setUserState={setUserState as any} />
      case 'support':
        return <SupportPage />
      case 'withdraw':
        return <WithdrawPage userState={userState} />
      default:
        return <HomePage userState={userState} setUserState={setUserState as any} />
    }
  }

  return (
    <>
      {isLoading && <LoadingOverlay visible />}
      <div id="app" style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        <Header userState={userState} />
        <main id="main-content">
          {renderCurrentPage()}
        </main>
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
      <NewsModal 
        isOpen={showNewsModal} 
        onClose={() => setShowNewsModal(false)}
      />
    </>
  )
}
