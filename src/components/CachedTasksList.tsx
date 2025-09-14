'use client'

import { useTasks, useCompleteTask } from '@/hooks/useApi'
import { useState } from 'react'

interface CachedTasksListProps {
  userId: string
  category?: string
}

export default function CachedTasksList({ userId, category = 'all' }: CachedTasksListProps) {
  const { tasks, isLoading, isError, revalidate } = useTasks(userId, category)
  const { trigger: completeTask, isMutating } = useCompleteTask()
  const [completingTask, setCompletingTask] = useState<string | null>(null)

  const handleCompleteTask = async (taskId: string) => {
    setCompletingTask(taskId)
    try {
      await completeTask({ taskId, userId })
      // SWR will automatically revalidate the data
    } catch (error) {
      console.error('Failed to complete task:', error)
    } finally {
      setCompletingTask(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
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
        <p className="text-red-600 mb-2">Failed to load tasks</p>
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
        <h3 className="text-lg font-semibold text-gray-800">Available Tasks</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
            Cached • Auto-refresh: 1min
          </span>
          <button
            onClick={() => revalidate()}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ↻
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No tasks available at the moment</p>
          <p className="text-sm text-gray-500 mt-1">Check back later for new tasks</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task: any) => (
            <div key={task.id} className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{task.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-600 font-semibold">৳{task.reward}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.type === 'youtube' ? 'bg-red-100 text-red-600' :
                      task.type === 'telegram' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {task.type}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  {task.completed ? (
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm">
                      ✓ Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={completingTask === task.id || isMutating}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {completingTask === task.id ? 'Completing...' : 'Complete'}
                    </button>
                  )}
                </div>
              </div>
              
              {task.url && (
                <div className="mt-3 pt-3 border-t">
                  <a
                    href={task.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <span>Open Link</span>
                    <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                    </svg>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
