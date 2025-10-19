'use client'

import { RootState } from '@/store'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Popup } from 'antd-mobile'
import {
  setWithdrawMethod,
  setAccountNumber,
  setAmount,
  submitWithdrawRequest,
  fetchWithdrawConfigRequest,
  clearError,
  clearSuccessMessage
} from '@/store/modules/withdraw/actions'


export default function WithdrawPage() {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const withdraw = useSelector((state: RootState) => state.withdraw)
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)

  const {
    withdrawMethod,
    accountNumber,
    amount,
    isSubmitting,
    isLoading,
    error,
    successMessage,
    minWithdraw,
    requiredReferrals
  } = withdraw

  
  // Clear messages on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError())
      dispatch(clearSuccessMessage())
    }
  }, [dispatch])

  // Set default payment method to first enabled method
  useEffect(() => {
    const allMethods = [
      { label: 'Bkash', value: 'Bkash', enabled: false },
      { label: 'Nagad', value: 'Nagad', enabled: false },
      { label: 'Binance', value: 'Binance', enabled: true },
    ]
    
    const firstEnabledMethod = allMethods.find(method => method.enabled)
    if (firstEnabledMethod && !withdrawMethod) {
      dispatch(setWithdrawMethod(firstEnabledMethod.value))
    }
  }, [dispatch, withdrawMethod])

  const handleSubmit = () => {
  

    // Dispatch Redux action to submit withdrawal request
    dispatch(submitWithdrawRequest({
      userId: user.userId || 0,
      withdrawMethod,
      accountNumber,
      amount: parseInt(amount)
    }))
  }

  // Payment method icons
  const PaymentIcon = ({ method }: { method: string }) => {
    switch (method) {
      case 'Binance':
        return (
          <svg width="24" height="24" viewBox="0 0 126.61 126.61" fill="currentColor" className="text-blue-600 dark:text-blue-400">
            <path d="M38.73 53.2l24.59-24.58 24.6 24.6 14.3-14.31L63.32 0 24.43 38.9l14.3 14.31zm-14.3 10.12L10.11 49.01 0 59.12l10.11 10.11 14.32-14.3zm14.3 10.12l24.59 24.58 24.6-24.6 14.31 14.29-38.9 38.91-38.9-38.88 14.3-14.32zm75.57-10.12l14.31-14.31-10.11-10.11-14.32 14.3 10.12 10.12z"/>
            <path d="M77.83 63.31L63.32 48.78 52.59 59.51l-1.24 1.23-2.54 2.54 14.51 14.5 14.51-14.47z"/>
          </svg>
        )
      case 'Bkash':
        return <i className="fa-solid fa-mobile-screen text-pink-500"></i>
      case 'Nagad':
        return <i className="fa-solid fa-mobile-screen text-orange-500"></i>
      default:
        return <i className="fa-solid fa-wallet"></i>
    }
  }

  const allPaymentMethods = [
    { label: 'Bkash', value: 'Bkash', enabled: false },
    { label: 'Nagad', value: 'Nagad', enabled: false },
    { label: 'Binance', value: 'Binance', enabled: true },
  ]

  // Filter to show only enabled payment methods
  const paymentMethods = allPaymentMethods
    .filter(method => method.enabled)
    .map(({ label, value }) => ({ label, value }))

  return (
    <div className="block animate-fade-in bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
    

      <div className="p-4 -mt-4">
        {/* Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-info-circle text-blue-600 dark:text-blue-400"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Withdrawal Requirements</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Minimum <b className="text-blue-600 dark:text-blue-400">{minWithdraw} USDT</b> • At least <b className="text-blue-600 dark:text-blue-400">{requiredReferrals} referrals</b>
              </p>
            </div>
          </div>
        </div>

        {/* Suspended Account Warning */}
        {user.status === 'suspend' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-exclamation-triangle text-red-600 dark:text-red-400 text-xl"></i>
              <div>
                <h4 className="text-red-800 dark:text-red-300 font-semibold mb-1">Account Suspended</h4>
                <p className="text-red-700 dark:text-red-400 text-sm">
                  Your account has been suspended. You cannot withdraw.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Form Card */}
      <div className="px-4 pb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method
              </label>
              <div 
                onClick={() => setShowPaymentPopup(true)}
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {withdrawMethod && (
                      <div className={withdrawMethod === 'Binance' ? 'text-blue-600 dark:text-blue-400' : ''}>
                        <PaymentIcon method={withdrawMethod} />
                      </div>
                    )}
                    <span className={withdrawMethod ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'}>
                      {withdrawMethod || 'Select payment method'}
                    </span>
                  </div>
                  <i className="fa-solid fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
          {/* Payment Method Popup */}
          <Popup
            visible={showPaymentPopup}
            onMaskClick={() => setShowPaymentPopup(false)}
            onClose={() => setShowPaymentPopup(false)}
            position="bottom"
            bodyStyle={{
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              minHeight: '30vh',
              maxHeight: '50vh'
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select Payment Method</h3>
                <button
                  onClick={() => setShowPaymentPopup(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
                </button>
              </div>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.value}
                    onClick={() => {
                      dispatch(setWithdrawMethod(method.value))
                      setShowPaymentPopup(false)
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      withdrawMethod === method.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-blue-300 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={method.value === 'Binance' ? 'text-yellow-500' : ''}>
                          <PaymentIcon method={method.value} />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{method.label}</span>
                      </div>
                      {withdrawMethod === method.value && (
                        <i className="fa-solid fa-check-circle text-blue-500"></i>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Popup>

          {/* Account Number Field */}
            <div className="px-4 pb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {withdrawMethod === 'Binance' ? 'Binance UID' : 'Account Number'}
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => {
                  const value = withdrawMethod === 'Binance' 
                    ? e.target.value.replace(/\D/g, '')
                    : e.target.value.replace(/\D/g, '').slice(0, 11)
                  dispatch(setAccountNumber(value))
                }}
                placeholder={withdrawMethod === 'Binance' ? 'Enter your Binance UID' : '01XXXXXXXXX'}
                className="w-full px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                maxLength={withdrawMethod === 'Binance' ? undefined : 11}
              />
            </div>

          {/* Amount Field */}
            <div className="px-4 pb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Withdrawal Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none">
                  USDT
                </span>
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= user.balanceTK)) {
                      dispatch(setAmount(value))
                    }
                  }}
                  placeholder={`Min: ${minWithdraw}`}
                  min={minWithdraw}
                  max={user.balanceTK}
                  step="0.01"
                  className="w-full pl-16 pr-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Available: <b className="text-blue-600 dark:text-blue-400">{user.balanceTK} USDT</b>
              </p>
            </div>

          {/* Submit Button */}
          <div className="px-4 pb-4">
            <button
              type="submit"
              disabled={user.status === 'suspend' || isSubmitting}
              className="w-full h-14 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {user.status === 'suspend'
                ? 'Account Suspended'
                : isSubmitting
                  ? 'Processing...'
                  : 'Withdraw Now'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}
