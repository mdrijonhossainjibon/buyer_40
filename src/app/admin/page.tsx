'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
 
import { 
  CreditCardOutlined,
  MenuOutlined,
  SettingOutlined,
  GlobalOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  UserOutlined,
  SunOutlined, 
  MoonOutlined,
  DashboardOutlined
} from '@ant-design/icons';
  
 
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminDashboard from '@/components/admin/AdminDashboard'
import AdminWithdrawals from '@/components/admin/AdminWithdrawals'
import AdminUsers from '@/components/admin/AdminUsers'
import AdminSettings from '@/components/admin/AdminSettings'
import AdminReports from '@/components/admin/AdminActivity'
import AdminAdsSettings from '@/components/admin/AdminAdsSettings'
import AdminBotsSettings from '@/components/admin/AdminBotsSettings'
 
  

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
    
  const [sidebarOpen, setSidebarOpen] = useState(false)
   
  const [isDarkMode, setIsDarkMode] = useState(false)

  useLayoutEffect(() => {
    const hasDarkClass = document.documentElement.classList.contains('dark')
    setIsDarkMode(hasDarkClass)
    if (hasDarkClass) {
      document.documentElement.setAttribute('data-prefers-color-scheme','dark')
    } else {
      document.documentElement.setAttribute('data-prefers-color-scheme','light')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-prefers-color-scheme','dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-prefers-color-scheme','light')
    }
  }

 
 
  const menuItems = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      icon: <DashboardOutlined />,
      onClick: () => {
        setActiveTab('dashboard')
        setSidebarOpen(false)
      }
    },
    {
      key: 'withdrawals',
      title: 'Withdrawal Management',
      icon: <CreditCardOutlined />,
      onClick: () => {
        setActiveTab('withdrawals')
        setSidebarOpen(false)
      }
    },
    {
      key: 'users',
      title: 'Users',
      icon: <TeamOutlined />,
      onClick: () => {
        setActiveTab('users')
        setSidebarOpen(false)
      }
    },
   
    
    {
      key: 'activities',
      title: 'Activities',
      icon: <ClockCircleOutlined />,
      onClick: () => {
        setActiveTab('activities')
        setSidebarOpen(false)
      }
    },
    {
      key: 'ads-settings',
      title: 'Ad Settings',
      icon: <EyeOutlined />,
      onClick: () => {
        setActiveTab('ads-settings')
        setSidebarOpen(false)
      }
    },
    {
      key: 'bots-settings',
      title: 'Bot Settings',
      icon: <UserOutlined />,
      onClick: () => {
        setActiveTab('bots-settings')
        setSidebarOpen(false)
      }
    },
    {
      key: 'settings',
      title: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => {
        setActiveTab('settings')
        setSidebarOpen(false)
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        menuItems={menuItems}
      />
      
      <div className="max-w-[500px] mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl min-h-screen">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 max-w-[500px] mx-auto h-[60px] px-4 bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 flex items-center justify-between z-20">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              aria-label="Open menu"
            >
              <MenuOutlined className="text-white text-lg" />
            </button>
            
            <div className="text-center flex-1">
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-purple-100 dark:text-purple-200 text-xs">
                System Management Dashboard
              </p>
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              <div className="relative w-12 h-6 bg-white bg-opacity-20 rounded-full transition-all duration-300">
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}>
                  <span className="absolute inset-0 flex items-center justify-center text-xs">
                    {isDarkMode ? <MoonOutlined /> : <SunOutlined />}
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className=" bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-120px)] pb-20 pt-[78px]">
            {activeTab === 'dashboard' && (
              <AdminDashboard   />
            )}
            {activeTab === 'withdrawals' && (
              <AdminWithdrawals  />
            )}
            {activeTab === 'users' && (
              <AdminUsers  />
            )}
            {activeTab === 'settings' && (
              <AdminSettings  />
            )}
          
            {activeTab === 'activities' && (
                 <AdminReports />
            )}
            {activeTab === 'ads-settings' && (
              <AdminAdsSettings   />
            )}
            {activeTab === 'bots-settings' && (
              <AdminBotsSettings  />
            )}
          </div>

          {/* Footer */}
          <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto px-6 py-4 text-center bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Future Apps Developer Admin Panel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
