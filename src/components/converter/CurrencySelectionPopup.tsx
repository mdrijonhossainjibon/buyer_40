import { Popup } from 'antd-mobile'
import { CurrencyType } from 'modules'
 

interface CurrencyOption {
  value: CurrencyType
  label: string
  icon: string
  color: string
  bgColor: string
}

interface CurrencySelectionPopupProps {
  visible: boolean
  title: string
  options: CurrencyOption[]
  selectedCurrency: CurrencyType
  onSelect: (currency: CurrencyType) => void
  onClose: () => void
  getUserBalance: (currency: CurrencyType) => number
}

export default function CurrencySelectionPopup({
  visible,
  title,
  options,
  selectedCurrency,
  onSelect,
  onClose,
  getUserBalance
}: CurrencySelectionPopupProps) {
  const handleSelect = (currency: CurrencyType) => {
    onSelect(currency)
    onClose()
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position='bottom'
      bodyClassName='h-screen'
    >
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full p-4 rounded-xl border-2 transition-all active:scale-95 ${
                selectedCurrency === option.value
                  ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={option.icon} 
                    alt={option.label}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-bold text-gray-900 dark:text-white">{option.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Balance: {getUserBalance(option.value).toFixed(2)}
                    </div>
                  </div>
                </div>
                {selectedCurrency === option.value && (
                  <i className="fas fa-check-circle text-yellow-500 text-xl"></i>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </Popup>
  )
}
