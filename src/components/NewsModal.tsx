'use client'

import { Dialog, Button } from 'antd-mobile'

interface NewsModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  content?: string
}

export default function NewsModal({ isOpen, onClose, title = "স্বাগতম!", content = "" }: NewsModalProps) {
  return (
    <Dialog
      visible={isOpen}
      onClose={onClose}
      closeOnMaskClick
      title={
        <div className="text-center">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-lg font-bold">{title}</div>
        </div>
      }
      content={
        <div className="text-center py-4">
          {content || (
            <div>
              <p className="mb-3 text-gray-700 dark:text-gray-300">Welcome to our app! Here you can earn money by watching ads.</p>
              <p className="mb-0 text-gray-700 dark:text-gray-300">Check regularly for new features and updates।</p>
            </div>
          )}
        </div>
      }
      actions={[
        {
          key: 'ok',
          text: 'বুঝেছি',
          onClick: onClose,
          bold: true
        }
      ]}
      bodyStyle={{
        borderRadius: '16px',
        padding: '20px'
      }}
    />
  )
}
