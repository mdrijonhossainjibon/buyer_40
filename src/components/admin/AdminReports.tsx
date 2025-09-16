'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Toast, List, SearchBar, Popup } from 'antd-mobile'
import { 
 
  SearchOutline
} from 'antd-mobile-icons'


// Create a plain data interface without Mongoose Document methods
interface ActivityData {
  _id: string
  userId: number
  activityType: 'ad_watch' | 'task_complete' | 'referral' | 'bonus' | 'withdrawal' | 'login'
  description: string
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  metadata?: {
    adId?: string
    taskId?: string
    referralUserId?: number
    withdrawalMethod?: string
    ipAddress?: string
    userAgent?: string
    [key: string]: any
  }
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

 

export default function AdminReports() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [activityHistory, setActivityHistory] = useState<ActivityData[]>([
    {
      _id: '1',
      userId: 1001,
      activityType: 'ad_watch',
      description: 'Watched mobile game advertisement',
     
      amount: 2.50,
      status: 'completed',
      createdAt: new Date('2024-01-16T14:30:00'),
      updatedAt: new Date('2024-01-16T14:30:00'),
      completedAt: new Date('2024-01-16T14:30:00'),
      
      metadata: { adId: 'ad_mobile_game_001', duration: 30 }
    },
    {
      _id: '2',
      userId: 1002,
      activityType: 'withdrawal',
      description: 'PayPal withdrawal request',
      
      amount: 25.00,
      status: 'pending',
      createdAt: new Date('2024-01-16T13:45:00'),
      updatedAt: new Date('2024-01-16T13:45:00'),
 
      metadata: { withdrawalMethod: 'paypal', email: 'bob.smith@yahoo.com' }
    },
    {
      _id: '3',
      userId: 1003,
      activityType: 'task_complete',
      description: 'Completed survey about shopping habits',
      amount: 5.00,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: new Date(),
      
      metadata: { taskId: 'survey_shopping_001', duration: 300 }
    },
    {
      _id: '4',
      userId: 1004,
      activityType: 'referral',
      description: 'Successful referral bonus earned',
   
      amount: 10.00,
      status: 'completed',
      createdAt: new Date('2024-01-16T11:15:00'),
      updatedAt: new Date('2024-01-16T11:15:00'),
      completedAt: new Date('2024-01-16T11:15:00'),
      
      metadata: { referralUserId: 1005 }
    },
    
    {
      _id: '6',
      userId: 1006,
      activityType: 'bonus',
      description: 'Weekly activity bonus',
      amount: 15.00,
      status: 'completed',
      createdAt: new Date('2024-01-16T09:00:00'),
      updatedAt: new Date('2024-01-16T09:00:00'),
      completedAt: new Date('2024-01-16T09:00:00'),
      
      metadata: { bonusType: 'weekly_activity' }
    },
    {
      _id: '7',
      userId: 1007,
      activityType: 'ad_watch',
      description: 'Watched video advertisement',
      amount: 3.00,
      status: 'completed',
      createdAt: new Date('2024-01-16T08:45:00'),
      updatedAt: new Date('2024-01-16T08:45:00'),
      completedAt: new Date('2024-01-16T08:45:00'),
     
      metadata: { adId: 'ad_video_002', duration: 45 }
    },
    {
      _id: '8',
      userId: 1008,
      activityType: 'withdrawal',
      description: 'Bank transfer withdrawal',
      amount: 50.00,
      status: 'failed',
      createdAt: new Date('2024-01-16T07:30:00'),
      updatedAt: new Date('2024-01-16T07:35:00'),
      
      metadata: { withdrawalMethod: 'bank_transfer', errorCode: 'insufficient_balance' }
    } 
  ])

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

