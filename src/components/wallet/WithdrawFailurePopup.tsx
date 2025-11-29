import { Popup } from 'antd-mobile'
import { RootState } from 'modules'
import { useSelector } from 'react-redux'
 

interface WithdrawFailurePopupProps {
  visible: boolean
  onClose: () => void
  onRetry: () => void
}

export default function WithdrawFailurePopup({
  visible,
  onClose,
  onRetry,
}: WithdrawFailurePopupProps) {
  // Get error and withdrawal data from Redux
  const withdraw = useSelector((state: RootState) => state.withdraw)
  const { error, selectedCoin, withdrawAmount } = withdraw
  
  // Extract data for display
  const errorMessage = error || 'An unexpected error occurred. Please try again.'
  const amount = withdrawAmount || ''
  const currency = selectedCoin?.symbol || ''
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
      <div className="h-full flex flex-col bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Content Container */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
          {/* Error Icon */}
          <div className="relative inline-flex mb-6 animate-shake">
            {/* Outer rings */}
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse"></div>
            
            {/* Main icon */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Withdrawal Failed
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            We couldn't process your withdrawal
          </p>

          {/* Error Details */}
          <div className="w-full max-w-md">
          {/* Amount Card */}
          {amount && currency && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Attempted Amount</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {amount} {currency}
              </div>
            </div>
          )}

          {/* Error Message */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">Error Details</h4>
                <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Common Issues
            </h4>
            <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>Insufficient balance or daily withdrawal limit exceeded</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>Invalid wallet address or network mismatch</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>Network congestion or temporary service unavailability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>Account verification required for this transaction</span>
              </li>
            </ul>
          </div>

          {/* Suggestions */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              What to do next
            </h4>
            <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">✓</span>
                <span>Double-check your wallet address and network</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">✓</span>
                <span>Verify you have sufficient balance for withdrawal + fees</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">✓</span>
                <span>Wait a few minutes and try again</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">✓</span>
                <span>Contact support if the issue persists</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={onClose}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={onRetry}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30"
            >
              Try Again
            </button>
          </div>

          {/* Footer Info */}
          <div className="text-center">
            <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Contact Support
            </button>
          </div>
          </div>
        </div>
      </div>

    
    </Popup>
  )
}
