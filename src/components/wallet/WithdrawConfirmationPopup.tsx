import { Popup } from 'antd-mobile'
import CryptoIcon from 'components/CryptoIcons'
import { useState } from 'react'


interface Network {
  id: string
  name: string
  isDefault: boolean
  minDeposit: string
  confirmations: number
  fee: string
  requiresMemo?: boolean
}

interface Coin {
  id: string
  name: string
  symbol: string
  icon: string
  networks: Network[]
}

interface WithdrawConfirmationPopupProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  selectedCoin: Coin
  selectedNetwork: Network
  withdrawAddress: string
  withdrawMemo: string
  withdrawAmount: string
  calculateReceiveAmount: () => string
}

export default function WithdrawConfirmationPopup({
  visible,
  onClose,
  onConfirm,
  loading,
  selectedCoin,
  selectedNetwork,
  withdrawAddress,
  withdrawMemo,
  withdrawAmount,
  calculateReceiveAmount,
}: WithdrawConfirmationPopupProps) {
  const [showProcessing, setShowProcessing] = useState(false)

  const handleConfirm = () => {
    setShowProcessing(true)
    // Call the actual confirm after showing processing
    setTimeout(() => {
      onConfirm()
      setShowProcessing(false)
    }, 4000) // 4 seconds to match processing animation
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
        {/* Confirmation Header */}
        <div className="relative bg-gradient-to-r from-orange-500 to-red-600 p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Confirm Withdrawal</h3>
          <p className="text-sm text-orange-100">Please verify all details before confirming</p>
        </div>

        {/* Confirmation Details */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Amount Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-700">
            <div className="text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">You are withdrawing</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                 
                <CryptoIcon symbol={selectedCoin.id} className="w-8 h-8 rounded-full" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{withdrawAmount}</span>
                <span className="text-xl font-semibold text-gray-600 dark:text-gray-400">{selectedCoin.symbol}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                You will receive: <span className="font-bold text-blue-600 dark:text-blue-400">{calculateReceiveAmount()} {selectedCoin.symbol}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            {/* Network */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Network</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedNetwork.name}</span>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Withdrawal Address</span>
                <span className="text-xs font-mono font-semibold text-gray-900 dark:text-white break-all">{withdrawAddress}</span>
              </div>
            </div>

            {/* Memo if required */}
            {selectedNetwork.requiresMemo && withdrawMemo && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Memo/Tag</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{withdrawMemo}</span>
                </div>
              </div>
            )}

            {/* Fee */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Network Fee</span>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">- {selectedNetwork.fee} {selectedCoin.symbol}</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 rounded">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-xs text-red-700 dark:text-red-300">
                <p className="font-semibold mb-1">Important Warning:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Withdrawals cannot be cancelled or reversed</li>
                  <li>Double-check the address and network</li>
                  <li>Wrong address will result in permanent loss</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 p-5 border-t border-gray-200 dark:border-gray-700 space-y-3 bg-white dark:bg-gray-900">
          <button
            onClick={handleConfirm}
            disabled={loading || showProcessing}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Yes, Confirm Withdrawal</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </Popup>
 
   
    </>
  )
}
