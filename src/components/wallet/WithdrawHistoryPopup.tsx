import { Popup, Toast } from 'antd-mobile'
import { useState } from 'react'
import TransactionDetailsPopup from './TransactionDetailsPopup'

interface WithdrawTransaction {
  id: string
  amount: string
  currency: string
  network: string
  address: string
  status: 'completed' | 'pending' | 'failed' | 'processing'
  date: string
  transactionId: string
  fee?: string
  txHash?: string
}

interface WithdrawHistoryPopupProps {
  visible: boolean
  onClose: () => void
}

export default function WithdrawHistoryPopup({
  visible,
  onClose
}: WithdrawHistoryPopupProps) {
  // Mock data - replace with actual data from Redux/API
  const [transactions] = useState<WithdrawTransaction[]>([
    {
      id: '1',
      amount: '50.00',
      currency: 'USDT',
      network: 'TRC20 (TRON)',
      address: 'TXn4B7kJ9mP2qR8sT3vW5xY6zA1bC4dE7f',
      status: 'completed',
      date: new Date(Date.now() - 86400000).toISOString(),
      transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      fee: '1.00',
      txHash: '0x' + Math.random().toString(16).substr(2, 64)
    },
    {
      id: '2',
      amount: '100.00',
      currency: 'USDT',
      network: 'BEP20 (BSC)',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      status: 'completed',
      date: new Date(Date.now() - 3600000).toISOString(),
      transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      fee: '0.50'
    },
    {
      id: '3',
      amount: '25.00',
      currency: 'USDT',
      network: 'TRC20 (TRON)',
      address: 'TXn4B7kJ9mP2qR8sT3vW5xY6zA1bC4dE7f',
      status: 'completed',
      date: new Date(Date.now() - 172800000).toISOString(),
      transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      fee: '1.00',
      txHash: '0x' + Math.random().toString(16).substr(2, 64)
    },
    {
      id: '4',
      amount: '75.00',
      currency: 'USDT',
      network: 'ERC20 (Ethereum)',
      address: '0x8A2b3C4d5E6f7A8B9C0D1E2F3A4B5C6D7E8F9A0B',
      status: 'failed',
      date: new Date(Date.now() - 259200000).toISOString(),
      transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      fee: '15.00'
    }
  ])

  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedTransaction, setSelectedTransaction] = useState<WithdrawTransaction | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'processing':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'failed':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'processing':
        return (
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'failed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    Toast.show({
      content: `${label} copied!`,
      position: 'top',
      duration: 2000
    })
  }

  const filteredTransactions = filterStatus === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filterStatus)

  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'completed').length,
    processing: transactions.filter(t => t.status === 'processing').length,
    failed: transactions.filter(t => t.status === 'failed').length
  }

  const handleTransactionClick = (transaction: WithdrawTransaction) => {
    setSelectedTransaction(transaction)
    setShowDetails(true)
  }

  const closeDetails = () => {
    setShowDetails(false)
    setTimeout(() => setSelectedTransaction(null), 300)
  }

  return (
    <>
      <Popup
        visible={visible}
        onMaskClick={onClose}
        bodyStyle={{
          height: '100vh',
        }}
      >
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
          {/* Compact Header - Binance Style */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Withdrawal History</h3>
              <div className="w-8" />
            </div>
          </div>

       
          {/* Filter Tabs - Binance Style */}
          <div className="bg-white dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {[
                { value: 'all', label: 'All' },
                { value: 'completed', label: 'Completed' },
                { value: 'processing', label: 'Processing' },
                { value: 'pending', label: 'Pending' },
                { value: 'failed', label: 'Failed' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterStatus(filter.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    filterStatus === filter.value
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  No Transactions
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filterStatus === 'all' ? 'Your withdrawal history will appear here' : `No ${filterStatus} withdrawals`}
                </p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    onClick={() => handleTransactionClick(transaction)}
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 hover:shadow-md dark:hover:bg-gray-750 transition-all cursor-pointer active:scale-[0.98] border border-gray-100 dark:border-gray-700"
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {/* Status Icon Circle */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                          transaction.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          transaction.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                          'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          <svg className={`w-4 h-4 ${
                            transaction.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                            transaction.status === 'processing' ? 'text-blue-600 dark:text-blue-400' :
                            transaction.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {transaction.status === 'completed' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : transaction.status === 'processing' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : transaction.status === 'pending' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            )}
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            Withdraw {transaction.currency}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {formatDate(transaction.date)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          -{transaction.amount}
                        </div>
                        <div className={`text-xs font-medium capitalize mt-0.5 ${
                          transaction.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                          transaction.status === 'processing' ? 'text-blue-600 dark:text-blue-400' :
                          transaction.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.status}
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Network:</span>
                          <span className="ml-1 text-gray-900 dark:text-white font-medium">{transaction.network}</span>
                        </div>
                        {transaction.fee && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Fee:</span>
                            <span className="ml-1 text-gray-900 dark:text-white font-medium">{transaction.fee}</span>
                          </div>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Popup>

    <Popup
      visible={showDetails}
      onMaskClick={closeDetails}
      bodyStyle={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <TransactionDetailsPopup
        visible={showDetails}
        onClose={closeDetails}
        transaction={selectedTransaction}
      />
    </Popup>

    
    </>
  )
}
