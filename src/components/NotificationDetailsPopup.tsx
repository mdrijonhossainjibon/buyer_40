'use client'

import { Popup, Skeleton } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'
import { useState, useEffect } from 'react'

interface NotificationItem {
  id: string
  title: string
  description?: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timeAgo: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
  metadata?: any
  createdAt?: string
}

interface NotificationDetailsPopupProps {
  isOpen: boolean
  notification: NotificationItem | null
  onClose: () => void
}

export default function NotificationDetailsPopup({ 
  isOpen, 
  notification, 
  onClose 
}: NotificationDetailsPopupProps) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && notification) {
      setLoading(true)
      // Simulate processing time for notification details
      const timer = setTimeout(() => {
        setLoading(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isOpen, notification])
  
  const formatMetadata = (metadata: any) => {
    if (!metadata || typeof metadata !== 'object') return null
    
    return Object.entries(metadata).map(([key, value]) => {
      let displayKey = key
      let displayValue = value
      
      // Format common keys
      switch (key) {
        case 'bonusAmount':
          displayKey = 'Bonus amount'
          displayValue = `${value} USDT`
          break
        case 'registrationTime':
          displayKey = 'Registration time'
          displayValue = new Date(value as string).toLocaleString('en-US')
          break
        case 'isFeastTime':
          displayKey = 'Feast time'
          displayValue = value ? 'Yes' : 'No'
          break
        case 'bonusType':
          displayKey = 'Bonus type'
          break
        case 'extraBonus':
          displayKey = 'Extra bonus'
          displayValue = `${value} USDT`
          break
        case 'feastTimeHours':
          displayKey = 'Feast time schedule'
          break
        case 'referredUserId':
          displayKey = 'Referred user'
          break
        case 'withdrawMethod':
          displayKey = 'Withdraw method'
          break
        case 'accountNumber':
          displayKey = 'Account number'
          break
        case 'amount':
          displayKey = 'Amount'
          displayValue = `${value} USDT`
          break
        case 'withdrawHistoryId':
          displayKey = 'Withdraw ID'
          break
        case 'requestTime':
          displayKey = 'Request time'
          displayValue = new Date(value as string).toLocaleString('en-US')
          break
      }
      
      return { key: displayKey, value: displayValue }
    })
  }

  const getBackgroundColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20'
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20'
      default:
        return 'bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getTagColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-200'
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-200'
    }
  }

  const getTagText = (type: NotificationItem['type']) => {
    switch (type) {
      case 'info':
        return 'Info'
      case 'success':
        return 'Success'
      case 'warning':
        return 'Warning'
      case 'error':
        return 'Error'
      default:
        return 'General'
    }
  }

  const renderSkeletonContent = () => (
    <div className="px-6 py-6 space-y-6">
      {/* Header Skeleton */}
      <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4">
        <Skeleton.Title animated style={{ width: '40%', margin: '0 auto 12px' }} />
        <Skeleton.Title animated style={{ width: '60%', margin: '0 auto 8px' }} />
        <Skeleton.Title animated style={{ width: '30%', margin: '0 auto', height: '16px' }} />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <div>
          <Skeleton.Title animated style={{ width: '25%', height: '18px', marginBottom: '8px' }} />
          <Skeleton.Paragraph lineCount={3} animated />
        </div>

        <div>
          <Skeleton.Title animated style={{ width: '30%', height: '18px', marginBottom: '8px' }} />
          <Skeleton.Title animated style={{ width: '50%', height: '16px' }} />
        </div>

        <div>
          <Skeleton.Title animated style={{ width: '35%', height: '18px', marginBottom: '8px' }} />
          <Skeleton.Title animated style={{ width: '40%', height: '16px' }} />
        </div>

        {/* Metadata Skeleton */}
        <div className="space-y-3">
          <Skeleton.Title animated style={{ width: '40%', height: '18px' }} />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Skeleton.Title animated style={{ width: '35%', height: '14px' }} />
              <Skeleton.Title animated style={{ width: '25%', height: '14px' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (!notification) return null

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      onClose={onClose}
      position="bottom"
      bodyStyle={{
        minHeight: '60vh',
        maxHeight: '90vh',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        backgroundColor: 'var(--adm-color-background)',
        color: 'var(--adm-color-text)'
      }}
    >
      <div className="p-6 bg-white dark:bg-gray-900">
        {/* Details Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Details</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <CloseOutline className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {loading ? (
          renderSkeletonContent()
        ) : (
          <>
            {/* Notification Content */}
            <div className={`p-4 rounded-lg border ${getBackgroundColor(notification.type)} border-gray-200 dark:border-gray-700 mb-6`}>
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                  {notification.title}
                </h4>
                <span className={`ml-3 px-3 py-1 text-sm font-medium rounded-full ${getTagColor(notification.type)}`}>
                  {getTagText(notification.type)}
                </span>
              </div>
              
              {/* Message Section */}
              <div className="mb-4">
                <h6 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  <i className="fa-solid fa-message mr-2"></i>
                  Message:
                </h6>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {notification.message || notification.description || 'No message'}
                </p>
              </div>

              {/* Time Section */}
              <div className="mb-4">
                <h6 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  <i className="fa-solid fa-clock mr-2"></i>
                  Time:
                </h6>
                <p className="text-gray-700 dark:text-gray-300">
                  {notification.timeAgo}
                </p>
              </div>

              {/* Priority Section */}
              <div className="mb-4">
                <h6 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  <i className="fa-solid fa-flag mr-2"></i>
                  Priority:
                </h6>
                <p className="text-gray-700 dark:text-gray-300">
                  {notification.priority === 'high' ? 'High' : notification.priority === 'medium' ? 'Medium' : 'Low'}
                </p>
              </div>

              {/* Metadata Section */}
              {notification.metadata && (
                <div>
                  <h5 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Additional Information</h5>
                  {formatMetadata(notification.metadata) ? (
                    <div className="space-y-2">
                      {formatMetadata(notification.metadata)?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {item.key}:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-white font-semibold">
                            {String(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No additional information</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Popup>
  )
}
