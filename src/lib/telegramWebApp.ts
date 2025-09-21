// Simplified Telegram Web App Integration
// Handles the tg.sendData() functionality for login tracking

export interface LoginTrackingData {
  action: 'login'
  userId: number
  username?: string
  timestamp: number
  sessionId: string
  platform?: string
  version?: string
  colorScheme?: string
  userAgent?: string
}

export class TelegramWebAppHelper {
  private static instance: TelegramWebAppHelper
  private isInitialized = false

  private constructor() {}

  public static getInstance(): TelegramWebAppHelper {
    if (!TelegramWebAppHelper.instance) {
      TelegramWebAppHelper.instance = new TelegramWebAppHelper()
    }
    return TelegramWebAppHelper.instance
  }

  /**
   * Initialize and check if Telegram Web App is available
   */
  public async initialize(): Promise<boolean> {
    if (typeof window === 'undefined') return false

    // Wait for Telegram Web App to load
    await new Promise(resolve => setTimeout(resolve, 500))

    const tg = (window as any).Telegram?.WebApp
    if (tg) {
      try {
        tg.ready()
        this.isInitialized = true
        console.log('✅ Telegram Web App initialized')
        return true
      } catch (error) {
        console.warn('⚠️ Telegram Web App initialization failed:', error)
      }
    }

    console.log('📱 Running in web browser mode')
    return false
  }

  /**
   * Check if running inside Telegram Web App
   */
  public isTelegramWebApp(): boolean {
    return this.isInitialized && typeof window !== 'undefined' && (window as any).Telegram?.WebApp
  }

  /**
   * Get Telegram user information
   */
  public getTelegramUser(): any {
    if (!this.isTelegramWebApp()) return null

    const tg = (window as any).Telegram.WebApp
    return tg.initDataUnsafe?.user || null
  }

  /**
   * Send login data using tg.sendData()
   */
  public async sendLoginData(userId: number, username?: string): Promise<boolean> {
    try {
      if (!this.isTelegramWebApp()) {
        console.log('📱 Not in Telegram Web App, skipping sendData')
        return false
      }

      const tg = (window as any).Telegram.WebApp
      const telegramUser = this.getTelegramUser()

      const loginData: LoginTrackingData = {
        action: 'login',
        userId: telegramUser?.id || userId,
        username: username || telegramUser?.username,
        timestamp: Date.now(),
        sessionId: this.generateSessionId(),
        platform: tg.platform,
        version: tg.version,
        colorScheme: tg.colorScheme,
        userAgent: navigator.userAgent
      }

      // Send data to Telegram bot using tg.sendData()
      tg.sendData(JSON.stringify(loginData))

      console.log('📤 Login data sent to Telegram bot:', loginData)

      // Also log to our backend
      await this.logToBackend(loginData)

      return true

    } catch (error) {
      console.error('❌ Failed to send login data:', error)
      return false
    }
  }

  /**
   * Send data to backend API for logging
   */
  private async logToBackend(data: LoginTrackingData): Promise<void> {
    try {
      const response = await fetch('/api/telegram/login-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          telegramUser: this.getTelegramUser(),
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        console.log('✅ Login data logged to backend')
      }
    } catch (error) {
      console.warn('⚠️ Failed to log to backend:', error)
      // Don't throw - this is optional
    }
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Show Telegram popup or browser alert
   */
  public showNotification(message: string, title = 'EarnFromAds BD'): void {
    if (this.isTelegramWebApp()) {
      const tg = (window as any).Telegram.WebApp
      tg.showPopup({
        title,
        message,
        buttons: [{ type: 'ok', text: 'OK' }]
      })
    } else {
      alert(`${title}: ${message}`)
    }
  }

  /**
   * Apply Telegram theme
   */
  public applyTelegramTheme(): void {
    if (!this.isTelegramWebApp()) return

    const tg = (window as any).Telegram.WebApp
    const isDark = tg.colorScheme === 'dark'

    if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-prefers-color-scheme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-prefers-color-scheme', 'light')
    }

    console.log('🎨 Applied Telegram theme:', tg.colorScheme)
  }

  /**
   * Show login success notification
   */
  public showLoginSuccess(username?: string): void {
    const message = username 
      ? `🎉 Welcome back, ${username}! Login successful.`
      : '🎉 Login successful! Welcome to EarnFromAds BD.'

    this.showNotification(message, '✅ Login Successful')
  }
}

// Export singleton instance
export const telegramWebApp = TelegramWebAppHelper.getInstance()

// Auto-initialize
if (typeof window !== 'undefined') {
  telegramWebApp.initialize()
}
