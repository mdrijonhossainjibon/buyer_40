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
              <p className="mb-3 text-gray-700 dark:text-gray-300">আপনাকে আমাদের অ্যাপে স্বাগতম! এখানে আপনি বিজ্ঞাপন দেখে টাকা আয় করতে পারবেন।</p>
              <p className="mb-0 text-gray-700 dark:text-gray-300">নতুন ফিচার এবং আপডেটের জন্য নিয়মিত চেক করুন।</p>
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
