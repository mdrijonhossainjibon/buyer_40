'use client'

import { Popup } from 'antd-mobile'
import { 
  CloseOutline,
  SetOutline,
  GlobalOutline,
  TeamOutline
} from 'antd-mobile-icons'
import BarChartOutline from '@/components/BarChartOutline'

interface MenuItem {
  key: string
  title: string
  icon: React.ReactNode
  onClick: () => void
}

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  activeTab: string
  menuItems: MenuItem[]
}

export default function AdminSidebar({ isOpen, onClose, activeTab, menuItems }: AdminSidebarProps) {
  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      onClose={onClose}
      position="left"
      bodyStyle={{
        width: '320px',
        height: '100vh',
        padding: 0,
        backgroundColor: 'var(--adm-color-background)',
        color: 'var(--adm-color-text)'
      }}
      maskStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <div className="h-full bg-white dark:bg-gray-800 flex flex-col">
        {/* Sidebar Header */}
        <div className="px-6 py-6 bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                <BarChartOutline className="text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">অ্যাডমিন প্যানেল</h2>
                <p className="text-sm text-purple-100 dark:text-purple-200">ম্যানেজমেন্ট সিস্টেম</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <CloseOutline className="text-white" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-4">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={item.onClick}
              className={`w-full px-6 py-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                activeTab === item.key 
                  ? 'bg-purple-50 dark:bg-purple-900/30 border-r-4 border-purple-500 text-purple-600 dark:text-purple-400' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.title}</span>
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2024 EarnFromAds BD
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Admin Panel v1.0
            </p>
          </div>
        </div>
      </div>
    </Popup>
  )
}
