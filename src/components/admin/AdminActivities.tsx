'use client'

import { useState, useEffect } from 'react'
import { Card, List, Badge, Selector, Toast, InfiniteScroll } from 'antd-mobile'
import { 
  ClockCircleOutline,
  UserOutline,
  EyeOutline,
  CheckCircleOutline,
  CloseCircleOutline,
  SearchOutline
} from 'antd-mobile-icons'

interface AdminActivitiesProps {
  loading?: boolean
}

interface Activity {
  _id: string
  userId: number
  username?: string
  activityType: 'ad_watch' | 'task_complete' | 'referral' | 'bonus' | 'withdrawal' | 'login' | 'signup'
  description: string
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  metadata?: {
    ipAddress?: string
    userAgent?: string
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export default function AdminActivities({ loading = false }: AdminActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    cancelled: 0
  })

  const filterOptions = [
    { label: 'সব কার্যকলাপ', value: 'all' },
    { label: 'লগইন', value: 'login' },
    { label: 'সাইনআপ', value: 'signup' },
    { label: 'অ্যাড দেখা', value: 'ad_watch' },
    { label: 'টাস্ক সম্পন্ন', value: 'task_complete' },
    { label: 'রেফারেল', value: 'referral' },
    { label: 'বোনাস', value: 'bonus' },
    { label: 'উইথড্র', value: 'withdrawal' }
  ]

  const statusOptions = [
    { label: 'সব স্ট্যাটাস', value: 'all' },
    { label: 'অপেক্ষমাণ', value: 'pending' },
    { label: 'সম্পন্ন', value: 'completed' },
    { label: 'ব্যর্থ', value: 'failed' },
    { label: 'বাতিল', value: 'cancelled' }
  ]

