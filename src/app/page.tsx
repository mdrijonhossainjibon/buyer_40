'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import HomePage from '@/components/pages/HomePage'
import TasksPage from '@/components/pages/TasksPage'
import SupportPage from '@/components/pages/SupportPage'
import WithdrawPage from '@/components/pages/WithdrawPage'
import LoadingOverlay from '@/components/LoadingOverlay'
import NewsModal from '@/components/NewsModal'
import TelegramPopup from '@/components/TelegramPopup'

import { RootState } from '@/store'
import { setUserData, fetchUserDataRequest } from '@/store/modules/user'

export default function Home() {
  const dispatch = useDispatch()
  const userState = useSelector((state: RootState) => state.user)
  
  const [currentPage, setCurrentPage] = useState('home')
  const [showNewsModal, setShowNewsModal] = useState(false)
  const [showTelegramPopup, setShowTelegramPopup] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Wrapper function to handle state updates via Redux
  const handleUserStateUpdate = (newState: any) => {
    if (typeof newState === 'function') {
      const updatedState = newState(userState)
      dispatch(setUserData(updatedState))
    } else {
      dispatch(setUserData(newState))
    }
  }

  useEffect(() => {
    if (isInitialized) return
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

      // Dispatch saga action to fetch user data
      dispatch(fetchUserDataRequest(currentUserId))
      
      setIsInitialized(true)
    }

    initializeApp()
  }, [isInitialized])


 
   

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'tasks':
        return <TasksPage />
      case 'support':
        return <SupportPage />
      case 'withdraw':
        return <WithdrawPage  />
      default:
        return <HomePage   />
    }
  }

  return (
    <>
      {userState.isLoading && <LoadingOverlay visible />}
      {
        showTelegramPopup ? <TelegramPopup isOpen onClose={() => setShowTelegramPopup(false)} miniAppUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/miniapp`} /> :
          (
            <><div
              id="app"
              className={`max-w-[500px] mx-auto pb-[86px] transition-opacity duration-300 ${userState.isLoading ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
            >
              <Header   />
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
