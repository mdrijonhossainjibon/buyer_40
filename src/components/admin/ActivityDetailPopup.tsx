'use client'

import { Popup } from 'antd-mobile'
import { ActivityData } from '@/lib/api/activities'

interface ActivityDetailPopupProps {
  visible: boolean
  activity: ActivityData | null
  onClose: () => void
  onAction?: (action: string, activity: ActivityData) => void
}

export default function ActivityDetailPopup({
  visible,
  activity,
  onClose,
  onAction
}: ActivityDetailPopupProps) {
  if (!activity) return null

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
    }
  }

  const formatMetadataKey = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^\w/, c => c.toUpperCase())
  }

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, activity)
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

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        minHeight: '50vh',
        maxHeight: '90vh',
        backgroundColor: 'var(--adm-color-background)',
      }}
    >
      <div className="p-4 bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Activity Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Activity Summary Card */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {activity.description}
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {activity.activityType.replace('_', ' ')}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(activity.status)}`}>
              {activity.status}
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(activity.amount)}
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Activity ID</span>
              <span className="text-sm font-mono text-gray-900 dark:text-white">{activity._id}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">User ID</span>
              <span className="text-sm font-mono text-gray-900 dark:text-white">{activity.userId}</span>
            </div>
            
            {activity.user?.username && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Username</span>
                <span className="text-sm text-gray-900 dark:text-white">{activity.user.username}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Activity Type</span>
              <span className="text-sm capitalize text-gray-900 dark:text-white">{activity.activityType.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="space-y-4">
          <h4 className="text-base font-semibold text-gray-900 dark:text-white">
            Timeline
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Created</span>
              <span className="text-sm text-gray-900 dark:text-white">
                {new Date(activity.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Updated</span>
              <span className="text-sm text-gray-900 dark:text-white">
                {new Date(activity.updatedAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            {activity.completedAt && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(activity.completedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Details Section */}
        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white">
              Additional Details
            </h4>
            
            <div className="space-y-2">
              {Object.entries(activity.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {formatMetadataKey(key)}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white font-mono">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => handleAction('view_user')}
            className="flex-1 px-4 py-3 border border-blue-200 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-lg transition-colors duration-200"
          >
            View User
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>

      </div>
    </Popup>
  )
}
