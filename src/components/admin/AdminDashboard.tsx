'use client'

import { useState, useEffect } from 'react'
import { Card, Skeleton, Toast, PullToRefresh } from 'antd-mobile'
import { 
  UserOutline, 
  BankcardOutline, 
  ClockCircleOutline
} from 'antd-mobile-icons'
import BarChartOutline from '@/components/BarChartOutline'
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { formatNumber, formatCurrency } from '@/lib/formatNumber'
import { baseURL } from '@/lib/api-string'

 

export default function AdminDashboard() {
  const [userStats, setUserStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const { response } = await API_CALL({
        baseURL,
        method : 'GET',
        url: '/admin/stats',
        body: {
          action: 'get-stats',
          ...generateSignature('admin', process.env.NEXT_PUBLIC_SECRET_KEY || '')
        }
      })

      if (response?.success) {
        setUserStats(response.data)
      } else {
        Toast.show({
          content: 'Failed to load dashboard data',
          duration: 2000,
        })
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
      Toast.show({
        content: 'Failed to load dashboard data',
        duration: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    await fetchDashboardData()
  }
  return (
    <PullToRefresh onRefresh={onRefresh}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Admin Dashboard
            </h1>
            
            {/* User Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <Card className="!p-3 !bg-blue-50 dark:!bg-blue-900/20 !border-blue-200 dark:!border-blue-800">
                <div className="text-center">
                  {loading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatNumber(userStats?.users?.total || 0)}
                    </div>
                  )}
                  <div className="text-xs text-blue-600 dark:text-blue-400">Total Users</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-green-50 dark:!bg-green-900/20 !border-green-200 dark:!border-green-800">
                <div className="text-center">
                  {loading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatNumber(userStats?.users?.active || 0)}
                    </div>
                  )}
                  <div className="text-xs text-green-600 dark:text-green-400">Active Users</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-purple-50 dark:!bg-purple-900/20 !border-purple-200 dark:!border-purple-800">
                <div className="text-center">
                  {loading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {formatNumber(userStats?.users?.suspended || 0)}
                    </div>
                  )}
                  <div className="text-xs text-purple-600 dark:text-purple-400">Suspended Users</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-orange-50 dark:!bg-orange-900/20 !border-orange-200 dark:!border-orange-800">
                <div className="text-center">
                  {loading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(userStats?.earnings?.totalEarned || 0)}
                    </div>
                  )}
                  <div className="text-xs text-orange-600 dark:text-orange-400">Total Earnings</div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Withdrawal Statistics Section */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Withdrawal Statistics
            </h2>
            
            {/* Withdrawal Count Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <Card className="!p-3 !bg-blue-50 dark:!bg-blue-900/20 !border-blue-200 dark:!border-blue-800">
                <div className="text-center">
                  {loading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatNumber(userStats?.withdrawals?.total || 0)}
                    </div>
                  )}
                  <div className="text-xs text-blue-600 dark:text-blue-400">Total Requests</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-yellow-50 dark:!bg-yellow-900/20 !border-yellow-200 dark:!border-yellow-800">
                <div className="text-center">
                  {loading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {formatNumber(userStats?.withdrawals?.pending || 0)}
                    </div>
                  )}
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">Pending</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-green-50 dark:!bg-green-900/20 !border-green-200 dark:!border-green-800">
                <div className="text-center">
                  {loading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatNumber(userStats?.withdrawals?.approved || 0)}
                    </div>
                  )}
                  <div className="text-xs text-green-600 dark:text-green-400">Approved</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-red-50 dark:!bg-red-900/20 !border-red-200 dark:!border-red-800">
                <div className="text-center">
                  {loading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">
                      {formatNumber(userStats?.withdrawals?.rejected || 0)}
                    </div>
                  )}
                  <div className="text-xs text-red-600 dark:text-red-400">Rejected</div>
                </div>
              </Card>
            </div>

            {/* Withdrawal Amount Statistics */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="!p-3 !bg-purple-50 dark:!bg-purple-900/20 !border-purple-200 dark:!border-purple-800">
                <div className="text-center">
                  {loading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {formatCurrency(userStats?.withdrawals?.totalAmount || 0)}
                    </div>
                  )}
                  <div className="text-xs text-purple-600 dark:text-purple-400">Total Amount</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-orange-50 dark:!bg-orange-900/20 !border-orange-200 dark:!border-orange-800">
                <div className="text-center">
                  {loading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(userStats?.withdrawals?.pendingAmount || 0)}
                    </div>
                  )}
                  <div className="text-xs text-orange-600 dark:text-orange-400">Pending Amount</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PullToRefresh>
  )
}
