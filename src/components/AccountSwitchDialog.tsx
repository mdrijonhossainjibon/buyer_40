'use client'

import { useState, useEffect } from 'react'
import { Popup,  Toast } from 'antd-mobile'
import { useDispatch } from 'react-redux'
import { getAccountLockDuration, getStoredUserData } from '@/lib/localStorage'

interface AccountSwitchDialogProps {
  visible: boolean
  onClose: () => void
  blockedUserId: number | null
}

export default function AccountSwitchDialog({ 
  visible, 
  onClose, 
  blockedUserId, 
  
}: AccountSwitchDialogProps) {
  const dispatch = useDispatch()
  const [timeRemaining, setTimeRemaining] = useState( getAccountLockDuration())
  const [showConfirmClear, setShowConfirmClear] = useState(false)
  const storedData = getStoredUserData()

  // Update countdown timer
  useEffect(() => {
    if (!visible) return

    const timer = setInterval(() => {
      const currentLockDuration = getAccountLockDuration()
      setTimeRemaining(currentLockDuration)
      
      if (currentLockDuration <= 0) {
        clearInterval(timer)
        onClose()
        Toast.show({
          content: 'Account lock has expired! You can now switch accounts.',
          position: 'center',
          duration: 3000,
        })
      }
    }, 1000) // Update every minute

    return () => clearInterval(timer)
  }, [visible, onClose])

  const formatTimeRemaining = (hours: number): string => {
    if (hours <= 0) return '0 minutes'
    
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    
    if (wholeHours === 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`
    }
    
    if (minutes === 0) {
      return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`
    }
    
    return `${wholeHours}h ${minutes}m`
  }
 
 

  const cancelClearAccount = () => {
    setShowConfirmClear(false)
  }

  return (
    <>
      {/* Main Account Switch Popup */}
      <Popup
        visible={visible && !showConfirmClear}
        onMaskClick={() => {}}
        bodyStyle={{   height: '100vh'}}

      >
          <div className="text-center p-6 max-w-md mx-auto">
            {/* Header with Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <i className="fas fa-shield-alt text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                🚫 Account Switch Blocked
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Security measure activated
              </p>
            </div>

            {/* Current Account Info */}
            {storedData && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center mb-2">
                  <i className="fas fa-user-circle text-blue-500 mr-2"></i>
                  <span className="font-semibold text-blue-800 dark:text-blue-200">
                    Current Account
                  </span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  User ID: {storedData.userId}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Locked since: {new Date(storedData.lockedAt).toLocaleString()}
                </p>
              </div>
            )}

            {/* Lock Duration Info */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center mb-2">
                <i className="fas fa-clock text-yellow-600 mr-2"></i>
                <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Time Remaining
                </span>
              </div>
              <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                {formatTimeRemaining(timeRemaining)}
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Browser will unlock automatically
              </p>
            </div>

            {/* Explanation */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                🛡️ Why is this happening?
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                To prevent abuse and maintain fair usage, each browser is locked to one account for 24 hours after first use. This helps protect the platform and ensures equal opportunities for all users.
              </p>
            </div>
 

            {/* Alternative Solutions */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                💡 Alternative Solutions
              </h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• Use a different browser (Chrome, Firefox, Edge, etc.)</li>
                <li>• Use incognito/private browsing mode</li>
                <li>• Wait for the 24-hour lock to expire</li>
                <li>• Use a different device</li>
              </ul>
            </div>
          </div>
      </Popup>

   
    </>
  )
}
