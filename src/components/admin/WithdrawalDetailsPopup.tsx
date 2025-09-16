'use client'

import { Popup } from 'antd-mobile'
import { CheckCircleOutline, CloseCircleOutline } from 'antd-mobile-icons'

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

interface WithdrawalDetailsPopupProps {
  visible: boolean
  withdrawal: WithdrawalRequest | null
  onClose: () => void
  onWithdrawalAction: (withdrawalId: string, action: 'approve' | 'reject', note?: string) => void
}

export default function WithdrawalDetailsPopup({
  visible,
  withdrawal,
  onClose,
  onWithdrawalAction
}: WithdrawalDetailsPopupProps) {
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

  if (!withdrawal) return null

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
            Withdrawal Details
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
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">User:</span>
              <div className="font-medium text-gray-900 dark:text-white">{withdrawal.username}</div>
              <div className="text-xs text-gray-500">ID: {withdrawal.userId}</div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Amount:</span>
              <div className="font-medium text-gray-900 dark:text-white">৳{withdrawal.amount}</div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Method:</span>
              <div className="font-medium text-gray-900 dark:text-white">{withdrawal.method}</div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Account Number:</span>
              <div className="font-medium text-gray-900 dark:text-white">{withdrawal.accountNumber}</div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <div className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(withdrawal.status)}`}>
                {getStatusText(withdrawal.status)}
              </div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Request Time:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {new Date(withdrawal.requestTime).toLocaleString('en-US')}
              </div>
            </div>
            {withdrawal.processedTime && (
              <div className="col-span-2">
                <span className="text-gray-600 dark:text-gray-400">Processed Time:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {new Date(withdrawal.processedTime).toLocaleString('en-US')}
                </div>
              </div>
            )}
            {withdrawal.adminNote && (
              <div className="col-span-2">
                <span className="text-gray-600 dark:text-gray-400">Admin Note:</span>
                <div className="font-medium text-gray-900 dark:text-white">{withdrawal.adminNote}</div>
              </div>
            )}
          </div>

          {withdrawal.status === 'pending' && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  onWithdrawalAction(withdrawal.id, 'approve')
                  onClose()
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircleOutline />
                Approve
              </button>
              <button
                onClick={() => {
                  const note = prompt('Enter rejection reason (optional):')
                  onWithdrawalAction(withdrawal.id, 'reject', note || undefined)
                  onClose()
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <CloseCircleOutline />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </Popup>
  )
}