  // API functions
  const fetchActivities = async (page: number = 1, reset: boolean = false) => {
    try {
      setError(null)
      if (reset) {
        setInitialLoading(true)
      } else {
        setLoadingMore(true)
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '5',
        type: filterType,
        status: filterStatus
      })

      const response = await fetch(`/api/admin/activities?${params}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch activities')
      }

      const { activities: newActivities, pagination } = result.data

      if (reset || page === 1) {
        setActivities(newActivities)
      } else {
        setActivities(prev => [...prev, ...newActivities])
      }

      setHasMore(pagination.hasMore)
      setCurrentPage(page)

      // Update stats when loading first page
      if (reset || page === 1) {
        const statusCounts = newActivities.reduce((acc: Record<string, number>, activity: Activity) => {
          acc[activity.status] = (acc[activity.status] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        setStats({
          total: pagination.totalCount,
          pending: statusCounts.pending || 0,
          completed: statusCounts.completed || 0,
          failed: statusCounts.failed || 0,
          cancelled: statusCounts.cancelled || 0
        })
      }

      if (newActivities.length === 0 && page > 1) {
        Toast.show('সব কার্যকলাপ লোড হয়েছে')
      }

    } catch (error) {
      console.error('Error fetching activities:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      Toast.show('কার্যকলাপ লোড করতে সমস্যা হয়েছে')
    } finally {
      setLoadingMore(false)
      setInitialLoading(false)
    }
  }

  const refreshActivities = async () => {
    try {
      // Call refresh API endpoint
      await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' })
      })
      
      // Reload activities
      await fetchActivities(1, true)
      Toast.show('রিফ্রেশ করা হয়েছে')
    } catch (error) {
      console.error('Error refreshing activities:', error)
      Toast.show('রিফ্রেশ করতে সমস্যা হয়েছে')
    }
  }

  useEffect(() => {
    // Load initial activities
    fetchActivities(1, true)
  }, [])

  const loadMore = async () => {
    if (loadingMore || !hasMore) return
    await fetchActivities(currentPage + 1, false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'failed': return 'danger'
      case 'pending': return 'warning'
      case 'cancelled': return 'default'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleOutline className="text-green-500" />
      case 'failed': return <CloseCircleOutline className="text-red-500" />
      case 'pending': return <ClockCircleOutline className="text-yellow-500" />
      case 'cancelled': return <CloseCircleOutline className="text-gray-500" />
      default: return <ClockCircleOutline />
    }
  }

  const getActionIcon = (activityType: string) => {
    switch (activityType) {
      case 'login': return <UserOutline className="text-blue-500" />
      case 'signup': return <UserOutline className="text-green-500" />
      case 'withdrawal': return <ClockCircleOutline className="text-orange-500" />
      case 'ad_watch': return <EyeOutline className="text-green-500" />
      case 'task_complete': return <CheckCircleOutline className="text-blue-500" />
      case 'referral': return <UserOutline className="text-purple-500" />
      case 'bonus': return <CheckCircleOutline className="text-yellow-500" />
      default: return <ClockCircleOutline />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'এখনই'
    if (diffInMinutes < 60) return `${diffInMinutes} মিনিট আগে`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} ঘন্টা আগে`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} দিন আগে`
  }

  // Activities are already filtered by the API, so we just use them directly
  const filteredActivities = activities

  // Reset pagination when filters change
  useEffect(() => {
    if (!initialLoading) {
      fetchActivities(1, true)
    }
  }, [filterType, filterStatus])

  if (loading || initialLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <ClockCircleOutline className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">ব্যবহারকারী কার্যকলাপ</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                সিস্টেমের সকল ব্যবহারকারী কার্যকলাপ ট্র্যাক করুন
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                কার্যকলাপের ধরন
              </label>
              <Selector
                options={filterOptions}
                value={[filterType]}
                onChange={(arr) => setFilterType(arr[0] || 'all')}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                স্ট্যাটাস
              </label>
              <Selector
                options={statusOptions}
                value={[filterStatus]}
                onChange={(arr) => setFilterStatus(arr[0] || 'all')}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">মোট</div>
          </div>
        </Card>
        <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">অপেক্ষমাণ</div>
          </div>
        </Card>
        <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">সম্পন্ন</div>
          </div>
        </Card>
        <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.failed}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">ব্যর্থ</div>
          </div>
        </Card>
        <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.cancelled}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">বাতিল</div>
          </div>
        </Card>
      </div>

      {/* Activities List */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              সাম্প্রতিক কার্যকলাপ ({filteredActivities.length})
            </h3>
            <button
              onClick={refreshActivities}
              disabled={loadingMore}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loadingMore ? 'লোড হচ্ছে...' : 'রিফ্রেশ'}</span>
            </button>
          </div>

          {error ? (
            <div className="text-center py-8">
              <div className="text-red-500 text-4xl mx-auto mb-2">⚠️</div>
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => fetchActivities(1, true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                পুনরায় চেষ্টা করুন
              </button>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <SearchOutline className="text-gray-400 text-4xl mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">কোনো কার্যকলাপ পাওয়া যায়নি</p>
            </div>
          ) : (
            <div>
              <List>
                {filteredActivities.map((activity) => (
                  <List.Item
                    key={activity._id}
                    prefix={getActionIcon(activity.activityType)}
                    description={
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatTimeAgo(activity.createdAt)}</span>
                          {activity.metadata?.ipAddress && (
                            <span>IP: {activity.metadata.ipAddress}</span>
                          )}
                        </div>
                        {activity.metadata?.userAgent && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {activity.metadata.userAgent}
                          </div>
                        )}
                        {activity.amount > 0 && (
                          <div className="text-xs font-medium text-green-600 dark:text-green-400">
                            পরিমাণ: ৳{activity.amount}
                          </div>
                        )}
                      </div>
                    }
                    extra={
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(activity.status)}
                        <Badge
                          content={activity.status === 'completed' ? 'সম্পন্ন' : 
                                  activity.status === 'failed' ? 'ব্যর্থ' : 
                                  activity.status === 'cancelled' ? 'বাতিল' : 'অপেক্ষমাণ'}
                          color={getStatusColor(activity.status)}
                        />
                      </div>
                    }
                    className="!bg-gray-50 dark:!bg-gray-700 !mb-2 !rounded-lg"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {activity.username || `User ${activity.userId}`}
                    </div>
                  </List.Item>
                ))}
              </List>
              
              <InfiniteScroll
                loadMore={loadMore}
                hasMore={hasMore}
                threshold={10}
              >
                {hasMore ? (
                  <div className="text-center py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {loadingMore ? 'লোড হচ্ছে...' : 'আরো দেখতে স্ক্রল করুন'}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-sm text-gray-400 dark:text-gray-500">
                      সব কার্যকলাপ দেখানো হয়েছে
                    </div>
                  </div>
                )}
              </InfiniteScroll>
            </div>
          )}
        </div>
      </Card>

      
    </div>
  )
}
