'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Skeleton, PullToRefresh, SearchBar, Empty } from 'antd-mobile'
import { 
  SearchOutline,
  EyeOutline,
  MoreOutline,
  TeamOutline,
  UserOutline
} from 'antd-mobile-icons'
import UserDetailsPopup from './UserDetailsPopup'
import { RootState } from '@/store'
import {
  fetchUsersRequest,
  setSearchQuery,
  setUserFilter,
  setSelectedUser,
  setShowDetailsPopup,
  updateUserStatusRequest,
  updateUserBalanceRequest,
  clearError,
  User,
  UserFilter
} from '@/store/modules/adminUsers'

export default function AdminUsers() {
  const dispatch = useDispatch()
  const {
    users,
    isLoading,
    isUpdating,
    searchQuery,
    userFilter,
    selectedUser,
    showDetailsPopup,
    error
  } = useSelector((state: RootState) => state.adminUsers)

  const handleRefresh = async () => {
    dispatch(fetchUsersRequest({ showToast: true }))
  }

  useEffect(() => {
    dispatch(fetchUsersRequest())
  }, [dispatch])

  // Clear error on unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError())
      }
    }
  }, [dispatch, error])

  const handleUserClick = (user: User) => {
    dispatch(setSelectedUser(user))
    dispatch(setShowDetailsPopup(true))
  }

  const handleUserAction = (userId: string, action: string) => {
    if (action.startsWith('update-balance:')) {
      const newBalance = parseFloat(action.split(':')[1])
      dispatch(updateUserBalanceRequest(userId, newBalance))
    } else {
      const newStatus = action === 'suspend' ? 'suspend' : 'active'
      dispatch(updateUserStatusRequest(userId, newStatus as 'active' | 'suspend'))
    }
  }

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'inactive': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400'
      case 'suspend': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getUserStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'inactive': return 'Inactive'
      case 'suspend': return 'Suspend'
      default: return 'Unknown'
    }
  }

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchQuery?.toLowerCase())  
                         
    const matchesFilter = userFilter === 'all' || user.status === userFilter
    return matchesSearch && matchesFilter
  })

  // Calculate statistics
  const totalUsers = users?.length || 0
  const activeUsers = users?.filter(u => u.status === 'active').length || 0
  const inactiveUsers = users?.filter(u => u.status === 'inactive').length || 0
  const suspendedUsers = users?.filter(u => u.status === 'suspend').length || 0

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
              User Management
            </h1>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <Card className="!p-3 !bg-blue-50 dark:!bg-blue-900/20 !border-blue-200 dark:!border-blue-800">
                <div className="text-center">
                  {isLoading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {totalUsers}
                    </div>
                  )}
                  <div className="text-xs text-blue-600 dark:text-blue-400">Total Users</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-green-50 dark:!bg-green-900/20 !border-green-200 dark:!border-green-800">
                <div className="text-center">
                  {isLoading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {activeUsers}
                    </div>
                  )}
                  <div className="text-xs text-green-600 dark:text-green-400">Active</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-gray-50 dark:!bg-gray-900/20 !border-gray-200 dark:!border-gray-800">
                <div className="text-center">
                  {isLoading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
                      {inactiveUsers}
                    </div>
                  )}
                  <div className="text-xs text-gray-600 dark:text-gray-400">Inactive</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-red-50 dark:!bg-red-900/20 !border-red-200 dark:!border-red-800">
                <div className="text-center">
                  {isLoading ? (
                    <Skeleton.Title animated style={{ width: '60%' }} />
                  ) : (
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">
                      {suspendedUsers}
                    </div>
                  )}
                  <div className="text-xs text-red-600 dark:text-red-400">Suspended</div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="p-4 space-y-3">
            {/* Search Bar */}
            <SearchBar
              placeholder="Search by username, ID, or email..."
              value={searchQuery}
              onChange={(value) => dispatch(setSearchQuery(value))}
              showCancelButton
              style={{
                '--border-radius': '8px',
                '--background': 'var(--adm-color-fill-content)',
              }}
            />

            {/* Filter Buttons */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              {[
                { key: 'all', label: 'All Users' },
                { key: 'active', label: 'Active' },
                { key: 'inactive', label: 'Inactive' },
                { key: 'suspend', label: 'Suspended' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => dispatch(setUserFilter(filter.key as UserFilter))}
                  className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-colors duration-200 ${
                    userFilter === filter.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="!bg-white dark:!bg-gray-800">
                  <Skeleton.Title animated style={{ width: '60%' }} />
                  <Skeleton.Paragraph lineCount={3} animated />
                </Card>
              ))}
            </div>
          ) : filteredUsers?.length === 0 ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Empty 
                description="No users found"
                imageStyle={{ height: 60 }}
              />
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers?.map((user) => (
                <Card
                  key={user.id}
                  className="!bg-white dark:!bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex items-center space-x-4 p-2">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {user.username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate">
                        {user.username}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        ID: {user.id}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 truncate">
                        {user.email && `${user.email} • `}Joined {formatDate( new Date().toISOString())}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(user.totalEarnings || 0)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {user.referralCount || 0} referrals
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getUserStatusColor(user.status)}`}>
                        {getUserStatusText(user.status)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <UserDetailsPopup
          visible={showDetailsPopup}
          user={selectedUser}
          onClose={() => dispatch(setShowDetailsPopup(false))}
          onUserAction={handleUserAction}
        />
      </div>
    </PullToRefresh>
  )
}
