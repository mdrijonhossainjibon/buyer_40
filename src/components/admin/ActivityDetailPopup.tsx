'use client'

import { Popup, Button } from 'antd-mobile'
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

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      onClose={onClose}
      bodyStyle={{

        maxHeight: '100vh',
        overflow: 'auto'
      }}
    >
      <div className="p-6 space-y-6 text-gray-900 dark:text-white bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {activity.description}
            </h3>
            <Button
              size="mini"
              fill="none"
              onClick={onClose}
              className="!text-gray-400 hover:!text-gray-600 dark:hover:!text-gray-300 !p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusStyle(activity.status)}`}>
              {activity.status}
            </span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {activity.amount.toFixed(2)} BDT
            </span>
          </div>
        </div>

        {/* Basic Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
              Activity ID
            </label>
            <div className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg font-mono">
              {activity._id}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
              User ID
            </label>
            <div className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg font-mono">
              {activity.userId}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
              Activity Type
            </label>
            <div className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg capitalize font-medium">
              {activity.activityType.replace('_', ' ')}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
              Amount
            </label>
            <div className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg font-bold text-green-600 dark:text-green-400">
              {activity.amount.toFixed(2)} BDT
            </div>
          </div>
        </div>

        {/* Timestamps Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Timeline
          </h4>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Created At
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Last Updated
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(activity.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {activity.completedAt && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Completed At
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(activity.completedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Section */}
        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Additional Details
            </h4>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
              {Object.entries(activity.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatMetadataKey(key)}:
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={() => handleAction('view_user')}
            fill="outline"
            color="primary"
            className="w-full"
          >
            View User
          </Button>

          <Button
            onClick={onClose}
            fill="outline"
            className="w-full"
          >
            Close
          </Button>
        </div>

      </div>
    </Popup>
  )
}
