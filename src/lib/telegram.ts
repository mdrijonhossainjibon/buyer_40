// Telegram Web App Integration Utility
// Handles communication between the web app and Telegram bot

interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
      is_premium?: boolean
    }
    chat?: {
      id: number
      type: string
      title?: string
      username?: string
    }
    start_param?: string
    auth_date: number
    hash: string
  }
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
    secondary_bg_color?: string
  }
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean
  sendData: (data: string) => void
  ready: () => void
  close: () => void
  expand: () => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
  onEvent: (eventType: string, eventHandler: () => void) => void
  offEvent: (eventType: string, eventHandler: () => void) => void
  showPopup: (params: {
    title?: string
    message: string
    buttons?: Array<{
      id?: string
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
      text: string
    }>
  }, callback?: (buttonId: string) => void) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
  showScanQrPopup: (params: {
    text?: string
  }, callback?: (text: string) => void) => void
  closeScanQrPopup: () => void
  readTextFromClipboard: (callback?: (text: string) => void) => void
  requestWriteAccess: (callback?: (granted: boolean) => void) => void
  requestContact: (callback?: (granted: boolean, contact?: any) => void) => void
}
 
export interface LoginData {
  action: 'login'
  userId: number
  username?: string
  timestamp: number
  sessionId?: string
  deviceInfo?: {
    platform: string
    version: string
    colorScheme: string
    language: string
  }
  userAgent?: string
  location?: {
    latitude?: number
    longitude?: number
  }
}

export interface TelegramLoginResult {
  success: boolean
  message: string
  data?: any
}

export class TelegramWebAppManager {
  private static instance: TelegramWebAppManager
  private tg: TelegramWebApp | null = null
  private isInitialized = false
  private initializationPromise: Promise<boolean> | null = null

  private constructor() {}

  public static getInstance(): TelegramWebAppManager {
    if (!TelegramWebAppManager.instance) {
      TelegramWebAppManager.instance = new TelegramWebAppManager()
    }
    return TelegramWebAppManager.instance
  }

  /**
   * Initialize Telegram Web App
   */
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true
    }

    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = new Promise((resolve) => {
      const checkTelegram = () => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          this.tg = window.Telegram.WebApp
          this.tg.ready()
          this.isInitialized = true
          
          console.log('✅ Telegram Web App initialized:', {
            version: this.tg.version,
            platform: this.tg.platform,
            user: this.tg.initDataUnsafe.user,
            colorScheme: this.tg.colorScheme
          })
          
          resolve(true)
        } else {
          console.warn('⚠️ Telegram Web App not available, running in web mode')
          resolve(false)
        }
      }

      // Check immediately
      checkTelegram()

      // If not available, wait a bit and try again
      if (!this.isInitialized) {
        setTimeout(checkTelegram, 1000)
      }
    })

    return this.initializationPromise
  }

  /**
   * Check if running inside Telegram Web App
   */
  public isTelegramWebApp(): boolean {
    return this.isInitialized && this.tg !== null
  }

  /**
   * Get Telegram user data
   */
  public getTelegramUser() {
    if (!this.tg?.initDataUnsafe.user) {
      return null
    }

    return {
      id: this.tg.initDataUnsafe.user.id,
      firstName: this.tg.initDataUnsafe.user.first_name,
      lastName: this.tg.initDataUnsafe.user.last_name,
      username: this.tg.initDataUnsafe.user.username,
      languageCode: this.tg.initDataUnsafe.user.language_code,
      isPremium: this.tg.initDataUnsafe.user.is_premium
    }
  }

  /**
   * Send login data to Telegram bot
   */
  public async sendLoginData(userId: number, username?: string, additionalData?: any): Promise<TelegramLoginResult> {
    try {
      if (!this.isTelegramWebApp()) {
        console.log('📱 Not running in Telegram Web App, skipping sendData')
        return {
          success: false,
          message: 'Not running in Telegram Web App'
        }
      }

      const telegramUser = this.getTelegramUser()
      
      const loginData: LoginData = {
        action: 'login',
        userId,
        username,
        timestamp: Date.now(),
        sessionId: this.generateSessionId(),
        deviceInfo: {
          platform: this.tg!.platform,
          version: this.tg!.version,
          colorScheme: this.tg!.colorScheme,
          language: telegramUser?.languageCode || 'en'
        },
        userAgent: navigator.userAgent,
        ...additionalData
      }

      // Send data to Telegram bot
      this.tg!.sendData(JSON.stringify(loginData))

      console.log('📤 Login data sent to Telegram bot:', loginData)

      // Also send to our backend API for logging
      await this.logLoginToBackend(loginData)

      return {
        success: true,
        message: 'Login data sent successfully',
        data: loginData
      }

    } catch (error) {
      console.error('❌ Failed to send login data:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Send login data to backend API for logging
   */
  private async logLoginToBackend(loginData: LoginData): Promise<void> {
    try {
      const response = await fetch('/api/telegram/login-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...loginData,
          telegramUser: this.getTelegramUser(),
          initData: this.tg?.initData
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('✅ Login logged to backend:', result)

    } catch (error) {
      console.error('❌ Failed to log login to backend:', error)
      // Don't throw error here, as this is optional logging
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Show Telegram popup notification
   */
  public showNotification(message: string, title?: string): void {
    if (!this.isTelegramWebApp()) {
      console.log('📱 Web mode - showing browser alert:', message)
      alert(message)
      return
    }

    this.tg!.showPopup({
      title: title || 'EarnFromAds BD',
      message,
      buttons: [{ type: 'ok', text: 'OK' }]
    })
  }

  /**
   * Show success notification for login
   */
  public showLoginSuccess(username?: string): void {
    const message = username 
      ? `🎉 Welcome back, ${username}! You have successfully logged in to EarnFromAds BD.`
      : '🎉 Login successful! Welcome to EarnFromAds BD.'

    this.showNotification(message, '✅ Login Successful')
  }

  /**
   * Apply Telegram theme to the app
   */
  public applyTelegramTheme(): void {
    if (!this.isTelegramWebApp()) return

    const theme = this.tg!.themeParams
    const isDark = this.tg!.colorScheme === 'dark'

    // Apply theme colors to CSS variables
    if (theme.bg_color) {
      document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color)
    }
    if (theme.text_color) {
      document.documentElement.style.setProperty('--tg-text-color', theme.text_color)
    }
    if (theme.button_color) {
      document.documentElement.style.setProperty('--tg-button-color', theme.button_color)
    }

    // Toggle dark mode based on Telegram theme
    if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-prefers-color-scheme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-prefers-color-scheme', 'light')
    }

    console.log('🎨 Applied Telegram theme:', { colorScheme: this.tg!.colorScheme, theme })
  }

  /**
   * Get device and location info
   */
  public async getDeviceInfo(): Promise<any> {
    const info: any = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }

    // Get location if available
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            enableHighAccuracy: false
          })
        })
        
        info.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
      } catch (error) {
        console.log('📍 Location not available:', error)
      }
    }

    return info
  }

  /**
   * Close Telegram Web App
   */
  public close(): void {
    if (this.isTelegramWebApp()) {
      this.tg!.close()
    }
  }

  /**
   * Expand Telegram Web App
   */
  public expand(): void {
    if (this.isTelegramWebApp()) {
      this.tg!.expand()
    }
  }
}

// Export singleton instance
export const telegramWebApp = TelegramWebAppManager.getInstance()

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  telegramWebApp.initialize()
}
