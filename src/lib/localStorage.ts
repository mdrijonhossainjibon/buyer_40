/**
 * LocalStorage utility for managing user account persistence
 * Prevents multiple accounts from being used in the same browser
 */

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'earnfromads_current_user_id',
  CURRENT_USERNAME: 'earnfromads_current_username',
  ACCOUNT_LOCKED: 'earnfromads_account_locked'
} as const

export interface StoredUserData {
  userId: number
  username: string
  lockedAt: number
}

/**
 * Check if localStorage is available
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && 'localStorage' in window
  } catch {
    return false
  }
}

/**
 * Get the currently stored user data
 */
export const getStoredUserData = (): StoredUserData | null => {
  if (!isLocalStorageAvailable()) return null
  
  try {
    const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)
    const username = localStorage.getItem(STORAGE_KEYS.CURRENT_USERNAME)
    const lockedAt = localStorage.getItem(STORAGE_KEYS.ACCOUNT_LOCKED)
    
    if (userId && username && lockedAt) {
      return {
        userId: parseInt(userId, 10),
        username,
        lockedAt: parseInt(lockedAt, 10)
      }
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error)
  }
  
  return null
}

/**
 * Store user data in localStorage
 */
export const storeUserData = (userId: number, username: string): void => {
  if (!isLocalStorageAvailable()) return
  
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId.toString())
    localStorage.setItem(STORAGE_KEYS.CURRENT_USERNAME, username)
    localStorage.setItem(STORAGE_KEYS.ACCOUNT_LOCKED, Date.now().toString())
  } catch (error) {
    console.error('Error storing to localStorage:', error)
  }
}

/**
 * Check if a different user is trying to access the app
 */
export const isAccountSwitchAttempt = (newUserId: number ): boolean => {
  const storedData = getStoredUserData()
  
  if (!storedData) return false
  
  return storedData.userId !== newUserId 
}

/**
 * Check if the current user matches the stored user
 */
export const isCurrentUserValid = (userId: number ): boolean => {
  const storedData = getStoredUserData()
  
  if (!storedData) return true // No stored data means first time user
  
  return storedData.userId === userId
}

/**
 * Clear stored user data (for logout or account reset)
 */
export const clearStoredUserData = (): void => {
  if (!isLocalStorageAvailable()) return
  
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID)
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USERNAME)
    localStorage.removeItem(STORAGE_KEYS.ACCOUNT_LOCKED)
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

/**
 * Get account lock duration in hours
 */
export const getAccountLockDuration = (): number => {
  const storedData = getStoredUserData()
  
  if (!storedData) return 0
  
  const hoursSinceLock = (Date.now() - storedData.lockedAt) / (1000 * 60 * 60)
  return Math.max(0, 24 - hoursSinceLock) // 24 hour lock period
}

/**
 * Check if account lock has expired (24 hours)
 */
export const isAccountLockExpired = (): boolean => {
  return getAccountLockDuration() <= 0
}

/**
 * Force unlock account (admin function)
 */
export const forceUnlockAccount = (): void => {
  clearStoredUserData()
}
