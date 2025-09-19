'use client'

import { Card, Skeleton, List , PullToRefresh , Empty } from 'antd-mobile'
import { useState, useEffect } from 'react'
import WithdrawalDetailsPopup from './WithdrawalDetailsPopup'

interface WithdrawalRequest {
  id: string
  userId: string
  username: string
  amount: number
  method: string
  accountNumber: string
  status: 'pending' | 'approved' | 'rejected'
  requestTime: string
  processedTime?: string
  adminNote?: string
}

 
export default function AdminWithdrawals() {
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null)
  const [showDetailsPopup, setShowDetailsPopup] = useState(false)
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
  const [loading, setLoading] = useState(true)

  // Generate signature function
  const generateSignature = (action: string, secretKey: string) => {
    const timestamp = Date.now().toString()
    const nonce = Math.random().toString(36).substring(2, 15)
    const hash = btoa(`${action}-${timestamp}-${nonce}`)
    const signature = btoa(`${hash}-${secretKey}`)
    
    return {
      timestamp,
      nonce,
      signature,
      hash
    }
  }

  // Fetch withdrawals
  const fetchWithdrawals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'list-withdrawals',
          ...generateSignature('admin', process.env.NEXT_PUBLIC_SECRET_KEY || 'app')
        })
      })

      const data = await response.json()
      if (data.success) {
        setWithdrawals(data.data.withdrawals || [])
      } else {
        console.error('Failed to fetch withdrawals:', data.message)
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle withdrawal action
  const onWithdrawalAction = async (withdrawalId: string, action: 'approve' | 'reject', note?: string) => {
    try {
      const response = await fetch('/api/admin/withdrawal-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          withdrawalId,
          action,
          adminNote: note,
          ...generateSignature('admin', process.env.NEXT_PUBLIC_SECRET_KEY || 'app')
        })
      })

      const data = await response.json()
      if (data.success) {
        // Refresh withdrawals list
        fetchWithdrawals()
      } else {
        console.error('Failed to process withdrawal:', data.message)
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error)
    }
  }

  useEffect(() => {
    fetchWithdrawals()
  }, [])
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'approved': return 'Approved'
      case 'rejected': return 'Rejected'
      default: return 'Unknown'
    }
  }

  const handleWithdrawalClick = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal)
    setShowDetailsPopup(true)
  }

  return (
    <PullToRefresh onRefresh={fetchWithdrawals}>
      <div className="space-y-4 p-6">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="!bg-white dark:!bg-gray-800">
                <Skeleton.Title animated style={{ width: '60%' }} />
                <Skeleton.Paragraph lineCount={3} animated />
              </Card>
            ))}
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Empty 
              description="No withdrawal requests found"
              imageStyle={{ height: 60 }}
            />
          </div>
        ) : (
          <List className="!bg-transparent">
            {withdrawals.map((withdrawal) => (
            <List.Item
              key={withdrawal.id}
              className="!bg-white dark:!bg-gray-800 !mb-3 !rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleWithdrawalClick(withdrawal)}
              extra={
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(withdrawal.status)}`}>
                  {getStatusText(withdrawal.status)}
                </span>
              }
            >
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{withdrawal.username}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">ID: {withdrawal.userId}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">৳{withdrawal.amount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Method:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{withdrawal.method}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">Account:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{withdrawal.accountNumber}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">Time:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {new Date(withdrawal.requestTime).toLocaleString('en-US')}
                    </span>
                  </div>
                </div>
  
              </div>
            </List.Item>
          ))}
        </List>
        )}

      <WithdrawalDetailsPopup
        visible={showDetailsPopup}
        withdrawal={selectedWithdrawal}
        onClose={() => setShowDetailsPopup(false)}
        onWithdrawalAction={onWithdrawalAction}
      />
      </div>
    </PullToRefresh>
  )
}
