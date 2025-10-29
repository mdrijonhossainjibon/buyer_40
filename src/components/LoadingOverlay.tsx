'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { fetchUserDataRequest } from '../store/modules/user/actions'
import { socketConnectRequest } from '../store/modules/socket/actions'
import { getCurrentUser } from '../lib/getCurrentUser'

interface LoadingOverlayProps {
  visible: boolean
  onClose?: () => void
}

export default function LoadingOverlay({ visible, onClose }: LoadingOverlayProps) {
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state: RootState) => state.user)
  const [progress, setProgress] = useState(0)

  // Initialize app on mount
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      dispatch(fetchUserDataRequest())
    }
  }, [dispatch])

  // Connect to WebSocket when user data is loaded
  useEffect(() => {
    if (!isLoading && visible) {
      dispatch(socketConnectRequest())
    }
  }, [isLoading, visible, dispatch])

  // Progress animation
  useEffect(() => {
    if (!visible) {
      setProgress(0)
      return
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (isLoading) {
          return Math.min(prev + Math.random() * 3 + 1, 85)
        } else {
          return Math.min(prev + Math.random() * 8 + 5, 100)
        }
      })
    }, 100)

    return () => clearInterval(interval)
  }, [visible, isLoading])

  // Auto-close when complete
  useEffect(() => {
    if (!isLoading && progress >= 100 && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading, progress, onClose])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Binance-style animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-8 text-center px-6 py-8">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/50">
            <span className="text-3xl font-bold text-white">E</span>
          </div>
          <h1 className="text-2xl font-bold text-white">EarnFromAds BD</h1>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading text */}
        <div className="text-sm text-gray-400 animate-pulse">
          {isLoading ? 'Loading your account...' : 'Getting ready...'}
        </div>
      </div>
    </div>
  )
}