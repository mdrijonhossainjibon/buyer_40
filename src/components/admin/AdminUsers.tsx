'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Button, Skeleton, Toast, PullToRefresh } from 'antd-mobile'
import { 
  SearchOutline,
  EyeOutline,
  MoreOutline,
  TeamOutline
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

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6 p-6">
      {/* Search and Filter */}
      <Card className="!bg-white dark:!bg-gray-800">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <SearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'inactive', label: 'Inactive' },
              { key: 'suspend', label: 'Suspend' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => dispatch(setUserFilter(filter.key as UserFilter))}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  userFilter === filter.key
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="!bg-white dark:!bg-gray-800">
                <Skeleton.Title animated style={{ width: '60%' }} />
                <Skeleton.Paragraph lineCount={3} animated />
              </Card>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="!bg-white dark:!bg-gray-800">
            <div className="text-center py-8">
              <TeamOutline className="mx-auto mb-4 text-gray-400" style={{ fontSize: '48px' }} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try changing your search or filter criteria.</p>
            </div>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="!bg-white dark:!bg-gray-800 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleUserClick(user)}>
              <div className="space-y-4">
                {/* User Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{user.username}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">ID: {user.id}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${getUserStatusColor(user.status)}`}>
                    {getUserStatusText(user.status)}
                  </span>
                </div>

                {/* User Details */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">৳{user.totalEarnings}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">৳{user.totalWithdrawals}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Withdrawals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{user.referralCount}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Referrals</div>
                  </div>
                  
                  
                  
                </div>
              </div>
            </Card>
          ))
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
