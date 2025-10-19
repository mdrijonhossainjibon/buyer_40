'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { fetchUserDataRequest, setLoading } from '../store/modules/user/actions'
import { getCurrentUser } from '../lib/getCurrentUser'


interface LoadingOverlayProps {
  visible: boolean
  onClose?: () => void

}

export default function LoadingOverlay({
  visible,
  onClose,

}: LoadingOverlayProps) {
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state: RootState) => state.user)

  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Initializing...')
  const [dataFetched, setDataFetched] = useState(false)
  const [telegramStatus, setTelegramStatus] = useState<'checking' | 'available' | 'unavailable' | 'error'>('checking')
  const [telegramData, setTelegramData] = useState<any>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [firstName, setFirstName] = useState<string | null>(null)
  const [lastName, setLastName] = useState<string | null>(null)
  const [startParam, setStartParam] = useState<string | null>(null)

  // Telegram Web App detection using getCurrentUser
  useEffect(() => {
    if (!visible) return

    const detectTelegram = async () => {
      try {
        setTelegramStatus('checking')
        setLoadingText('Checking Telegram Web App...')

        // Initialize Telegram WebApp if available
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp
          tg.ready()

          // Request write access for enhanced user data
          tg.requestWriteAccess?.((granted) => {
            console.log('Write access:', granted ? 'granted' : 'denied')
          })

          // Apply Telegram theme if available
          if (tg.themeParams) {
            document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#000000')
            document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#ffffff')
          }
        }

        // Use getCurrentUser to get user data
        const currentUser = getCurrentUser()

        if (currentUser) {
          setTelegramStatus('available')
          
          // Set user data from getCurrentUser
          setUserId(typeof currentUser.telegramId === 'number' ? currentUser.telegramId : parseInt(currentUser.telegramId))
          setUsername(currentUser.telegramUsername || currentUser.username)
          setFirstName(currentUser.username.split(' ')[0] || null)
          setLastName(currentUser.username.split(' ').slice(1).join(' ') || null)
          setStartParam(currentUser.start_param || null)

          // Set Telegram data
          if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp
            setTelegramData({
              initData: tg.initData || '',
              initDataUnsafe: tg.initDataUnsafe || {},
              platform: tg.platform || 'unknown',
              colorScheme: tg.colorScheme || 'dark',
              version: (tg as any).isVersionAtLeast?.('6.0') ? '6.0+' : 'legacy',
              user: currentUser
            })
          } else {
            // Development mode or web browser
            setTelegramData({
              initData: '',
              initDataUnsafe: {},
              platform: 'web',
              colorScheme: 'dark',
              version: 'mock',
              user: currentUser
            })
          }
        } else {
          setTelegramStatus('unavailable')
          console.warn('No user data available from getCurrentUser')
        }

      } catch (error) {
        console.error('Error detecting Telegram Web App:', error)
        setTelegramStatus('error')
      }
    }

    detectTelegram()
  }, [visible])

  // Fetch user data when component becomes visible and Telegram is checked
  useEffect(() => {
    if (visible && userId && !dataFetched && telegramStatus !== 'checking') {
      dispatch(setLoading(true))

      // Include Telegram data in the request if available
      const requestData: any = {
        userId,
        username,
        start_param: startParam,
        firstName,
        lastName
      }
 
      if (telegramStatus === 'available' && telegramData) {
        requestData.telegramData = telegramData
        requestData.platform = 'telegram'
      } else {
        requestData.platform = 'web'
      }

      
      setDataFetched(true)
    }
  }, [visible, userId, username, startParam, dispatch, dataFetched, telegramStatus, telegramData])


  // Fetch user data on mount using getCurrentUser
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      dispatch(fetchUserDataRequest())
    }
  }, [dispatch])


 

  useEffect(() => {
    if (!visible) {
      setProgress(0)
      setDataFetched(false)
      setTelegramStatus('checking')
      setTelegramData(null)
      setUserId(null)
      setUsername(null)
      setFirstName(null)
      setLastName(null)
      setStartParam(null)
      return
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        let newProgress = prev

        // Progress based on current state
        if (telegramStatus === 'checking') {
          // Slow progress during Telegram detection
          newProgress = Math.min(prev + Math.random() * 1 + 0.3, 25)
        } else if (isLoading) {
          // Medium progress during data loading
          newProgress = Math.min(prev + Math.random() * 2 + 0.5, 85)
        } else {
          // Fast progress when complete
          newProgress = Math.min(prev + Math.random() * 5 + 3, 100)
        }

        // Update loading text based on progress and current state
        if (telegramStatus === 'checking') {
          setLoadingText('Checking Telegram Web App...')
        } else if (newProgress < 30) {
          const platformText = telegramStatus === 'available' ? 'Telegram Web App' : 'Web Browser'
          setLoadingText(`Initializing ${platformText}...`)
        } else if (newProgress < 50) {
          setLoadingText('Loading configuration...')
        } else if (newProgress < 70) {
          setLoadingText(isLoading ? 'Fetching user data...' : 'Syncing profile data...')
        } else if (newProgress < 85) {
          setLoadingText(isLoading ? 'Processing account info...' : 'Connecting to server...')
        } else if (newProgress < 95) {
          setLoadingText('Finalizing setup...')
        } else {
          setLoadingText('Almost ready...')
        }

        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [visible, isLoading, telegramStatus])

  // Auto-close when loading is complete and progress reaches 100%
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
      {/* Content */}
      <div className="flex flex-col items-center gap-6 text-center px-6 py-8">

        {/* Platform Status Indicator */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${telegramStatus === 'checking' ? 'bg-yellow-500 animate-pulse' :
              telegramStatus === 'available' ? 'bg-green-500' :
                telegramStatus === 'error' ? 'bg-red-500' :
                  'bg-gray-500'
            }`}></div>
          <span className="text-xs text-gray-400">
            {telegramStatus === 'checking' ? 'Detecting Platform...' :
              telegramStatus === 'available' ? 'Telegram Web App' :
                telegramStatus === 'error' ? 'Platform Error' :
                  'Web Browser Mode'}
          </span>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <div className="text-sm text-gray-300">
            {error ? error : loadingText}
          </div>
        </div>

        {/* Fallback Mode Warning */}
        {telegramStatus === 'unavailable' && (
          <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-3 text-xs text-yellow-300 max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-400">⚠</span>
              <span>Web Browser Mode</span>
            </div>
            <div className="text-yellow-200/80">
              Running in fallback mode. Some Telegram features may be limited.
            </div>
          </div>
        )}

        {/* Simple progress bar */}
        <div className="w-64 space-y-2">
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${error ? 'bg-red-500' :
                  telegramStatus === 'available' ? 'bg-green-500' :
                    telegramStatus === 'checking' ? 'bg-yellow-500' :
                      'bg-blue-500'
                }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 text-center">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Status text */}
        <div className="text-xs text-gray-400">
          {error
            ? 'An error occurred while loading data'
            : progress < 100
              ? 'Please wait a moment...'
              : 'Loading complete!'
          }
        </div>

      
      </div>

      {/* Simple footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <div className="text-xs text-gray-500">
          Developed by Future Apps Developer
        </div>
      </div>
    </div>
  )
}