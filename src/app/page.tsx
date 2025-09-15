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
import TelegramPopup from '@/components/TelegramPopup'
import { fetchUserData } from '@/lib/clientSignature'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isLoading, setIsLoading] = useState(true)
  const [showNewsModal, setShowNewsModal] = useState(false)
  const [showTelegramPopup, setShowTelegramPopup] = useState(false)
  const [userState, setUserState] = useState({
    userId: 123456789,
    balanceTK: 0,
    referralCount: 0,
    dailyAdLimit: 10,
    watchedToday: 0,
    telegramBonus: 0,
    youtubeBonus: 0,
    isBotVerified: 0
  })


  useEffect(() => {
    const initializeApp = async () => {
      let currentUserId = 123456789 // Default user ID

      // Initialize Telegram WebApp
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        tg.ready()
        tg.expand()

        // Get user data from Telegram
        const user = tg.initDataUnsafe?.user
        if (user) {
          currentUserId = user.id
        }
      }

      // Fetch user data from API
      try {
        const userData = await fetchUserData(currentUserId)
        if (userData) {
          setUserState(userData)
        } else {
          // If API fails, set the userId at least
          setUserState(prev => ({
            ...prev,
            userId: currentUserId,
          }))
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        // Fallback to default state with current user ID
        setUserState(prev => ({
          ...prev,
          userId: currentUserId,
        }))
      }

      // Complete loading
      setTimeout(() => {
        setIsLoading(false)
        // Show news modal after loading completes
        setShowNewsModal(true)
      }, 1000)
    }

    initializeApp()
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
      {
        showTelegramPopup ? <TelegramPopup isOpen onClose={() => setShowTelegramPopup(false)} miniAppUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/miniapp`} /> :
          (
            <><div
              id="app"
              className={`max-w-[500px] mx-auto pb-[86px] transition-opacity duration-300 ${isLoading ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
            >
              <Header userState={userState} />
              <main id="main-content" className="px-4 py-4">
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


    </>
  )
}
