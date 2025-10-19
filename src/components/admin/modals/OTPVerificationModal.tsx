'use client'

import { useState, useEffect } from 'react'
import { Popup, Toast } from 'antd-mobile'
import { useSession } from 'next-auth/react'

interface OTPVerificationModalProps {
  visible: boolean
  onClose: () => void
  onVerify: (otpCode: string, resetToken?: string) => void
  onResendOtp: () => void
  purpose?: 'password_reset' | 'general'
}



 

export default function OTPVerificationModal({ 
  visible, 
  onClose, 
  onVerify, 
  onResendOtp,
  purpose = 'general'
}: OTPVerificationModalProps) {
  const [otpCode, setOtpCode] = useState('')
  const [otpTimer, setOtpTimer] = useState(60)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const { data: session } = useSession()

  function maskEmail(email: string, showStart = 4, showEnd = 2) {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (name.length <= showStart + showEnd) return email; // too short, return as is
    const maskedName = name.slice(0, showStart) + '*'.repeat(name.length - showStart - showEnd) + name.slice(-showEnd);
    return maskedName + '@' + domain;
  }
  
  // Start timer when modal becomes visible
  useEffect(() => {
    if (visible) {
      setOtpTimer(60)
      setOtpCode('')
      
      const timer = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [visible])

  const handleVerify = async () => {
    if (!otpCode || otpCode.length !== 6) {
      Toast.show({
        content: 'Please enter valid 6-digit OTP code',
        duration: 2000
      })
      return
    }

    setIsVerifying(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otpCode,
          purpose
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP')
      }

      Toast.show({
        content: 'OTP verified successfully!',
        duration: 2000
      })

      // Pass the reset token to parent component
      onVerify(otpCode, data.resetToken)

    } catch (error) {
      console.error('OTP verification error:', error)
      Toast.show({
        content: error instanceof Error ? error.message : 'Failed to verify OTP',
        duration: 3000
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    if (otpTimer > 0 || isResending) return
    
    setIsResending(true)
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purpose
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }

      setOtpTimer(60)
      setOtpCode('')
      
      Toast.show({
        content: 'New OTP sent to your email!',
        duration: 2000
      })
      
      onResendOtp()
      
      // Start OTP timer again
      const timer = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

    } catch (error) {
      console.error('Resend OTP error:', error)
      Toast.show({
        content: error instanceof Error ? error.message : 'Failed to send OTP',
        duration: 3000
      })
    } finally {
      setIsResending(false)
    }
  }

  const handleClose = () => {
    setOtpCode('')
    setOtpTimer(0)
    onClose()
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtpCode(value)
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
         

        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              Enter the OTP code sent to your email
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              OTP sent to {maskEmail(session?.user?.email as string)}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Check your spam folder if you don&apos;t see the email
            </p>
          </div>

          <div>
            <input
              type="text"
              value={otpCode}
              onChange={handleOtpChange}
              className="w-full px-4 py-4 text-center text-3xl font-mono border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-200 tracking-[0.5em] shadow-sm hover:shadow-md"
              placeholder="000000"
              maxLength={6}
              autoComplete="one-time-code"
            />
          </div>

          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Didn&apos;t receive code?
            </span>
            {otpTimer > 0 ? (
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                Resend in {otpTimer}s
              </span>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 px-3 py-1 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Sending...' : 'Resend Now'}
              </button>
            )}
          </div>
        </div>

        <div className="flex space-x-3 pt-6">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={isVerifying || !otpCode || otpCode.length !== 6}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      </div>
    </Popup>
  )
}
