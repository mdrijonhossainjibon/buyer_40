'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RightOutline } from 'antd-mobile-icons'
 
 
import {
  setFromCurrency,
  setToCurrency,
  setFromAmount,
  setToAmount,
  swapCurrencies,
  fetchRatesRequest,
  convertRequest,
  setShowSuccessPopup,
  setShowFailurePopup,
  CurrencyType,
  RootState
} from 'modules'
import ProcessingPopup from 'components/converter/ProcessingPopup'
import CurrencySelectionPopup from 'components/converter/CurrencySelectionPopup'
import ConfirmationPopup from 'components/converter/ConfirmationPopup'
import SuccessPopup from 'components/converter/SuccessPopup'
import FailurePopup from 'components/converter/FailurePopup'
 


export default function CoinConverterPage() {
  const dispatch = useDispatch()

  // Redux state
  const converter = useSelector((state: RootState) => state.converter)
  const user = useSelector((state: RootState) => state.user)

  const {
    rates,
    selectedFromCurrency,
    selectedToCurrency,
    fromAmount,
    toAmount,
    isConverting,
    error,
    showSuccessPopup,
    showFailurePopup,
    lastConversion
  } = converter

  // User balances from Redux
  const userBalances = {
    xp: user.wallet?.available?.xp || 0,
    usdt: user.wallet?.available?.usdt || 0
  }

  // Local UI state
  const [showFromPopup, setShowFromPopup] = useState(false)
  const [showToPopup, setShowToPopup] = useState(false)
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)

  // Fetch rates on mount
  useEffect(() => {
    dispatch(fetchRatesRequest())
  }, [dispatch])


  // Currency options with labels and icons
  const currencyOptions: { value: CurrencyType; label: string; icon: string; color: string; bgColor: string }[] = [
    { value: 'xp', label: 'XP', icon: '/xp.svg', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
    { value: 'usdt', label: 'USDT', icon: '/usdt.svg', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' }
  ]

  // Get user balance for selected currency
  const getUserBalance = (currency: CurrencyType): number => {
    return userBalances[currency] || 0
  }

  // Format balance with K, M, B suffixes
  const formatBalance = (value: number): string => {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(2) + 'B'
    }
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(2) + 'M'
    }
    if (value >= 1_000) {
      return (value / 1_000).toFixed(2) + 'K'
    }
    return value.toFixed(2)
  }

  // Find conversion rate
  const currentRate = useMemo(() => {
    return rates.find(
      (r) =>
        r.from === selectedFromCurrency &&
        r.to === selectedToCurrency
    )
  }, [rates, selectedFromCurrency, selectedToCurrency])

  // Calculate price impact
  const priceImpact = useMemo(() => {
    if (!currentRate || fromAmount === 0) return 0
    // Simulate price impact based on amount (larger amounts = higher impact)
    // Progressive impact: starts at 0.5% for small amounts, increases exponentially
    const userBalance = getUserBalance(selectedFromCurrency)
    const percentOfBalance = userBalance > 0 ? (fromAmount / userBalance) * 100 : 0
    
    // Base impact from amount size
    const baseImpact = (fromAmount / 1000) * 0.5
    
    // Additional impact based on % of balance being converted
    const balanceImpact = percentOfBalance * 0.15
    
    // Combined impact with exponential scaling for large amounts
    const totalImpact = baseImpact + balanceImpact + (fromAmount / 50000) * 2
    
    return Math.min(totalImpact, 15) // Cap at 15%
  }, [currentRate, fromAmount, selectedFromCurrency, getUserBalance])

  // Calculate converted amount
  const handleFromAmountChange = (value: number) => {
    dispatch(setFromAmount(value))
    if (currentRate) {
      const converted = value * currentRate.rate
      const afterFee = converted - (converted * currentRate.fee) / 100
      dispatch(setToAmount(afterFee))
    }
  }

  // Handle currency selection
  const handleFromCurrencyChange = (currency: CurrencyType) => {
    if (currency === selectedToCurrency) {
      // Swap currencies
      dispatch(swapCurrencies())
    } else {
      dispatch(setFromCurrency(currency))
      handleFromAmountChange(fromAmount)
    }
  }

  const handleToCurrencyChange = (currency: CurrencyType) => {
    if (currency === selectedFromCurrency) {
      // Swap currencies
      dispatch(swapCurrencies())
    } else {
      dispatch(setToCurrency(currency))
      handleFromAmountChange(fromAmount)
    }
  }

  // Handle conversion with confirmation
  const handleConvert = () => {
    if (fromAmount <= 0 || !isValidConversion) {
      return
    }
    setShowConfirmPopup(true)
  }

  const confirmConversion = () => {
    setShowConfirmPopup(false)

    // Dispatch conversion request (saga will handle the API call)
    dispatch(convertRequest(
      user.userId!,
      selectedFromCurrency,
      selectedToCurrency,
      fromAmount
    ))
  }


  // Check if conversion is valid
  const isValidConversion = useMemo(() => {
    if (!currentRate) return false
    if (fromAmount < currentRate.minAmount) return false
    if (currentRate.maxAmount > 0 && fromAmount > currentRate.maxAmount) return false
    const userBalance = getUserBalance(selectedFromCurrency)
    if (fromAmount > userBalance) return false
    return true
  }, [currentRate, fromAmount, selectedFromCurrency, getUserBalance])

  // Get currency color
  // const getCurrencyColor = (currency: CurrencyType) => {
  //   const option = currencyOptions.find((o) => o.value === currency)
  //   return option?.color || 'gray'
  // }

  // Handle success popup close
  const handleSuccessClose = () => {
    dispatch(setShowSuccessPopup(false))
  }

  // Handle failure popup close
  const handleFailureClose = () => {
    dispatch(setShowFailurePopup(false))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
    
      {/* Converter Card */}
      <div className="max-w-lg mx-auto px-4 py-5">
        <div className="space-y-5 pb-32">
          {/* From Currency */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">From</span>
            </div>
            <div className="p-3 space-y-3">
              {/* Currency Selector */}
              <div 
                onClick={() => setShowFromPopup(true)}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all p-3 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={currencyOptions.find(c => c.value === selectedFromCurrency)?.icon} 
                    alt={selectedFromCurrency}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedFromCurrency.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Balance: {formatBalance(getUserBalance(selectedFromCurrency))}
                    </span>
                  </div>
                </div>
                <RightOutline className="text-gray-400" />
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="number"
                    value={fromAmount || ''}
                    onChange={(e) => handleFromAmountChange(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full bg-gray-50 dark:bg-gray-800 rounded px-3 py-2.5 pr-20 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-yellow-500"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {selectedFromCurrency.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Percentage Quick Select Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => handleFromAmountChange(getUserBalance(selectedFromCurrency) * percentage / 100)}
                    className={`py-2 px-3 text-xs font-semibold rounded border transition-all ${
                      percentage === 100
                        ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-yellow-500'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 hover:border-yellow-500 text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={() => {
                dispatch(swapCurrencies())
                handleFromAmountChange(fromAmount)
              }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 flex items-center justify-center shadow-lg active:scale-95 transition-all border-4 border-gray-50 dark:border-gray-950"
            >
              <i className="fas fa-exchange-alt text-lg"></i>
            </button>
          </div>

          {/* To Currency */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">To</span>
            </div>
            <div className="p-3 space-y-3">
              {/* Currency Selector */}
              <div 
                onClick={() => setShowToPopup(true)}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all p-3 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={currencyOptions.find(c => c.value === selectedToCurrency)?.icon} 
                    alt={selectedToCurrency}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedToCurrency.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Balance: {formatBalance(getUserBalance(selectedToCurrency))}
                    </span>
                  </div>
                </div>
                <RightOutline className="text-gray-400" />
              </div>

              {/* Amount Display */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="number"
                    value={toAmount.toFixed(4) || ''}
                    readOnly
                    placeholder="0.00"
                    className="w-full bg-gray-50 dark:bg-gray-800 rounded px-3 py-2.5 pr-20 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {selectedToCurrency.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Info */}
          {currentRate && (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Conversion Details</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Exchange Rate</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    1 {selectedFromCurrency.toUpperCase()} = {currentRate.rate} {selectedToCurrency.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Fee</span>
                  <span className="font-bold text-gray-900 dark:text-white">{currentRate.fee}%</span>
                </div>
                {priceImpact > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Price Impact</span>
                    <span className={`font-bold ${
                      priceImpact > 10 ? 'text-red-600 dark:text-red-400' : 
                      priceImpact > 5 ? 'text-orange-600 dark:text-orange-400' : 
                      priceImpact > 2 ? 'text-yellow-600 dark:text-yellow-400' : 
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {priceImpact > 10 ? '⚠️ ' : priceImpact > 5 ? '⚡ ' : ''}~{priceImpact.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Validation Messages */}
          {!isValidConversion && fromAmount > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-red-200 dark:border-red-800/30 overflow-hidden">
              <div className="p-3 space-y-2">
                {!currentRate && (
                  <div className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                    <span className="mt-0.5">⚠️</span>
                    <span className="font-medium">This conversion pair is not available</span>
                  </div>
                )}
                {currentRate && fromAmount < currentRate.minAmount && (
                  <div className="flex items-start gap-2 text-xs text-yellow-600 dark:text-yellow-400">
                    <span className="mt-0.5">⚠️</span>
                    <span className="font-medium">Minimum amount: {currentRate.minAmount} {selectedFromCurrency.toUpperCase()}</span>
                  </div>
                )}
                {currentRate && currentRate.maxAmount > 0 && fromAmount > currentRate.maxAmount && (
                  <div className="flex items-start gap-2 text-xs text-yellow-600 dark:text-yellow-400">
                    <span className="mt-0.5">⚠️</span>
                    <span className="font-medium">Maximum amount: {currentRate.maxAmount} {selectedFromCurrency.toUpperCase()}</span>
                  </div>
                )}
                {fromAmount > getUserBalance(selectedFromCurrency) && (
                  <div className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                    <span className="mt-0.5">⚠️</span>
                    <span className="font-medium">Insufficient balance</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Convert Button - Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleConvert}
            disabled={!isValidConversion || isConverting}
            className={`w-full py-4 font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              isValidConversion && !isConverting
                ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-gray-900 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            {isConverting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Converting...</span>
              </>
            ) : (
              <>
                <i className="fas fa-exchange-alt"></i>
                <span>Swap Now</span>
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
              <span>Instant Swap</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Best Rates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Currency Selection Popups */}
      <CurrencySelectionPopup
        visible={showFromPopup}
        title="Select Currency"
        options={currencyOptions}
        selectedCurrency={selectedFromCurrency}
        onSelect={handleFromCurrencyChange}
        onClose={() => setShowFromPopup(false)}
        getUserBalance={getUserBalance}
      />

      <CurrencySelectionPopup
        visible={showToPopup}
        title="Select Currency"
        options={currencyOptions}
        selectedCurrency={selectedToCurrency}
        onSelect={handleToCurrencyChange}
        onClose={() => setShowToPopup(false)}
        getUserBalance={getUserBalance}
      />

      {/* Confirmation Popup */}
      <ConfirmationPopup
        visible={showConfirmPopup}
        fromAmount={fromAmount}
        fromCurrency={selectedFromCurrency.toUpperCase()}
        toAmount={toAmount}
        toCurrency={selectedToCurrency.toUpperCase()}
        fee={currentRate?.fee || 0}
        rate={currentRate?.rate || 0}
        onConfirm={confirmConversion}
        onCancel={() => setShowConfirmPopup(false)}
      />

    
      {/* Processing Popup */}
      <ProcessingPopup />

      {/* Success Popup */}
      <SuccessPopup
        visible={showSuccessPopup}
        fromAmount={lastConversion?.fromAmount || 0}
        fromCurrency={lastConversion?.fromCurrency.toUpperCase() || 'XP'}
        toAmount={lastConversion?.toAmount || 0}
        toCurrency={lastConversion?.toCurrency.toUpperCase() || 'USDT'}
        onClose={handleSuccessClose}
      />

      {/* Failure Popup */}
      <FailurePopup
        visible={showFailurePopup}
        errorMessage={error || 'An error occurred'}
        onClose={handleFailureClose}
      />
    </div>
  )
}
