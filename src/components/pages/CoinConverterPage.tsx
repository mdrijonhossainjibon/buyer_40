'use client'

import { useEffect, useState, useMemo } from 'react'
import { Popup } from 'antd-mobile'
import { RightOutline } from 'antd-mobile-icons'
import toast from 'react-hot-toast'
import CurrencySelectionPopup from '@/components/converter/CurrencySelectionPopup'
import ConfirmationPopup from '@/components/converter/ConfirmationPopup'
import DetailsPopup from '@/components/converter/DetailsPopup'
import ProcessingPopup from '@/components/converter/ProcessingPopup'
import SuccessPopup from '@/components/converter/SuccessPopup'
import FailurePopup from '@/components/converter/FailurePopup'
 

// Mock data types
type CurrencyType = 'xp' | 'usdt'  

interface ConversionRate {
  from: CurrencyType
  to: CurrencyType
  rate: number
  minAmount: number
  maxAmount: number
  fee: number
}
 

export default function CoinConverterPage( {onClose}: {onClose: () => void} ) {
  // Mock user balances
  const [userBalances, setUserBalances] = useState({
    xp: 5000,
    usdt: 100,
    tickets: 50,
    balance: 100
  })

  // Mock conversion rates
  const [rates] = useState<ConversionRate[]>([
    { from: 'xp', to: 'usdt', rate: 0.001, minAmount: 100, maxAmount: 10000, fee: 3 },
    { from: 'usdt', to: 'xp', rate: 1000, minAmount: 1, maxAmount: 100, fee: 2 },
  ])

 
  // Converter state
  const [selectedFromCurrency, setSelectedFromCurrency] = useState<CurrencyType>('xp')
  const [selectedToCurrency, setSelectedToCurrency] = useState<CurrencyType>('usdt')
  const [fromAmount, setFromAmount] = useState(0)
  const [toAmount, setToAmount] = useState(0)
  const [isConverting, setIsConverting] = useState(false)

  const [showFromPopup, setShowFromPopup] = useState(false)
  const [showToPopup, setShowToPopup] = useState(false)
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [showDetailsPopup, setShowDetailsPopup] = useState(false)
  const [showProcessingPopup, setShowProcessingPopup] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showFailurePopup, setShowFailurePopup] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // Mock data is already loaded
  }, [])

  // Currency options with labels and icons
  const currencyOptions: { value: CurrencyType; label: string; icon: string; color: string; bgColor: string }[] = [
    { value: 'xp', label: 'XP', icon: '⭐', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
    { value: 'usdt', label: 'USDT', icon: '💵', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' }
  ]

  // Get user balance for selected currency
  const getUserBalance = (currency: CurrencyType): number => {
    return userBalances[currency] || 0
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
    const baseImpact = (fromAmount / 10000) * 0.1
    return Math.min(baseImpact, 5) // Cap at 5%
  }, [currentRate, fromAmount])

  // Calculate converted amount
  const handleFromAmountChange = (value: number) => {
    setFromAmount(value)
    if (currentRate) {
      const converted = value * currentRate.rate
      const afterFee = converted - (converted * currentRate.fee) / 100
      setToAmount(afterFee)
    }
  }

  // Handle currency selection
  const handleFromCurrencyChange = (currency: CurrencyType) => {
    if (currency === selectedToCurrency) {
      // Swap currencies
      const temp = selectedFromCurrency
      setSelectedFromCurrency(selectedToCurrency)
      setSelectedToCurrency(temp)
    } else {
      setSelectedFromCurrency(currency)
      handleFromAmountChange(fromAmount)
    }
  }

  const handleToCurrencyChange = (currency: CurrencyType) => {
    if (currency === selectedFromCurrency) {
      // Swap currencies
      const temp = selectedFromCurrency
      setSelectedFromCurrency(selectedToCurrency)
      setSelectedToCurrency(temp)
    } else {
      setSelectedToCurrency(currency)
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

  const confirmConversion = async () => {
    setIsConverting(true)
    setShowConfirmPopup(false)
    setShowProcessingPopup(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update balances
      setUserBalances(prev => ({
        ...prev,
        [selectedFromCurrency]: prev[selectedFromCurrency] - fromAmount,
        [selectedToCurrency]: prev[selectedToCurrency] + toAmount
      }))

 
  
      // Show success popup
      setShowProcessingPopup(false)
      setShowSuccessPopup(true)

      // Reset form after delay
      setTimeout(() => {
        setFromAmount(0)
        setToAmount(0)
      }, 2000)
    } catch (error) {
      setShowProcessingPopup(false)
      setErrorMessage(error instanceof Error ? error.message : 'Conversion failed. Please try again.')
      setShowFailurePopup(true)
    } finally {
      setIsConverting(false)
    }
  }

  // Check if conversion is valid
  const isValidConversion = useMemo(() => {
    if (!currentRate) return false
    if (fromAmount < currentRate.minAmount) return false
    if (currentRate.maxAmount > 0 && fromAmount > currentRate.maxAmount) return false
    const userBalance = getUserBalance(selectedFromCurrency)
    if (fromAmount > userBalance) return false
    return true
  }, [currentRate, fromAmount, selectedFromCurrency])

  // Get currency color
  const getCurrencyColor = (currency: CurrencyType) => {
    const option = currencyOptions.find((o) => o.value === currency)
    return option?.color || 'gray'
  }

  // Handle success popup close
  const handleSuccessClose = () => {
    setShowSuccessPopup(false)
    setFromAmount(0)
    setToAmount(0)
  }

  // Handle failure popup close
  const handleFailureClose = () => {
    setShowFailurePopup(false)
    setErrorMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* Header */}
      <div className="max-w-lg mx-auto mb-4 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              💱 Swap
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Trade tokens in an instant
            </p>
          </div>
          <button
            onClick={() => setShowDetailsPopup(true)}
            className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all active:scale-95"
          >
            <i className="fas fa-info-circle text-xl"></i>
          </button>
        </div>
      </div>

      {/* Converter Card */}
      <div className="max-w-lg mx-auto mb-6 px-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          {/* From Currency */}
          <div className="mb-3">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Available</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{getUserBalance(selectedFromCurrency).toFixed(2)} {selectedFromCurrency.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <input
                  type="number"
                  value={fromAmount || ''}
                  onChange={(e) => handleFromAmountChange(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="flex-1 bg-transparent text-3xl font-bold text-gray-900 dark:text-white outline-none"
                />
                <button
                  onClick={() => setShowFromPopup(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95 ml-3"
                >
                  <span className="text-xl">{currencyOptions.find(c => c.value === selectedFromCurrency)?.icon}</span>
                  <span className="font-bold text-gray-900 dark:text-white text-base">{selectedFromCurrency.toUpperCase()}</span>
                  <RightOutline fontSize={14} className="text-gray-400" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFromAmountChange(getUserBalance(selectedFromCurrency) * 0.25)}
                  className="flex-1 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold text-sm text-gray-700 dark:text-gray-300 active:scale-95 transition-all"
                >
                  25%
                </button>
                <button
                  onClick={() => handleFromAmountChange(getUserBalance(selectedFromCurrency) * 0.5)}
                  className="flex-1 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold text-sm text-gray-700 dark:text-gray-300 active:scale-95 transition-all"
                >
                  50%
                </button>
                <button
                  onClick={() => handleFromAmountChange(getUserBalance(selectedFromCurrency) * 0.75)}
                  className="flex-1 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold text-sm text-gray-700 dark:text-gray-300 active:scale-95 transition-all"
                >
                  75%
                </button>
                <button
                  onClick={() => handleFromAmountChange(getUserBalance(selectedFromCurrency))}
                  className="flex-1 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-sm active:scale-95 transition-all shadow-sm"
                >
                  MAX
                </button>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-3 relative z-10">
            <button
              onClick={() => {
                const temp = selectedFromCurrency
                setSelectedFromCurrency(selectedToCurrency)
                setSelectedToCurrency(temp)
                handleFromAmountChange(fromAmount)
              }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 flex items-center justify-center shadow-lg active:scale-95 transition-all border-4 border-white dark:border-gray-950"
            >
              <i className="fas fa-exchange-alt text-xl"></i>
            </button>
          </div>

          {/* To Currency */}
          <div className="mb-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Available</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{getUserBalance(selectedToCurrency).toFixed(2)} {selectedToCurrency.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  value={toAmount.toFixed(4) || ''}
                  readOnly
                  placeholder="0"
                  className="flex-1 bg-transparent text-3xl font-bold text-gray-900 dark:text-white outline-none"
                />
                <button
                  onClick={() => setShowToPopup(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95 ml-3"
                >
                  <span className="text-xl">{currencyOptions.find(c => c.value === selectedToCurrency)?.icon}</span>
                  <span className="font-bold text-gray-900 dark:text-white text-base">{selectedToCurrency.toUpperCase()}</span>
                  <RightOutline fontSize={14} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Rate Info */}
          {currentRate && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-600 dark:text-gray-400">Exchange Rate</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  1 {selectedFromCurrency.toUpperCase()} = {currentRate.rate} {selectedToCurrency.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-600 dark:text-gray-400">Fee</span>
                <span className="font-semibold text-gray-900 dark:text-white">{currentRate.fee}%</span>
              </div>
              {priceImpact > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Price Impact</span>
                  <span className={`font-semibold ${priceImpact > 2 ? 'text-red-600' : 'text-yellow-600'}`}>
                    ~{priceImpact.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Validation Messages */}
          {!isValidConversion && fromAmount > 0 && (
            <div className="mb-4">
              {!currentRate && (
                <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                  ⚠️ This conversion pair is not available
                </div>
              )}
              {currentRate && fromAmount < currentRate.minAmount && (
                <div className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2">
                  ⚠️ Minimum amount: {currentRate.minAmount} {selectedFromCurrency.toUpperCase()}
                </div>
              )}
              {currentRate && currentRate.maxAmount > 0 && fromAmount > currentRate.maxAmount && (
                <div className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2">
                  ⚠️ Maximum amount: {currentRate.maxAmount} {selectedFromCurrency.toUpperCase()}
                </div>
              )}
              {fromAmount > getUserBalance(selectedFromCurrency) && (
                <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                  ⚠️ Insufficient balance
                </div>
              )}
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={!isValidConversion || isConverting}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all active:scale-95 ${
              isValidConversion && !isConverting
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 shadow-lg'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            {isConverting ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-spinner fa-spin"></i>
                Converting...
              </span>
            ) : (
              'Swap Now'
            )}
          </button>
        </div>
      </div>

      {/* Close Button */}
      <div className="max-w-lg mx-auto px-4 pb-6">
        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <i className="fas fa-times text-lg"></i>
          Close Swap
        </button>
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

      {/* Details Popup */}
      <DetailsPopup
        visible={showDetailsPopup}
        onClose={() => setShowDetailsPopup(false)}
      />

      {/* Processing Popup */}
      <ProcessingPopup visible={showProcessingPopup} />

      {/* Success Popup */}
      <SuccessPopup
        visible={showSuccessPopup}
        fromAmount={fromAmount}
        fromCurrency={selectedFromCurrency.toUpperCase()}
        toAmount={toAmount}
        toCurrency={selectedToCurrency.toUpperCase()}
        onClose={handleSuccessClose}
      />

      {/* Failure Popup */}
      <FailurePopup
        visible={showFailurePopup}
        errorMessage={errorMessage}
        onClose={handleFailureClose}
      />
    </div>
  )
}
