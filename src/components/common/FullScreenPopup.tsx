import { Popup } from 'antd-mobile'
import { ReactNode } from 'react'

interface FullScreenPopupProps {
  visible: boolean
  onClose: () => void
  title?: string
  showBackButton?: boolean
  rightButton?: ReactNode
  children: ReactNode
  headerClassName?: string
}

export default function FullScreenPopup({
  visible,
  onClose,
  title,
  showBackButton = true,
  rightButton,
  children,
  headerClassName = '',
}: FullScreenPopupProps) {
  return (
    <Popup
      visible={visible}
      position='bottom'
      bodyClassName='h-screen'
      showCloseButton={false}
      closeOnMaskClick={false}
    >
      <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        {/* Header */}
        <div className={`sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 ${headerClassName}`}>
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {showBackButton ? (
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95"
                >
                  <i className="fas fa-arrow-left text-lg text-gray-700 dark:text-gray-300"></i>
                </button>
              ) : (
                <div className="w-10"></div>
              )}
              
              {title && (
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  {title}
                </h1>
              )}
              
              <div className="flex items-center gap-2">
                {rightButton || <div className="w-10"></div>}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </Popup>
  )
}
