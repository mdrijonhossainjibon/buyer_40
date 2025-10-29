'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '@/components/Header'
import WalletPage from '@/components/pages/WalletPage'
import AccountSuspensionPopup from '@/components/AccountSuspensionPopup'
import { RootState } from '@/store'

export default function Wallet() {
  const userState = useSelector((state: RootState) => state.user)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <AccountSuspensionPopup
        isOpen={userState.userId !== null && userState.status === 'suspend'}
      />

      {userState.userId && userState.status === 'active' && (
        <div
          id="app"
          className={`max-w-[500px] mx-auto transition-opacity duration-300 bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl min-h-screen ${
            userState.isLoading ? 'opacity-0 invisible' : 'opacity-100 visible'
          }`}
        >
          <Header />
          <main id="main-content" className="px-4 pt-4 pb-20 bg-gray-50 dark:bg-gray-900">
            <WalletPage />
          </main>
        </div>
      )}
    </div>
  )
}
