import { Popup } from 'antd-mobile'

interface DetailsPopupProps {
  visible: boolean
  onClose: () => void
}

export default function DetailsPopup({ visible, onClose }: DetailsPopupProps) {
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position='bottom'
      bodyClassName='h-screen'
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About Swap</h3>
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">What is Swap?</h4>
            <p>Swap allows you to instantly exchange one currency for another at the current market rate.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Fees</h4>
            <p>A small fee is charged on each swap to cover network costs. The fee percentage varies by currency pair.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Price Impact</h4>
            <p>Large swaps may experience price impact. This is shown before you confirm the transaction.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Limits</h4>
            <p>Each currency pair has minimum and maximum swap amounts. Make sure your amount is within these limits.</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold transition-all active:scale-95"
        >
          Got it
        </button>
      </div>
    </Popup>
  )
}
