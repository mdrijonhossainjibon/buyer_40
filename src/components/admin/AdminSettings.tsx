'use client'

import { useState } from 'react'
import { Switch, Card, List, Toast , Popup } from 'antd-mobile'
import { 
  SetOutline,
  SoundOutline,
  EyeOutline,
  GlobalOutline,
  LockOutline,
  DownlandOutline
} from 'antd-mobile-icons'

interface AdminSettingsProps {
  loading?: boolean
}

export default function AdminSettings({ loading = false }: AdminSettingsProps) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [otpCode, setOtpCode] = useState('')
  const [otpTimer, setOtpTimer] = useState(60)

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked)
    if (checked) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-prefers-color-scheme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-prefers-color-scheme', 'light')
    }
    Toast.show({
      content: checked ? 'ডার্ক মোড চালু করা হয়েছে' : 'লাইট মোড চালু করা হয়েছে',
      duration: 1500
    })
  }

  const handleExportData = () => {
    Toast.show({
      content: 'ডেটা এক্সপোর্ট শুরু হয়েছে...',
      duration: 2000
    })
    // TODO: Implement actual data export functionality
  }

  const handleClearCache = () => {
    Toast.show({
      content: 'ক্যাশ সাফ করা হয়েছে',
      duration: 1500
    })
    // TODO: Implement cache clearing
  }

  const handlePasswordChange = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      Toast.show({
        content: 'সব ফিল্ড পূরণ করুন',
        duration: 2000
      })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Toast.show({
        content: 'নতুন পাসওয়ার্ড মিলছে না',
        duration: 2000
      })
      return
    }

    if (passwordForm.newPassword.length < 6) {
      Toast.show({
        content: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে',
        duration: 2000
      })
      return
    }

    // Show OTP verification step
    setShowPasswordModal(false)
    setShowOtpModal(true)
    setOtpTimer(60)
    
    Toast.show({
      content: 'OTP আপনার ফোনে পাঠানো হয়েছে',
      duration: 2000
    })
    
    // Start OTP timer
    const timer = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleOtpVerification = () => {
    if (!otpCode || otpCode.length !== 6) {
      Toast.show({
        content: 'সঠিক ৬ সংখ্যার OTP কোড লিখুন',
        duration: 2000
      })
      return
    }

    // TODO: Implement actual OTP verification API call
    Toast.show({
      content: 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে',
      duration: 2000
    })
    
    setShowOtpModal(false)
    setOtpCode('')
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const handleResendOtp = () => {
    if (otpTimer > 0) return
    
    setOtpTimer(60)
    Toast.show({
      content: 'নতুন OTP পাঠানো হয়েছে',
      duration: 2000
    })
    
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
  }

  const handlePasswordFormChange = (field: string, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }))
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
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">সেটিংস</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">অ্যাডমিন প্যানেল কনফিগারেশন</p>
        </div>
        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
          <SetOutline className="text-purple-600 dark:text-purple-400" />
        </div>
      </div>

      {/* Theme Settings */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <EyeOutline className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">থিম সেটিংস</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ডার্ক বা লাইট মোড নির্বাচন করুন
              </p>
            </div>
          </div>
          <Switch
            checked={darkMode}
            onChange={handleDarkModeToggle}
            style={{
              '--checked-color': '#8b5cf6',
              '--height': '28px',
              '--width': '48px'
            }}
          />
        </div>
      </Card>

  

      {/* Security Settings */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <LockOutline className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">নিরাপত্তা</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                অ্যাকাউন্ট নিরাপত্তা সেটিংস
              </p>
            </div>
          </div>
        
        </div>
      </Card>

      {/* Data Management */}
    
      {/* App Info */}
      <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">অ্যাপ তথ্য</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">ভার্সন:</span>
              <span className="text-gray-700 dark:text-gray-300">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">শেষ আপডেট:</span>
              <span className="text-gray-700 dark:text-gray-300">
                {new Date().toLocaleDateString('bn-BD')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">ডেভেলপার:</span>
              <span className="text-gray-700 dark:text-gray-300">Future Apps Developer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">টেলিগ্রাম চ্যানেল:</span>
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

      {/* Password Change Popup */}
      <Popup
        visible={showPasswordModal}
        onMaskClick={() => setShowPasswordModal(false)}
        onClose={() => setShowPasswordModal(false)}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
        className="!bg-white dark:!bg-gray-800"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              পাসওয়ার্ড পরিবর্তন করুন
            </h3>
            <button
              onClick={() => setShowPasswordModal(false)}
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
                বর্তমান পাসওয়ার্ড
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="বর্তমান পাসওয়ার্ড লিখুন"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                নতুন পাসওয়ার্ড
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="নতুন পাসওয়ার্ড লিখুন"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                নতুন পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="নতুন পাসওয়ার্ড আবার লিখুন"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              বাতিল
            </button>
            <button
              onClick={handlePasswordChange}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              পরিবর্তন করুন
            </button>
          </div>
        </div>
      </Popup>

      {/* OTP Verification Popup */}
      <Popup
        visible={showOtpModal}
        onMaskClick={() => setShowOtpModal(false)}
        onClose={() => setShowOtpModal(false)}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
        className="!bg-white dark:!bg-gray-800"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              OTP যাচাইকরণ
            </h3>
            <button
              onClick={() => setShowOtpModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                আপনার ফোনে পাঠানো ৬ সংখ্যার কোড লিখুন
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                +880********** নম্বরে OTP পাঠানো হয়েছে
              </p>
            </div>

            <div>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setOtpCode(value)
                }}
                className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                কোড পুনরায় পাঠান
              </span>
              {otpTimer > 0 ? (
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  {otpTimer}s
                </span>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                >
                  এখনই পাঠান
                </button>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowOtpModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              বাতিল
            </button>
            <button
              onClick={handleOtpVerification}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              যাচাই করুন
            </button>
          </div>
        </div>
      </Popup>
    </div>
  )
}
