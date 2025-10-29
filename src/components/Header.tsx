'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { BellOutline } from 'antd-mobile-icons'
import NotificationPopup from './NotificationPopup'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import {  fetchUserDataRequest } from '@/store/modules/user'
import { fetchBotStatusRequest } from '@/store/modules/botStatus';
import { getAccountLockDuration, isAccountSwitchAttempt } from '@/lib/localStorage'
import AccountSwitchDialog from './AccountSwitchDialog'
 

export default function Header( ) {
  const router = useRouter()
  const pathname = usePathname()
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)
  const user = useSelector((state: RootState) => state.user);
  const [photoUrl, setPhotoUrl] = useState<string>("https://picsum.photos/60/60?random=1");
  
  const [isLoading, setIsLoading] = useState(false)
  const [showAccountDialog, setShowAccountDialog] = useState(false)
  const [blockedUserId, setBlockedUserId] = useState<number | null>(null)

  const dispatch = useDispatch()
  
  // Check if we're on home page
  const isHomePage = pathname === '/'

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
    
        dispatch(fetchBotStatusRequest())
         
    }, [])
  
    const handleCloseDialog = () => {
      setShowAccountDialog(false)
    }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      {/* Main Header Row */}
      <div className="px-3 py-2.5 flex items-center justify-between">
        {/* Left Section - Back Button or User Info */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {!isHomePage && (
            <button
              onClick={() => router.back()}
              className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
            >
              <i className="fas fa-arrow-left text-gray-700 dark:text-gray-300 text-xs"></i>
            </button>
          )}
          
          {/* User Avatar with Status Ring */}
          <div className="relative flex-shrink-0">
            <img 
              className="w-9 h-9 rounded-full object-cover border-2 border-green-500 dark:border-green-400" 
              src={photoUrl}
              alt="User" 
            />
            {/* Online Status Dot */}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 dark:bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          
          {/* User Info */}
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {getDisplayName()}
              </h1>
              {/* Verified Badge */}
              <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-blue-500 dark:bg-blue-400 flex items-center justify-center">
                <i className="fas fa-check text-white text-[7px]"></i>
              </div>
            </div>
            
            {/* Balance Row with Icon */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 dark:bg-green-900/20 rounded">
                <i className="fas fa-wallet text-[8px] text-green-600 dark:text-green-400"></i>
                <span className="text-[10px] font-bold text-green-600 dark:text-green-400">
                  {user.wallet.available.usdt.toFixed(2)} USDT
                </span>
              </div>
              {/* XP Badge */}
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-purple-50 dark:bg-purple-900/20 rounded">
                <i className="fas fa-star text-[8px] text-purple-600 dark:text-purple-400"></i>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                  {user.xp || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Notification Button */}
          <button 
            className="relative w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center"
            onClick={() => setShowNotificationPopup(true)}
          >
            <BellOutline className="text-base text-gray-700 dark:text-gray-300" />
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">3</span>
            </div>
            {/* Pulse Animation */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          </button>

          {/* Settings/Menu Button */}
          <button 
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center"
          >
            <i className="fas fa-ellipsis-v text-gray-700 dark:text-gray-300 text-sm"></i>
          </button>
        </div>
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
