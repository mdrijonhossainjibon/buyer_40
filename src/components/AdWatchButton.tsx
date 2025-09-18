'use client'

import { useState } from 'react'
import { Button, Toast, Modal } from 'antd-mobile'
import { useAds } from '@/hooks/useAds'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

interface AdWatchButtonProps {
  onAdWatched?: (reward: number) => void
  className?: string
  size?: 'mini' | 'small' | 'middle' | 'large'
  disabled?: boolean
}

export default function AdWatchButton({ 
  onAdWatched, 
  className = '',
  size = 'middle',
  disabled = false 
}: AdWatchButtonProps) {
  const { isAdAvailable, isWatching, watchAd, adsSettings } = useAds()
  const user = useSelector((state: RootState) => state.user)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleWatchAd = async () => {
    setShowConfirmModal(false)
    
    if (!isAdAvailable) {
      Toast.show({
        content: 'No ads available right now',
        position: 'center',
        duration: 2000,
      })
      return
    }

    // Show loading toast
    const loadingToast = Toast.show({
      content: 'Loading ad...',
      position: 'center',
      duration: 0, // Don't auto dismiss
    })

    try {
      const result = await watchAd()
      
      // Dismiss loading toast
      loadingToast.close()

      if (result.success) {
        Toast.show({
          content: `🎉 ${result.message} You earned ${result.reward || adsSettings.adEarningAmount} BDT!`,
          position: 'center',
          duration: 3000,
        })

        // Call the callback if provided
        if (onAdWatched && result.reward) {
          onAdWatched(result.reward)
        }

        // Send reward to backend
        await submitAdWatch(result.reward || adsSettings.adEarningAmount)
      } else {
        Toast.show({
          content: result.message,
          position: 'center',
          duration: 2000,
        })
      }
    } catch (error) {
      loadingToast.close()
      Toast.show({
        content: 'Failed to watch ad. Please try again.',
        position: 'center',
        duration: 2000,
      })
    }
  }

  const submitAdWatch = async (reward: number) => {
    try {
      const timestamp = Date.now().toString()
      const hash = btoa(`${user.userId}-${timestamp}-${reward}`)
      
      // This would typically include proper signature generation
      const response = await fetch('/api/tasks/watch-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          timestamp,
          signature: hash, // In production, use proper signature
          hash,
        }),
      })

      const data = await response.json()
      
      if (!data.success) {
        console.error('Failed to submit ad watch:', data.message)
      }
    } catch (error) {
      console.error('Error submitting ad watch:', error)
    }
  }

  const getButtonText = () => {
    if (isWatching) return 'Watching Ad...'
    if (!adsSettings.adWatchEnabled) return 'Ads Disabled'
    if (user.watchedToday >= adsSettings.dailyAdLimit) return 'Daily Limit Reached'
    return `Watch Ad (+${adsSettings.adEarningAmount} BDT)`
  }

  const getButtonColor = () => {
    if (isWatching) return 'warning'
    if (!isAdAvailable) return 'default'
    return 'success'
  }

  const isButtonDisabled = disabled || isWatching || !isAdAvailable

  return (
    <>
      <Button
        className={`${className} transition-all duration-200`}
        size={size}
        color={getButtonColor()}
        disabled={isButtonDisabled}
        loading={isWatching}
        onClick={() => setShowConfirmModal(true)}
        block
      >
        {getButtonText()}
      </Button>

      <Modal
        visible={showConfirmModal}
        content={
          <div className="text-center py-4">
            <div className="text-4xl mb-4">📺</div>
            <h3 className="text-lg font-semibold mb-2">Watch Rewarded Ad</h3>
            <p className="text-gray-600 mb-4">
              You will earn <strong>{adsSettings.adEarningAmount} BDT</strong> for watching this ad.
            </p>
            <p className="text-sm text-gray-500">
              Minimum watch time: {adsSettings.minWatchTime} seconds
            </p>
            <div className="mt-4 text-xs text-gray-400">
              Daily Progress: {user.watchedToday}/{adsSettings.dailyAdLimit} ads watched
            </div>
          </div>
        }
        closeOnAction
        onClose={() => setShowConfirmModal(false)}
        actions={[
          {
            key: 'cancel',
            text: 'Cancel',
         
          },
          {
            key: 'watch',
            text: 'Watch Ad',
            
            onClick: handleWatchAd,
          },
        ]}
      />
    </>
  )
}
