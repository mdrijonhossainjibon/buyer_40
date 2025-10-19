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
import { toast } from 'react-toastify'



  export async function showAlternatingAds(zoneId: string, userId: number, dispatch: any) {
  // Define all ad providers in rotation
  const ads = ["load", "giga", "adexora"];

  // Get last state from localStorage
  let lastAd = localStorage.getItem("lastAd");

  // Find index of last shown ad
  let lastIndex = ads.indexOf(lastAd || "");

  // Calculate next ad index (rotate)
  let nextIndex = (lastIndex + 1) % ads.length;
  let nextAd = ads[nextIndex];

  // Show the next ad
  if (nextAd === "load") {
    await LoadAds(zoneId);
  } else if (nextAd === "giga") {
    await window.showGiga?.();
  } else if (nextAd === "adexora") {
    await window.showAdexora?.();
  }

  // Dispatch ad watch request
  dispatch(watchAdRequest(userId));

  // Save state
  localStorage.setItem("lastAd", nextAd);

  return nextAd;
}
 


 
export default function TasksPage() {
  const [isWatchingAd, setIsWatchingAd] = useState(false)

  const user = useSelector((state: RootState) => state.user);
  const adsSettings = useSelector((state: RootState) => state.adsSettings);
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
      toast.error('Your account has been suspended!')
      return
    }


    showAlternatingAds(adsSettings.monetagZoneId, user.userId as any, dispatch)


  }

  const openChannel = () => {
    window.open('https://t.me/TheAuraEarner', '_blank')
  }

  const checkChannel = async () => {
    if (user.telegramBonus && user.telegramBonus > 0) {
      toast.error('Already claimed!')
      return
    }
    try {

      // Dispatch Redux action to claim channel bonus
      if (user.userId) {
        dispatch(claimChannelRequest(user.userId))
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
    window.open('https://www.youtube.com/@TheAuraEarner', '_blank')
  }

  const claimYoutube = async () => {
    if (user.youtubeBonus && user.youtubeBonus > 0) {
      toast.error('Already claimed!')
      return
    }



    try {
      // Use Promise instead of setTimeout for better error handling
      await new Promise(resolve => setTimeout(resolve, 2500))

      // Dispatch Redux action to claim YouTube bonus
      if (user.userId) {
        dispatch(claimYoutubeRequest(user.userId))

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
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">Earn <b>{adsSettings.defaultAdsReward || 0}</b> USDT for each ad.</p>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">Verify to start earning by watching ads!</p>


        <button
          className="w-full p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={watchAd}
          disabled={isWatchingAd || (user.watchedToday || 0) >= (adsSettings.adsWatchLimit || 5000) || user.status === 'suspend'}
        >
          watch Ads
        </button>
        <p className="mt-2.5 text-sm opacity-80 text-gray-600 dark:text-gray-400">
          Stay on the ad for {adsSettings.minWatchTime || 30} seconds to get the reward.
        </p>
      </div>

      <div className="p-5 rounded-xl text-center mb-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <i className="fab fa-telegram text-5xl mb-4 text-blue-600 dark:text-blue-400"></i>
        <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Join our Telegram Channel</h3>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">Join the channel, then come back and click &quot;Check &amp; Claim&quot;.</p>
        <div className="flex gap-2.5">
          <button className="flex-1 p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200" onClick={openChannel}>
            <span>Open Channel</span>
          </button>
          <button
            className="flex-1 p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={checkChannel}
            disabled={Boolean(user.telegramBonus && user.telegramBonus > 0)}
          >
            <span>
              {((user.telegramBonus && user.telegramBonus > 0)) ? (
                <>
                  <i className="fas fa-check-circle text-green-300 mr-1"></i>
                  Claimed!
                </>
              ) : (
                <>
                  <i className="fas fa-search mr-1"></i>
                  Check & Claim
                </>
              )}
            </span>
          </button>
        </div>
        <p className="mt-2.5 text-sm opacity-80 text-gray-600 dark:text-gray-400">
          Earn 0.007$ USDT by joining our Telegram channel!
        </p>

      </div>

      <div className="p-5 rounded-xl text-center mb-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <i className="fab fa-youtube text-5xl mb-4 text-red-600 dark:text-red-400"></i>
        <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Subscribe our YouTube</h3>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">Click Open YouTube, subscribe, then click &quot;Check &amp; Claim&quot;.</p>
        <div className="flex gap-2.5">
          <button className="flex-1 p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors duration-200" onClick={openYoutube}>
            <span>Open YouTube</span>
          </button>
          <button
            className="flex-1 p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={claimYoutube}
            disabled={Boolean(user.youtubeBonus && user.youtubeBonus > 0)}
          >
            <span>
              {((user.youtubeBonus && user.youtubeBonus > 0)) ? (
                <>
                  <i className="fas fa-check-circle text-green-300 mr-1"></i>
                  Claimed!
                </>
              ) : (
                <>
                  <i className="fas fa-search mr-1"></i>
                  Check & Claim
                </>
              )}
            </span>
          </button>
        </div>
        <p className="mt-2.5 text-sm opacity-80 text-gray-600 dark:text-gray-400">
          Earn 0.007$ USDT by subscribing to our YouTube channel!
        </p>



      </div>
    </div>
  )
}
