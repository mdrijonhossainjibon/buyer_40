'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ConfigProvider } from 'antd-mobile';
 
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
import {  fetchUserDataRequest } from '@/store/modules/user'

export default function Home() {
  const dispatch = useDispatch()
  const userState = useSelector((state: RootState) => state.user)
  
  const [currentPage, setCurrentPage] = useState('home')
  const [showNewsModal, setShowNewsModal] = useState(false)
  const [showTelegramPopup, setShowTelegramPopup] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
 
  useLayoutEffect(() => {
    // Check if document element has dark class and sync with state
    const hasDarkClass = document.documentElement.classList.contains('dark')
    
    if (hasDarkClass) {
      document.documentElement.setAttribute('data-prefers-color-scheme','dark')
    }
    else{
      document.documentElement.setAttribute('data-prefers-color-scheme','light')
    } 
     
  }, [ ])

  useEffect(() => {
    if (isInitialized) return
    const initializeApp = async () => {
      let currentUserId = 123456789 // Default user ID

      // Initialize Telegram WebApp
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        tg.ready()
        tg.expand()

        console.log(tg)

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
   
      <div 
        className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
       
      >
        {userState.isLoading && <LoadingOverlay visible />}
        {
          showTelegramPopup ? (
            <TelegramPopup 
              isOpen 
              onClose={() => setShowTelegramPopup(false)} 
              miniAppUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/miniapp`} 
            />
          ) : (
            <>
              <div
                id="app"
                className={`max-w-[500px] mx-auto pb-[86px] transition-opacity duration-300 bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl ${userState.isLoading ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
              >
                <Header />
                <main id="main-content" className="px-4 py-4 bg-gray-50 dark:bg-gray-900">
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
      </div>
 
  )
}
