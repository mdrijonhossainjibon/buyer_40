'use client'

import { useAds, useWatchAd, useOptimisticUpdate } from '@/hooks/useApi'
import { useState } from 'react'

interface CachedAdsListProps {
  userId: string
  limit?: number
}

export default function CachedAdsList({ userId, limit = 10 }: CachedAdsListProps) {
  const { ads, isLoading, isError, revalidate } = useAds(userId, limit)
  const { trigger: watchAd, isMutating } = useWatchAd()
  const { updateUserBalance, updateWatchedToday } = useOptimisticUpdate()
  const [watchingAd, setWatchingAd] = useState<string | null>(null)

  const handleWatchAd = async (ad: any) => {
    setWatchingAd(ad.id)
    
    // Optimistic updates
    updateUserBalance(userId, ad.reward)
    updateWatchedToday(userId)
    
    try {
      await watchAd({
        adId: ad.id,
        userId,
        watchDuration: ad.duration
      })
    } catch (error) {
      console.error('Failed to record ad watch:', error)
      // Revert optimistic updates on error
      updateUserBalance(userId, -ad.reward)
      updateWatchedToday(userId)
    } finally {
      setWatchingAd(null)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-3"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 mb-2">Failed to load ads</p>
        <button
          onClick={() => revalidate()}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Available Ads</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
            Cached • Auto-refresh: 30s
          </span>
          <button
            onClick={() => revalidate()}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ↻
          </button>
        </div>
      </div>

      {ads.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No ads available at the moment</p>
          <p className="text-sm text-gray-500 mt-1">New ads are added regularly</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad: any) => (
            <div key={ad.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-3xl mb-2">📺</div>
                  <p className="text-sm opacity-90">{ad.duration}s video</p>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-2">{ad.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{ad.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-green-600 font-bold text-lg">৳{ad.reward}</span>
                  <span className="text-gray-500 text-sm">{ad.duration} seconds</span>
                </div>
                
                <button
                  onClick={() => handleWatchAd(ad)}
                  disabled={watchingAd === ad.id || isMutating || !ad.available}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                >
                  {watchingAd === ad.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Watching...
                    </span>
                  ) : !ad.available ? (
                    'Not Available'
                  ) : (
                    `Watch & Earn ৳${ad.reward}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Ads refresh automatically every 30 seconds for the latest content
        </p>
      </div>
    </div>
  )
}