  // Filter activity history based on search query
  const filteredActivityHistory = activityHistory.filter(item => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      item.description.toLowerCase().includes(searchTerm) ||
      item.activityType.toLowerCase().includes(searchTerm) ||
      item.status.toLowerCase().includes(searchTerm) ||
      item.userId.toString().includes(searchTerm)
    )
  })

  const handleItemClick = (activity: ActivityData) => {
    setSelectedActivity(activity)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedActivity(null)
  }

  const formatMetadata = (metadata: any) => {
    if (!metadata) return 'No additional data'
    return Object.entries(metadata)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')
  }
 
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4 p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Activity Reports</h2>
        
        {/* Search Bar */}
        <div className="mb-4">
          <SearchBar
            placeholder="Search activities, users, campaigns..."
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            className="!bg-gray-50 dark:!bg-gray-700"
          />
        </div>
        
        {/* Results count */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {searchQuery ? (
            <span>Found {filteredActivityHistory.length} result{filteredActivityHistory.length !== 1 ? 's' : ''} for "{searchQuery}"</span>
          ) : (
            <span>Showing all {activityHistory.length} activities</span>
          )}
        </div>
      </div>
      
      {/* Activity List using antd-mobile List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <List className="bg-white dark:bg-gray-800">
          {filteredActivityHistory.length > 0 ? (
            filteredActivityHistory.map((item) => (
            <List.Item
              key={item._id}
              className="!bg-white dark:!bg-gray-800 hover:!bg-gray-50 dark:hover:!bg-gray-700 !border-gray-200 dark:!border-gray-700 cursor-pointer"
              onClick={() => handleItemClick(item)}
              prefix={
                <div className={`p-2 rounded-full mr-3 ${
                  item.status === 'completed' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                    : item.status === 'pending' 
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                    : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                }`}>
                  
                </div>
              }
              description={
                <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                  <div className="flex items-center space-x-4">
                    <span>{formatTimestamp(item.createdAt)}</span>
                   
                    <span className="text-blue-400">• User ID: {item.userId}</span>
                  </div>
                  <div className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                    <span className="capitalize">{item.activityType.replace('_', ' ')}</span> • {item.createdAt.toLocaleDateString()}
                  </div>
                </div>
              }
              extra={
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'completed' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 border border-green-300 dark:border-green-700'
                    : item.status === 'pending'
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700'
                    : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700'
                }`}>
                  {item.status.toUpperCase()}
                </span>
              }
            >
              <div className="text-gray-900 dark:text-white font-medium text-sm">
                {item.description}
              </div>
            </List.Item>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <SearchOutline className="text-4xl mb-2 mx-auto" />
              <p>No activities found matching "{searchQuery}"</p>
              <p className="text-sm mt-1">Try adjusting your search terms</p>
            </div>
          )}
        </List>
      </div>

      {/* Detail Popup */}
      <Popup
        visible={isModalVisible}
        onMaskClick={handleCloseModal}
        onClose={handleCloseModal}
        bodyStyle={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
      >
        {selectedActivity && (
          <div className="p-4 space-y-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800">
            {/* Header Info */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{selectedActivity.description}</h3>
                <Button 
                  size="mini" 
                  fill="none" 
                  onClick={handleCloseModal}
                  className="!text-gray-500 hover:!text-gray-700"
                >
                  ✕
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedActivity.status === 'completed' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                    : selectedActivity.status === 'pending'
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                    : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                }`}>
                  {selectedActivity.status.toUpperCase()}
                </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  ${selectedActivity.amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Activity ID
                </label>
                <p className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  {selectedActivity._id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  User ID
                </label>
                <p className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  {selectedActivity.userId}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Activity Type
                </label>
                <p className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded capitalize">
                  {selectedActivity.activityType.replace('_', ' ')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Amount
                </label>
                <p className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded font-semibold">
                  ${selectedActivity.amount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Created At
                </label>
                <p className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  {selectedActivity.createdAt.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Updated At
                </label>
                <p className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  {selectedActivity.updatedAt.toLocaleString()}
                </p>
              </div>
              {selectedActivity.completedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Completed At
                  </label>
                  <p className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    {selectedActivity.completedAt.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Metadata */}
            {selectedActivity.metadata && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Additional Information
                </label>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded space-y-2">
                  {Object.entries(selectedActivity.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleCloseModal}
                className="flex-1"
                color="primary"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Popup>
    </div>
  )
}
