import { Popup } from 'antd-mobile'

interface ConfirmationPopupProps {
  visible: boolean
  fromAmount: number
  fromCurrency: string
  toAmount: number
  toCurrency: string
  fee: number
  rate: number
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationPopup({
  visible,
  fromAmount,
  fromCurrency,
  toAmount,
  toCurrency,
  fee,
  rate,
  onConfirm,
  onCancel
}: ConfirmationPopupProps) {
  const feeAmount = (fromAmount * rate * fee) / 100
  const amountAfterFee = toAmount
  const totalBeforeFee = fromAmount * rate
  const priceImpact = fee // Using fee as price impact indicator

  return (
    <Popup
      visible={visible}
      onMaskClick={onCancel}
      position='bottom'
      bodyClassName='h-screen'
    >
      <div className="flex flex-col h-full">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-32">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">💱</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirm Conversion</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please review the details before confirming
          </p>
        </div>

        {/* Main Conversion Display */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-5 mb-4 border border-yellow-200 dark:border-gray-600">
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">You Pay</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {fromAmount} <span className="text-xl text-yellow-600 dark:text-yellow-400">{fromCurrency}</span>
            </div>
            
            <div className="flex justify-center items-center my-4">
              <div className="bg-white dark:bg-gray-600 rounded-full p-2 shadow-md">
                <i className="fas fa-arrow-down text-yellow-500 text-lg"></i>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">You Receive</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {toAmount.toFixed(4)} <span className="text-xl text-green-600 dark:text-green-400">{toCurrency}</span>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 space-y-3">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            Transaction Details
          </div>
          
          {/* Exchange Rate */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Exchange Rate</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              1 {fromCurrency} = {rate} {toCurrency}
            </span>
          </div>

          {/* Amount Before Fee */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Amount Before Fee</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {totalBeforeFee.toFixed(4)} {toCurrency}
            </span>
          </div>

          {/* Conversion Fee */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Conversion Fee ({fee}%)
            </span>
            <span className="text-sm font-medium text-red-600 dark:text-red-400">
              -{feeAmount.toFixed(4)} {toCurrency}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

          {/* Final Amount */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Final Amount
            </span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">
              {amountAfterFee.toFixed(4)} {toCurrency}
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Price Impact */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <i className="fas fa-chart-line text-xs text-gray-500"></i>
              <span className="text-xs text-gray-600 dark:text-gray-400">Price Impact</span>
            </div>
            <div className={`text-sm font-bold ${
              priceImpact < 1 ? 'text-green-600' : 
              priceImpact < 3 ? 'text-yellow-600' : 
              'text-orange-600'
            }`}>
              ~{priceImpact.toFixed(2)}%
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <i className="fas fa-clock text-xs text-gray-500"></i>
              <span className="text-xs text-gray-600 dark:text-gray-400">Est. Time</span>
            </div>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
              Instant
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-route text-purple-500 text-xs"></i>
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Conversion Route</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="font-bold text-purple-700 dark:text-purple-300">{fromCurrency}</span>
            <i className="fas fa-arrow-right text-purple-400 text-xs"></i>
            <span className="px-2 py-1 bg-purple-200 dark:bg-purple-800 rounded-lg text-xs font-semibold text-purple-700 dark:text-purple-200">
              Direct Swap
            </span>
            <i className="fas fa-arrow-right text-purple-400 text-xs"></i>
            <span className="font-bold text-purple-700 dark:text-purple-300">{toCurrency}</span>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 mb-4">
          <div className="flex items-start gap-2">
            <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-1">Important Notice:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>This conversion is instant and irreversible</li>
                <li>The rate is locked for this transaction</li>
                <li>Fees are deducted from the final amount</li>
                <li>Ensure you have reviewed all details carefully</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <i className="fas fa-shield-alt text-green-500"></i>
          <span>Secured by encryption</span>
          <span className="mx-1">•</span>
          <i className="fas fa-lock text-green-500"></i>
          <span>Protected transaction</span>
        </div>
        </div>

        {/* Fixed Bottom Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
          <div className="flex gap-3 max-w-md mx-auto">
            <button
              onClick={onCancel}
              className="flex-1 py-3.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold transition-all active:scale-95 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md"
            >
              <i className="fas fa-times mr-2"></i>
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold transition-all active:scale-95 shadow-lg hover:shadow-xl"
            >
              <i className="fas fa-check-circle mr-2"></i>
              Confirm Swap
            </button>
          </div>
        </div>
      </div>
    </Popup>
  )
}
