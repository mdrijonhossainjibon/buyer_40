'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { Button, Toast, Card, Space, Divider } from 'antd-mobile'
import { EyeInvisibleOutline, EyeOutline, UserOutline, LockOutline } from 'antd-mobile-icons'
import OtpPopup from '@/components/OtpPopup'
import { telegramWebApp } from '@/lib/telegramWebApp'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showOtpPopup, setShowOtpPopup] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [pendingLoginData, setPendingLoginData] = useState<any>(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin')
    }
  }, [status, router])

  useLayoutEffect(() => {
    // Initialize Telegram Web App and apply theme
    const initTelegram = async () => {
      await telegramWebApp.initialize()
      telegramWebApp.applyTelegramTheme()
    }
    
    initTelegram()

    // Check if document element has dark class and sync with state
    const hasDarkClass = document.documentElement.classList.contains('dark')
    
    if (hasDarkClass) {
      document.documentElement.setAttribute('data-prefers-color-scheme','dark')
    }
    else{
      document.documentElement.setAttribute('data-prefers-color-scheme','light')
    } 
  }, [])


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('username', e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('password', e.target.value)
  }

  const handleLogin = async () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      Toast.show({
        content: 'Username and password are required',
        duration: 2000,
      })
      return
    }

    setLoading(true)
    try {
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        // Check if OTP is required
        if (result.error === 'OTP_REQUIRED') {
          setPendingLoginData({ username: formData.username })
          setShowOtpPopup(true)
          Toast.show({
            content: 'OTP Send Successfully',
            duration: 2000,
          })
        } else {
          Toast.show({
            content: result.error || 'Login failed',
            duration: 2000,
            position: 'bottom'
          })
        }
      } else if (result?.ok) {
        Toast.show({
          content: 'Successfully logged in',
          duration: 2000,
        })
        
        // Send login data to Telegram bot
        await telegramWebApp.sendLoginData(0, formData.username)
        telegramWebApp.showLoginSuccess(formData.username)
      }
    } catch (error) {
      console.error('Login error:', error)
      Toast.show({
        content: 'Failed to login',
        duration: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async (otp: string) => {
    setOtpLoading(true)
    try {
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        otp: otp,
        redirect: false,
      })

      if (result?.error) {
        Toast.show({
          content: result.error || 'OTP verification failed',
          duration: 2000,
        })
      } else if (result?.ok) {
        Toast.show({
          content: 'OTP verification successful! Login completed',
          duration: 2000,
        })
        
        // Send login data to Telegram bot
        await telegramWebApp.sendLoginData(0, formData.username)
        telegramWebApp.showLoginSuccess(formData.username)
        
        setShowOtpPopup(false)
        setPendingLoginData(null)
        router.push('/admin')
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      Toast.show({
        content: 'Failed to verify OTP',
        duration: 2000,
      })
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      // Trigger login again to resend OTP
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
      })

      Toast.show({
        content: 'New OTP has been sent',
        duration: 2000,
      })
    } catch (error) {
      console.error('Resend OTP error:', error)
      Toast.show({
        content: 'Failed to send OTP',
        duration: 2000,
      })
    }
  }

  const handleCloseOtp = () => {
    setShowOtpPopup(false)
    setPendingLoginData(null)
  }

  const handleRegister = () => {
    Toast.show({
      content: 'Only login access is permitted. New registration is currently closed.',
      duration: 3000,
    })
  }

  const handleForgotPassword = () => {
    Toast.show({
      content: 'Password reset feature coming soon',
      duration: 2000,
    })
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const result = await signIn('google', {
        redirect: false,
      })

      if (result?.error) {
        Toast.show({
          content: result.error || 'Google login failed',
          duration: 2000,
        })
      } else if (result?.ok) {
        Toast.show({
          content: 'Successfully logged in with Google',
          duration: 2000,
        })
        router.push('/')
      }
    } catch (error) {
      console.error('Google login error:', error)
      Toast.show({
        content: 'Failed to login with Google',
        duration: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-[500px] mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl min-h-screen">
          {/* Header */}
          <div className="px-6 py-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700">
            <div className="mb-4">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <UserOutline className="text-blue-500 dark:text-blue-400" style={{ fontSize: '32px' }} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome</h1>
              <p className="text-blue-100 dark:text-blue-200 text-sm">
                Login to your account
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="px-6 py-8 bg-gray-50 dark:bg-gray-900">
            <Card className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700 shadow-sm">
              <div className="p-6">
                <Space direction="vertical" className="w-full" >
                  {/* Username Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <UserOutline className="inline mr-2" />
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleUsernameChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <LockOutline className="inline mr-2" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
                      >
                        {showPassword ? <EyeInvisibleOutline /> : <EyeOutline />}
                      </button>
                    </div>
                  </div>

                  {/* Login Button */}
                  <Button
                    block
                    type="submit"
                    loading={loading}
                    onClick={handleLogin}
                    className="!bg-gradient-to-r !from-blue-500 !to-purple-600 dark:!from-blue-600 dark:!to-purple-700 !border-none !text-white !font-semibold !py-3 !rounded-lg !shadow-lg hover:!shadow-xl !transition-all !duration-200"
                    style={{
                      '--adm-color-primary': 'rgb(59 130 246)',
                      '--adm-button-border-radius': '8px'
                    } as React.CSSProperties}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>

                  {/* Forgot Password */}
                  <div className="text-center">
                    <button
                      onClick={handleForgotPassword}
                      className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Divider className="!text-gray-400 dark:!text-gray-500">or</Divider>

                  {/* Google Login Button */}
                  <Button
                    block
                    loading={loading}
                    onClick={handleGoogleLogin}
                    className="!bg-white dark:!bg-gray-700 !border-gray-300 dark:!border-gray-600 !text-gray-700 dark:!text-gray-300 !font-medium !py-3 !rounded-lg hover:!bg-gray-50 dark:hover:!bg-gray-600 !transition-all !duration-200 !shadow-sm"
                    style={{
                      '--adm-button-border-radius': '8px'
                    } as React.CSSProperties}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Login with Google</span>
                    </div>
                  </Button>

                  {/* Register Button */}
                  <Button
                    block
                    onClick={handleRegister}
                    className="!bg-gray-100 dark:!bg-gray-700 !border-gray-300 dark:!border-gray-600 !text-gray-700 dark:!text-gray-300 !font-medium !py-3 !rounded-lg hover:!bg-gray-200 dark:hover:!bg-gray-600 !transition-all !duration-200"
                    style={{
                      '--adm-button-border-radius': '8px'
                    } as React.CSSProperties}
                  >
                    Create new account
                  </Button>
                </Space>
              </div>
            </Card>
          </div>

          {/* Footer */}
          <div className="mt-auto px-6 py-6 text-center bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              © 2024 EarnFromAds BD. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Secure login powered by advanced authentication
            </p>
          </div>
        </div>
      </div>

      {/* OTP Popup */}
      <OtpPopup
        isOpen={showOtpPopup}
        onClose={handleCloseOtp}
        onVerify={handleOtpVerify}
        phoneNumber={pendingLoginData?.phoneNumber}
        email={pendingLoginData?.email}
        loading={otpLoading}
        resendOtp={handleResendOtp}
      />
    </div>
  )
}
