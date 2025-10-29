import { useState, useEffect, useRef } from 'react'
import { Popup, Toast } from 'antd-mobile'
import { CloseOutline, DownOutline } from 'antd-mobile-icons'

import CoinSelectorPopup from './CoinSelectorPopup'
import NetworkSelectorPopup from './NetworkSelectorPopup'
import WithdrawConfirmationPopup from './WithdrawConfirmationPopup'
import WithdrawProcessingPopup from './WithdrawProcessingPopup'
import WithdrawSuccessPopup from './WithdrawSuccessPopup'
import WithdrawFailurePopup from './WithdrawFailurePopup'

interface WithdrawPopupProps {
  visible: boolean
  onClose: () => void
  loading?: boolean
}

type Network = {
  id: string
  name: string
  isDefault: boolean
  minDeposit: string
  confirmations: number
  fee: string
  requiresMemo?: boolean
}

type Coin = {
  id: string
  name: string
  symbol: string
  icon: string
  networks: Network[]
}

// Separate balance tracking
type CoinBalance = {
  [coinId: string]: string
}

// Recent address type
type RecentAddress = {
  id: string
  address: string
  label: string
  network: string
  coinSymbol: string
  lastUsed: number
}

// Helper function to get crypto icon path
const getCryptoIcon = (symbol: string): string => {
  return `/svg/color/${symbol.toLowerCase()}.svg`
}

// Mock data - replace with actual API call in production
const CRYPTO_COINS: Coin[] = [
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    icon: getCryptoIcon('USDT'),
    networks: [
      {
        id: 'bep20-mainnet',
        name: 'BEP20 (BSC Mainnet)',
        isDefault: true,
        minDeposit: '10',
        confirmations: 15,
        fee: '1',
      },
      {
        id: 'erc20-mainnet',
        name: 'ERC20 (Ethereum)',
        isDefault: false,
        minDeposit: '50',
        confirmations: 12,
        fee: '15',
      },
      {
        id: 'trc20-mainnet',
        name: 'TRC20 (TRON)',
        isDefault: false,
        minDeposit: '10',
        confirmations: 15,
        fee: '1',
        requiresMemo: true,
      },
    ],
  },
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: getCryptoIcon('BTC'),
    networks: [
      {
        id: 'btc-mainnet',
        name: 'Bitcoin (Mainnet)',
        isDefault: true,
        minDeposit: '0.001',
        confirmations: 1,
        fee: '0.0005',
      },
    ],
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: getCryptoIcon('ETH'),
    networks: [
      {
        id: 'eth-mainnet',
        name: 'Ethereum (Mainnet)',
        isDefault: true,
        minDeposit: '0.01',
        confirmations: 12,
        fee: '0.005',
      },
    ],
  },
]

// Mock balances - replace with actual API call in production
const COIN_BALANCES: CoinBalance = {
  usdt: '1000.00',
  btc: '0.5',
  eth: '2.5',
}

// Mock recent addresses - replace with actual API call in production
const RECENT_ADDRESSES: RecentAddress[] = [
  {
    id: '1',
    address: 'TN3W4H6rK2ce4vX9YnFxx6HZwME96ERSUz',
    label: 'My Binance Wallet',
    network: 'TRC20 (TRON)',
    coinSymbol: 'USDT',
    lastUsed: Date.now() - 86400000, // 1 day ago
  },
  {
    id: '2',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    label: 'Trust Wallet',
    network: 'BEP20 (BSC Mainnet)',
    coinSymbol: 'USDT',
    lastUsed: Date.now() - 172800000, // 2 days ago
  },
]

