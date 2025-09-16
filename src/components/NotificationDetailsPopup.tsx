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
      
      // Format common keys in Bengali
      switch (key) {
        case 'bonusAmount':
          displayKey = 'বোনাস পরিমাণ'
          displayValue = `${value} টাকা`
          break
        case 'registrationTime':
          displayKey = 'রেজিস্ট্রেশন সময়'
          displayValue = new Date(value as string).toLocaleString('bn-BD')
          break
        case 'isFeastTime':
          displayKey = 'ভোজের সময়'
          displayValue = value ? 'হ্যাঁ' : 'না'
          break
        case 'bonusType':
          displayKey = 'বোনাসের ধরন'
          break
        case 'extraBonus':
          displayKey = 'অতিরিক্ত বোনাস'
          displayValue = `${value} টাকা`
          break
        case 'feastTimeHours':
          displayKey = 'ভোজের সময়সূচী'
          break
        case 'referredUserId':
          displayKey = 'রেফার করা ব্যবহারকারী'
          break
        case 'withdrawMethod':
          displayKey = 'উইথড্র পদ্ধতি'
          break
        case 'accountNumber':
          displayKey = 'অ্যাকাউন্ট নম্বর'
          break
        case 'amount':
          displayKey = 'পরিমাণ'
          displayValue = `${value} টাকা`
          break
        case 'withdrawHistoryId':
          displayKey = 'উইথড্র আইডি'
          break
        case 'requestTime':
          displayKey = 'অনুরোধের সময়'
          displayValue = new Date(value as string).toLocaleString('bn-BD')
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
        return 'তথ্য'
      case 'success':
        return 'সফল'
      case 'warning':
        return 'সতর্কতা'
      case 'error':
        return 'ত্রুটি'
      default:
        return 'সাধারণ'
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
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">বিস্তারিত</h3>
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
                  বার্তা:
                </h6>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {notification.message || notification.description || 'কোন বার্তা নেই'}
                </p>
              </div>
              
              {notification.timeAgo && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <i className="fa-solid fa-clock mr-2"></i>
                  {notification.timeAgo}
                </p>
              )}
            </div>
          </>
        )}

        {/* Metadata Section */}
        {!loading && notification.metadata && Object.keys(notification.metadata).length > 0 && (
          <div className="mb-6">
            <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
              <i className="fa-solid fa-info-circle mr-2"></i>
              অতিরিক্ত তথ্য
            </h5>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              {formatMetadata(notification.metadata)?.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.key}:
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">
                    {String(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Priority Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">অগ্রাধিকার:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              notification.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200' :
              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-200' :
              'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200'
            }`}>
              {notification.priority === 'high' ? 'উচ্চ' : 
               notification.priority === 'medium' ? 'মধ্যম' : 'নিম্ন'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">অবস্থা:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              notification.isRead ? 
              'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-200' :
              'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-200'
            }`}>
              {notification.isRead ? 'পড়া হয়েছে' : 'নতুন'}
            </span>
          </div>
        </div>
      </div>
    </Popup>
  )
}
