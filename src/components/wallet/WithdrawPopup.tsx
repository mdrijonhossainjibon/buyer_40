import { useEffect, useMemo, useCallback } from 'react'
import { Popup  } from 'antd-mobile'
import { CloseOutline, DownOutline } from 'antd-mobile-icons'
import { useDispatch, useSelector } from 'react-redux'
 
import {
  setSelectedCoin,
  setSelectedNetwork,
  setWithdrawAddress,
  setWithdrawMemo,
  setWithdrawAmount,
  setPercentageAmount,
  fetchCryptoPricesRequest,
  addRecentAddress,
  deleteRecentAddress,
  selectRecentAddress,
  toggleCoinSelector,
  toggleNetworkSelector,
  toggleRecentAddresses,
  toggleConfirmation,
  toggleProcessing,
  toggleSuccess,
  toggleFailure,
  submitWithdrawRequest,
  resetWithdrawForm,
  Coin,
  Network,
  RecentAddress,
  CryptoWithdrawRequest,
  RootState,
} from 'modules'
//import toast from 'react-hot-toast'

import CoinSelectorPopup from './CoinSelectorPopup'
import NetworkSelectorPopup from './NetworkSelectorPopup'
import WithdrawConfirmationPopup from './WithdrawConfirmationPopup'
import WithdrawProcessingPopup from './WithdrawProcessingPopup'
import WithdrawSuccessPopup from './WithdrawSuccessPopup'
import WithdrawFailurePopup from './WithdrawFailurePopup'
import { fetchCryptoCoinsRequest } from 'modules/cryptoCoins'
import CryptoIcon from 'components/CryptoIcons'

interface WithdrawPopupProps {
  visible: boolean
  onClose: () => void
  loading?: boolean
}
 
// Coin balance mapping - will use Redux state
const COIN_BALANCE_MAP: { [key: string]: keyof WalletBalances } = {
  usdt: 'usdt',
  btc: 'usdt',
  eth: 'usdt',
  bnb: 'usdt',
  trx: 'usdt',
  sol: 'usdt',
  xrp: 'usdt',
  ada: 'usdt',
  doge: 'usdt',
  matic: 'usdt',
}

type WalletBalances = {
  xp: number
  usdt: number
  spin: number
}
 
// Helper functions moved to Redux reducer

