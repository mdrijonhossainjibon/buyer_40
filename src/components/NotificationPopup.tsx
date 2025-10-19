'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Popup, List, PullToRefresh, Skeleton } from 'antd-mobile'
import CustomToast from '@/components/CustomToast'
import { BellOutline, CloseOutline } from 'antd-mobile-icons'
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { RootState } from '@/store'
import NotificationDetailsPopup from './NotificationDetailsPopup'
import { baseURL } from '@/lib/api-string'

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

  const fetchNotifications = async (showToast = false) => {
    setLoading(true)
    try {
      const { response } = await API_CALL({
         baseURL,
        method: 'POST',
        url: '/notifications',
        body: {
          ...generateSignature(JSON.stringify({ action: 'list' , userId : user.userId }), process.env.NEXT_PUBLIC_SECRET_KEY || '')
        }
      })

      if (response && response.success) {
        setNotifications(response.data.notifications)
        if (showToast) {
          CustomToast.show({
            content: 'নোটিফিকেশন আপডেট হয়েছে',
            duration: 1500,
          })
        }
      } else {
        CustomToast.show({
          content: response?.message || 'নোটিফিকেশন লোড করতে ব্যর্থ',
          duration: 2000,
        })
      }
    } catch (error) {
      console.error('Fetch notifications error:', error)
      CustomToast.show({
        content: 'নোটিফিকেশন লোড করতে ব্যর্থ',
        duration: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    await fetchNotifications(true)
  }

  const openNotificationDetails = (notification: NotificationItem) => {
    setSelectedNotification(notification)
    setDetailsOpen(true)
  }

  const closeNotificationDetails = () => {
    setDetailsOpen(false)
    setSelectedNotification(null)
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

  const renderSkeletonItems = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="mb-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-2">
          <Skeleton.Title animated style={{ width: '60%' }} />
          <Skeleton.Title animated style={{ width: '20%', height: '20px' }} />
        </div>
        <Skeleton.Paragraph lineCount={2} animated />
        <div className="mt-2">
          <Skeleton.Title animated style={{ width: '30%', height: '14px' }} />
        </div>
      </div>
    ))
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

        {/* Notification List with Pull to Refresh */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
          <PullToRefresh onRefresh={handleRefresh}>
            <div className="px-4 py-2">
              {loading ? (
                <div className="space-y-2">
                  {renderSkeletonItems()}
                </div>
              ) : (
                <>
                  {notifications.length > 0 ? (
                    <List className="dark:bg-gray-900">
                      {notifications.map((notification) => (
                        <List.Item
                          key={notification.id}
                          onClick={() => openNotificationDetails(notification)}
                          description={
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
                                {notification.message.slice(0, 50)}
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
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-6">
                      <BellOutline className="text-gray-300 dark:text-gray-600 mb-4" style={{ fontSize: '48px' }} />
                      <h4 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">কোন নোটিফিকেশন নেই</h4>
                      <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
                        আপনার কোন নতুন বার্তা নেই
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
                        নতুন নোটিফিকেশনের জন্য নিচে টেনে রিফ্রেশ করুন
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </PullToRefresh>
        </div>
      </div>

      {/* Use the separate NotificationDetailsPopup component */}
      <NotificationDetailsPopup
        isOpen={detailsOpen}
        notification={selectedNotification}
        onClose={closeNotificationDetails}
      />
    </Popup>
  )
}
