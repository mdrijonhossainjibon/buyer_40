'use client'

import { useState, useEffect, useRef } from 'react'
import { Popup, Button, Toast } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'

interface OtpPopupProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (otp: string) => void
  phoneNumber?: string
  email?: string
  loading?: boolean
  resendOtp?: () => void
}

export default function OtpPopup({ 
  isOpen, 
  onClose, 
  onVerify, 
  phoneNumber, 
  email, 
  loading = false,
  resendOtp 
}: OtpPopupProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', ''])
      setTimer(60)
      setCanResend(false)
      // Focus first input when popup opens
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [isOpen])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isOpen, timer])

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Take only the last character

    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      onVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      onVerify(pastedData)
    }
  }

  const handleVerify = () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      Toast.show({
        content: 'Enter the 6-digit OTP code.',
        duration: 2000,
      })
      return
    }
    onVerify(otpString)
  }

  const handleResend = () => {
    if (canResend && resendOtp) {
      resendOtp()
      setTimer(60)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
      Toast.show({
        content: 'New OTP sent',
        duration: 2000,
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      onClose={onClose}
      position="bottom"
      bodyStyle={{
       
        padding: 0,
 
         
        backgroundColor: 'var(--adm-color-background)',
        color: 'var(--adm-color-text)'
      }}
      maskStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 text-center border-b border-gray-200 dark:border-gray-700 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close OTP popup"
          >
            <CloseOutline className="text-gray-500 dark:text-gray-400" />
          </button>
          
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">OTP Verification</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
             ${email} Enter the 6-digit code sent in the email.
          </p>
        </div>

        {/* OTP Input */}
        <div className="px-6 py-8">
          <div className="flex justify-center space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-bold bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            ))}
          </div>

          {/* Timer and Resend */}
          <div className="text-center mb-6">
            {timer > 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
               Wait for the code to be resent.: <span className="font-mono font-bold text-blue-500 dark:text-blue-400">{formatTime(timer)}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Send new code
              </button>
            )}
          </div>

          {/* Verify Button */}
          <Button
            block
            loading={loading}
            onClick={handleVerify}
            disabled={otp.some(digit => digit === '')}
            className="!bg-gradient-to-r !from-blue-500 !to-purple-600 dark:!from-blue-600 dark:!to-purple-700 !border-none !text-white !font-semibold !py-3 !rounded-lg !shadow-lg hover:!shadow-xl !transition-all !duration-200 disabled:!opacity-50 disabled:!cursor-not-allowed"
            style={{
              '--adm-color-primary': 'rgb(59 130 246)',
              '--adm-button-border-radius': '8px'
            } as React.CSSProperties}
          >
           {loading ? 'Verifying...' : 'Verify'}
          </Button>

          {/* Help Text */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
            Didn&apos;t receive the code? Check your spam folder or wait a while.
            </p>
          </div>
        </div>
      </div>
    </Popup>
  )
}
