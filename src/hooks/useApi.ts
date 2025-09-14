import useSWR, { mutate } from 'swr'
import useSWRMutation from 'swr/mutation'
import { api, cacheKeys, mutationConfig } from '@/lib/swr-config'

// Custom hook for user data
export function useUser(userId: string | null) {
  const { data, error, isLoading, mutate: revalidate } = useSWR(
    userId ? cacheKeys.user(userId) : null,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  )

  return {
    user: data,
    isLoading,
    isError: error,
    revalidate,
  }
}

// Custom hook for tasks
export function useTasks(userId?: string, category?: string) {
  const { data, error, isLoading, mutate: revalidate } = useSWR(
    cacheKeys.tasks(userId, category),
    {
      refreshInterval: 60000, // Refresh every minute
    }
  )

  return {
    tasks: data || [],
    isLoading,
    isError: error,
    revalidate,
  }
}

// Custom hook for ads
export function useAds(userId?: string, limit?: number) {
  const { data, error, isLoading, mutate: revalidate } = useSWR(
    cacheKeys.ads(userId, limit),
    {
      refreshInterval: 30000, // Refresh every 30 seconds for fresh ads
    }
  )

  return {
    ads: data || [],
    isLoading,
    isError: error,
    revalidate,
  }
}

// Mutation hook for completing tasks
export function useCompleteTask() {
  return useSWRMutation(
    '/tasks',
    async (url, { arg }: { arg: { taskId: string; userId: string } }) => {
      const response = await api.post(url, arg)
      // Return both the response data and the userId for cache invalidation
      return { ...response.data, userId: arg.userId }
    },
    {
      ...mutationConfig,
      onSuccess: (data, key, config) => {
        // Revalidate related data using userId from returned data
        mutate(cacheKeys.tasks(data.userId))
        mutate(cacheKeys.user(data.userId))
      },
    }
  )
}

// Mutation hook for watching ads
export function useWatchAd() {
  return useSWRMutation(
    '/ads',
    async (url, { arg }: { arg: { adId: string; userId: string; watchDuration: number } }) => {
      const response = await api.post(url, arg)
      // Return both the response data and the userId for cache invalidation
      return { ...response.data, userId: arg.userId }
    },
    {
      ...mutationConfig,
      onSuccess: (data, key, config) => {
        // Revalidate related data using userId from returned data
        mutate(cacheKeys.ads(data.userId))
        mutate(cacheKeys.user(data.userId))
      },
    }
  )
}

// Mutation hook for updating user data
export function useUpdateUser() {
  return useSWRMutation(
    (userId: string) => cacheKeys.user(userId),
    async (url, { arg }: { arg: { userId: string; data: any } }) => {
      const response = await api.put(`/user/${arg.userId}`, arg.data)
      // Return both the response data and the userId for cache invalidation
      return { ...response.data, userId: arg.userId }
    },
    {
      ...mutationConfig,
      onSuccess: (data, key, config) => {
        // Update cache with new data using userId from returned data
        mutate(cacheKeys.user(data.userId), data, false)
      },
    }
  )
}

// Hook for cache invalidation
export function useCacheInvalidation() {
  const invalidateUser = (userId: string) => {
    mutate(cacheKeys.user(userId))
  }

  const invalidateTasks = (userId?: string, category?: string) => {
    mutate(cacheKeys.tasks(userId, category))
  }

  const invalidateAds = (userId?: string, limit?: number) => {
    mutate(cacheKeys.ads(userId, limit))
  }

  const invalidateAll = () => {
    mutate(() => true) // Invalidate all cache
  }

  return {
    invalidateUser,
    invalidateTasks,
    invalidateAds,
    invalidateAll,
  }
}

// Hook for optimistic updates
export function useOptimisticUpdate() {
  const updateUserBalance = (userId: string, amount: number) => {
    mutate(
      cacheKeys.user(userId),
      (currentData: any) => {
        if (!currentData) return currentData
        return {
          ...currentData,
          balanceTK: currentData.balanceTK + amount,
        }
      },
      false // Don't revalidate immediately
    )
  }

  const updateWatchedToday = (userId: string) => {
    mutate(
      cacheKeys.user(userId),
      (currentData: any) => {
        if (!currentData) return currentData
        return {
          ...currentData,
          watchedToday: currentData.watchedToday + 1,
        }
      },
      false
    )
  }

  return {
    updateUserBalance,
    updateWatchedToday,
  }
}
