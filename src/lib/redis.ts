import Redis from 'ioredis'

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
}

// Create Redis instance
let redis: Redis | null = null

export function getRedisClient(): Redis | null {
  if (!redis) {
    try {
      redis = new Redis(redisConfig)
      
      redis.on('error', (err) => {
        console.warn('Redis connection error:', err.message)
        redis = null
      })
      
      redis.on('connect', () => {
        console.log('Redis connected successfully')
      })
    } catch (error) {
      console.warn('Failed to create Redis client:', error)
      return null
    }
  }
  
  return redis
}

// Cache utilities
export class RedisCache {
  private redis: Redis | null

  constructor() {
    this.redis = getRedisClient()
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null
    
    try {
      const value = await this.redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.warn('Redis get error:', error)
      return null
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    if (!this.redis) return false
    
    try {
      const serialized = JSON.stringify(value)
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, serialized)
      } else {
        await this.redis.set(key, serialized)
      }
      return true
    } catch (error) {
      console.warn('Redis set error:', error)
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.redis) return false
    
    try {
      await this.redis.del(key)
      return true
    } catch (error) {
      console.warn('Redis del error:', error)
      return false
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.redis) return false
    
    try {
      const result = await this.redis.exists(key)
      return result === 1
    } catch (error) {
      console.warn('Redis exists error:', error)
      return false
    }
  }

  async invalidatePattern(pattern: string): Promise<boolean> {
    if (!this.redis) return false
    
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
      return true
    } catch (error) {
      console.warn('Redis invalidatePattern error:', error)
      return false
    }
  }
}

// Export singleton instance
export const redisCache = new RedisCache()
