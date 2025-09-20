'use client'

import { useState } from 'react'
import CustomToast from '@/components/CustomToast'
import { RootState } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import { LoadAds } from '@/lib/ads'
import { 
  watchAdRequest, 
  claimYoutubeRequest, 
  claimChannelRequest 
} from '@/store/modules/user/actions'

 
 
 
export default function TasksPage() {
  const [isWatchingAd, setIsWatchingAd] = useState(false)
  const [channelClaimed, setChannelClaimed] = useState(false)
  const [youtubeClaimed, setYoutubeClaimed] = useState(false)
  const user = useSelector((state: RootState) => state.user);
  const  adsSettings   = useSelector((state: RootState) => state.adsSettings);
  const dispatch = useDispatch();

  const watchAd = async () => {
    if (user.watchedToday >= 5000) {
      CustomToast.show({
        content: 'Daily ad limit reached!',
        duration: 2000,
      })
      return
    }

    if (user.status === 'suspend') {
      CustomToast.show({
        content: 'Your account has been suspended!',
        duration: 2000,
      })
      return
    }

    setIsWatchingAd(true)
    
    CustomToast.show({
      content: 'Watching ad...',
      duration: 3000,
    })

    // Rewarded interstitial
    try {
      // Use the exposed ad function from AdsLoader
      if (typeof window !== 'undefined' && (window.showGigaAd || window.showGiga)) {
        const adFunction = window.showGigaAd || window.showGiga
        if (adFunction) {
          try {
            const response = await adFunction()
            // Handle successful ad completion
            CustomToast.show({
              content: 'Ad watched successfully! Reward credited.',
              duration: 2000,
            })
            
            // Dispatch Redux action to credit the reward
            if (user.userId) {
              dispatch(watchAdRequest(user.userId))
            }
          } catch (error) {
            console.error('Giga ads error:', error)
            CustomToast.show({
              content: 'Failed to complete ad watching',
              duration: 2000,
            })
          }
        }
      } else {
        CustomToast.show({
          content: 'Ad service not available',
          duration: 2000,
        })
      }
    } catch (error) {
      console.error('Ad watching error:', error)
      CustomToast.show({
        content: 'Failed to start ad watching',
        duration: 2000,
      })
    } finally {
      setIsWatchingAd(false)
    }

    
    /* if (adsSettings.monetagEnabled) {
      LoadAds(adsSettings.monetagZoneId).then(() => {
        try {
          // Simulate ad watching delay
          setTimeout(async () => {
            try {
              const { response } = await API_CALL({
                baseURL,
                method: 'POST',
                url: '/watch-ad',
                body: {
                
                  ...generateSignature(user.userId?.toString() || '0', process.env.NEXT_PUBLIC_SECRET_KEY || '')
                }
              })
    
              if (response && response.success) {
                CustomToast.show({
                  content: response.message,
                  duration: 2000,
                })
              } else {
                CustomToast.show({
                  content: response?.message || 'Failed to watch ad',
                  duration: 2000,
                })
              }
            } catch (error) {
              console.error('Watch ad error:', error)
              CustomToast.show({
                content: 'Failed to process ad watching',
                duration: 2000,
              })
            } finally {
              setIsWatchingAd(false)
            }
          }, 3000)
        } catch (error) {
          setIsWatchingAd(false)
          CustomToast.show({
            content: 'Failed to start ad watching',
            duration: 2000,
          })
        }
       })
    } */

   
  }

  const openChannel = () => {
    window.open('https://t.me/earnfromads1', '_blank')
  }

  const checkChannel = async () => {
    if (user.telegramBonus && user.telegramBonus > 0) {
      CustomToast.show({
        content: 'Already claimed!',
        duration: 2000,
      })
      return
    }

    CustomToast.show({
      content: 'Checking channel...',
      duration: 2000,
      type: 'loading'
    })
    
    try {
      // Use Promise instead of setTimeout for better error handling
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Dispatch Redux action to claim channel bonus
      if (user.userId) {
        dispatch(claimChannelRequest(user.userId))
        setChannelClaimed(true)
      }
    } catch (error) {
      console.error('Telegram bonus error:', error)
      CustomToast.show({
        content: 'Failed to process telegram bonus',
        duration: 2000,
      })
    }
  }

  const openYoutube = () => {
    window.open('https://www.youtube.com/@earnfromads-1', '_blank')
  }
 
  const claimYoutube = async () => {
    if (user.youtubeBonus && user.youtubeBonus > 0) {
      CustomToast.show({
        content: 'Already claimed!',
        duration: 2000,
      })
      return
    }
 
    CustomToast.show({
      content: 'Checking subscription...',
      duration: 2000,
      type: 'loading'
    })
    
    try {
      // Use Promise instead of setTimeout for better error handling
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Dispatch Redux action to claim YouTube bonus
      if (user.userId) {
        dispatch(claimYoutubeRequest(user.userId))
        setYoutubeClaimed(true)
      }
    } catch (error) {
      console.error('YouTube bonus error:', error)
      CustomToast.show({
        content: 'Failed to process YouTube bonus',
        duration: 2000,
      })
    }
  }

  return (
    <div className="block animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Complete Tasks</h2>

      <div className="p-5 rounded-xl text-center mb-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <i className="fas fa-video text-5xl mb-4 text-blue-600 dark:text-blue-400"></i>
        <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Rewarded Ad</h3>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">প্রতিটি বিজ্ঞাপনের জন্য <b>{adsSettings.defaultAdsReward || 0}</b> টাকা আয় করুন।</p>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">অ্যাড দেখে আয় করতে ভেরিফাই করুন!</p>
        <button
          className="w-full p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={watchAd}
          disabled={isWatchingAd || (user.watchedToday || 0) >= (adsSettings.adsWatchLimit || 5000) || user.status === 'suspend'}
        >
          <span>{isWatchingAd ? 'Watching Ad...' : 'Watch Ad'}</span>
        </button>
        <p className="mt-2.5 text-sm opacity-80 text-gray-600 dark:text-gray-400">
          পুরস্কার পেতে {adsSettings.minWatchTime || 30} সেকেন্ডের জন্য বিজ্ঞাপনে থাকুন।
        </p>
      </div>

      <div className="p-5 rounded-xl text-center mb-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <i className="fab fa-telegram text-5xl mb-4 text-blue-600 dark:text-blue-400"></i>
        <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Join our Telegram Channel</h3>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">চ্যানেলে জয়েন করুন, তারপর ফিরে এসে &quot;Check &amp; Claim&quot; দিন।</p>
        <div className="flex gap-2.5">
          <button className="flex-1 p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200" onClick={openChannel}>
            <span>Open Channel</span>
          </button>
          <button className="flex-1 p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-200" onClick={checkChannel}>
            <span>Check & Claim</span>
          </button>
        </div>
        <p className="mt-2.5 text-sm opacity-80 text-gray-600 dark:text-gray-400">
          Earn 15 BDT by joining our Telegram channel!
        </p>
        {(channelClaimed || (user.telegramBonus && user.telegramBonus > 0)) && (
          <small className="block mt-1.5 opacity-80 text-gray-600 dark:text-gray-400">
            ✅ Channel bonus claimed!
          </small>
        )}
      </div>

      <div className="p-5 rounded-xl text-center mb-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <i className="fab fa-youtube text-5xl mb-4 text-red-600 dark:text-red-400"></i>
        <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Subscribe our YouTube</h3>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">Open YouTube এ ক্লিক করুন, সাবস্ক্রাইব করুন, তারপর &quot;Check &amp; Claim&quot; দিন।</p>
        <div className="flex gap-2.5">
          <button className="flex-1 p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors duration-200" onClick={openYoutube}>
            <span>Open YouTube</span>
          </button>
          <button
            className="flex-1 p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={claimYoutube}
   
          >
            <span>{ 'Check & Claim'}</span>
          </button>
        </div>
        <p className="mt-2.5 text-sm opacity-80 text-gray-600 dark:text-gray-400">
          Earn 15 BDT by subscribing to our YouTube channel!
        </p>
       
        
        {(youtubeClaimed || (user.youtubeBonus && user.youtubeBonus > 0)) && (
          <small className="block mt-1.5 opacity-80 text-gray-600 dark:text-gray-400">
            ✅ YouTube bonus claimed!
          </small>
        )}
      </div>
    </div>
  )
}
