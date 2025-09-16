'use client'

import { Popup, Toast } from 'antd-mobile'
import { useState } from 'react'

interface User {
  id: string
  username: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'suspend'
  joinDate: string
  lastActive: string
  totalEarnings: number
  totalWithdrawals: number
  referralCount: number
}

interface UserDetailsPopupProps {
  visible: boolean
  user: User | null
  onClose: () => void
  onUserAction?: (userId: string, action: string) => void
}

export default function UserDetailsPopup({
  visible,
  user,
  onClose,
  onUserAction
}: UserDetailsPopupProps) {
  const [isEditingBalance, setIsEditingBalance] = useState(false)
  const [newBalance, setNewBalance] = useState('')
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
      case 'suspend': return 'suspend'
      default: return 'Unknown'
    }
  }

  if (!user) return null

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      onClose={onClose}
      bodyStyle={{
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
      }}
      className="!bg-white dark:!bg-gray-800"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            User Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* User Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-lg">{user.username}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">ID: {user.id}</div>
              </div>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${getUserStatusColor(user.status)}`}>
              {getUserStatusText(user.status)}
            </span>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{user.email}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{user.phone}</span>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Account Information</h4>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Joined:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {new Date(user.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Last Active:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {new Date(user.lastActive).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Statistics</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">৳{user.totalEarnings}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Earnings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">৳{user.totalWithdrawals}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Withdrawals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.referralCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Referrals</div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Actions</h4>
            
            {isEditingBalance ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Balance Amount
                  </label>
                  <input
                    type="number"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    placeholder="Enter new balance"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (newBalance && onUserAction) {
                        onUserAction(user.id, `update-balance:${newBalance}`)
                        setIsEditingBalance(false)
                        setNewBalance('')
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Save Balance
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingBalance(false)
                      setNewBalance('')
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsEditingBalance(true)
                    setNewBalance(user.totalEarnings.toString())
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Balance
                </button>
                
                {user.status !== 'suspend' ? (
                  <button
                    onClick={() => {
                      if (onUserAction) {
                        onUserAction(user.id, 'suspend')
                        onClose()
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Suspend User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (onUserAction) {
                        onUserAction(user.id, 'activate')
                        onClose()
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Activate User
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Popup>
  )
}
