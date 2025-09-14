// Import the existing Redis implementation
import { redisCache as existingRedisCache } from './redis'

// Re-export the existing Redis cache
export const redisCache = existingRedisCache

// Database query caching wrapper
export async function cacheDbQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  // Try to get from cache first
  const cached = await redisCache.get<T>(key)
  if (cached) {
    return cached
  }

  // Execute query and cache result
  const result = await queryFn()
  await redisCache.set(key, result, ttl)
  
  return result
}

// Cache invalidation helpers
export const cacheInvalidation = {
  user: async (userId: string) => {
    await redisCache.invalidatePattern(`user:${userId}*`)
  },
  
  tasks: async (userId?: string) => {
    if (userId) {
      await redisCache.invalidatePattern(`tasks:${userId}*`)
    } else {
      await redisCache.invalidatePattern('tasks:*')
    }
  },
  
  ads: async (userId?: string) => {
    if (userId) {
      await redisCache.invalidatePattern(`ads:*:${userId}*`)
    } else {
      await redisCache.invalidatePattern('ads:*')
    }
  },
  
  all: async () => {
    await redisCache.invalidatePattern('*')
  }
}
