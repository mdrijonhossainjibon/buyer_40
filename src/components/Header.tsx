'use client'

import { useState } from 'react'
import { BellOutline } from 'antd-mobile-icons'
import NotificationPopup from './NotificationPopup'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

 

export default function Header( ) {
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)
  const user = useSelector((state: RootState) => state.user)
  return (
    <header className="px-4 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <img 
          className="w-15 h-15 rounded-full object-cover border-2 border-blue-600 dark:border-blue-400" 
          src="https://picsum.photos/60/60?random=1" 
          alt="User Photo" 
        />
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
            User {user.userId || 'Guest'} 
            <i className="fas fa-check-circle text-base text-blue-600 dark:text-blue-400"></i>
          </h1>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">ব্যালেন্স: <span className="text-blue-600 dark:text-blue-400">{user.balanceTK}</span> টাকা 💰</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
        <button 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 relative"
          onClick={() => setShowNotificationPopup(true)}
        >
          <BellOutline className="text-xl text-gray-600 dark:text-gray-400" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </button>
         
      </div>
      
      <NotificationPopup
        isOpen={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
      />
    </header>
  )
}
