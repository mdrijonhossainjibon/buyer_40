'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { RootState } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
 
import { fetchTasksRequest, claimTaskRequest } from '@/store/modules/tasks/actions'
import { getPlatformStyles } from '@/lib/getPlatformStyles'

export default function TasksPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const touchStartY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const user = useSelector((state: RootState) => state.user);
  const { tasks: tasksData, isLoading } = useSelector((state: RootState) => state.tasks);
 
  const dispatch = useDispatch();

  // Fetch tasks on component mount
  useEffect(() => {
    if (user.userId) {
      dispatch(fetchTasksRequest(user.userId))
    }
  }, [user.userId, dispatch])

  // Pull to refresh handler
  const handleRefresh = async () => {
    if (user.userId && !isRefreshing) {
      setIsRefreshing(true)
      dispatch(fetchTasksRequest(user.userId, true)) // Pass true for showToast
      
      // Simulate minimum refresh time for better UX
      setTimeout(() => {
        setIsRefreshing(false)
        setPullDistance(0)
        setIsPulling(false)
      }, 1000)
    }
  }

  // Touch event handlers for pull-to-refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0 && !isRefreshing) {
      const touchY = e.touches[0].clientY
      const distance = touchY - touchStartY.current

      if (distance > 0) {
        setIsPulling(true)
        setPullDistance(Math.min(distance, 120)) // Max 120px pull
      }
    }
  }

  const handleTouchEnd = () => {
    if (pullDistance > 80 && !isRefreshing) {
      handleRefresh()
    } else {
      setPullDistance(0)
      setIsPulling(false)
    }
  }

  const handleClaim = (id: string) => {
    if (user.userId) {
      dispatch(claimTaskRequest(user.userId, id))
    }
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasksData.length
    const completed = tasksData.filter(t => t.claimed).length
    const pending = total - completed
    const totalRewards = tasksData.reduce((sum, t) => sum + (t.claimed ? parseFloat(t.reward) : 0), 0)
    
    return { total, completed, pending, totalRewards }
  }, [tasksData])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(tasksData.map(t => t.platform))]
    return cats
  }, [tasksData])

  // Filter tasks by category
  const filteredTasks = useMemo(() => {
    if (selectedCategory === 'all') return tasksData
    return tasksData.filter(t => t.platform === selectedCategory)
  }, [tasksData, selectedCategory])

  // Map task data to render format with auto-detected styles
  const tasks = filteredTasks.map(task => {
    const styles = getPlatformStyles(task.platform)
    return {
      id: task.id,
      platform: task.platform,
      icon: styles.icon,
      iconColor: styles.iconColor,
      title: task.title,
      description: task.description,
      reward: task.reward,
      claimed: task.claimed,
      link: task.link,
      buttonLabel: styles.buttonLabel,
      buttonColor: styles.buttonColor
    }
  })

  return (
    <div 
      ref={containerRef}
      className="pb-6 animate-fade-in overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        transform: `translateY(${isPulling ? pullDistance * 0.5 : 0}px)`,
        transition: isPulling ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {/* Pull to Refresh Indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden"
        style={{ 
          height: `${pullDistance * 0.5}px`,
          opacity: pullDistance / 120,
          transition: isPulling ? 'none' : 'all 0.3s ease-out'
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className={`${isRefreshing || pullDistance > 80 ? 'animate-spin' : ''}`}>
            <i className="fas fa-sync-alt text-2xl text-blue-600 dark:text-blue-400"></i>
          </div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {isRefreshing ? 'Refreshing...' : pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
          </p>
        </div>
      </div>
    
      {/* Tasks List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-900"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 dark:border-t-blue-400 absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 text-center max-w-sm w-full">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-inbox text-3xl text-gray-400 dark:text-gray-500"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Tasks Available</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCategory === 'all' 
                ? 'Check back later for new tasks!'
                : `No ${selectedCategory} tasks available.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}   
              className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              <div className="relative">
                <div className="flex items-start gap-3 mb-3">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${task.iconColor.replace('text-', 'from-')}-500 to-${task.iconColor.replace('text-', '')}-600 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <i className={`${task.icon} text-2xl text-white`}></i>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                        {task.title}
                      </h3>
                      {task.claimed && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full flex items-center gap-1 flex-shrink-0">
                          <i className="fas fa-check-circle"></i>
                          Done
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {task.description}
                    </p>
                    
                    {/* Reward Badge */}
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-2.5 py-1">
                      <i className="fas fa-coins text-yellow-600 dark:text-yellow-400"></i>
                      <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
                        +{task.reward} USDT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(task.link, '_blank')}
                    className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: task.buttonColor }}
                  >
                    <i className="fas fa-external-link-alt"></i>
                    {task.buttonLabel}
                  </button>
                  <button
                    onClick={() => handleClaim(task.id)}
                    disabled={task.claimed}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                      task.claimed 
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    {task.claimed ? (
                      <>
                        <i className="fas fa-check-circle"></i>
                        Claimed
                      </>
                    ) : (
                      <>
                        <i className="fas fa-gift"></i>
                        Claim Reward
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
