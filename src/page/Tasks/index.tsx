'use client'

import { useEffect, useMemo } from 'react'
 
import { useSelector, useDispatch } from 'react-redux'
 
import { fetchTasksRequest, claimTaskRequest } from 'modules/tasks'
import { RootState } from 'modules';
import { Image } from 'antd-mobile';
 

export default function TasksPage() {

  
  const user = useSelector((state: RootState) => state.user);
  const { tasks: tasksData, isLoading } = useSelector((state: RootState) => state.tasks);
 
  const dispatch = useDispatch();

  // Fetch tasks on component mount
  useEffect(() => {
    if (user.userId) {
      dispatch(fetchTasksRequest(user.userId))
    }
  }, [user.userId, dispatch])

  const handleClaim = (id: string) => {
    
      dispatch(claimTaskRequest(id))
 
  }

  // Calculate statistics
  // const stats = useMemo(() => {
  //   const total = tasksData.length
  //   const completed = tasksData.filter(t => t.claimed).length
  //   const pending = total - completed
  //   const totalRewards = tasksData.reduce((sum, t) => sum + (t.claimed ? parseFloat(t.reward) : 0), 0)
  //   
  //   return { total, completed, pending, totalRewards }
  // }, [tasksData])

   

  // All tasks without filtering
  const filteredTasks = useMemo(() => {
    return tasksData
  }, [tasksData])

 
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="px-3 py-4">
        <div className="space-y-2.5 pb-24">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-200 dark:border-blue-900"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-t-blue-600 dark:border-t-blue-400 absolute top-0 left-0"></div>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 font-medium">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex items-center justify-center min-h-[50vh]">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 text-center max-w-xs w-full">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-inbox text-2xl text-gray-400 dark:text-gray-500"></i>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">No Tasks Available</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Check back later for new tasks!
            </p>
          </div>
            </div>
          ) : (
            <div className="space-y-2">
          {filteredTasks.map((task) => (
            <div
              key={task.id}   
              className="relative bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow transition-all duration-150 overflow-hidden group"
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-150"></div>
              
              <div className="relative">
                <div className="flex items-start gap-2.5 mb-2.5">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    {task.icon ? (
                      task.icon.startsWith('http') || task.icon.startsWith('/') ? (
                        <Image
                          src={task.icon} 
                          alt={task.title}
                          width={22}
                          height={22}
                          className="w-5.5 h-5.5 object-contain"
                        />
                      ) : (
                        <svg className="w-5.5 h-5.5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d={task.icon} />
                        </svg>
                      )
                    ) : (
                      <i className="fas fa-tasks text-white text-base"></i>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {task.title}
                      </h3>
                      {task.claimed && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full flex items-center gap-0.5 flex-shrink-0">
                          <i className="fas fa-check-circle text-[9px]"></i>
                          Done
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1.5 line-clamp-2">
                      {task.description}
                    </p>
                    
                    {/* Reward Badge */}
                    <div className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-800 rounded-lg px-2 py-1">
                      <i className="fas fa-star text-xs text-purple-600 dark:text-purple-400"></i>
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                        +{task.reward} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => window.open(task.link, '_blank')}
                    className="flex-1 py-2 px-3 rounded-lg font-semibold text-xs text-white transition-all duration-150 hover:shadow hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: task.buttonColor || '#3b82f6' }}
                  >
                    <i className="fas fa-external-link-alt text-[10px]"></i>
                    {task.buttonLabel || 'Visit'}
                  </button>
                  <button
                    onClick={() => handleClaim(task.id)}
                    disabled={task.claimed}
                    className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs text-white transition-all duration-150 flex items-center justify-center gap-1.5 ${
                      task.claimed 
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow hover:scale-[1.01] active:scale-95'
                    }`}
                  >
                    {task.claimed ? (
                      <>
                        <i className="fas fa-check-circle text-[10px]"></i>
                        Claimed
                      </>
                    ) : (
                      <>
                        <i className="fas fa-gift text-[10px]"></i>
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
      </div>
    </div>
  )
}
