'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Toast  } from 'antd-mobile'
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
  MoonOutlined 
} from '@ant-design/icons';
 
import { API_CALL, generateSignature } from 'auth-fingerprint'
import BarChartOutline from '@/components/BarChartOutline'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminDashboard from '@/components/admin/AdminDashboard'
import AdminWithdrawals from '@/components/admin/AdminWithdrawals'
import AdminUsers from '@/components/admin/AdminUsers'
import AdminSettings from '@/components/admin/AdminSettings'
import AdminReports from '@/components/admin/AdminReports'
import AdminActivities from '@/components/admin/AdminActivities'
import AdminAdsSettings from '@/components/admin/AdminAdsSettings'
import AdminBotsSettings from '@/components/admin/AdminBotsSettings'

interface WithdrawalRequest {
  id: string
  userId: string
  username: string
  amount: number
  method: string
  accountNumber: string
  status: 'pending' | 'approved' | 'rejected'
  requestTime: string
  processedTime?: string
  adminNote?: string
}

interface UserStats {
  totalUsers: number
  activeUsers: number
  totalWithdrawals: number
  pendingWithdrawals: number
  totalEarnings: number
}

interface User {
  id: string
  username: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'suspended'
  joinDate: string
  lastActive: string
  totalEarnings: number
  totalWithdrawals: number
  referralCount: number
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all')
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

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [statsResponse, withdrawalsResponse] = await Promise.all([
        API_CALL({
          method: 'POST',
          url: '/admin/stats',
          body: {
            action: 'get-stats',
            ...generateSignature('admin', process.env.NEXT_PUBLIC_SECRET_KEY || '')
          }
        }),
        API_CALL({
          method: 'POST',
          url: '/admin/withdrawals',
          body: {
            action: 'list-withdrawals',
            ...generateSignature('admin', process.env.NEXT_PUBLIC_SECRET_KEY || '')
          }
        })
      ])

      if (statsResponse.response?.success) {
        setUserStats(statsResponse.response.data)
      }

      if (withdrawalsResponse.response?.success) {
        setWithdrawals(withdrawalsResponse.response.data.withdrawals)
      }
    } catch (error) {
      console.error('Admin data fetch error:', error)
      Toast.show({
        content: 'Failed to load data',
        duration: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleWithdrawalAction = async (withdrawalId: string, action: 'approve' | 'reject', note?: string) => {
    try {
      const { response } = await API_CALL({
        method: 'POST',
        url: '/admin/withdrawal-action',
        body: {
          withdrawalId,
          action,
          adminNote: note,
          ...generateSignature('admin', process.env.NEXT_PUBLIC_SECRET_KEY || '')
        }
      })

      if (response?.success) {
        Toast.show({
          content: action === 'approve' ? 'Withdrawal approved' : 'Withdrawal rejected',
          duration: 2000,
        })
        fetchDashboardData()
      } else {
        Toast.show({
          content: response?.message || 'Action failed',
          duration: 2000,
        })
      }
    } catch (error) {
      console.error('Withdrawal action error:', error)
      Toast.show({
        content: 'Failed to complete action',
        duration: 2000,
      })
    }
  }

  const menuItems = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      icon: <BarChartOutline />,
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
      key: 'settings',
      title: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => {
        setActiveTab('settings')
        setSidebarOpen(false)
      }
    },
    {
      key: 'reports',
      title: 'Reports',
      icon: <GlobalOutlined />,
      onClick: () => {
        setActiveTab('reports')
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
              <AdminDashboard 
                userStats={userStats}
                loading={loading}
              />
            )}
            {activeTab === 'withdrawals' && (
              <AdminWithdrawals  />
            )}
            {activeTab === 'users' && (
              <AdminUsers  />
            )}
            {activeTab === 'settings' && (
              <AdminSettings 
                loading={loading}
              />
            )}
            {activeTab === 'reports' && (
              <AdminReports 
           
              />
            )}
            {activeTab === 'activities' && (
              <AdminActivities 
                loading={loading}
              />
            )}
            {activeTab === 'ads-settings' && (
              <AdminAdsSettings 
                loading={loading}
              />
            )}
            {activeTab === 'bots-settings' && (
              <AdminBotsSettings 
                loading={loading}
              />
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
