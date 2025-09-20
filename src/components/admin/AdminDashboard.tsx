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
      <div className="space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
        <Card className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !border-none text-white">
          <div className="text-center">
            <UserOutline className="mx-auto mb-2" style={{ fontSize: '24px' }} />
            {loading ? (
              <Skeleton.Title animated />
            ) : (
              <div className="text-2xl font-bold">{formatNumber(userStats?.users.total || 0)}</div>
            )}
            <div className="text-sm opacity-90">Total Users</div>
          </div>
        </Card>

        <Card className="!bg-gradient-to-r !from-green-500 !to-green-600 !border-none text-white">
          <div className="text-center">
            <BankcardOutline className="mx-auto mb-2" style={{ fontSize: '24px' }} />
            {loading ? (
              <Skeleton.Title animated />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(userStats?.withdrawals?.totalWithdrawn || 0)}</div>
            )}
            <div className="text-sm opacity-90">Total Withdrawals</div>
          </div>
        </Card>

        <Card className="!bg-gradient-to-r !from-purple-500 !to-purple-600 !border-none text-white">
          <div className="text-center">
            <BarChartOutline className="mx-auto mb-2" />
            {loading ? (
              <Skeleton.Title animated />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(userStats?.earnings.totalEarned || 0)}</div>
            )}
            <div className="text-sm opacity-90">Total Earnings</div>
          </div>
        </Card>

        <Card className="!bg-gradient-to-r !from-orange-500 !to-orange-600 !border-none text-white">
          <div className="text-center">
            <ClockCircleOutline className="mx-auto mb-2" style={{ fontSize: '24px' }} />
            {loading ? (
              <Skeleton.Title animated />
            ) : (
              <div className="text-2xl font-bold">{formatNumber(userStats?.users?.active || 0)}</div>
            )}
            <div className="text-sm opacity-90">Active Users</div>
          </div>
        </Card>
        </div>
      </div>
    </PullToRefresh>
  )
}
