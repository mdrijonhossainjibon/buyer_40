'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { PullToRefresh, Skeleton, Popup, Toast } from 'antd-mobile'
import { RootState } from 'modules'
import { fetchBotStatusRequest } from 'modules/botStatus'

 

export default function ReferralPage() {
  const dispatch = useDispatch()
  const botStatus = useSelector((state: RootState) => state.botStatus)
  const user = useSelector((state: RootState) => state.user)
  const [showSharePopup, setShowSharePopup] = useState(false);

  const referralLink = `https://t.me/${botStatus.botUsername || undefined}/app?startapp=${user.referralCode || ''}`;

  useEffect(() => {
    dispatch(fetchBotStatusRequest());
  }, [dispatch]);


  const onRefresh = async () => {
    dispatch(fetchBotStatusRequest());
   
  }

  const copyReferralLink = async () => {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(referralLink)
        Toast.show({
          content: '✅ Referral link copied!',
          position: 'bottom',
          duration: 2000,
        })
        return
      }

      // Fallback for Telegram WebView and other restricted environments
      const textArea = document.createElement('textarea')
      textArea.value = referralLink
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)

      if (successful) {
        Toast.show({
          content: '✅ Referral link copied!',
          position: 'bottom',
          duration: 2000,
        })
      } else {
        throw new Error('Copy command failed')
      }
    } catch (err) {
      console.error('Failed to copy: ', err)
      Toast.show({
        content: 'Copy not supported',
        position: 'center',
        duration: 2000,
      })
    }
  }

  const shareOnTelegram = () => {
    const text = encodeURIComponent(
      `🎉 Join me on Earn From Ads and start earning by watching ads! You'll get 100 XP bonus for referring! Use my referral link: ${referralLink}`
    );
    window.open(`https://t.me/share/url?url=${referralLink}&text=${text}`, '_blank')
    setShowSharePopup(false)
  }

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `🎉 Join me on Earn From Ads and start earning by watching ads! You'll get 100 XP bonus for referring! ${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank')
    setShowSharePopup(false)
  }

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank')
    setShowSharePopup(false)
  }

  return (
    <PullToRefresh onRefresh={onRefresh}>
      <div className="pb-4 animate-fade-in">
        {/* Header Stats */}
        <div className="mx-4 mb-5">


          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800 shadow-md">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <i className="fas fa-user-friends text-white text-sm"></i>
                </div>
                <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">Total Referrals</p>
              </div>
              {botStatus.isLoading ? (
                <Skeleton.Title animated className="w-16 h-6" />
              ) : (
                <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{botStatus.referralCount}</p>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800 shadow-md">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <i className="fas fa-star text-white text-sm"></i>
                </div>
                <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">Per Referral</p>
              </div>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400">100 XP</p>
            </div>
          </div>
        </div>

        {/* Referral Link Card */}
        <div className="mx-4 mb-5">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-md">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <i className="fas fa-link text-blue-500"></i>
              Your Referral Link
            </h3>
            {botStatus.isLoading ? (
              <Skeleton.Paragraph lineCount={1} animated />
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-dashed border-gray-300 dark:border-gray-600 mb-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 break-all font-mono">{referralLink}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={copyReferralLink}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <i className="fas fa-copy text-sm"></i>
                <span className="text-xs">Copy Link</span>
              </button>
              <button
                onClick={() => setShowSharePopup(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <i className="fas fa-share-alt text-sm"></i>
                <span className="text-xs">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mx-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <i className="fas fa-info-circle text-blue-500 text-sm"></i>
            How It Works
          </h3>
          <div className="space-y-2.5">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">Share Your Link</p>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">Copy and share your unique referral link with friends</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 dark:text-green-400 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">Friends Join</p>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">They sign up using your referral link</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">Earn Rewards</p>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">Get 100 XP for each successful referral</p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Popup */}
        <Popup
          visible={showSharePopup}
          onMaskClick={() => setShowSharePopup(false)}
          bodyStyle={{
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            minHeight: '40vh',
            backgroundColor: 'var(--adm-color-background)',
          }}
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Share Via</h3>
              <button
                onClick={() => setShowSharePopup(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <i className="fas fa-times text-gray-600 dark:text-gray-400"></i>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={shareOnTelegram}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <i className="fab fa-telegram text-white text-2xl"></i>
                </div>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">Telegram</span>
              </button>

              <button
                onClick={shareOnWhatsApp}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <i className="fab fa-whatsapp text-white text-2xl"></i>
                </div>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">WhatsApp</span>
              </button>

              <button
                onClick={shareOnFacebook}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                  <i className="fab fa-facebook text-white text-2xl"></i>
                </div>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">Facebook</span>
              </button>
            </div>

            <button
              onClick={copyReferralLink}
              className="w-full mt-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <i className="fas fa-copy"></i>
              <span>Copy Link</span>
            </button>
          </div>
        </Popup>
      </div>
    </PullToRefresh>
  )
}
