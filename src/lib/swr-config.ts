import axios from 'axios'

// Configure axios instance with default settings
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// SWR fetcher function
export const fetcher = (url: string) => api.get(url).then(res => res.data)

// SWR configuration
export const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 0, // Disable automatic refresh by default
  dedupingInterval: 2000, // Dedupe requests within 2 seconds
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  onError: (error: any) => {
    console.error('SWR Error:', error)
    // You can add error reporting here
  },
  onSuccess: (data: any, key: string) => {
    // Optional: Log successful requests
    console.log(`SWR Success for ${key}:`, data)
  }
}

// Cache key generators
export const cacheKeys = {
  user: (id: string) => `/user/${id}`,
  tasks: (userId?: string, category?: string) => {
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    if (category) params.append('category', category)
    return `/tasks?${params.toString()}`
  },
  ads: (userId?: string, limit?: number) => {
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    if (limit) params.append('limit', limit.toString())
    return `/ads?${params.toString()}`
  },
  stats: () => '/stats',
  leaderboard: (type?: string) => `/leaderboard${type ? `?type=${type}` : ''}`,
}

// Mutation helpers
export const mutationConfig = {
  revalidate: true,
  populateCache: true,
  rollbackOnError: true,
}
