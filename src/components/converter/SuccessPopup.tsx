import { Popup } from 'antd-mobile'
import { useEffect, useState } from 'react'

interface SuccessPopupProps {
  visible: boolean
  fromAmount: number
  fromCurrency: string
  toAmount: number
  toCurrency: string
  onClose: () => void
}

export default function SuccessPopup({
  visible,
  fromAmount,
  fromCurrency,
  toAmount,
  toCurrency,
  onClose
}: SuccessPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [animateCheck, setAnimateCheck] = useState(false)

  useEffect(() => {
    if (visible) {
      setShowConfetti(true)
      setAnimateCheck(true)
      
      // Hide confetti after animation
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 3000)

      return () => clearTimeout(timer)
    } else {
      setAnimateCheck(false)
    }
  }, [visible])

  const currentDate = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position='bottom'
      bodyClassName='h-screen'
    >
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center relative overflow-hidden">
        
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  backgroundColor: ['#10b981', '#fbbf24', '#3b82f6', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="w-full max-w-md relative z-10">
          {/* Success Icon with Animation */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              {/* Outer rings */}
              <div className={`absolute inset-0 ${animateCheck ? 'animate-ping' : ''}`}>
                <div className="w-32 h-32 rounded-full bg-green-400 opacity-20"></div>
              </div>
              <div className={`absolute inset-2 ${animateCheck ? 'animate-pulse' : ''}`}>
                <div className="w-28 h-28 rounded-full bg-green-400 opacity-30"></div>
              </div>
              
              {/* Main success circle */}
              <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl transform transition-all duration-500 ${
                animateCheck ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
              }`}>
                <i className="fas fa-check text-6xl text-white"></i>
              </div>
            </div>
          </div>

          {/* Success Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🎉 Conversion Successful!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your transaction has been completed
            </p>
          </div>

          {/* Transaction Summary Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 mb-6">
            {/* From/To Display */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="text-left">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">You Paid</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {fromAmount} <span className="text-base text-yellow-600 dark:text-yellow-400">{fromCurrency}</span>
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2">
                  <i className="fas fa-arrow-right text-green-600 dark:text-green-400"></i>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">You Received</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {toAmount.toFixed(4)} <span className="text-base text-green-600 dark:text-green-400">{toCurrency}</span>
                  </p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Date & Time</span>
                  <span className="text-gray-900 dark:text-white">{currentDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                    <i className="fas fa-check-circle text-xs"></i>
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Success Badge */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-3 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <i className="fas fa-badge-check text-green-600 dark:text-green-400"></i>
                <p className="text-xs text-green-700 dark:text-green-300">
                  <span className="font-semibold">Transaction verified and secured.</span> Your balance has been updated instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold transition-all active:scale-95 hover:border-green-400 dark:hover:border-green-500"
            >
              <i className="fas fa-redo mr-2"></i>
              Convert Again
            </button>
            <button
              onClick={() => {
                // Share functionality
                if (navigator.share) {
                  navigator.share({
                    title: 'Conversion Success',
                    text: `Successfully converted ${fromAmount} ${fromCurrency} to ${toAmount.toFixed(4)} ${toCurrency}!`
                  })
                }
              }}
              className="py-3 px-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold transition-all active:scale-95 hover:border-blue-400 dark:hover:border-blue-500"
            >
              <i className="fas fa-share-alt mr-2"></i>
              Share
            </button>
          </div>

          {/* Main Action Button */}
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg transition-all active:scale-95 shadow-lg hover:shadow-xl"
          >
            <i className="fas fa-check-circle mr-2"></i>
            Done
          </button>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <i className="fas fa-info-circle mr-1"></i>
              View transaction history in your wallet
            </p>
          </div>
        </div>
      </div>
 
    </Popup>
  )
}
