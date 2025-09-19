'use client'

import { useEffect, useState } from 'react'
import { BellOutline } from 'antd-mobile-icons'
import NotificationPopup from './NotificationPopup'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import {  fetchUserDataRequest } from '@/store/modules/user'
import { fetchBotStatusRequest } from '@/store/modules/botStatus';
import { getAccountLockDuration, isAccountSwitchAttempt } from '@/lib/localStorage'
import AccountSwitchDialog from './AccountSwitchDialog'
 

export default function Header( ) {
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)
  const user = useSelector((state: RootState) => state.user);
  const [photoUrl, setPhotoUrl] = useState<string>("https://picsum.photos/60/60?random=1");
  
  const [isLoading, setIsLoading] = useState(false)
  const [showAccountDialog, setShowAccountDialog] = useState(false)
  const [blockedUserId, setBlockedUserId] = useState<number | null>(null)

  const dispatch = useDispatch()

  // Function to get display name with intelligent handling
  const getDisplayName = () => {
    const tgUser = typeof window !== 'undefined' ? window.Telegram?.WebApp?.initDataUnsafe?.user : null;
    
    // Check if we have first name or last name from Telegram
    const firstName = tgUser?.first_name;
    const lastName = tgUser?.last_name;
    
    let displayName = '';
    
    if (firstName || lastName) {
      // If we have first or last name, show username instead
      displayName = firstName + '' + lastName || tgUser?.username || 'User';
    } else {
      // If no first/last name, use username or fallback
      displayName = user.username || user.userId?.toString() || 'Guest';
    }
    
    // Handle long names with substring (max 15 characters)
    if (displayName.length > 15) {
      return displayName.substring(0, 15) + '...';
    }
    
    return displayName;
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const tgPhoto = window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url;
      
      if (tgPhoto) {
        setPhotoUrl(tgPhoto);
      }
    }
  }, []);


    useEffect(() => {
    
        // Initialize Telegram WebApp
              if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                const tg = window.Telegram.WebApp
        
                // Get user data from Telegram
                const telegramUser = tg.initDataUnsafe?.user
                if (telegramUser && telegramUser.username) {
                  const userId = telegramUser.id
                  const username = telegramUser.username
        
                  // Check if this is an account switch attempt
                  if (isAccountSwitchAttempt(userId)) {
                    const currentLockDuration = getAccountLockDuration()
                    
                    if (currentLockDuration > 0) {
                      
                      setBlockedUserId(userId)
                      setShowAccountDialog(true)
                      setIsLoading(false)
                      return
                    }
                  }
        
                  // Proceed with user data fetch if validation passes
                  dispatch(fetchUserDataRequest({ 
                    userId, 
                    start_param: tg.initDataUnsafe.start_param, 
                    username 
                  }))
                  dispatch(fetchBotStatusRequest())
                }
              }
          ///dispatch(fetchUserDataRequest({ userId : 709148502 }))
        
       
       
    }, [])
  
    const handleCloseDialog = () => {
      setShowAccountDialog(false)
    }

  return (
    <header className="px-4 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <img 
          className="w-15 h-15 rounded-full object-cover border-2 border-blue-600 dark:border-blue-400" 
          src={ photoUrl }
          alt="User Photo" 
        />
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
            {getDisplayName()}
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

        {/* Account Switch Dialog */}
        <AccountSwitchDialog
          visible={showAccountDialog}
          onClose={handleCloseDialog}
          blockedUserId={blockedUserId}
           
        />
    </header>
  )
}
