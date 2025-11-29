import { Popup } from 'antd-mobile'
import { useEffect, useState } from 'react'

interface FailurePopupProps {
  visible: boolean
  errorMessage: string
  onClose: () => void
  onRetry?: () => void
}

export default function FailurePopup({ visible, errorMessage, onClose, onRetry }: FailurePopupProps) {
  const [animateError, setAnimateError] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (visible) {
      setAnimateError(true)
    } else {
      setAnimateError(false)
      setShowDetails(false)
    }
  }, [visible])

  const currentDate = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  // Parse error message to determine error type
  const getErrorType = (message: string) => {
    if (message.toLowerCase().includes('insufficient')) return 'insufficient_balance'
    if (message.toLowerCase().includes('network')) return 'network_error'
    if (message.toLowerCase().includes('rate')) return 'rate_changed'
    if (message.toLowerCase().includes('limit')) return 'limit_exceeded'
    return 'unknown'
  }

  const errorType = getErrorType(errorMessage)

  const troubleshootingTips = {
    insufficient_balance: [
      'Check your available balance',
      'Try converting a smaller amount',
      'Earn more through tasks and activities'
    ],
    network_error: [
      'Check your internet connection',
      'Try again in a few moments',
      'Refresh the page if issue persists'
    ],
    rate_changed: [
      'Exchange rates update in real-time',
      'Review the new rate and try again',
      'Consider setting a rate alert'
    ],
    limit_exceeded: [
      'Check minimum and maximum limits',
      'Adjust your conversion amount',
      'Contact support for higher limits'
    ],
    unknown: [
      'Check your internet connection',
      'Ensure you have sufficient balance',
      'Try again in a few moments'
    ]
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position='bottom'
      bodyClassName='h-screen'
    >
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center relative overflow-hidden">
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-red-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border-4 border-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Error Icon with Animation */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              {/* Outer warning rings */}
              <div className={`absolute inset-0 ${animateError ? 'animate-ping' : ''}`}>
                <div className="w-32 h-32 rounded-full bg-red-400 opacity-20"></div>
              </div>
              <div className={`absolute inset-2 ${animateError ? 'animate-pulse' : ''}`}>
                <div className="w-28 h-28 rounded-full bg-red-400 opacity-30"></div>
              </div>
              
              {/* Main error circle */}
              <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-2xl transform transition-all duration-500 ${
                animateError ? 'scale-100 rotate-0' : 'scale-0 -rotate-180'
              }`}>
                <i className="fas fa-exclamation-triangle text-6xl text-white"></i>
              </div>
            </div>
          </div>

          {/* Error Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ⚠️ Conversion Failed
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We couldn't complete your transaction
            </p>
          </div>

          {/* Error Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 mb-6">
            {/* Error Message */}
            <div className="mb-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <i className="fas fa-times-circle text-red-600 dark:text-red-400 mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">
                      Error Details
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errorMessage || 'An unexpected error occurred. Please try again.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Information */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Error Code</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    #{errorType.toUpperCase().substring(0, 8)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Time</span>
                  <span className="text-gray-900 dark:text-white">{currentDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                    <i className="fas fa-times-circle text-xs"></i>
                    Failed
                  </span>
                </div>
              </div>
            </div>

            {/* Troubleshooting Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between text-left mb-3"
              >
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                  Troubleshooting Tips
                </span>
                <i className={`fas fa-chevron-${showDetails ? 'up' : 'down'} text-gray-400 text-xs transition-transform`}></i>
              </button>
              
              {showDetails && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 animate-fadeIn">
                  <ul className="space-y-2">
                    {troubleshootingTips[errorType].map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                        <i className="fas fa-check-circle text-xs mt-0.5"></i>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Support Options */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <i className="fas fa-headset text-blue-600 dark:text-blue-400 mt-0.5"></i>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                  Need Help?
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                  Our support team is available 24/7 to assist you
                </p>
                <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  <i className="fas fa-comment-dots mr-1"></i>
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold transition-all active:scale-95 hover:border-gray-400 dark:hover:border-gray-500"
            >
              <i className="fas fa-times mr-2"></i>
              Cancel
            </button>
            <button
              onClick={() => {
                onClose()
                onRetry?.()
              }}
              className="py-3 px-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold transition-all active:scale-95 hover:border-blue-400 dark:hover:border-blue-500"
            >
              <i className="fas fa-redo mr-2"></i>
              Retry
            </button>
          </div>

          {/* Main Action Button */}
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold text-lg transition-all active:scale-95 shadow-lg hover:shadow-xl"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Converter
          </button>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <i className="fas fa-shield-alt text-green-500 mr-1"></i>
              Your funds are safe and secure
            </p>
          </div>
        </div>
      </div>
 
    </Popup>
  )
}
