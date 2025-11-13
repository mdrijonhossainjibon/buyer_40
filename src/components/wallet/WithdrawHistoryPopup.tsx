import { Popup, PullToRefresh } from 'antd-mobile'
import { useState, useEffect } from 'react'
import TransactionDetailsPopup from './TransactionDetailsPopup'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'modules'
import { toggleWithdrawHistoryPopup } from 'modules/ui'
 
 
 
 

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

export default function WithdrawHistoryPopup() {
  const dispatch = useDispatch()
  const ui = useSelector((state: RootState) => state.ui)
  const user = useSelector((state: RootState) => state.user)
  const withdrawHistory = useSelector((state: RootState) => state.withdrawHistory)

  const { showWithdrawHistoryPopup } = ui
  const { transactions, isLoading } = withdrawHistory

  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
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
      } finally {
        
      }
    }
    
    if (showWithdrawHistoryPopup) {
      fetchCryptoPrices()
      // Refresh prices every 30 seconds while popup is open
      const interval = setInterval(fetchCryptoPrices, 30000)
      return () => clearInterval(interval)
    }
  }, [showWithdrawHistoryPopup])

  // Pull to refresh handler
  const onRefresh = async () => {
 
  }

  // Stop refreshing when loading completes
  useEffect(() => {
    if (!isLoading && isRefreshing) {
      setIsRefreshing(false)
    }
  }, [isLoading, isRefreshing])

 

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    //toast.success(`${label} copied!`)
  }
  
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
  
  // Format amount display with coin and USDT
  const formatAmount = (amount: number, currency?: string) => {
    if (!amount || isNaN(amount)) {
      return (
        <div className="text-right">
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            -0.00 {currency?.toUpperCase() || 'USDT'}
          </div>
        </div>
      )
    }
    
    const coinAmount = getCoinAmount(amount, currency)
    const isUSDT = !currency || currency.toUpperCase() === 'USDT'
    
    return (
      <div className="text-right">
        <div className="text-sm font-bold text-gray-900 dark:text-white">
          -{coinAmount} {currency?.toUpperCase() || 'USDT'}
        </div>
        {!isUSDT && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            ≈ ${amount.toFixed(2)} USDT
          </div>
        )}
      </div>
    )
  }

  const filteredTransactions = filterStatus === 'all' ? transactions : transactions.filter(t => t.status === filterStatus)

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction)
    setShowDetails(true)
  }

  const closeDetails = () => {
    setShowDetails(false)
    setTimeout(() => setSelectedTransaction(null), 300)
  }

  const Close = () => dispatch(toggleWithdrawHistoryPopup(false))

  return (
    <>
      <Popup
        visible={showWithdrawHistoryPopup}
        onMaskClick={Close}
        bodyStyle={{
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
          {/* Compact Header - Binance Style */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={Close}
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${filterStatus === filter.value
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content with Pull to Refresh */}
          <div className="flex-1 overflow-y-auto">
            <PullToRefresh onRefresh={onRefresh} >
              <div className="bg-gray-50 dark:bg-gray-900">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-yellow-400 animate-spin mb-4"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading withdrawal history...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
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
              <div className="divide-y divide-gray-200 dark:divide-gray-700 ">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    onClick={() => handleTransactionClick(transaction)}
                    className="bg-white dark:bg-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer active:bg-gray-100 dark:active:bg-gray-700"
                  >
                    {/* Main Content Row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Status Icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          transaction.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                          transaction.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          transaction.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                          'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          <svg className={`w-5 h-5 ${
                            transaction.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                            transaction.status === 'processing' ? 'text-blue-600 dark:text-blue-400' :
                            transaction.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {transaction.status === 'completed' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            ) : transaction.status === 'processing' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : transaction.status === 'pending' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            )}
                          </svg>
                        </div>
                        
                        {/* Transaction Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            Withdraw {transaction.currency?.toUpperCase() || 'USDT'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {formatDate(transaction.date)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Amount & Status */}
                      <div className="text-right ml-3">
                        {formatAmount(Number(transaction.amount), transaction.currency)}
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

                    {/* Network & Fee Row */}
                    <div className="flex items-center justify-between text-xs pl-[52px]">
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 dark:text-gray-500">Network:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{transaction.network}</span>
                        </div>
                        {transaction.fee && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500 dark:text-gray-500">Fee:</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">{transaction.fee}</span>
                          </div>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
              </div>
            </PullToRefresh>
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
