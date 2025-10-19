'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import HomePage from '@/components/pages/HomePage'
import TasksPage from '@/components/pages/TasksPage'
import SupportPage from '@/components/pages/SupportPage'
import WithdrawPage from '@/components/pages/WithdrawPage'
import LoadingOverlay from '@/components/LoadingOverlay'
import AccountSuspensionPopup from '@/components/AccountSuspensionPopup'


import { RootState } from '@/store'


export default function Home() {

  const userState = useSelector((state: RootState) => state.user);

  const [showLoading, setShowLoading] = useState(true)


  const [currentPage, setCurrentPage] = useState('home')


  useLayoutEffect(() => {
    // Check if document element has dark class and sync with state
    const hasDarkClass = document.documentElement.classList.contains('dark')

    if (hasDarkClass) {
      document.documentElement.setAttribute('data-prefers-color-scheme', 'dark')
    }
    else {
      document.documentElement.setAttribute('data-prefers-color-scheme', 'light')
    }
  }, [])






  const renderCurrentPage = () => {
    // Check if Telegram WebApp is available
    const isTelegramWebApp = typeof window !== 'undefined' && window.Telegram?.WebApp.initDataUnsafe?.user;

    // If not in Telegram WebApp, show TelegramPopup
    /*   if (!isTelegramWebApp) {
        return (
          <TelegramPopup 
            isOpen={true}
            
          />
        );
      } */

    // If in Telegram WebApp, render the appropriate page
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'tasks':
        return <TasksPage />
      case 'support':
        return <SupportPage />
      case 'withdraw':
        return <WithdrawPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >

      <LoadingOverlay
        visible={showLoading}
        onClose={() => setShowLoading(false)}

      />

      <AccountSuspensionPopup
        isOpen={userState.userId !== null && userState.status === 'suspend'}
      />

      {
        userState.userId && userState.status === 'active' && (
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
        )
      }

    </div>

  )
}
