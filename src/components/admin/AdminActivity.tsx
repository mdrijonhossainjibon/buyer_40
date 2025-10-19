'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Toast, List, SpinLoading, PullToRefresh, Skeleton, SearchBar } from 'antd-mobile'
import {
  SearchOutline,
  FilterOutline,
  CheckCircleOutline,
  ClockCircleOutline,
  CloseCircleOutline
} from 'antd-mobile-icons'
import ActivityDetailPopup from './ActivityDetailPopup'
import { RootState } from '@/store'
import {
  setSearchQuery,
  setStatusFilter,
  setTypeFilter,
  setSelectedActivity,
  fetchActivitiesRequest,
  loadMoreActivitiesRequest,
  updateActivityStatusRequest,
  clearError
} from '@/store/modules/activities/actions'
import { ActivityData } from '@/lib/api/activities'

export default function AdminActivity() {
  const dispatch = useDispatch()
  const {
    activities,
    selectedActivity,
    searchQuery,
    statusFilter,
    typeFilter,
    pagination,
    stats,
    isLoading,
    isLoadingMore,
    error
  } = useSelector((state: RootState) => state.activities)

  const isModalVisible = selectedActivity !== null

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

 

  // Activity history is already filtered by the API
  const filteredActivityHistory = activities

  // Load activities from Redux
  const loadActivities = (showToast = false) => {
    dispatch(fetchActivitiesRequest(showToast))
  }

  // Load activities on component mount and when filters change
  useEffect(() => {
    loadActivities()
  }, [searchQuery, statusFilter, typeFilter])

 

  const handleItemClick = (activity: ActivityData) => {
    dispatch(setSelectedActivity(activity))
  }

  const handleCloseModal = () => {
    dispatch(setSelectedActivity(null))
  }

  const handleAction = (action: string, activity: ActivityData) => {
    if (action === 'view_user') {
      Toast.show({
        content: `Viewing user ${activity.userId}`,
        position: 'center'
      })
      return
    }

    if (action === 'update_status') {
      // This would be implemented based on your requirements
      // dispatch(updateActivityStatusRequest(activity._id, newStatus))
    }

    // Close modal after action
    handleCloseModal()
  }

  const handleLoadMore = () => {
    if (!isLoading && !isLoadingMore && pagination.hasMore) {
      dispatch(loadMoreActivitiesRequest())
    }
  }

  const handleRefresh = async () => {
    loadActivities(true)
  }

  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockCircleOutline className="text-yellow-500" />
      case 'completed': return <CheckCircleOutline className="text-green-500" />
      case 'failed':
      case 'cancelled': return <CloseCircleOutline className="text-red-500" />
      default: return <ClockCircleOutline className="text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'failed':
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'completed': return 'Completed'
      case 'failed': return 'Failed'
      case 'cancelled': return 'Cancelled'
      default: return 'Unknown'
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header with Statistics */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Activity Management
            </h1>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <Card className="!p-3 !bg-blue-50 dark:!bg-blue-900/20 !border-blue-200 dark:!border-blue-800">
                <div className="text-center">
                  {isLoading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {stats?.total || activities.length}
                    </div>
                  )}
                  <div className="text-xs text-blue-600 dark:text-blue-400">Total Activities</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-yellow-50 dark:!bg-yellow-900/20 !border-yellow-200 dark:!border-yellow-800">
                <div className="text-center">
                  {isLoading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {stats?.pending || activities.filter(a => a.status === 'pending').length}
                    </div>
                  )}
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">Pending</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-green-50 dark:!bg-green-900/20 !border-green-200 dark:!border-green-800">
                <div className="text-center">
                  {isLoading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {stats?.completed || activities.filter(a => a.status === 'completed').length}
                    </div>
                  )}
                  <div className="text-xs text-green-600 dark:text-green-400">Completed</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-red-50 dark:!bg-red-900/20 !border-red-200 dark:!border-red-800">
                <div className="text-center">
                  {isLoading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">
                      {stats?.failed || activities.filter(a => a.status === 'failed' || a.status === 'cancelled').length}
                    </div>
                  )}
                  <div className="text-xs text-red-600 dark:text-red-400">Failed</div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <SearchBar
              placeholder="Search by username, user ID, or description..."
              value={searchQuery}
              onChange={(value) => dispatch(setSearchQuery(value))}
              showCancelButton
              style={{
                '--border-radius': '8px',
                '--background': 'var(--adm-color-fill-content)',
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading && activities.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="!bg-white dark:!bg-gray-800">
                  <Skeleton.Title animated style={{ width: '60%' }} />
                  <Skeleton.Paragraph lineCount={3} animated />
                </Card>
              ))}
            </div>
          ) : filteredActivityHistory.length === 0 ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center">
                <SearchOutline className="text-6xl text-gray-300 dark:text-gray-600 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No activities found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your search terms or filters'
                    : 'No activities available'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredActivityHistory.map((activity) => (
                <Card
                  key={activity._id}
                  className="!bg-white dark:!bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleItemClick(activity)}
                >
                  <div className="flex items-center space-x-4 p-2">
                    {/* Activity Icon */}
                    <div className="flex-shrink-0">
                      {getStatusIcon(activity.status)}
                    </div>
                    
                    {/* Activity Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate">
                        {activity.description}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        User: {activity.user?.username || `ID: ${activity.userId}`}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 truncate">
                        {activity.activityType.replace('_', ' ')} • {formatDate(activity.createdAt)}
                      </div>
                    </div>
                    
                    {/* Amount */}
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(activity.amount)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {formatTimestamp(new Date(activity.createdAt))}
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)}`}>
                        {getStatusText(activity.status)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
              
              {/* Load More Button */}
              {pagination.hasMore && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore ? (
                      <>
                        <SpinLoading style={{ '--size': '16px' }} className="mr-2" />
                        Loading...
                      </>
                    ) : (
                      'Load More Activities'
                    )}
                  </button>
                </div>
              )}
            </div>
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
