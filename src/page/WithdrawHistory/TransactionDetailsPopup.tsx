import { Toast } from 'antd-mobile'
import { useState, useEffect } from 'react'

// Coin to CoinGecko ID mapping
const COINGECKO_ID_MAP: { [key: string]: string } = {
  btc: 'bitcoin',
  eth: 'ethereum',
  usdt: 'tether',
  bnb: 'binancecoin',
  trx: 'tron',
  sol: 'solana',
  xrp: 'ripple',
  ada: 'cardano',
  doge: 'dogecoin',
  matic: 'matic-network',
}

type CryptoPrices = {
  [coinId: string]: number
}

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

interface TransactionDetailsPopupProps {
  visible: boolean
  onClose: () => void
  transaction: WithdrawTransaction | null
}

export default function TransactionDetailsPopup({
  visible,
  onClose,
  transaction
}: TransactionDetailsPopupProps) {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices>({})
  
  // Fetch crypto prices from CoinGecko API
  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const coinIds = Object.values(COINGECKO_ID_MAP).join(',')
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
        )
        const data = await response.json()
        
        // Convert CoinGecko response to our format
        const prices: CryptoPrices = {}
        Object.entries(COINGECKO_ID_MAP).forEach(([symbol, geckoId]) => {
          if (data[geckoId]?.usd) {
            prices[symbol] = data[geckoId].usd
          }
        })
        
        setCryptoPrices(prices)
      } catch (error) {
        console.error('Failed to fetch crypto prices:', error)
      }
    }
    
    if (visible) {
      fetchCryptoPrices()
      // Refresh prices every 30 seconds while popup is open
      const interval = setInterval(fetchCryptoPrices, 30000)
      return () => clearInterval(interval)
    }
  }, [visible])
  
  // Convert USDT amount to coin amount
  const getCoinAmount = (usdtAmount: number, coinSymbol?: string): string => {
    if (!coinSymbol) {
      return usdtAmount.toFixed(2)
    }
    
    const symbol = coinSymbol.toLowerCase()
    
    // If it's USDT, return as is
    if (symbol === 'usdt') {
      return usdtAmount.toFixed(2)
    }
    
    // Convert USDT to coin amount using price
    const price = cryptoPrices[symbol]
    if (price && price > 0) {
      const coinAmount = usdtAmount / price
      return coinAmount.toFixed(8)
    }
    
    return usdtAmount.toFixed(2)
  }
  
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

  if (!transaction) return null

  return (
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
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Withdrawal Details</h3>
            <div className="w-8" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Amount Section - Compact */}
          <div className="bg-white dark:bg-gray-800 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  -{getCoinAmount(Number(transaction.amount), transaction.currency)} <span className="text-lg text-gray-600 dark:text-gray-400">{transaction.currency}</span>
                </h2>
                {transaction.currency?.toUpperCase() !== 'USDT' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    ≈ ${Number(transaction.amount).toFixed(2)} USDT
                  </p>
                )}
              </div>
              <div className={`px-2.5 py-1 rounded text-xs font-medium capitalize ${
                transaction.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                transaction.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                transaction.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
                {transaction.status}
              </div>
            </div>
          </div>

          {/* Transaction Information - Compact List */}
          <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
            {/* Network */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Network</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{transaction.network}</span>
              </div>
            </div>

            {/* Fee */}
            {transaction.fee && (
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Network Fee</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{transaction.fee} {transaction.currency}</span>
                </div>
              </div>
            )}

            {/* Date & Time */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Date & Time</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(transaction.date)}</span>
              </div>
            </div>

            {/* Address */}
            <div className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Withdrawal Address</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{transaction.address}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(transaction.address, 'Address')}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 flex-shrink-0 mt-5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Transaction ID */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-900 dark:text-white">{transaction.transactionId}</span>
                  <button
                    onClick={() => copyToClipboard(transaction.transactionId, 'Transaction ID')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Transaction Hash */}
            {transaction.txHash && (
              <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Transaction Hash</p>
                    <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{transaction.txHash}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(transaction.txHash!, 'Transaction Hash')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 flex-shrink-0 mt-5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Compact */}
          <div className="mt-4 px-4 pb-4 space-y-2">
            {transaction.txHash && (
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Explorer
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
  )
}
