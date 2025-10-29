'use client'

import { useEffect, useState, useRef } from 'react'
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
import Image from 'next/image'
import SpinResultPopup from '@/components/SpinResultPopup'
 

export default function SpinWheelPage() {
  // Mock data
  const mockUser = {
    userId: 12345,
    balanceTK: 25.50
  }

  const mockSpinWheel = {
    canSpin: true,
    nextSpinTime: null,
    spinResult: null,
    prizes: [
      { id: '1', label: '0.5 USDT', amount: 0.5, color: '#FF6B6B', probability: 7 },
      { id: '2', label: '1 USDT', amount: 1, color: '#4ECDC4', probability: 6 },
      { id: '3', label: '2 USDT', amount: 2, color: '#45B7D1', probability: 5 },
      { id: '4', label: 'Thanx', amount: 0, color: '#FFA07A', probability: 30 },
      { id: '5', label: 'Thanx', amount: 0, color: '#98D8C8', probability: 25 },
      { id: '6', label: 'Thanx', amount: 0, color: '#F7DC6F', probability: 20 },
      { id: '7', label: 'Thanx', amount: 0, color: '#BB8FCE', probability: 7 }
    ],
    freeSpinsUsed: 1,
    maxFreeSpins: 4,
    extraSpinsUnlocked: 2,
    maxExtraSpins: 6,
    spinTickets: 5,
    isSpinning: false,
    isWatchingAd: false,
    isLoading: false
  }

  const [rotation, setRotation] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [spinResult, setSpinResult] = useState<any>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [pulseAnimation, setPulseAnimation] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)

  // Mock: No need to fetch data on mount

  // Mock: No countdown timer needed

  // Handle spin result
  useEffect(() => {
    if (spinResult && !showResult && mockSpinWheel.prizes?.length) {
      // Calculate winning segment angle
      const prizeIndex = mockSpinWheel.prizes.findIndex(
        p => p.id === spinResult.prizeId
      )
      
      if (prizeIndex !== -1) {
        const segmentAngle = 360 / mockSpinWheel.prizes.length
        const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2)
        const spins = 5 // Number of full rotations
        const finalRotation = spins * 360 + targetAngle

        setIsAnimating(true)
        setRotation(finalRotation)

        // Show result after animation
        setTimeout(() => {
          setIsAnimating(false)
          setShowResult(true)
        }, 4000)
      }
    }
  }, [spinResult, showResult])

  const handleSpin = () => {
    if (isAnimating) return

    setShowResult(false)
    setSpinResult(null)
    
    // Mock: Randomly select a prize
    const randomPrize = mockSpinWheel.prizes[Math.floor(Math.random() * mockSpinWheel.prizes.length)]
    setSpinResult({
      prizeId: randomPrize.id,
      amount: randomPrize.amount,
      label: randomPrize.label
    })
  }

  const handleCloseResult = () => {
    setShowResult(false)
    setSpinResult(null)
    setRotation(0)
  }

  const handleUnlockExtraSpin = () => {
    // Mock: Simulate unlocking extra spin
    console.log('Unlocking extra spin...')
  }

  const handleTicketSpin = () => {
    if (isAnimating || mockSpinWheel.spinTickets <= 0) return

    setShowResult(false)
    setSpinResult(null)
    
    // Mock: Randomly select a prize
    const randomPrize = mockSpinWheel.prizes[Math.floor(Math.random() * mockSpinWheel.prizes.length)]
    setSpinResult({
      prizeId: randomPrize.id,
      amount: randomPrize.amount,
      label: randomPrize.label
    })
  }

  // Calculate remaining spins
  const freeSpinsRemaining = mockSpinWheel.maxFreeSpins - mockSpinWheel.freeSpinsUsed
  const extraSpinsRemaining = mockSpinWheel.extraSpinsUnlocked
  const totalSpinsRemaining = freeSpinsRemaining + extraSpinsRemaining
  const canUnlockExtra = mockSpinWheel.freeSpinsUsed >= mockSpinWheel.maxFreeSpins && 
                         mockSpinWheel.extraSpinsUnlocked < mockSpinWheel.maxExtraSpins

  // Pulse animation for spin button
  useEffect(() => {
    if (mockSpinWheel.canSpin && !isAnimating) {
      const interval = setInterval(() => {
        setPulseAnimation(prev => !prev)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isAnimating])

  // Use mock prizes for display
  const displayPrizes = mockSpinWheel.prizes

  // Get prize icon based on amount
  const getPrizeIcon = (amount: number) => {
    if (amount >= 50) return <RocketOutlined className="text-lg" />
    if (amount >= 20) return <FireOutlined className="text-lg" />
    if (amount >= 10) return <StarOutlined className="text-lg" />
    if (amount >= 5) return <ThunderboltOutlined className="text-lg" />
    return <DollarCircleOutlined className="text-base" />
  }

  const segmentAngle = 360 / displayPrizes.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 py-6 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Enhanced Stats Cards with Glassmorphism */}
      <div className="max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 relative z-10">
        {/* Free Spins Card */}
        <div className="group bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-white/60 dark:border-gray-700/60 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <GiftOutlined className="text-white text-lg" />
            </div>
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300">Free Spins</div>
          </div>
          <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            {freeSpinsRemaining}/{mockSpinWheel.maxFreeSpins}
          </div>
        </div>

        {/* Extra Spins Card */}
        <div className="group bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-white/60 dark:border-gray-700/60 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <StarOutlined className="text-white text-lg" />
            </div>
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300">Extra Spins</div>
          </div>
          <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
            {extraSpinsRemaining}/{mockSpinWheel.maxExtraSpins}
          </div>
        </div>

        {/* Spin Tickets Card */}
        <div className="group bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-white/60 dark:border-gray-700/60 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <TrophyOutlined className="text-white text-lg" />
            </div>
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300">Tickets</div>
          </div>
          <div className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
            {mockSpinWheel.spinTickets || 0}
          </div>
        </div>

        {/* Balance Card */}
        <div className="group bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-white/60 dark:border-gray-700/60 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <Image 
                src='/icons/usdt.svg'
                alt="USDT"
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300">Balance</div>
          </div>
          <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
            ${mockUser.balanceTK?.toFixed(2) || '0.00'}
          </div>
        </div>
      </div>

      {/* Enhanced Spin Wheel Container */}
      <div className="max-w-2xl mx-auto mb-6 relative z-10">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 relative overflow-hidden border border-white/60 dark:border-gray-700/60">
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #ec4899 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          </div>
          
          {/* Glowing Orbs */}
          <div className="absolute top-10 right-10 w-24 h-24 bg-pink-400/30 dark:bg-pink-500/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-2xl"></div>
          
          {/* Enhanced Wheel Container */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Enhanced 3D Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 -mt-3">
              <div className="relative">
                <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-pink-600 dark:border-t-pink-500 drop-shadow-2xl"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[32px] border-t-pink-400"></div>
                {/* Pointer Glow */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-pink-500/50 rounded-full blur-xl"></div>
              </div>
            </div>

            {/* Enhanced 3D Wheel */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 mx-auto">
              {/* Outer Glow Ring */}
              <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-pink-400/30 via-purple-400/30 to-blue-400/30 blur-2xl"></div>
              
              {/* Dotted Border Ring with Animation */}
              <div className="absolute -inset-4 rounded-full border-8 border-dotted border-pink-400 dark:border-pink-500 animate-spin" style={{ animationDuration: '20s' }}></div>
              
              {/* Enhanced Decorative Dots on Border */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) * Math.PI / 180
                const radius = 180 // Distance from center
                const x = 50 + radius * Math.cos(angle - Math.PI / 2)
                const y = 50 + radius * Math.sin(angle - Math.PI / 2)
                return (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-pink-400 rounded-full"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                )
              })}

              {/* Enhanced 3D Center Button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 z-10">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                
                {/* Main Button */}
                <div className="relative w-full h-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full shadow-2xl flex items-center justify-center border-4 border-white dark:border-gray-200 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 group">
                  {/* Inner Gradient */}
                  <div className="absolute inset-2 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-50"></div>
                  
                  {/* Text */}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-3xl font-black text-white tracking-wider drop-shadow-lg">GO</span>
                    <div className="w-8 h-0.5 bg-white/80 mt-1 rounded-full"></div>
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
                {/* Outer White Border */}
                <div className="absolute inset-0 rounded-full bg-white dark:bg-gray-200 shadow-2xl"></div>
                
                {/* Inner Wheel Container */}
                <div className="absolute inset-2 rounded-full overflow-hidden shadow-inner">
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
                            stroke="white"
                            strokeWidth="1.5"
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
                        <div className="flex flex-col items-center gap-1">
                          {/* Crypto Icon */}
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                            {getPrizeIcon(prize.amount)}
                          </div>
                          
                          {/* Amount Text */}
                          <div className="text-white font-black text-xs sm:text-sm drop-shadow-lg whitespace-nowrap">
                            {prize.label}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {/* Center White Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-gray-100 rounded-full shadow-xl border-4 border-gray-200 dark:border-gray-300 z-20"></div>
              </div>
            </div>

            {/* Enhanced Spin Buttons */}
            <div className="mt-10 flex flex-col gap-4 w-full max-w-md">
              {/* Free Spin Button with Ticket Spin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Free Spin Button */}
                <button
                  onClick={handleSpin}
                  disabled={!mockSpinWheel.canSpin || isAnimating || mockSpinWheel.isSpinning}
                  className={`relative px-6 py-4 rounded-xl font-bold text-base shadow-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group ${
                    mockSpinWheel.canSpin && !isAnimating && !mockSpinWheel.isSpinning
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl hover:scale-105 active:scale-95'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {/* Animated Background */}
                  {mockSpinWheel.canSpin && !isAnimating && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  
                  <div className="relative z-10 flex items-center gap-2">
                    {isAnimating || mockSpinWheel.isSpinning ? (
                      <>
                        <ThunderboltOutlined spin className="text-xl" />
                        <span className="text-sm sm:text-base">Spinning...</span>
                      </>
                    ) : mockSpinWheel.canSpin ? (
                      <>
                        <GiftOutlined className="text-xl" />
                        <span className="text-sm sm:text-base">Free ({freeSpinsRemaining}/{mockSpinWheel.maxFreeSpins})</span>
                        <StarOutlined className="text-lg animate-pulse" />
                      </>
                    ) : (
                      <span className="text-xs sm:text-sm">⏰ {timeRemaining}</span>
                    )}
                  </div>
                </button>

                {/* Ticket Spin Button */}
                {mockSpinWheel.spinTickets > 0 && (
                  <button
                    onClick={handleTicketSpin}
                    disabled={isAnimating || mockSpinWheel.isSpinning}
                    className="relative px-6 py-4 rounded-xl font-bold text-base shadow-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center gap-2">
                      <FireOutlined className="text-xl" />
                      <span className="text-sm sm:text-base">Ticket ({mockSpinWheel.spinTickets})</span>
                      <ThunderboltOutlined className="text-lg animate-pulse" />
                    </div>
                  </button>
                )}
              </div>

              {/* Unlock Extra Spin Button */}
              {canUnlockExtra && !isAnimating && (
                <button
                  onClick={handleUnlockExtraSpin}
                  disabled={mockSpinWheel.isWatchingAd}
                  className="relative px-6 py-4 rounded-xl font-bold text-base shadow-lg transition-all duration-300 overflow-hidden group bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {mockSpinWheel.isWatchingAd ? (
                      <>
                        <ThunderboltOutlined spin className="text-xl" />
                        <span>Watching Ad...</span>
                      </>
                    ) : (
                      <>
                        <FireOutlined className="text-xl animate-pulse" />
                        <span className="text-sm sm:text-base">Watch Ad for Extra Spin ({mockSpinWheel.maxExtraSpins - mockSpinWheel.extraSpinsUnlocked} left)</span>
                      </>
                    )}
                  </div>
                </button>
              )}
            </div>

            {/* Enhanced Info Cards */}
            <div className="mt-6 w-full max-w-md space-y-3">
              {/* Status Card */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/50">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                  {freeSpinsRemaining > 0 ? (
                    <>
                      <GiftOutlined className="text-purple-600 dark:text-purple-400 text-lg" />
                      <span className="text-purple-700 dark:text-purple-300">
                        {freeSpinsRemaining} free spin{freeSpinsRemaining > 1 ? 's' : ''} remaining today
                      </span>
                    </>
                  ) : extraSpinsRemaining > 0 ? (
                    <>
                      <StarOutlined className="text-orange-600 dark:text-orange-400 text-lg animate-pulse" />
                      <span className="text-orange-700 dark:text-orange-300">
                        {extraSpinsRemaining} extra spin{extraSpinsRemaining > 1 ? 's' : ''} remaining
                      </span>
                    </>
                  ) : (
                    <>
                      <ClockCircleOutlined className="text-blue-600 dark:text-blue-400 text-lg" />
                      <span className="text-blue-700 dark:text-blue-300">
                        Come back tomorrow for more free spins!
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Ticket Info Card */}
              {mockSpinWheel.spinTickets > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200/50 dark:border-yellow-700/50">
                  <div className="flex flex-col items-center justify-center gap-1 text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <FireOutlined className="text-orange-600 dark:text-orange-400 text-lg" />
                      <span className="text-orange-700 dark:text-orange-300">
                        Use tickets to spin anytime! No cooldown!
                      </span>
                    </div>
                    <span className="text-xs text-orange-600 dark:text-orange-400">
                      Thanks for your support! 🎁
                    </span>
                  </div>
                </div>
              )}

              {/* Extra Spin Info */}
              {canUnlockExtra && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 border border-orange-200/50 dark:border-orange-700/50">
                  <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                    <ThunderboltOutlined className="text-red-600 dark:text-red-400 text-lg animate-pulse" />
                    <span className="text-red-700 dark:text-red-300">
                      Watch ads to unlock up to {mockSpinWheel.maxExtraSpins} extra free spins!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 0%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 15s ease infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 30s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
 

      {/* Spin Result Popup */}
      <SpinResultPopup
        visible={showResult}
        spinResult={spinResult}
        onClose={handleCloseResult}
      />

      {/* Loading Overlay */}
      {mockSpinWheel.isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
            <i className="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
          </div>
        </div>
      )}
    </div>
  )
}
