'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Toast, List, SpinLoading, PullToRefresh } from 'antd-mobile'
import {
  SearchOutline,
  FilterOutline
} from 'antd-mobile-icons'
import ActivityDetailPopup from './ActivityDetailPopup'
import { ActivityAPI, ActivityData } from '@/lib/api/activities'

export default function AdminReports() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [activityHistory, setActivityHistory] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
    totalAmount: 0
  })
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 20,
    hasMore: false
  })

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `${minutes} minutes ago`
    } else if (hours < 24) {
      return `${hours} hours ago`
    } else {
      return `${days} days ago`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#52c41a'
      case 'pending':
        return '#faad14'
      case 'failed':
      case 'cancelled':
        return '#ff4d4f'
      default:
        return '#8c8c8c'
    }
  }

  // Activity history is already filtered by the API
  const filteredActivityHistory = activityHistory

  // Load activities from API
  const loadActivities = async (reset = false) => {
    try {
      setLoading(true)
      const currentOffset = reset ? 0 : pagination.offset

      const response = await ActivityAPI.listActivities({
        search: searchQuery,
        status: statusFilter,
        activityType: typeFilter,
        limit: pagination.limit,
        offset: currentOffset,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })

      if (response.success) {
        if (reset) {
          setActivityHistory(response.data.activities)
          setPagination({
            offset: response.data.activities.length,
            limit: pagination.limit,
            hasMore: response.data.hasMore
          })
        } else {
          setActivityHistory(prev => [...prev, ...response.data.activities])
          setPagination(prev => ({
            ...prev,
            offset: prev.offset + response.data.activities.length,
            hasMore: response.data.hasMore
          }))
        }

        if (response.data.stats) {
          setStats(response.data.stats)
        }
      } else {
        Toast.show({
          content: response.message || 'Failed to load activities',
          position: 'center'
        })
      }
    } catch (error) {
      console.error('Error loading activities:', error)
      Toast.show({
        content: 'Error loading activities',
        position: 'center'
      })
    } finally {
      setLoading(false)
    }
  }

  // Load activities on component mount and when filters change
  useEffect(() => {
    loadActivities(true)
  }, [searchQuery, statusFilter, typeFilter])

  const handleItemClick = (activity: ActivityData) => {
    setSelectedActivity(activity)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedActivity(null)
  }

  const handleAction = async (action: string, activity: ActivityData) => {
  
    if(action === 'view_user') {
      Toast.show({
        content: `Viewing user ${activity.userId}`,
        position: 'center'
      })
      return;
    }
    


    // Close modal after action
    handleCloseModal()
  }

  const handleLoadMore = () => {
    if (!loading && pagination.hasMore) {
      loadActivities(false)
    }
  }

  const handleRefresh = async () => {
    try {
      await loadActivities(true)
      Toast.show({
        content: 'Activities refreshed',
        position: 'center',
        duration: 1000
      })
    } catch (error) {
      console.error('Error refreshing activities:', error)
      Toast.show({
        content: 'Failed to refresh activities',
        position: 'center'
      })
    }
  }

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      pullingText="Pull to refresh"
      canReleaseText="Release to refresh"
      refreshingText="Refreshing..."
      completeText="Refresh complete"
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        {/* Header */}
        

            <div className="relative mb-[19px]">
                    <SearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400  " />
                    <input
                      type="text"
                      placeholder="Search by username, user ID"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                    />
           </div>

        {/* Activity List using antd-mobile List */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden">
          {loading && activityHistory.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <SpinLoading style={{ '--size': '32px' }} />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading activities...</span>
            </div>
          ) : (
            <List className="bg-white dark:bg-gray-800">
              {filteredActivityHistory.length > 0 ? (
                <>
                  {filteredActivityHistory.map((item) => (
                    <List.Item
                      key={item._id}
                      className="!bg-white dark:!bg-gray-800 hover:!bg-gray-50 dark:hover:!bg-gray-700 !border-gray-200 dark:!border-gray-700 cursor-pointer"
                      onClick={() => handleItemClick(item)}
                      prefix={
                        <div className={`p-2 rounded-full mr-3 ${item.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                            : item.status === 'pending'
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                              : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                          }`}>
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                        </div>
                      }
                      description={
                        <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                          <div className="flex items-center space-x-4">
                            <span>{formatTimestamp(new Date(item.createdAt))}</span>
                            <span className="text-blue-400">• User: {item.user?.username || `ID: ${item.userId}`}</span>
                            <span className="text-green-400">• ৳{item.amount.toFixed(2)}</span>
                          </div>
                          <div className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                            <span className="capitalize">{item.activityType.replace('_', ' ')}</span> • {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      }
                      extra={
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 border border-green-300 dark:border-green-700'
                            : item.status === 'pending'
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700'
                              : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700'
                          }`}>
                          {item.status}
                        </span>
                      }
                    >
                      <div className="text-gray-900 dark:text-white font-medium text-sm">
                        {item.description}
                      </div>
                    </List.Item>
                  ))}

                  {/* Load More Button */}
                  {pagination.hasMore && (
                    <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={handleLoadMore}
                        loading={loading}
                        color="primary"
                        fill="outline"
                        size="small"
                      >
                        Load More Activities
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <SearchOutline className="text-4xl mb-2 mx-auto" />
                  <p>No activities found</p>
                  <p className="text-sm mt-1">
                    {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                      ? 'Try adjusting your search terms or filters'
                      : 'No activities available'
                    }
                  </p>
                </div>
              )}
            </List>
          )}
        </div>

        {/* Detail Popup */}
        <ActivityDetailPopup
          visible={isModalVisible}
          activity={selectedActivity}
          onClose={handleCloseModal}
          onAction={handleAction}
        />
      </div>
    </PullToRefresh>
  )
}
