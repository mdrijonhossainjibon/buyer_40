'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Popup, List, Toast } from 'antd-mobile'
import { BellOutline, CloseOutline } from 'antd-mobile-icons'
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { RootState } from '@/store'

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

interface NotificationPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationPopup({ isOpen, onClose }: NotificationPopupProps) {
  const user = useSelector((state: RootState) => state.user)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    if (isOpen && user.userId) {
      fetchNotifications()
    }
  }, [isOpen, user.userId])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const { response } = await API_CALL({
        method: 'POST',
        url: '/notifications',
        body: {
          userId: user.userId,
          action: 'list',
          ...generateSignature(user.userId?.toString() || '0', process.env.NEXT_PUBLIC_SECRET_KEY || '')
        }
      })

      if (response && response.success) {
        setNotifications(response.data.notifications)
      } else {
        Toast.show({
          content: response?.message || 'Failed to load notifications',
          duration: 2000,
        })
      }
    } catch (error) {
      console.error('Fetch notifications error:', error)
      Toast.show({
        content: 'Failed to load notifications',
        duration: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  const openNotificationDetails = (notification: NotificationItem) => {
    setSelectedNotification(notification)
    setDetailsOpen(true)
  }

  const closeNotificationDetails = () => {
    setDetailsOpen(false)
    setSelectedNotification(null)
  }

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

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      onClose={onClose}
      position="right"
      bodyStyle={{
        width: '100vw',
        height: '100vh',
        padding: 0,
        maxWidth: 'none',
        backgroundColor: 'var(--adm-color-background)',
        color: 'var(--adm-color-text)'
      }}
      maskStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)'
      }}
    >
      <div className="h-full w-full overflow-y-auto bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="px-6 py-6 text-center border-b border-gray-200 dark:border-gray-700 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close notifications"
          >
            <CloseOutline className="text-gray-500 dark:text-gray-400" />
          </button>
          <div className="flex items-center justify-center mb-2">
            <BellOutline className="text-gray-700 dark:text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">নোটিফিকেশন</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {notifications.length} টি নতুন বার্তা
          </p>
        </div>

        {/* Notification List */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900">
          <List className="dark:bg-gray-900">
            {notifications.map((notification) => (
              <List.Item
                key={notification.id}
                onClick={() => openNotificationDetails(notification)}
                description={
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
                      {notification.message || notification.description}
                    </p>
                    {notification.timeAgo && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {notification.timeAgo}
                      </p>
                    )}
                  </div>
                }
                className={`!mb-2 !rounded-lg border border-gray-200 dark:border-gray-700 ${getBackgroundColor(notification.type)} hover:shadow-md dark:hover:shadow-lg transition-all duration-200 cursor-pointer`}
                style={{
                  '--adm-color-background': 'transparent',
                  '--adm-color-text': 'inherit'
                } as React.CSSProperties}
              >
                <div className="flex items-center justify-between">
                  <div className={`font-medium flex-1 ${notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {notification.title}
                    {!notification.isRead && (
                      <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTagColor(notification.type)}`}>
                      {getTagText(notification.type)}
                    </span>
                    <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
                  </div>
                </div>
              </List.Item>
            ))}
          </List>
        </div>

        {/* Empty state */}
        {notifications.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <BellOutline className="text-gray-300 dark:text-gray-600 mb-4" style={{ fontSize: '48px' }} />
            <h4 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">কোন নোটিফিকেশন নেই</h4>
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
              আপনার কোন নতুন বার্তা নেই
            </p>
          </div>
        )}
      </div>

      {/* Notification Details Popup */}
      <Popup
        visible={detailsOpen}
        onMaskClick={closeNotificationDetails}
        onClose={closeNotificationDetails}
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
        {selectedNotification && (
          <div className="p-6 bg-white dark:bg-gray-900">
            {/* Details Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">বিস্তারিত</h3>
              <button
                onClick={closeNotificationDetails}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <CloseOutline className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Notification Content */}
            <div className={`p-4 rounded-lg border ${getBackgroundColor(selectedNotification.type)} border-gray-200 dark:border-gray-700 mb-6`}>
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                  {selectedNotification.title}
                </h4>
                <span className={`ml-3 px-3 py-1 text-sm font-medium rounded-full ${getTagColor(selectedNotification.type)}`}>
                  {getTagText(selectedNotification.type)}
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {selectedNotification.message || selectedNotification.description}
              </p>
              
              {selectedNotification.timeAgo && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <i className="fa-solid fa-clock mr-2"></i>
                  {selectedNotification.timeAgo}
                </p>
              )}
            </div>

            {/* Metadata Section */}
            {selectedNotification.metadata && Object.keys(selectedNotification.metadata).length > 0 && (
              <div className="mb-6">
                <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  অতিরিক্ত তথ্য
                </h5>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  {formatMetadata(selectedNotification.metadata)?.map((item, index) => (
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
                  selectedNotification.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200' :
                  selectedNotification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-200' :
                  'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200'
                }`}>
                  {selectedNotification.priority === 'high' ? 'উচ্চ' : 
                   selectedNotification.priority === 'medium' ? 'মধ্যম' : 'নিম্ন'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">অবস্থা:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  selectedNotification.isRead ? 
                  'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-200' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-200'
                }`}>
                  {selectedNotification.isRead ? 'পড়া হয়েছে' : 'নতুন'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Popup>
    </Popup>
  )
}