export default function WithdrawPopup({ visible, onClose, loading }: WithdrawPopupProps) {
  const [selectedCoin, setSelectedCoin] = useState<Coin>(CRYPTO_COINS[0])
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(CRYPTO_COINS[0].networks[0])
  const [showCoinSelector, setShowCoinSelector] = useState(false)
  const [showNetworkSelector, setShowNetworkSelector] = useState(false)
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [withdrawMemo, setWithdrawMemo] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
 
  const [showRecentAddresses, setShowRecentAddresses] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showProcessing, setShowProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showFailure, setShowFailure] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [wsConnected, setWsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Get balance for selected coin
  const getBalance = (coinId: string): string => {
    return COIN_BALANCES[coinId] || '0.00'
  }

  // Get filtered recent addresses
  const getRecentAddresses = (): RecentAddress[] => {
    return RECENT_ADDRESSES.filter(
      addr => addr.coinSymbol === selectedCoin.symbol && addr.network === selectedNetwork.name
    )
  }

  // Set amount by percentage
  const setPercentageAmount = (percentage: number) => {
    const balance = parseFloat(getBalance(selectedCoin.id))
    const amount = (balance * percentage / 100).toFixed(8)
    setWithdrawAmount(amount)
  }

  // Update selected network when coin changes
  useEffect(() => {
    const defaultNetwork = selectedCoin.networks.find(n => n.isDefault) || selectedCoin.networks[0]
    setSelectedNetwork(defaultNetwork)
  }, [selectedCoin])

  // WebSocket connection management
  useEffect(() => {
    // Only connect WebSocket when processing popup is visible
    if (!showProcessing) return

    const connectWebSocket = () => {
      try {
        // Replace with your actual WebSocket URL
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws/withdraw'
        const ws = new WebSocket(wsUrl)
        wsRef.current = ws

        ws.onopen = () => {
          console.log('WebSocket connected')
          setWsConnected(true)
          Toast.show({ content: 'Connected to withdrawal service', position: 'top', duration: 1000 })
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            console.log('WebSocket message received:', data)

            switch (data.type) {
              case 'WITHDRAWAL_INITIATED':
                // Withdrawal request received by server
                console.log('Withdrawal initiated:', data.transactionId)
                break

              case 'WITHDRAWAL_PROCESSING':
                // Withdrawal is being processed
                console.log('Withdrawal processing:', data.status)
                break

              case 'WITHDRAWAL_SUCCESS':
                // Withdrawal completed successfully
                setTransactionId(data.transactionId)
                setShowProcessing(false)
                setShowSuccess(true)
                Toast.show({ content: 'Withdrawal completed successfully!', position: 'top' })
                break

              case 'WITHDRAWAL_FAILED':
                // Withdrawal failed
                setErrorMessage(data.error || 'Withdrawal failed. Please try again.')
                setShowProcessing(false)
                setShowFailure(true)
                Toast.show({ content: data.error || 'Withdrawal failed', position: 'top' })
                break

              case 'WITHDRAWAL_PENDING':
                // Withdrawal is pending (e.g., waiting for blockchain confirmation)
                console.log('Withdrawal pending:', data.confirmations)
                break

              default:
                console.log('Unknown message type:', data.type)
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          setWsConnected(false)
        }

        ws.onclose = () => {
          console.log('WebSocket disconnected')
          setWsConnected(false)
          wsRef.current = null

          // Attempt to reconnect after 3 seconds if processing is still active
          if (showProcessing) {
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log('Attempting to reconnect WebSocket...')
              connectWebSocket()
            }, 3000)
          }
        }
      } catch (error) {
        console.error('Error creating WebSocket connection:', error)
        setWsConnected(false)
      }
    }

    connectWebSocket()

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      setWsConnected(false)
    }
  }, [showProcessing])
 

  const handleCoinSelect = (coin: Coin) => {
    setSelectedCoin(coin)
    setShowCoinSelector(false)
  }

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network)
    setShowNetworkSelector(false)
  }

  const calculateReceiveAmount = () => {
    const amount = parseFloat(withdrawAmount) || 0
    const fee = parseFloat(selectedNetwork.fee) || 0
    const receive = amount - fee
    return receive > 0 ? receive.toFixed(8) : '0.00000000'
  }

  const handleWithdraw = () => {
    // Validation
    if (!withdrawAddress) {
      Toast.show({ content: 'Please enter withdrawal address', position: 'top' })
      return
    }
    if (!withdrawAmount) {
      Toast.show({ content: 'Please enter withdrawal amount', position: 'top' })
      return
    }
    const amount = parseFloat(withdrawAmount)
    const minWithdraw = parseFloat(selectedNetwork.minDeposit) // Using minDeposit as minimum withdrawal
    const balance = parseFloat(getBalance(selectedCoin.id))

    if (amount < minWithdraw) {
      Toast.show({ content: `Minimum withdrawal is ${selectedNetwork.minDeposit} ${selectedCoin.symbol}`, position: 'top' })
      return
    }
    if (amount > balance) {
      Toast.show({ content: 'Insufficient balance', position: 'top' })
      return
    }
    if (selectedNetwork.requiresMemo && !withdrawMemo) {
      Toast.show({ content: 'Memo/Tag is required for this network', position: 'top' })
      return
    }

    // Show confirmation popup
    setShowConfirmation(true)
  }

  const handleConfirmWithdraw = async () => {
    // Close confirmation and show processing
    setShowConfirmation(false)
    setShowProcessing(true)

    try {
      // Make API call to initiate withdrawal
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coinId: selectedCoin.id,
          coinSymbol: selectedCoin.symbol,
          network: selectedNetwork.id,
          networkName: selectedNetwork.name,
          address: withdrawAddress,
          memo: withdrawMemo || undefined,
          amount: withdrawAmount,
          fee: selectedNetwork.fee,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate withdrawal')
      }

      // Send withdrawal request through WebSocket for real-time updates
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'INITIATE_WITHDRAWAL',
          data: {
            withdrawalId: data.withdrawalId,
            coinId: selectedCoin.id,
            coinSymbol: selectedCoin.symbol,
            network: selectedNetwork.id,
            address: withdrawAddress,
            amount: withdrawAmount,
          },
        }))
      } else {
        // Fallback: If WebSocket is not connected, use polling or show error
        console.warn('WebSocket not connected, using fallback method')
        
        // Simulate processing delay for fallback
        await new Promise((resolve) => setTimeout(resolve, 4000))
        
        if (data.success) {
          setTransactionId(data.transactionId || 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase())
          setShowProcessing(false)
          setShowSuccess(true)
        } else {
          throw new Error(data.message || 'Withdrawal failed')
        }
      }

      // Note: Success/failure will be handled by WebSocket messages
      // The processing popup will remain visible until WebSocket confirms status
      
    } catch (error: any) {
      // Show failure popup
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.')
      setShowProcessing(false)
      setShowFailure(true)
      
      // Close WebSocket connection on error
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }

  const handleRetryWithdraw = () => {
    // Close failure popup and reopen confirmation
    setShowFailure(false)
    setShowConfirmation(true)
  }

  const handleSuccessClose = () => {
    // Close success popup and reset form
    setShowSuccess(false)
    setWithdrawAddress('')
    setWithdrawMemo('')
    setWithdrawAmount('')
    onClose()
  }

  const handleFailureClose = () => {
    // Close failure popup
    setShowFailure(false)
  }

  return (
    <>
      <Popup
        visible={visible}
        onMaskClick={onClose}
        bodyStyle={{
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          height: '100vh',
          overflow: 'hidden',
          padding: 0,
        }}
      >
        <div className="h-full flex flex-col bg-white dark:bg-gray-900">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-4 border-b border-blue-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Withdraw Crypto</h2>
                  <p className="text-xs text-blue-100">Send crypto to external wallet</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
              >
                <CloseOutline fontSize={20} className="text-white" />
              </button>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl -z-10"></div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="space-y-5 p-4 pb-40">
              {/* Binance-Style Coin Selection */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Coin
                  </span>
                </div>
                <div 
                  onClick={() => setShowCoinSelector(true)}
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedCoin.icon} 
                      alt={selectedCoin.name} 
                      className="w-7 h-7 rounded-full"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedCoin.symbol}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Balance: {getBalance(selectedCoin.id)} {selectedCoin.symbol}
                      </span>
                    </div>
                  </div>
                  <DownOutline className="text-gray-400" />
                </div>
              </div>

              {/* Binance-Style Network Selection */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Network
                  </span>
                </div>
                <div 
                  onClick={() => setShowNetworkSelector(true)}
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedNetwork.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Fee: {selectedNetwork.fee} {selectedCoin.symbol}
                    </span>
                  </div>
                  <DownOutline className="text-gray-400" />
                </div>
              </div>

              {/* Withdrawal Address */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Withdrawal Address
                  </span>
                  {getRecentAddresses().length > 0 && (
                    <button
                      onClick={() => setShowRecentAddresses(!showRecentAddresses)}
                      className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Address Book
                    </button>
                  )}
                </div>
                <div className="p-3 space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      placeholder={`Enter ${selectedCoin.symbol} address`}
                      className="w-full bg-gray-50 dark:bg-gray-800 rounded px-3 py-2.5 pr-10 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                    />
                    {withdrawAddress && (
                      <button
                        onClick={() => setWithdrawAddress('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Recent Addresses Dropdown */}
                  {showRecentAddresses && getRecentAddresses().length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Recent Addresses</span>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {getRecentAddresses().map((addr) => (
                          <button
                            key={addr.id}
                            onClick={() => {
                              setWithdrawAddress(addr.address)
                              setShowRecentAddresses(false)
                            }}
                            className="w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-200 dark:border-gray-700 last:border-0"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                                  {addr.label}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
                                  {addr.address}
                                </div>
                              </div>
                              <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Address Validation Warning */}
                  {withdrawAddress && withdrawAddress.length < 20 && (
                    <div className="flex items-start gap-2 text-xs text-orange-600 dark:text-orange-400">
                      <span className="mt-0.5">⚠️</span>
                      <span>Please verify the address is correct</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Memo/Tag - Conditionally Rendered */}
              {selectedNetwork.requiresMemo && (
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Memo/Tag (Required)
                    </span>
                  </div>
                  <div className="p-3">
                    <input
                      type="text"
                      value={withdrawMemo}
                      onChange={(e) => setWithdrawMemo(e.target.value)}
                      placeholder="Enter memo/tag"
                      className="w-full bg-gray-50 dark:bg-gray-800 rounded px-3 py-2.5 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                    />
                    <div className="mt-2 flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                      <span className="mt-0.5">⚠️</span>
                      <span className="font-medium">
                        Important: You must include this memo/tag. Withdrawals without the correct memo will be lost.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Withdrawal Amount */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Withdrawal Amount
                  </span>
                </div>
                <div className="p-3 space-y-3">
                  {/* Amount Input with Currency Badge */}
                  <div className="relative">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-gray-50 dark:bg-gray-800 rounded px-3 py-2.5 pr-20 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {selectedCoin.symbol}
                      </span>
                      <img src={selectedCoin.icon} alt={selectedCoin.symbol} className="w-5 h-5 rounded-full" />
                    </div>
                  </div>

                  {/* Percentage Quick Select Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 75, 100].map((percentage) => (
                      <button
                        key={percentage}
                        onClick={() => setPercentageAmount(percentage)}
                        className="py-2 px-3 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-500 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold rounded border border-gray-200 dark:border-gray-700 transition-all"
                      >
                        {percentage}%
                      </button>
                    ))}
                  </div>

                  {/* Balance Info */}
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Available Balance</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {getBalance(selectedCoin.id)} {selectedCoin.symbol}
                    </span>
                  </div>

                  {/* Min/Max Info */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <span>Minimum:</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {selectedNetwork.minDeposit} {selectedCoin.symbol}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <span>Fee:</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {selectedNetwork.fee} {selectedCoin.symbol}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
 

              {/* Withdraw Button */}
              <div className="pb-6 sticky bottom-0 bg-white dark:bg-gray-900 pt-4 -mx-4 px-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleWithdraw}
                  disabled={loading || !withdrawAddress || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing Withdrawal...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Confirm Withdrawal</span>
                    </>
                  )}
                </button>
                
                {/* Quick Stats Below Button */}
                <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Fast Processing</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Popup>

      {/* Coin Selection Popup */}
      <CoinSelectorPopup
        visible={showCoinSelector}
        onClose={() => setShowCoinSelector(false)}
        coins={CRYPTO_COINS}
        selectedCoin={selectedCoin}
        onSelect={handleCoinSelect}
      />

      {/* Network Selection Popup */}
      <NetworkSelectorPopup
        visible={showNetworkSelector}
        onClose={() => setShowNetworkSelector(false)}
        networks={selectedCoin.networks}
        selectedNetwork={selectedNetwork}
        onSelect={handleNetworkSelect}
        coinSymbol={selectedCoin.symbol}
      />

      {/* Confirmation Popup */}
      <WithdrawConfirmationPopup
        visible={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmWithdraw}
        loading={loading}
        selectedCoin={selectedCoin}
        selectedNetwork={selectedNetwork}
        withdrawAddress={withdrawAddress}
        withdrawMemo={withdrawMemo}
        withdrawAmount={withdrawAmount}
        calculateReceiveAmount={calculateReceiveAmount}
      />

      {/* Processing Popup */}
      <WithdrawProcessingPopup
        visible={showProcessing}
      />

      {/* Success Popup */}
      <WithdrawSuccessPopup
        visible={showSuccess}
        onClose={handleSuccessClose}
        amount={withdrawAmount}
        currency={selectedCoin.symbol}
        network={selectedNetwork.name}
        address={withdrawAddress}
        transactionId={transactionId}
      />

      {/* Failure Popup */}
      <WithdrawFailurePopup
        visible={showFailure}
        onClose={handleFailureClose}
        onRetry={handleRetryWithdraw}
        errorMessage={errorMessage}
        amount={withdrawAmount}
        currency={selectedCoin.symbol}
      />
    </>
  )
}
