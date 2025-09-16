'use client'

import { Card, Skeleton } from 'antd-mobile'
import { 
  UserOutline, 
  BankcardOutline, 
  ClockCircleOutline
} from 'antd-mobile-icons'
import BarChartOutline from '@/components/BarChartOutline'

interface UserStats {
  totalUsers: number
  activeUsers: number
  totalWithdrawals: number
  pendingWithdrawals: number
  totalEarnings: number
}

interface AdminDashboardProps {
  userStats: UserStats | null
  loading: boolean
}

export default function AdminDashboard({ userStats, loading }: AdminDashboardProps) {
  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !border-none text-white">
          <div className="text-center">
            <UserOutline className="mx-auto mb-2" style={{ fontSize: '24px' }} />
            <div className="text-2xl font-bold">{userStats?.totalUsers || 0}</div>
            <div className="text-sm opacity-90">Total Users</div>
          </div>
        </Card>

        <Card className="!bg-gradient-to-r !from-green-500 !to-green-600 !border-none text-white">
          <div className="text-center">
            <BankcardOutline className="mx-auto mb-2" style={{ fontSize: '24px' }} />
            <div className="text-2xl font-bold">{userStats?.totalWithdrawals || 0}</div>
            <div className="text-sm opacity-90">Total Withdrawals</div>
          </div>
        </Card>

        <Card className="!bg-gradient-to-r !from-purple-500 !to-purple-600 !border-none text-white">
          <div className="text-center">
            <BarChartOutline className="mx-auto mb-2" />
            <div className="text-2xl font-bold">৳{userStats?.totalEarnings || 0}</div>
            <div className="text-sm opacity-90">Total Earnings</div>
          </div>
        </Card>

        <Card className="!bg-gradient-to-r !from-orange-500 !to-orange-600 !border-none text-white">
          <div className="text-center">
            <ClockCircleOutline className="mx-auto mb-2" style={{ fontSize: '24px' }} />
            <div className="text-2xl font-bold">{userStats?.pendingWithdrawals || 0}</div>
            <div className="text-sm opacity-90">Pending Withdrawals</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