export default function WithdrawPopup({ visible, onClose, loading }: WithdrawPopupProps) {
  const dispatch = useDispatch()
  
  // Memoized selectors to prevent unnecessary re-renders
  const user = useSelector((state: RootState) => state.user)
  const withdraw = useSelector((state: RootState) => state.withdraw)
  const cryptoCoins = useSelector((state: RootState) => state.cryptoCoins)
   
  const walletBalances = useMemo(() => user.wallet?.available || { xp: 0, usdt: 0, spin: 0 }, [user.wallet?.available])
  
  // Get all state from Redux
  const {
    selectedCoin,
    selectedNetwork,
    withdrawAddress,
    withdrawMemo,
    withdrawAmount,
    cryptoPrices,
    pricesLoading,
    recentAddresses,
    showCoinSelector,
    showNetworkSelector,
    showRecentAddresses,
    showConfirmation,
    showProcessing,
    showSuccess,
    showFailure,
    isSubmitting,
    error,
  } = withdraw



  const handleProcessingClose = useCallback(() => {
    dispatch(toggleProcessing(false))
  }, [dispatch])
  

 
  
  
  // Fetch crypto coins from Redux on component mount
  useEffect(() => {
    dispatch(fetchCryptoCoinsRequest())
  }, [ dispatch ])
  
  // Recent addresses are loaded from localStorage in Redux reducer on init
  
  // Fetch crypto prices from Redux saga
  useEffect(() => {
    if (visible) {
      dispatch(fetchCryptoPricesRequest())
    }
  }, [visible, dispatch])
  
  // Set default coin and network when coins are loaded
  useEffect(() => {
    if (cryptoCoins.coins.length > 0 && !selectedCoin) {
      const defaultCoin = cryptoCoins.coins[0]
      dispatch(setSelectedCoin(defaultCoin))
      const defaultNetwork = defaultCoin.networks.find((n: Network) => n.isDefault) || defaultCoin.networks[0]
      dispatch(setSelectedNetwork(defaultNetwork))
    }
  }, [cryptoCoins.coins, selectedCoin, dispatch])
  
  // Show error toast if crypto coins fetch fails
  useEffect(() => {
    if (cryptoCoins.error) {
      //toast.error(cryptoCoins.error)
    }
  }, [cryptoCoins.error])
  
  // Get balance for selected coin from Redux (in USDT) - Memoized
  const getBalance = useCallback((coinId: string): string => {
    const balanceKey = COIN_BALANCE_MAP[coinId]
    if (balanceKey && walletBalances) {
      return walletBalances[balanceKey].toFixed(2)
    }
    return '0.00'
  }, [walletBalances])
  
  // Get balance in coin's native amount (converted from USDT) - Memoized
  const getBalanceInCoin = useCallback((coinId: string): string => {
    const usdtBalance = parseFloat(getBalance(coinId))
    const coinSymbol = coinId.toLowerCase()
    
    // If it's USDT, return as is
    if (coinSymbol === 'usdt') {
      return usdtBalance.toFixed(2)
    }
    
    // Convert USDT to coin amount using price
    const price = cryptoPrices[coinSymbol]
    if (price && price > 0) {
      const coinAmount = usdtBalance / price
      return coinAmount.toFixed(8)
    }
    
    return '0.00000000'
  }, [getBalance, cryptoPrices])
  
  // Get USDT value of amount in selected coin - Memoized
  const getUSDTValue = useCallback((coinAmount: string, coinSymbol: string): string => {
    const amount = parseFloat(coinAmount) || 0
    const symbol = coinSymbol.toLowerCase()
    
    if (symbol === 'usdt') {
      return amount.toFixed(2)
    }
    
    const price = cryptoPrices[symbol]
    if (price && price > 0) {
      const usdtValue = amount * price
      return usdtValue.toFixed(2)
    }
    
    return '0.00'
  }, [cryptoPrices])

  // Get filtered recent addresses - Memoized
  const filteredRecentAddresses = useMemo(() => {
    if (!selectedCoin || !selectedNetwork) return []
    return recentAddresses
      .filter(
        (addr : any) => addr.coinSymbol === selectedCoin.symbol && addr.network === selectedNetwork.name
      )
      .sort((a : any, b : any) => b.lastUsed - a.lastUsed) // Sort by most recently used
  }, [selectedCoin, selectedNetwork, recentAddresses])
  
  // Handle selecting a recent address - Memoized
  const handleSelectRecentAddress = useCallback((address: RecentAddress) => {
    dispatch(selectRecentAddress(address))
  }, [dispatch])
  
  // Handle deleting a recent address - Memoized
  const handleDeleteRecentAddress = useCallback((addressId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(deleteRecentAddress(addressId))
    ////toast.success('Address removed from history')
  }, [dispatch])

  // Set amount by percentage - Memoized
  const handleSetPercentageAmount = useCallback((percentage: number) => {
    if (!selectedCoin) return
    const balance = parseFloat(getBalanceInCoin(selectedCoin.id))
    dispatch(setPercentageAmount(percentage, balance))
  }, [selectedCoin, getBalanceInCoin, dispatch])

  // Update selected network when coin changes
  useEffect(() => {
    if (selectedCoin) {
      const defaultNetwork = selectedCoin.networks.find((n: Network) => n.isDefault) || selectedCoin.networks[0]
      dispatch(setSelectedNetwork(defaultNetwork))
    }
  }, [selectedCoin, dispatch])

  

  const handleCoinSelect = useCallback((coin: Coin) => {
    dispatch(setSelectedCoin(coin))
    dispatch(toggleCoinSelector(false))
  }, [dispatch])

  const handleNetworkSelect = useCallback((network: Network) => {
    dispatch(setSelectedNetwork(network))
    dispatch(toggleNetworkSelector(false))
  }, [dispatch])

  const calculateReceiveAmount = useCallback(() => {
    if (!selectedNetwork) return '0.00000000'
    const amount = parseFloat(withdrawAmount) || 0
    const fee = parseFloat(selectedNetwork.fee) || 0
    const receive = amount - fee
    return receive > 0 ? receive.toFixed(8) : '0.00000000'
  }, [selectedNetwork, withdrawAmount])

  const handleWithdraw = useCallback(() => {
    // Validation
    if (!selectedCoin || !selectedNetwork) {
      //toast.error('Please select a coin and network')
      return
    }
    if (!withdrawAddress) {
      //toast.error(`Please enter withdrawal address`)
      return
    }
    if (!withdrawAmount) {
      //toast.error('Please enter withdrawal amount')
      return
    }
    const amount = parseFloat(withdrawAmount)
    const minWithdraw = parseFloat(selectedNetwork.minDeposit) // Using minDeposit as minimum withdrawal
    const usdtValue = parseFloat(getUSDTValue(withdrawAmount, selectedCoin.symbol))
    const usdtBalance = parseFloat(getBalance(selectedCoin.id))

    if (amount < minWithdraw) {
      //toast.error(`Minimum withdrawal is ${selectedNetwork.minDeposit} ${selectedCoin.symbol}`)
      return
    }
    if (usdtValue > usdtBalance) {
      //toast.error('Insufficient balance')
      return
    }
    if (selectedNetwork.requiresMemo && !withdrawMemo) {
      //toast.error('Memo/Tag is required for this network')
      return
    }

    // Show confirmation popup
    dispatch(toggleConfirmation(true))
  }, [selectedCoin, selectedNetwork, withdrawAddress, withdrawAmount, withdrawMemo, getUSDTValue, getBalance, dispatch])

  const handleConfirmWithdraw = useCallback(() => {
    
    if (!selectedCoin || !selectedNetwork) {
      //toast.error('User not found or invalid selection')
      return
    }

    // Save address to recent addresses
    dispatch(addRecentAddress({
      address: withdrawAddress,
      label: `${selectedCoin.symbol} Address`,
      network: selectedNetwork.name,
      coinSymbol: selectedCoin.symbol
    }))

    // Dispatch Redux action to submit crypto withdrawal
    const usdtValue = parseFloat(getUSDTValue(withdrawAmount, selectedCoin.symbol))
    const cryptoWithdrawData: CryptoWithdrawRequest = {
      coinSymbol: selectedCoin.symbol,
      network: selectedNetwork.name,
      walletAddress: withdrawAddress,
      amount: usdtValue,
      memo: withdrawMemo || undefined
    }
    dispatch(submitWithdrawRequest(cryptoWithdrawData))
    
 
  }, [selectedCoin, selectedNetwork, withdrawAddress, withdrawAmount, getUSDTValue, dispatch])

  const handleRetryWithdraw = useCallback(() => {
    // Close failure popup and reopen confirmation
    dispatch(toggleFailure(false))
    dispatch(toggleConfirmation(true))
  }, [dispatch])

  const handleSuccessClose = useCallback(() => {
    // Close success popup and reset form
    dispatch(resetWithdrawForm())
    onClose()
  }, [onClose, dispatch])

  const handleFailureClose = useCallback(() => {
    // Close failure popup
    dispatch(toggleFailure(false))
  }, [dispatch])

  // Show loading state
  if ((cryptoCoins.isLoading && cryptoCoins.coins.length === 0) || pricesLoading) {
    return (
      <Popup
        visible={visible}
        onMaskClick={onClose}
        bodyStyle={{
          height: '100vh',
          overflow: 'hidden',
          padding: 0,
        }}
      >
        <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 mx-auto mb-4 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400">Loading crypto coins...</p>
          </div>
        </div>
      </Popup>
    )
  }

  // Show error state if no coins loaded
  if (!selectedCoin || !selectedNetwork) {
    return (
      <Popup
        visible={visible}
        onMaskClick={onClose}
        bodyStyle={{

          height: '100vh',
          overflow: 'hidden',
          padding: 0,
        }}
      >
        <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="text-center p-4">
            <p className="text-red-600 dark:text-red-400 mb-4">No crypto coins available</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </Popup>
    )
  }

  return (
    <>
      <Popup
        visible={visible}
        onMaskClick={onClose}
        bodyStyle={{
         
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
                  onClick={() => dispatch(toggleCoinSelector(true))}
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                  <CryptoIcon symbol={selectedCoin.symbol}  />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedCoin.symbol}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Balance: {getBalanceInCoin(selectedCoin.id)} {selectedCoin.symbol}
                        {selectedCoin.symbol.toUpperCase() !== 'USDT' && (
                          <span className="ml-1">≈ ${getBalance(selectedCoin.id)} USDT</span>
                        )}
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
                  onClick={() => dispatch(toggleNetworkSelector(true))}
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
                  {filteredRecentAddresses.length > 0 && (
                    <button
                      onClick={() => dispatch(toggleRecentAddresses(!showRecentAddresses))}
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
                      onChange={(e) => dispatch(setWithdrawAddress(e.target.value))}
                      placeholder={`Enter ${selectedCoin.symbol} address`}
                      className="w-full bg-gray-50 dark:bg-gray-800 rounded px-3 py-2.5 pr-10 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                    />
                    {withdrawAddress && (
                      <button
                        onClick={() => dispatch(setWithdrawAddress(''))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Recent Addresses Dropdown */}
                  {showRecentAddresses && filteredRecentAddresses.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Recent Addresses</span>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {filteredRecentAddresses.map((addr: RecentAddress) => (
                          <div
                            key={addr.id}
                            className="relative group"
                          >
                            <button
                              onClick={() => handleSelectRecentAddress(addr)}
                              className="w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-200 dark:border-gray-700 last:border-0"
                            >
                              <div className="flex items-start justify-between gap-2 pr-8">
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
                            <button
                              onClick={(e) => handleDeleteRecentAddress(addr.id, e)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                              title="Delete address"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
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
                      onChange={(e) => dispatch(setWithdrawMemo(e.target.value))}
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
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => dispatch(setWithdrawAmount(e.target.value))}
                        placeholder="0.00"
                        className="w-full bg-gray-50 dark:bg-gray-800 rounded px-3 py-2.5 pr-20 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                          {selectedCoin.symbol}
                        </span>
                        
                         <CryptoIcon symbol={selectedCoin.symbol}  className="w-5 h-5 rounded-full"    />
                      </div>
                    </div>
                    {withdrawAmount && selectedCoin.symbol.toUpperCase() !== 'USDT' && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
                        ≈ ${getUSDTValue(withdrawAmount, selectedCoin.symbol)} USDT
                      </div>
                    )}
                  </div>

                  {/* Percentage Quick Select Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 75, 100].map((percentage) => (
                      <button
                        key={percentage}
                        onClick={() => handleSetPercentageAmount(percentage)}
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
                    <div className="text-right">
                      <div className="text-xs font-semibold text-gray-900 dark:text-white">
                        {getBalanceInCoin(selectedCoin.id)} {selectedCoin.symbol}
                      </div>
                      {selectedCoin.symbol.toUpperCase() !== 'USDT' && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ≈ ${getBalance(selectedCoin.id)} USDT
                        </div>
                      )}
                    </div>
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
                  disabled={isSubmitting || !withdrawAddress || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
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
        onClose={() => dispatch(toggleCoinSelector(false))}
        coins={cryptoCoins.coins}
        selectedCoin={selectedCoin}
        onSelect={handleCoinSelect}
      />

      {/* Network Selection Popup */}
      <NetworkSelectorPopup
        visible={showNetworkSelector}
        onClose={() => dispatch(toggleNetworkSelector(false))}
        networks={selectedCoin.networks}
        selectedNetwork={selectedNetwork}
        onSelect={handleNetworkSelect}
        coinSymbol={selectedCoin.symbol}
      />

      {/* Confirmation Popup */}
      <WithdrawConfirmationPopup
        visible={showConfirmation}
        onClose={() => dispatch(toggleConfirmation(false))}
        onConfirm={handleConfirmWithdraw}
        loading={isSubmitting}
        selectedCoin={selectedCoin}
        selectedNetwork={selectedNetwork}
        withdrawAddress={withdrawAddress}
        withdrawMemo={withdrawMemo}
        withdrawAmount={withdrawAmount}
        calculateReceiveAmount={calculateReceiveAmount}
      />

      {/* Processing Popup */}
      <WithdrawProcessingPopup visible={showProcessing} onClose={handleProcessingClose}  />

      {/* Success Popup */}
       <WithdrawSuccessPopup visible={showSuccess} onClose={handleSuccessClose} />
     

      {/* Failure Popup */}
      <WithdrawFailurePopup
        visible={showFailure}
        onClose={handleFailureClose}
        onRetry={handleRetryWithdraw}
        
      />
    </>
  )
}
