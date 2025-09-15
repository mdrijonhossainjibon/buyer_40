'use client'

import { Popup, Button, List  } from 'antd-mobile'
import { BellOutline, CloseOutline } from 'antd-mobile-icons'

interface NotificationItem {
  id: string
  title: string
  description: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp?: string
}

interface NotificationPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationPopup({ isOpen, onClose }: NotificationPopupProps) {
 
    const notifications: NotificationItem[] = [
        {
          id: '1',
          title: 'নতুন বিজ্ঞাপন উপলব্ধ!',
          description: 'টাস্ক পেজে গিয়ে নতুন বিজ্ঞাপন দেখুন এবং টাকা আয় করুন।',
          type: 'info',
          timestamp: '২ মিনিট আগে'
        },
        {
          id: '2',
          title: 'রেফারেল বোনাস!',
          description: 'আপনার বন্ধুদের রেফার করুন এবং প্রতি রেফারে ৩০ টাকা পান।',
          type: 'success',
          timestamp: '১ ঘন্টা আগে'
        },
        {
          id: '3',
          title: 'সিস্টেম আপডেট',
          description: 'নতুন ফিচার যোগ করা হয়েছে। অ্যাপ রিস্টার্ট করুন।',
          type: 'warning',
          timestamp: '৩ ঘন্টা আগে'
        },
        {
          id: '4',
          title: 'উইথড্র সফল!',
          description: 'আপনার ৫০০ টাকা বিকাশে পাঠানো হয়েছে।',
          type: 'success',
          timestamp: '৫ ঘন্টা আগে'
        },
        {
          id: '5',
          title: 'উইথড্র প্রসেসিং',
          description: 'আপনার উইথড্র অনুরোধটি বর্তমানে প্রক্রিয়াধীন রয়েছে।',
          type: 'info',
          timestamp: '৭ ঘন্টা আগে'
        },
        {
          id: '6',
          title: 'উইথড্র ব্যর্থ!',
          description: 'লেনদেন সম্পন্ন হয়নি, আবার চেষ্টা করুন বা সাপোর্টে যোগাযোগ করুন।',
          type: 'warning',
          timestamp: '১২ ঘন্টা আগে'
        },
        {
          id: '7',
          title: 'ডেইলি বোনাস',
          description: 'আজকের ডেইলি বোনাস সংগ্রহ করতে ভুলবেন না!',
          type: 'info',
          timestamp: '১ দিন আগে'
        },
        {
          id: '8',
          title: 'উইথড্র রিকোয়েস্ট গ্রহণ করা হয়েছে',
          description: 'আপনার ১০০০ টাকার উইথড্র রিকোয়েস্ট রেকর্ড করা হয়েছে।',
          type: 'info',
          timestamp: '২ দিন আগে'
        }
      ];
      
      

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
                    {notification.timestamp && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {notification.timestamp}
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
                  <div className="font-medium text-gray-900 dark:text-white flex-1">
                    {notification.title}
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
