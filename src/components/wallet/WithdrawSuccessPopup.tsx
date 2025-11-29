import { Popup } from 'antd-mobile'
import { RootState } from 'modules'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
 

interface WithdrawSuccessPopupProps {
  visible: boolean
  onClose: () => void
}

export default function WithdrawSuccessPopup({
  visible,
  onClose,
}: WithdrawSuccessPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  
  // Get withdraw state from Redux
  const withdraw = useSelector((state: RootState) => state.withdraw)
  const { transactionData, successMessage, withdrawalStatus } = withdraw
  
 
  // Extract transaction details
  const amount = transactionData?.amount || '0.00'
  const currency = transactionData?.currency || 'USDT'
  const network = transactionData?.network || 'Unknown'
  const address = transactionData?.address || ''
  const transactionId = transactionData?.transactionId || ''
  const timestamp = transactionData?.timestamp || Date.now()

  useEffect(() => {
    if (visible && withdrawalStatus === 'completed') {
      // Show confetti animation
      setShowConfetti(true)
      const confettiTimer = setTimeout(() => setShowConfetti(false), 3000)
      
      // Show success toast
    /*   toast.success(successMessage || 'Withdrawal completed successfully!', {
        duration: 4000,
        icon: '✅',
      }) */
      
      return () => clearTimeout(confettiTimer)
    }
  }, [visible, withdrawalStatus, successMessage])

  const handleShare = async () => {
    if (!transactionData) return
    
    const shareText = `✅ Withdrawal Successful!\n\nAmount: ${amount} ${currency}\nNetwork: ${network}\nTransaction ID: ${transactionId}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Withdrawal Success',
          text: shareText
        })
        //toast.success('Shared successfully!')
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText)
        //toast.success('Transaction details copied to clipboard!')
      } catch (err) {
        //toast.error('Failed to copy to clipboard')
      }
    }
  }

  const handleCopyTransactionId = async () => {
    if (!transactionId) {
      //toast.error('No transaction ID available')
      return
    }
    try {
      await navigator.clipboard.writeText(transactionId)
      //toast.success('Transaction ID copied!')
    } catch (err) {
      //toast.error('Failed to copy')
    }
  }

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
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random()}s`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            ))}
          </div>
        )}

        {/* Content Container */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
          {/* Success Icon */}
          <div className="relative inline-flex mb-6 animate-scale-in">
            {/* Outer rings */}
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full bg-green-500/10 scale-110 animate-pulse"></div>
            
            {/* Main icon */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Withdrawal Successful!
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            {successMessage || 'Your withdrawal has been processed successfully'}
          </p>

          {/* Transaction Details */}
          <div className="w-full max-w-md">
          {/* Amount Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 mb-4 text-center border border-green-200 dark:border-green-800">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Amount</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {amount} {currency}
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3 mb-6">
            {/* Network */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Network</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{network}</span>
            </div>

            {/* Address */}
            {address && (
              <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Address</span>
                <span className="text-sm font-mono text-gray-900 dark:text-white text-right break-all max-w-[200px]">
                  {address.length > 20 ? `${address.slice(0, 10)}...${address.slice(-8)}` : address}
                </span>
              </div>
            )}

            {/* Transaction ID */}
            {transactionId && (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group cursor-pointer" onClick={handleCopyTransactionId}>
                <span className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-900 dark:text-white">
                    {transactionId.length > 16 ? `${transactionId.slice(0, 8)}...${transactionId.slice(-8)}` : transactionId}
                  </span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Date & Time */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Date & Time</span>
              <span className="text-sm text-gray-900 dark:text-white">
                {new Date(timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">Completed</span>
              </div>
            </div>
          </div>

          {/* Success Badge */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Your funds will arrive within 10-30 minutes</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>

            <button
              onClick={onClose}
              className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold text-sm hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30"
            >
              Done
            </button>
          </div>

           
          </div>
        </div>
      </div>
 
 
    </Popup>
  )
}
