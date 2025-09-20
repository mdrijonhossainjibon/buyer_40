'use client'
 
import { Popup, Button, Space } from 'antd-mobile'
import QRCode from './QRCode'
 

interface TelegramPopupProps {
  isOpen: boolean
  
}

export default function TelegramPopup({ isOpen  }: TelegramPopupProps) {
  const miniAppUrl = 'https://t.me/EarnFromAdsBD_bot/?startapp=UID1544ajY'
  
  const openMiniApp = () => {
    if (typeof window !== 'undefined') {
      window.open(miniAppUrl, '_blank')
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
        background: 'linear-gradient(135deg, #0B0E11 0%, #161A1E 50%, #1E2329 100%)'
      }}
      maskStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#F0B90B] to-[#F8D12F] rounded-full flex items-center justify-center">
              <i className="fab fa-telegram-plane text-black text-sm"></i>
            </div>
            <h2 className="text-xl font-bold text-white m-0">Telegram Access</h2>
          </div>
        
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="max-w-md mx-auto w-full">
            {/* Title Section */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2 m-0">
                Access Earn From Ads BD
              </h3>
              <p className="text-gray-400 text-sm m-0">
                Connect to our Telegram bot for seamless trading experience
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-[#F0B90B] to-[#F8D12F] rounded-full mx-auto mt-4"></div>
            </div>

            {/* QR Code Section */}
            <div className="bg-gradient-to-br from-[#1E2329] to-[#2B3139] rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center space-x-2 bg-[#F0B90B]/10 px-3 py-1 rounded-full mb-4">
                  <div className="w-2 h-2 bg-[#F0B90B] rounded-full animate-pulse"></div>
                  <span className="text-[#F0B90B] text-xs font-medium">SCAN TO CONNECT</span>
                </div>
                <p className="text-gray-300 text-base mb-0 leading-relaxed">
                  Scan this QR code with your phone to open in Telegram
                </p>
              </div>
              
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-xl border-2 border-[#F0B90B]/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/5 to-transparent"></div>
                  <QRCode
                    value={miniAppUrl}
                    size={180}
                    style={{ backgroundColor: 'white' }}
                    bordered={false}
                  />
                </div>
              </div>
              
              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-600"></div>
                <span className="px-4 text-gray-500 text-xs font-medium">OR</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-600"></div>
              </div>
              
              {/* Button Section */}
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4 leading-relaxed m-0">
                  Click below to open Telegram directly
                </p>
                <Button
                  onClick={openMiniApp}
                  style={{
                    background: 'linear-gradient(135deg, #F0B90B 0%, #F8D12F 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#000',
                    width: '100%',
                    boxShadow: '0 4px 12px rgba(240, 185, 11, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  className="hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <Space>
                    <i className="fab fa-telegram-plane text-lg"></i>
                    Open in Telegram
                  </Space>
                </Button>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-500 text-xs">
                <i className="fas fa-shield-alt text-[#F0B90B]"></i>
                <span>Secure connection via Telegram</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  )
}
