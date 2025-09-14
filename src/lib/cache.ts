// Cache utilities for Next.js application
import { NextRequest, NextResponse } from 'next/server'
import { redisCache } from './redis'

// In-memory cache for development/simple caching
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  revalidate?: number // Revalidation time in seconds
  tags?: string[] // Cache tags for invalidation
}

// Simple in-memory cache
export class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl * 1000, // Convert to milliseconds
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Get all keys matching a pattern
  getKeys(pattern?: string): string[] {
    const keys = Array.from(this.cache.keys())
    if (!pattern) return keys
    return keys.filter(key => key.includes(pattern))
  }

  // Invalidate cache by tags
  invalidateByTag(tag: string): void {
    const keys = this.getKeys(tag)
    keys.forEach(key => this.delete(key))
  }
}

// Global cache instance
export const memoryCache = new MemoryCache()

// Cache key generator
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|')
  return `${prefix}:${sortedParams}`
}

// Cache wrapper for API routes
export function withCache(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: CacheOptions = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const { ttl = 300, revalidate, tags = [] } = options
    
    // Generate cache key from URL and method
    const cacheKey = generateCacheKey('api', {
      url: req.url,
      method: req.method,
    })

    // Try to get from cache
    const cachedData = memoryCache.get(cacheKey)
    if (cachedData) {
      const response = NextResponse.json(cachedData)
      response.headers.set('X-Cache', 'HIT')
      response.headers.set('Cache-Control', `public, max-age=${ttl}, stale-while-revalidate=${revalidate || ttl}`)
      return response
    }

    // Execute handler
    const response = await handler(req)
    
    // Cache successful responses
    if (response.ok) {
      const data = await response.clone().json()
      memoryCache.set(cacheKey, data, ttl)
      
      // Set cache headers
      response.headers.set('X-Cache', 'MISS')
      response.headers.set('Cache-Control', `public, max-age=${ttl}, stale-while-revalidate=${revalidate || ttl}`)
      
      // Add cache tags
      if (tags.length > 0) {
        response.headers.set('Cache-Tags', tags.join(','))
      }
    }

    return response
  }
}

// Revalidate cache by tag
export function revalidateTag(tag: string): void {
  memoryCache.invalidateByTag(tag)
}

// Cache decorator for functions
export function cached<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: CacheOptions = {}
): T {
  const { ttl = 300 } = options
  
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const cacheKey = generateCacheKey(fn.name, { args })
    
    const cached = memoryCache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    const result = await fn(...args)
    memoryCache.set(cacheKey, result, ttl)
    
    return result
  }) as T
}

// Cache middleware for database queries
export async function cacheQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  const cached = memoryCache.get(key)
  if (cached) {
    return cached
  }
  
  const result = await queryFn()
  memoryCache.set(key, result, ttl)
  
  return result
}

// Cache warming utility
export async function warmCache(keys: string[], fetcher: (key: string) => Promise<any>): Promise<void> {
  const promises = keys.map(async (key) => {
    try {
      const data = await fetcher(key)
      memoryCache.set(key, data, 3600) // 1 hour default
    } catch (error) {
      console.error(`Failed to warm cache for key: ${key}`, error)
    }
  })
  
  await Promise.allSettled(promises)
}

// Cache statistics
export function getCacheStats(): {
  size: number
  keys: string[]
  hitRate?: number
} {
  return {
    size: memoryCache['cache'].size,
    keys: memoryCache.getKeys(),
  }
}
