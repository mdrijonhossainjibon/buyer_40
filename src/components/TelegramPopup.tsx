'use client'

import { useState, useEffect } from 'react'
import { Popup, Button, Space } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'
import { isInTelegram, generateQRCodeDataURL } from '../lib/telegramUtils'

interface TelegramPopupProps {
  isOpen: boolean
  onClose: () => void
  miniAppUrl: string
}

export default function TelegramPopup({ isOpen, onClose, miniAppUrl }: TelegramPopupProps) {
  const [inTelegram, setInTelegram] = useState(false)

  useEffect(() => {
    //setInTelegram(isInTelegram())
  }, [])

  const qrCodeUrl = generateQRCodeDataURL(miniAppUrl)

  const openMiniApp = () => {
    if (typeof window !== 'undefined') {
      window.open(miniAppUrl, '_blank')
    }
  }

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      onClose={onClose}
      bodyStyle={{
        borderRadius: '0',
        padding: '32px 24px',
        width: '100vw',
        height: '100vh',
        maxWidth: 'none',
        margin: '0',
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0'
      }}
      maskStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div className="relative">
      

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 m-0">Access Earn From Ads BD</h3>
          <div className="w-12 h-1 bg-gradient-to-r from-[#0088cc] to-[#0066aa] rounded-full mx-auto"></div>
        </div>
 
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6">
              <p className="text-gray-700 text-lg mb-6 leading-relaxed m-0">
                Scan this QR code with your phone to open in Telegram:
              </p>
              
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-100">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="rounded-xl w-48 h-48 object-contain block"
                    style={{ width: '192px', height: '192px' }}
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-600 text-base mb-4 leading-relaxed m-0">
                  Or click the button below to open Telegram:
                </p>
                <Button
                  color="primary"
                  onClick={openMiniApp}
                  style={{
                    background: 'linear-gradient(135deg, #0088cc, #0066aa)',
                    border: 'none',
                    borderRadius: '12px',
                    height: '40px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <Space>
                    <i className="fab fa-telegram-plane"></i>
                    Open in Telegram
                  </Space>
                </Button>
              </div>
            </div>
          </div>
     
      </div>
    </Popup>
  )
}
