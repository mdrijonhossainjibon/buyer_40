'use client'

import { useEffect } from 'react'
import { Tag } from 'antd'
import CustomToast from '@/components/CustomToast'
import { RootState } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import {
  claimYoutubeRequest,
  claimChannelRequest
} from '@/store/modules/user/actions'
import { fetchTasksRequest, claimTaskRequest } from '@/store/modules/tasks/actions'
import { getPlatformStyles } from '@/lib/getPlatformStyles'



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
    if (user.userId) {
      dispatch(claimTaskRequest(user.userId, id))
    }
  }

  // Map task data to render format with auto-detected styles
  const tasks = tasksData.map(task => {
    const styles = getPlatformStyles(task.platform)
    return {
      id: task.id,
      icon: <i className={`${styles.icon} text-3xl ${styles.iconColor}`}></i>,
      title: task.title,
      description: task.description,
      reward: `${task.reward} USDT`,
      claimed: task.claimed,
      actions: [
        {
          label: styles.buttonLabel,
          type: 'primary' as const,
          onClick: () => window.open(task.link, '_blank'),
          style: { backgroundColor: styles.buttonColor }
        },
        {
          label: task.claimed ? 'Claimed' : 'Check & Claim',
          type: 'primary' as const,
          onClick: () => handleClaim(task.id),
          disabled: task.claimed,
          icon: task.claimed ? <i className="fas fa-check-circle"></i> : <i className="fas fa-search"></i>,
          style: { backgroundColor: '#52c41a' }
        }
      ]
    }
  })

  return (
    <div className="block animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Complete Tasks</h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-start gap-4 mb-4">
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex-shrink-0">
                {task.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {task.title}
                  </h3>
                  {task.claimed && (
                    <Tag color="success" className="text-xs">
                      Completed
                    </Tag>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {task.description}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">💰</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Reward: {task.reward}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {task.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm text-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: action.disabled ? '#9ca3af' : action.style?.backgroundColor
                  }}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  )
}
