'use client'

import { useState } from 'react'
import { Popup, Toast } from 'antd-mobile'

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface PasswordChangeModalProps {
  visible: boolean
  onClose: () => void
  onPasswordChange: (passwordForm: PasswordForm) => void
}

export default function PasswordChangeModal({ 
  visible, 
  onClose, 
  onPasswordChange 
}: PasswordChangeModalProps) {
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handlePasswordFormChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      Toast.show({
        content: 'Please fill all fields',
        duration: 2000
      })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Toast.show({
        content: 'New passwords do not match',
        duration: 2000
      })
      return
    }

    if (passwordForm.newPassword.length < 6) {
      Toast.show({
        content: 'Password must be at least 6 characters',
        duration: 2000
      })
      return
    }

    onPasswordChange(passwordForm)
    
    // Reset form after successful submission
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const handleClose = () => {
    // Reset form when closing
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    onClose()
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={handleClose}
      onClose={handleClose}
      bodyStyle={{
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
      }}
      className="!bg-white dark:!bg-gray-800"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Change Password
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Current Password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="New Password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Confirm New Password"
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Change Password
          </button>
        </div>
      </div>
    </Popup>
  )
}
