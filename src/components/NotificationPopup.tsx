'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Popup, Button, List, Toast } from 'antd-mobile'
import { BellOutline, CloseOutline } from 'antd-mobile-icons'
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { RootState } from '@/store'

interface NotificationItem {
  id: string
  title: string
  description: string
  type: 'info' | 'success' | 'warning' | 'error'
  timeAgo: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
  metadata?: {
    actionUrl?: string
    actionText?: string
    category?: string
  }
}

interface NotificationPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationPopup({ isOpen, onClose }: NotificationPopupProps) {
  const user = useSelector((state: RootState) => state.user)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)

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

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const { response } = await API_CALL({
        method: 'POST',
        url: '/notifications',
        body: {
          userId: user.userId,
          action: 'markRead',
          notificationIds,
          ...generateSignature(user.userId?.toString() || '0', process.env.NEXT_PUBLIC_SECRET_KEY || '')
        }
      })

      if (response && response.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notificationIds.includes(notification.id) 
              ? { ...notification, isRead: true }
              : notification
          )
        )
      }
    } catch (error) {
      console.error('Mark as read error:', error)
    }
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
                description={
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {notification.description}
                    </p>
                    {notification.timeAgo && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {notification.timeAgo}
                      </p>
                    )}
                  </div>
                }
                className={`!mb-2 !rounded-lg border border-gray-200 dark:border-gray-700 ${getBackgroundColor(notification.type)} hover:shadow-md dark:hover:shadow-lg transition-all duration-200`}
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
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getTagColor(notification.type)}`}>
                    {getTagText(notification.type)}
                  </span>
                </div>
              </List.Item>
            ))}
          </List>
        </div>

        
      </div>
    </Popup>
  )
}
