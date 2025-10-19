'use client'

import { Popup, Button, Space } from 'antd-mobile'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

interface AccountSuspensionPopupProps {
  isOpen: boolean
  onClose?: () => void
}

export default function AccountSuspensionPopup({ isOpen, onClose }: AccountSuspensionPopupProps) {
  const userState = useSelector((state: RootState) => state.user)

  const handleContactSupport = () => {
    // Open Telegram support or redirect to support page
    if (typeof window !== 'undefined') {
      window.open('https://t.me/EarnFromAdsBD_support', '_blank')
    }
  }

  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <Popup
      visible={isOpen}
      
      bodyStyle={{
        borderRadius: '0',
        padding: '0',
        width: '100vw',
        height: '100vh',
        maxWidth: 'none',
        margin: '0',
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 50%, #B91C1C 100%)'
      }}
      maskStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-white text-sm"></i>
            </div>
            <h2 className="text-xl font-bold text-white m-0">Account Suspended</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="max-w-md mx-auto w-full">
            {/* Title Section */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-ban text-red-400 text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 m-0">
                Account Access Restricted
              </h3>
              <p className="text-red-200 text-sm m-0">
                Your account has been temporarily suspended
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-red-400 to-red-500 rounded-full mx-auto mt-4"></div>
            </div>

            {/* Info Section */}
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-2xl p-6 border border-red-700 shadow-2xl mb-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center space-x-2 bg-red-500/10 px-3 py-1 rounded-full mb-4">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-red-400 text-xs font-medium">ACCOUNT STATUS</span>
                </div>
                
                {/* User Info */}
                <div className="bg-red-900/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-200">Username:</span>
                    <span className="text-white font-medium">{userState.username || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-red-200">User ID:</span>
                    <span className="text-white font-medium">{userState.userId || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-red-200">Status:</span>
                    <span className="text-red-400 font-bold uppercase">{userState.status}</span>
                  </div>
                </div>

                <p className="text-red-100 text-sm mb-0 leading-relaxed">
                  Your account has been suspended due to policy violations or security concerns. 
                  Please contact our support team for assistance.
                </p>
              </div>
              
              {/* Reasons Section */}
              <div className="bg-red-900/30 rounded-lg p-4 mb-4">
                <h4 className="text-red-200 text-sm font-semibold mb-3 m-0">Common reasons for suspension:</h4>
                <ul className="text-red-100 text-xs space-y-2 m-0 pl-4">
                  <li>• Violation of terms of service</li>
                  <li>• Suspicious account activity</li>
                  <li>• Multiple account creation</li>
                  <li>• Fraudulent referral activities</li>
                  <li>• Use of automated tools or bots</li>
                </ul>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleContactSupport}
                  style={{
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#fff',
                    width: '100%',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  className="hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <Space>
                    <i className="fab fa-telegram-plane text-lg"></i>
                    Contact Support
                  </Space>
                </Button>

                <Button
                  onClick={handleRefresh}
                  style={{
                    background: 'transparent',
                    border: '1px solid #EF4444',
                    borderRadius: '12px',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#EF4444',
                    width: '100%',
                    transition: 'all 0.3s ease'
                  }}
                  className="hover:bg-red-500/10"
                >
                  <Space>
                    <i className="fas fa-sync-alt text-lg"></i>
                    Refresh Page
                  </Space>
                </Button>
              </div>
            </div>

            {/* Footer Info */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-red-300 text-xs">
                <i className="fas fa-info-circle text-red-400"></i>
                <span>Account suspensions are reviewed within 24-48 hours</span>
              </div>
              <div className="mt-2">
                <span className="text-red-400 text-xs">
                  Support: @EarnFromAdsBD_support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  )
}
