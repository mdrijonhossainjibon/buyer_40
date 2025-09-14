'use client'

import { useUser, useOptimisticUpdate } from '@/hooks/useApi'
import { useState } from 'react'

interface CachedUserProfileProps {
  userId: string
}

export default function CachedUserProfile({ userId }: CachedUserProfileProps) {
  const { user, isLoading, isError, revalidate } = useUser(userId)
  const { updateUserBalance } = useOptimisticUpdate()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await revalidate()
    setIsRefreshing(false)
  }

  const handleOptimisticUpdate = () => {
    // Example: Add 50 TK optimistically
    updateUserBalance(userId, 50)
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/50">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl w-48"></div>
            <div className="flex space-x-3">
              <div className="h-6 w-16 bg-slate-700 rounded-lg"></div>
              <div className="h-6 w-20 bg-slate-700 rounded-lg"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                <div className="h-4 bg-slate-600 rounded w-24"></div>
                <div className="h-5 bg-gradient-to-r from-slate-600 to-slate-500 rounded w-20"></div>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-700/50">
            <div className="h-4 bg-slate-700 rounded w-64 mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-48"></div>
          </div>
          <div className="h-12 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-gradient-to-br from-red-900/90 to-red-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-red-500/30">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-red-300 font-bold text-xl mb-1">Error Loading Profile</h3>
            <p className="text-red-400">Failed to load user data from cache</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
              Retrying...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="mr-2">🔄</span>
              Retry Loading
            </div>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
            <span className="text-white text-2xl">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-white">User Profile</h2>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50"
            disabled={isRefreshing}
          >
            <span className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`}>
              {isRefreshing ? '🔄' : '↻'}
            </span>
            Refresh
          </button>
          <div className="flex items-center px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-green-400 text-sm font-semibold">CACHED</span>
          </div>
        </div>
      </div>

      {user && (
        <div className="space-y-6">
          {/* User Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl p-6 border border-slate-600/30 hover:border-cyan-500/30 transition-all duration-300 group">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">User ID</p>
                  <p className="text-white font-bold text-lg">{user.id}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white">🆔</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-green-400 text-sm font-medium mb-1">Balance</p>
                  <p className="text-white font-bold text-2xl">৳{user.balanceTK}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-purple-400 text-sm font-medium mb-1">Referrals</p>
                  <p className="text-white font-bold text-xl">{user.referralCount}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white">👥</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 group">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-400 text-sm font-medium mb-1">Ads Watched</p>
                  <p className="text-white font-bold text-xl">{user.watchedToday}/{user.dailyAdLimit}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white">📺</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 rounded-xl p-6 border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300 group">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-indigo-400 text-sm font-medium mb-1">Telegram Bonus</p>
                  <p className="text-white font-bold text-xl">৳{user.telegramBonus}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white">📱</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 rounded-xl p-6 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 group">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-red-400 text-sm font-medium mb-1">YouTube Bonus</p>
                  <p className="text-white font-bold text-xl">৳{user.youtubeBonus}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white">🎥</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className={`rounded-xl p-6 border transition-all duration-300 ${
            user.isBotVerified 
              ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30 hover:border-green-400/50' 
              : 'bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-500/30 hover:border-red-400/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                  user.isBotVerified 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-r from-red-500 to-orange-500'
                }`}>
                  <span className="text-white text-2xl">
                    {user.isBotVerified ? '✅' : '❌'}
                  </span>
                </div>
                <div>
                  <p className={`text-sm font-medium mb-1 ${
                    user.isBotVerified ? 'text-green-400' : 'text-red-400'
                  }`}>
                    Bot Verification Status
                  </p>
                  <p className="text-white font-bold text-lg">
                    {user.isBotVerified ? 'Verified Account' : 'Not Verified'}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold ${
                user.isBotVerified 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {user.isBotVerified ? '✓ VERIFIED' : '✗ PENDING'}
              </div>
            </div>
          </div>
          
          {/* Cache Info */}
          <div className="pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-400">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                Last updated: {new Date(user.lastUpdated).toLocaleString()}
              </div>
              <div className="flex items-center text-cyan-400">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                Auto-refresh: 30s
              </div>
            </div>
          </div>

          {/* Optimistic Update Button */}
          <div className="pt-6">
            <button
              onClick={handleOptimisticUpdate}
              className="w-full bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-cyan-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-purple-500/25 hover:scale-105 transform"
            >
              <div className="flex items-center justify-center">
                <span className="mr-3 text-xl">⚡</span>
                Test Optimistic Update (+৳50)
                <span className="ml-3 text-xl">💰</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
