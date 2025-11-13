import { Popup } from 'antd-mobile'
import { ReactNode } from 'react'

interface BasePopupProps {
  visible: boolean
  onClose: () => void
  title?: string
  showHeader?: boolean
  showCloseButton?: boolean
  children: ReactNode
  position?: 'bottom' | 'top' | 'left' | 'right'
  bodyClassName?: string
  headerClassName?: string
  closeOnMaskClick?: boolean
}

export default function BasePopup({
  visible,
  onClose,
  title,
  showHeader = true,
  showCloseButton = true,
  children,
  position = 'bottom',
  bodyClassName = '',
  headerClassName = '',
  closeOnMaskClick = true,
}: BasePopupProps) {
  return (
    <Popup
      visible={visible}
      onMaskClick={closeOnMaskClick ? onClose : undefined}
      position={position}
      bodyClassName={bodyClassName}
      showCloseButton={false}
    >
      <div className="bg-white dark:bg-gray-900 min-h-[200px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        {showHeader && (
          <div className={`sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 ${headerClassName}`}>
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {title || 'Popup'}
                </h2>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95"
                  >
                    <i className="fas fa-times text-lg text-gray-600 dark:text-gray-400"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </Popup>
  )
}
