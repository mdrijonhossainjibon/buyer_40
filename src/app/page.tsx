'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { socketConnectRequest } from '@/store/modules/socket'
import Header from '@/components/Header'

import HomePage from '@/components/pages/HomePage'

import LoadingOverlay from '@/components/LoadingOverlay'
import AccountSuspensionPopup from '@/components/AccountSuspensionPopup'


import { RootState } from '@/store'


export default function Home() {

  const userState = useSelector((state: RootState) => state.user);
  
  const [showLoading, setShowLoading] = useState(true);
 
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
            className={`max-w-[500px] mx-auto transition-opacity duration-300 bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl min-h-screen ${userState.isLoading ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
          >
            <Header />
            <main id="main-content" className="px-4 pt-4 pb-20 bg-gray-50 dark:bg-gray-900">
              <HomePage />
            </main>

          </div>
        )
      }

    </div>

  )
}
