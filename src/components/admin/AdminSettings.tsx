'use client'

import { useState } from 'react'
import { Switch, Card, List, Toast , Popup } from 'antd-mobile'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  SetOutline,
  SoundOutline,
  EyeOutline,
  GlobalOutline,
  LockOutline,
  DownlandOutline
} from 'antd-mobile-icons'
import PasswordChangeModal from './modals/PasswordChangeModal'
import OTPVerificationModal from './modals/OTPVerificationModal'

interface AdminSettingsProps {
  loading?: boolean
}

export default function AdminSettings({ loading = false }: AdminSettingsProps) {
  const router = useRouter()
  const [passwordFormData, setPasswordFormData] = useState<any>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
 
    
  const handlePasswordChange = async (passwordForm: any) => {
    try {
      // Store password form data for later use
      setPasswordFormData(passwordForm)
      
      // Send OTP for password reset
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purpose: 'password_reset'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }

      // Show OTP verification step
      setShowPasswordModal(false)
      setShowOtpModal(true)
      
      Toast.show({
        content: 'OTP sent to your email!',
        duration: 2000
      })
    } catch (error) {
      console.error('Send OTP error:', error)
      Toast.show({
        content: error instanceof Error ? error.message : 'Failed to send OTP',
        duration: 3000
      })
    }
  }

  const handleOtpVerification = async (otpCode: string) => {
    try {
      if (!passwordFormData || !passwordFormData.newPassword) {
        throw new Error('Password form data not found')
      }

      // First verify the OTP
      const verifyResponse = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otpCode,
          purpose: 'password_reset'
        }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Failed to verify OTP')
      }

      // If OTP is verified, proceed with password reset
      const resetResponse = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: passwordFormData.newPassword,
          currentPassword: passwordFormData.currentPassword
        }),
      })

      const resetData = await resetResponse.json()

      if (!resetResponse.ok) {
        throw new Error(resetData.error || 'Failed to reset password')
      }

      Toast.show({
        content: 'Password changed successfully!',
        duration: 2000
      })
      
      // Clear stored password data and close modal
      setPasswordFormData(null)
      setShowOtpModal(false)
    } catch (error) {
      console.error('Password reset error:', error)
      Toast.show({
        content: error instanceof Error ? error.message : 'Failed to reset password',
        duration: 3000
      })
    }
  }

  const handleResendOtp = () => {
    // This is now handled by the OTP modal itself
    console.log('Resend OTP triggered')
  }

  const handleLogout = async () => {
    try {
      Toast.show({
        content: 'Logging out...',
        duration: 1500
      })
      
      // Sign out using NextAuth
      await signOut({ 
        redirect: false,
        callbackUrl: '/login'
      })
      
      // Clear any local storage data
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      
      // Navigate to login page
      router.push('/login')
      
      Toast.show({
        content: 'Logged out successfully',
        duration: 2000
      })
    } catch (error) {
      console.error('Logout error:', error)
      Toast.show({
        content: 'Logout failed. Please try again.',
        duration: 2000
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="h-[60px] bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Admin Panel Configuration</p>
        </div>
        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
          <SetOutline className="text-purple-600 dark:text-purple-400" />
        </div>
      </div>

     
      {/* Security Settings */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <LockOutline className="text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Security</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Account security settings
              </p>
            </div>
          </div>
          
          <List className="!bg-transparent">
            <List.Item
              onClick={() => setShowPasswordModal(true)}
              className="!bg-transparent hover:!bg-gray-50 dark:hover:!bg-gray-700 transition-colors cursor-pointer"
              prefix={
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <LockOutline className="text-orange-600 dark:text-orange-400 text-sm" />
                </div>
              }
              arrow
            >
              <div>
                <div className="text-gray-900 dark:text-white font-medium">Change Password</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Update your account password</div>
              </div>
            </List.Item>

            <List.Item
              onClick={() => setShowLogoutModal(true)}
              className="!bg-transparent hover:!bg-gray-50 dark:hover:!bg-gray-700 transition-colors cursor-pointer"
              prefix={
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
              }
              arrow
            >
              <div>
                <div className="text-gray-900 dark:text-white font-medium">Logout</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Sign out of your account</div>
              </div>
            </List.Item>
          </List>
        </div>
      </Card>

    

     
      {/* App Info */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">App Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Version:</span>
              <span className="text-gray-700 dark:text-gray-300">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Last Update:</span>
              <span className="text-gray-700 dark:text-gray-300">
                {new Date().toLocaleDateString('en-BD')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Developer:</span>
              <span className="text-gray-700 dark:text-gray-300">Future Apps Developer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Telegram Channel:</span>
              <a 
                href="https://t.me/FutureApps_Dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline"
              >
                @FutureApps_Dev
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Password Change Modal */}
      <PasswordChangeModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onPasswordChange={handlePasswordChange}
      />

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        visible={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleOtpVerification}
        onResendOtp={handleResendOtp}
        purpose="password_reset"
      />

      {/* Logout Confirmation Popup */}
      <Popup
        visible={showLogoutModal}
        onMaskClick={() => setShowLogoutModal(false)}
        onClose={() => setShowLogoutModal(false)}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
        className="!bg-white dark:!bg-gray-800"
      >
        <div className="p-6 space-y-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to logout from your account?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                You will need to login again to access the admin panel.
              </p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowLogoutModal(false)
                handleLogout()
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </Popup>
    </div>
  )
}
