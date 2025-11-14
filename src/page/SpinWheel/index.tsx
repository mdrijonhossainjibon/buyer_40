'use client'

import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  GiftOutlined,
  ThunderboltOutlined,
  DollarCircleOutlined,
  StarOutlined,
  FireOutlined,
  RocketOutlined,
  ClockCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons'
 
import {
  fetchSpinConfigRequest,
  spinWheelRequest,
  spinWithTicketRequest,
  clearSpinResult,
  setSpinning,
  
} from 'modules/spinWheel'
import { showAlternatingAds } from 'lib/ads'
import { RootState } from 'modules'
import { formatNumber } from 'lib/formatNumber'
import SpinResultPopup from 'components/SpinResult'
 



export default function SpinWheelPage() {
  const dispatch = useDispatch()


  // Redux state
  const spinWheel = useSelector((state: RootState) => state.spinWheel)
  const user = useSelector((state: RootState) => state.user)


  const {
    prizes = [],
    canSpin = false,
    nextSpinTime = null,
    spinResult: reduxSpinResult = null,
    isSpinning = false,
    isLoading = false,
    isWatchingAd = false,
    freeSpinsUsed = 0,
    maxFreeSpins = 4,
    extraSpinsUnlocked = 0,
    extraSpinsUsed = 0,
    maxExtraSpins = 6,
    spinTickets = 0,
    error = null
  } = spinWheel || {}

  // Local state
  const [rotation, setRotation] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const adsSettings = useSelector((state: RootState) => state.adsSettings);

  const wheelRef = useRef<HTMLDivElement>(null)

  // Fetch spin configuration on mount
  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchSpinConfigRequest(user.userId))
    }
  }, [dispatch, user?.userId])

  // Countdown timer for next spin
  useEffect(() => {
    if (!canSpin && nextSpinTime) {
      const interval = setInterval(() => {
        const now = Date.now()
        const timeLeft = nextSpinTime - now

        if (timeLeft <= 0) {
          setTimeRemaining('')
          clearInterval(interval)
        } else {
          const hours = Math.floor(timeLeft / (1000 * 60 * 60))
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [canSpin, nextSpinTime])

  // Handle spin result from Redux
  useEffect(() => {
    if (reduxSpinResult && !showResult && prizes?.length) {
      // Calculate winning segment angle
      const prizeIndex = prizes.findIndex(
        p => p.id === reduxSpinResult.prizeId
      )

      if (prizeIndex !== -1) {
        const segmentAngle = 360 / prizes.length
        const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2)
        const spins = 5 // Number of full rotations
        const finalRotation = spins * 360 + targetAngle

        setIsAnimating(true)
        setRotation(finalRotation)

        // Show result after animation
        setTimeout(() => {
          setIsAnimating(false)
          setShowResult(true)
          dispatch(setSpinning(false))
        }, 4000)
      }
    }
  }, [reduxSpinResult, showResult, prizes, dispatch])

  const handleSpin = async () => {
    if (isAnimating || !user?.userId) return

    // Priority: Free Spin > Extra Spin > Ticket Spin
    const hasFreeSpin = freeSpinsUsed < maxFreeSpins
    const hasExtraSpin = extraSpinsRemaining > 0



    if (hasFreeSpin || hasExtraSpin) {

        await showAlternatingAds(adsSettings?.monetagZoneId);
      setShowResult(false)
      dispatch(spinWheelRequest(user.userId))
    } else if (spinTickets > 0) {

        await showAlternatingAds(adsSettings?.monetagZoneId);
      setShowResult(false)
      dispatch(spinWithTicketRequest(user.userId))
    }
  }

  const handleCloseResult = () => {
    setShowResult(false)
    dispatch(clearSpinResult())
    setRotation(0)
  }


  // Calculate remaining spins
  const freeSpinsRemaining = Math.max(0, maxFreeSpins - freeSpinsUsed)

  // Auto-unlock extra spins when free spins are exhausted
  // If free spins used >= 4 and extra spins not yet unlocked, they should be unlocked automatically
  const shouldHaveExtraSpins = freeSpinsUsed >= maxFreeSpins
  const extraSpinsRemaining = shouldHaveExtraSpins
    ? Math.max(0, maxExtraSpins - extraSpinsUsed)
    : Math.max(0, extraSpinsUnlocked - extraSpinsUsed)

  const totalSpinsRemaining = freeSpinsRemaining + extraSpinsRemaining + spinTickets

  // Can spin if has free spins, extra spins, or tickets available
  const hasSpinsAvailable = freeSpinsRemaining > 0 || extraSpinsRemaining > 0 || spinTickets > 0

  // Check if all spins are exhausted (no free, no extra, no tickets)
  const allSpinsExhausted = freeSpinsRemaining === 0 && extraSpinsRemaining === 0 && spinTickets === 0

  // Determine button text and icon
  const getSpinButtonContent = () => {
    if (isAnimating || isSpinning) {
      return {
        icon: <ThunderboltOutlined className="text-xl" />,
        text: 'Spinning...',
        subtext: '',
        isWatchAd: false
      }
    }

    if (freeSpinsRemaining > 0) {
      return {
        icon: <GiftOutlined className="text-2xl" />,
        text: 'Free Spin',
        subtext: `${freeSpinsRemaining}/${maxFreeSpins}`,
        isWatchAd: false
      }
    }

    if (extraSpinsRemaining > 0) {
      return {
        icon: <StarOutlined className="text-2xl animate-pulse" />,
        text: 'Extra Spin',
        subtext: `${extraSpinsRemaining}/${maxExtraSpins} left`,
        isWatchAd: false
      }
    }

    if (spinTickets > 0) {
      return {
        icon: <FireOutlined className="text-2xl" />,
        text: 'Ticket Spin',
        subtext: `${spinTickets} tickets`,
        isWatchAd: false
      }
    }

    // All spins exhausted - show countdown
    if (allSpinsExhausted) {
      return {
        icon: <ClockCircleOutlined className="text-xl" />,
        text: 'All Spins Used',
        subtext: timeRemaining ? `Next in ${timeRemaining}` : 'Resets tomorrow',
        isWatchAd: false
      }
    }

    return {
      icon: <ClockCircleOutlined className="text-xl" />,
      text: 'No Spins Available',
      subtext: timeRemaining || 'Tomorrow',
      isWatchAd: false
    }
  }

  const spinButtonContent = getSpinButtonContent()

  // Use Redux prizes for display
  const displayPrizes = prizes.length > 0 ? prizes : [
    { id: '1', label: '50 XP', amount: 50, color: '#F0B90B', probability: 7 },
    { id: '2', label: '100 XP', amount: 100, color: '#FCD535', probability: 6 },
    { id: '3', label: '200 XP', amount: 200, color: '#FF6B35', probability: 5 },
    { id: '4', label: 'Thanx', amount: 0, color: '#2B3139', probability: 30 },
    { id: '5', label: 'Thanx', amount: 0, color: '#1E2329', probability: 25 },
    { id: '6', label: 'Thanx', amount: 0, color: '#F0B90B', probability: 20 },
    { id: '7', label: 'Thanx', amount: 0, color: '#FCD535', probability: 7 },
    { id: '8', label: 'Thanx', amount: 0, color: '#FF6B35', probability: 7 },
  ]

  // Get prize icon based on amount
  const getPrizeIcon = (amount: number) => {
    if (amount >= 50) return <RocketOutlined className="text-lg text-[#F0B90B]" />
    if (amount >= 20) return <FireOutlined className="text-lg text-[#FCD535]" />
    if (amount >= 10) return <StarOutlined className="text-lg text-[#F0B90B]" />
    if (amount >= 5) return <ThunderboltOutlined className="text-lg text-[#FCD535]" />
    return <DollarCircleOutlined className="text-base text-[#F0B90B]" />
  }

  const segmentAngle = 360 / displayPrizes.length

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0B0E11] dark:via-[#181A20] dark:to-[#0B0E11] overflow-hidden relative">
      <div className="min-h-full flex flex-col relative pb-40">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Glow Orbs */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-400/10 dark:bg-[#F0B90B]/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-300/8 dark:bg-[#FCD535]/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-yellow-400/8 dark:bg-[#F0B90B]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Floating Particles */}
          <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-400/8 dark:bg-[#F0B90B]/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-yellow-300/8 dark:bg-[#FCD535]/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-60 left-1/3 w-24 h-24 bg-yellow-400/10 dark:bg-[#F0B90B]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-60 right-1/3 w-48 h-48 bg-yellow-300/8 dark:bg-[#FCD535]/10 rounded-full blur-3xl animate-float"></div>

          {/* Sparkles */}
          <div className="absolute top-32 left-1/4 w-3 h-3 bg-yellow-500/40 dark:bg-[#F0B90B]/60 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-yellow-400/40 dark:bg-[#FCD535]/60 rounded-full animate-ping" style={{ animationDelay: '1.2s' }}></div>
          <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-yellow-500/40 dark:bg-[#F0B90B]/60 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-yellow-400/50 dark:bg-[#FCD535]/80 rounded-full animate-ping" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-yellow-500/50 dark:bg-[#F0B90B]/80 rounded-full animate-ping" style={{ animationDelay: '1.8s' }}></div>
        </div>

        {/* Binance-Style Stats Cards */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-2 px-3 py-3 relative z-10">
          {/* Free Spins Card */}
          <div className="group relative bg-white dark:bg-[#1E2329] hover:bg-gray-50 dark:hover:bg-[#2B3139] rounded-md p-3 border border-gray-200 dark:border-[#2B3139] hover:border-yellow-400 dark:hover:border-[#F0B90B]/40 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm">
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 dark:from-[#F0B90B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded bg-yellow-400/10 dark:bg-[#F0B90B]/10 flex items-center justify-center">
                  <GiftOutlined className="text-yellow-600 dark:text-[#F0B90B] text-sm" />
                </div>
                <span className="text-[11px] font-medium text-gray-600 dark:text-[#848E9C]">Free Spins</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-[#F0B90B] tracking-tight">
                {freeSpinsRemaining}<span className="text-lg text-gray-500 dark:text-[#848E9C]">/{maxFreeSpins}</span>
              </div>
            </div>
          </div>

          {/* Extra Spins Card */}
          <div className="group relative bg-white dark:bg-[#1E2329] hover:bg-gray-50 dark:hover:bg-[#2B3139] rounded-md p-3 border border-gray-200 dark:border-[#2B3139] hover:border-yellow-300 dark:hover:border-[#FCD535]/40 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm">
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/5 dark:from-[#FCD535]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded bg-yellow-300/10 dark:bg-[#FCD535]/10 flex items-center justify-center">
                  <StarOutlined className="text-yellow-500 dark:text-[#FCD535] text-sm" />
                </div>
                <span className="text-[11px] font-medium text-gray-600 dark:text-[#848E9C]">Extra Spins</span>
              </div>
              <div className="text-2xl font-bold text-yellow-500 dark:text-[#FCD535] tracking-tight">
                {extraSpinsRemaining}<span className="text-lg text-gray-500 dark:text-[#848E9C]">/{maxExtraSpins}</span>
              </div>
            </div>
          </div>

          {/* Spin Tickets Card */}
          <div className="group relative bg-white dark:bg-[#1E2329] hover:bg-gray-50 dark:hover:bg-[#2B3139] rounded-md p-3 border border-gray-200 dark:border-[#2B3139] hover:border-orange-400 dark:hover:border-[#FF6B35]/40 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm">
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 dark:from-[#FF6B35]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded bg-orange-400/10 dark:bg-[#FF6B35]/10 flex items-center justify-center">
                  <TrophyOutlined className="text-orange-600 dark:text-[#FF6B35] text-sm" />
                </div>
                <span className="text-[11px] font-medium text-gray-600 dark:text-[#848E9C]">Tickets</span>
              </div>
              <div className="text-2xl font-bold text-orange-600 dark:text-[#FF6B35] tracking-tight">
                {spinTickets || 0}
              </div>
            </div>
          </div>

          {/* XP Balance Card */}
          <div className="group relative bg-white dark:bg-[#1E2329] hover:bg-gray-50 dark:hover:bg-[#2B3139] rounded-md p-3 border border-gray-200 dark:border-[#2B3139] hover:border-green-400 dark:hover:border-[#0ECB81]/40 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm">
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 dark:from-[#0ECB81]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded bg-green-400/10 dark:bg-[#0ECB81]/10 flex items-center justify-center">
                  <StarOutlined className="text-green-600 dark:text-[#0ECB81] text-sm" />
                </div>
                <span className="text-[11px] font-medium text-gray-600 dark:text-[#848E9C]">XP Balance</span>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-[#0ECB81] tracking-tight">
                {formatNumber(user?.wallet.available.xp || 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Spin Wheel Container */}
        <div className="flex-1 flex items-center justify-center px-4 relative z-10">
          <div className="bg-white/90 dark:bg-[#1E2329]/80 backdrop-blur-xl rounded-3xl shadow-xl dark:shadow-[0_0_60px_rgba(240,185,11,0.15)] p-8 relative overflow-hidden border border-gray-200 dark:border-[#2B3139]">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #F0B90B 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400/10 dark:bg-[#F0B90B]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-yellow-300/10 dark:bg-[#FCD535]/15 rounded-full blur-3xl"></div>

            {/* Enhanced Wheel Container */}
            <div className="relative flex flex-col items-center justify-center">
              {/* Magnetic Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 -mt-4">
                <div className="relative">
                  {/* Outer Glow */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-20 bg-yellow-500/30 dark:bg-[#F0B90B]/40 rounded-full blur-2xl animate-pulse"></div>

                  {/* Main Pointer */}
                  <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-t-[48px] border-t-yellow-500 dark:border-t-[#F0B90B] drop-shadow-[0_8px_20px_rgba(234,179,8,0.6)] dark:drop-shadow-[0_8px_20px_rgba(240,185,11,0.6)]"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-yellow-400 dark:border-t-[#FCD535]"></div>

                  {/* Inner Highlight */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-white/30"></div>
                </div>
              </div>

              {/* Spin Wheel */}
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[450px] md:h-[450px] mx-auto">
                {/* Outer Glow Ring */}
                <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-yellow-400/20 via-yellow-300/15 to-yellow-400/20 dark:from-[#F0B90B]/30 dark:via-[#FCD535]/20 dark:to-[#F0B90B]/30 blur-3xl"></div>

                {/* Dotted Border Ring with Animation */}
                <div className="absolute -inset-4 rounded-full border-8 border-dotted border-yellow-500 dark:border-[#F0B90B] animate-spin" style={{ animationDuration: '20s' }}></div>

                {/* Decorative Dots on Border */}
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30) * Math.PI / 180
                  const radius = 180 // Distance from center
                  const x = 50 + radius * Math.cos(angle - Math.PI / 2)
                  const y = 50 + radius * Math.sin(angle - Math.PI / 2)
                  return (
                    <div
                      key={i}
                      className="absolute w-4 h-4 bg-yellow-500 dark:bg-[#F0B90B] rounded-full shadow-lg dark:shadow-[0_0_10px_rgba(240,185,11,0.6)]"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  )
                })}

                {/* Center GO Button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 z-10">
                  {/* Outer Glow */}
                  <div className="absolute inset-0 bg-yellow-500 dark:bg-[#F0B90B] rounded-full blur-2xl opacity-50 animate-pulse"></div>

                  {/* Main Button */}
                  <div className="relative w-full h-full bg-gradient-to-br from-yellow-500 to-yellow-400 dark:from-[#F0B90B] dark:to-[#FCD535] rounded-full shadow-xl dark:shadow-[0_0_30px_rgba(240,185,11,0.6)] flex items-center justify-center border-4 border-white dark:border-[#1E2329] cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 group">
                    {/* Inner Gradient */}
                    <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 to-yellow-500 dark:from-[#FCD535] dark:to-[#F0B90B] rounded-full opacity-50"></div>

                    {/* Text */}
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-3xl sm:text-4xl font-black text-white dark:text-[#1E2329] tracking-wider drop-shadow-lg">GO</span>
                      <div className="w-8 sm:w-10 h-1 bg-white/60 dark:bg-[#1E2329]/60 mt-1 rounded-full"></div>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Enhanced Spinning Wheel */}
                <div
                  ref={wheelRef}
                  className="relative w-full h-full"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isAnimating ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                  }}
                >
                  {/* Outer Border */}
                  <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-[#2B3139] shadow-xl dark:shadow-[0_0_40px_rgba(240,185,11,0.3)]"></div>

                  {/* Inner Wheel Container */}
                  <div className="absolute inset-2 rounded-full overflow-hidden shadow-inner dark:shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                    {/* Wheel Segments */}
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                      <defs>
                        {/* Define gradients for each segment */}
                        {displayPrizes.map((prize, index) => (
                          <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: prize.color, stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: prize.color, stopOpacity: 0.8 }} />
                          </linearGradient>
                        ))}
                      </defs>

                      {/* Draw segments */}
                      {displayPrizes.map((prize, index) => {
                        const startAngle = (index * segmentAngle - 90) * Math.PI / 180
                        const endAngle = ((index + 1) * segmentAngle - 90) * Math.PI / 180
                        const largeArcFlag = segmentAngle > 180 ? 1 : 0

                        const x1 = 100 + 95 * Math.cos(startAngle)
                        const y1 = 100 + 95 * Math.sin(startAngle)
                        const x2 = 100 + 95 * Math.cos(endAngle)
                        const y2 = 100 + 95 * Math.sin(endAngle)

                        return (
                          <g key={prize.id}>
                            {/* Segment Path */}
                            <path
                              d={`M 100 100 L ${x1} ${y1} A 95 95 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                              fill={`url(#gradient-${index})`}
                              stroke="#e5e7eb"
                              className="dark:stroke-[#1E2329]"
                              strokeWidth="2"
                            />

                            {/* White separator lines */}
                            <line
                              x1="100"
                              y1="100"
                              x2={x1}
                              y2={y1}
                              stroke="white"
                              strokeWidth="2"
                            />
                          </g>
                        )
                      })}
                    </svg>

                    {/* Text and Icons Layer */}
                    {displayPrizes.map((prize, index) => {
                      const angle = (index * segmentAngle + segmentAngle / 2) * Math.PI / 180
                      const radius = 60 // Distance from center for text
                      const x = 50 + (radius / 100) * 50 * Math.cos(angle - Math.PI / 2)
                      const y = 50 + (radius / 100) * 50 * Math.sin(angle - Math.PI / 2)
                      const textRotation = index * segmentAngle + segmentAngle / 2

                      return (
                        <div
                          key={`text-${prize.id}`}
                          className="absolute"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: `translate(-50%, -50%) rotate(${textRotation}deg)`,
                            transformOrigin: 'center center'
                          }}
                        >
                          <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                            {/* Icon */}
                            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white dark:bg-[#1E2329] rounded-full flex items-center justify-center shadow-lg border border-yellow-400/30 dark:border-[#F0B90B]/30">
                              {getPrizeIcon(prize.amount)}
                            </div>

                            {/* Amount Text */}
                            <div className="text-gray-900 dark:text-[#EAECEF] font-black text-[10px] sm:text-xs md:text-sm drop-shadow-lg whitespace-nowrap">
                              {prize.label}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Center Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white dark:bg-[#1E2329] rounded-full shadow-xl border-2 sm:border-4 border-yellow-500/50 dark:border-[#F0B90B]/50 z-20"></div>
                </div>
              </div>

              {/* Binance-Style Spin Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-col gap-2 w-full max-w-md">
                {/* Single Smart Spin Button */}
                <button
                  onClick={handleSpin}
                  disabled={!hasSpinsAvailable || isAnimating || isSpinning}
                  className={`relative px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base shadow-[0_0_15px_rgba(240,185,11,0.3)] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group ${hasSpinsAvailable && !isAnimating && !isSpinning
                      ? 'bg-gradient-to-r from-[#F0B90B] to-[#FCD535] text-[#1E2329] hover:shadow-[0_0_25px_rgba(240,185,11,0.5)] hover:scale-105 active:scale-95'
                      : 'bg-[#2B3139] text-[#5E6673] cursor-not-allowed'
                    }`}
                >
                  {/* Animated Background */}
                  {hasSpinsAvailable && !isAnimating && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FCD535] to-[#F0B90B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}

                  <div className="relative z-10 flex items-center gap-2">
                    {spinButtonContent.icon}
                    <div className="flex flex-col items-start">
                      <span className="text-base sm:text-lg font-black leading-tight">{spinButtonContent.text}</span>
                      {spinButtonContent.subtext && (
                        <span className="text-[10px] sm:text-xs font-medium opacity-80">{spinButtonContent.subtext}</span>
                      )}
                    </div>
                    {hasSpinsAvailable && !isAnimating && !isSpinning && (
                      <RocketOutlined className="text-lg sm:text-xl animate-pulse ml-auto" />
                    )}
                  </div>
                </button>


              </div>


            </div>


          </div>

        </div>

        {/* Spin Result Popup */}
        <SpinResultPopup
          visible={showResult}
          spinResult={reduxSpinResult}
          onClose={handleCloseResult}
        />

        {/* Loading Overlay - Binance Style */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              {/* Spinning Circle Loader */}
              <div className="relative w-16 h-16">
                {/* Outer ring */}
                <div className="absolute inset-0 border-4 border-[#2B3139] rounded-full"></div>
                {/* Spinning arc */}
                <div className="absolute inset-0 border-4 border-transparent border-t-[#F0B90B] rounded-full animate-spin"></div>
                {/* Inner glow */}
                <div className="absolute inset-2 bg-[#F0B90B]/10 rounded-full blur-sm"></div>
              </div>

              {/* Loading Text */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-white font-medium text-sm">Loading...</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-[#F0B90B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-[#F0B90B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-[#F0B90B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
