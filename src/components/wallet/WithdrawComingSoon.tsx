import { useEffect, useState } from 'react'
import { Popup } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'

// Available days of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
// Set the days when withdraw is available
export const AVAILABLE_DAYS = [3] // Sunday only - 1 payout day per week

// Day names for display
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_FULL_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function useWithdrawAvailability() {
  const [isAvailable, setIsAvailable] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [nextAvailableDay, setNextAvailableDay] = useState<number>(0)
  const [currentDay, setCurrentDay] = useState<number>(new Date().getDay())

  useEffect(() => {
    const checkAvailability = () => {
      const now = new Date()
      const todayDay = now.getDay() // 0 = Sunday, 6 = Saturday
      setCurrentDay(todayDay)
      
      // Check if today is an available day
      if (AVAILABLE_DAYS.includes(todayDay)) {
        setIsAvailable(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setNextAvailableDay(todayDay)
        return
      }

      setIsAvailable(false)

      // Calculate time until next available day
      let daysUntilAvailable = 0
      let nextDay = todayDay
      
      while (!AVAILABLE_DAYS.includes(nextDay)) {
        nextDay = (nextDay + 1) % 7
        daysUntilAvailable++
      }
      
      setNextAvailableDay(nextDay)

      // Calculate the exact time until next available day at midnight
      const nextAvailableDate = new Date(now)
      nextAvailableDate.setDate(now.getDate() + daysUntilAvailable)
      nextAvailableDate.setHours(0, 0, 0, 0)

      const difference = nextAvailableDate.getTime() - now.getTime()

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      })
    }

    checkAvailability()
    const timer = setInterval(checkAvailability, 1000)

    return () => clearInterval(timer)
  }, [])

  return { isAvailable, timeLeft, nextAvailableDay, currentDay }
}

// Get available day names for display
function getAvailableDayNames(): string[] {
  return AVAILABLE_DAYS.map(day => DAY_FULL_NAMES[day])
}

interface WithdrawComingSoonProps {
  visible: boolean
  onClose: () => void
}

export default function WithdrawComingSoon({ visible, onClose }: WithdrawComingSoonProps) {
  const { timeLeft, nextAvailableDay, currentDay, isAvailable } = useWithdrawAvailability()
  const availableDayNames = getAvailableDayNames()

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        height: '100vh',
        overflow: 'auto',
        padding: 0,
      }}
    >
      <div className="min-h-full flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-5 overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Payout Schedule</h2>
                <p className="text-xs text-emerald-100">Weekly withdrawal windows</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center transition-all shadow-lg"
            >
              <CloseOutline fontSize={20} className="text-white" />
            </button>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-300/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-cyan-300/20 rounded-full blur-xl"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-5 space-y-5">
          
          {/* Status Badge */}
          <div className="flex justify-center">
            {isAvailable ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg shadow-green-500/30">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-white">Payout Available Now!</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg shadow-amber-500/30">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-white">Next: {DAY_FULL_NAMES[nextAvailableDay]}</span>
              </div>
            )}
          </div>

          {/* Weekly Schedule Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Weekly Payout Schedule</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{AVAILABLE_DAYS.length} payout days per week</p>
              </div>
            </div>
            
            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {DAY_NAMES.map((day, index) => {
                const isPayoutDay = AVAILABLE_DAYS.includes(index)
                const isToday = index === currentDay
                const isNextPayout = index === nextAvailableDay && !isAvailable
                
                return (
                  <div
                    key={day}
                    className={`relative flex flex-col items-center py-3 px-1.5 rounded-2xl transition-all duration-300 ${
                      isPayoutDay
                        ? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/40'
                        : 'bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750 border border-gray-200 dark:border-gray-600'
                    } ${isToday && !isPayoutDay ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''} ${isToday && isPayoutDay ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-emerald-500' : ''}`}
                  >
                    {/* Next Payout Indicator */}
                    {isNextPayout && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                    
                    {/* Day Name */}
                    <span className={`text-[11px] font-bold tracking-wide ${
                      isPayoutDay 
                        ? 'text-white' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {day}
                    </span>
                    
                    {/* Status Icon */}
                    <div className={`mt-1.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      isPayoutDay 
                        ? 'bg-white/25' 
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}>
                      {isPayoutDay ? (
                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="w-2 h-0.5 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
                      )}
                    </div>
                    
                    {/* Today Label */}
                    {isToday && (
                      <span className={`mt-1 text-[8px] font-extrabold uppercase tracking-wider ${
                        isPayoutDay 
                          ? 'text-white/90' 
                          : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        Today
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded"></div>
                <span className="text-[10px] text-gray-600 dark:text-gray-400">Payout Day</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <span className="text-[10px] text-gray-600 dark:text-gray-400">Unavailable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-gray-600 dark:text-gray-400">Next</span>
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          {!isAvailable && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 shadow-xl">
              <div className="text-center mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Time Until Next Payout</p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-slate-700/50 rounded-xl p-3 text-center backdrop-blur">
                  <div className="text-3xl font-bold text-white font-mono">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">Days</div>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-3 text-center backdrop-blur">
                  <div className="text-3xl font-bold text-white font-mono">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">Hours</div>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-3 text-center backdrop-blur">
                  <div className="text-3xl font-bold text-white font-mono">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">Mins</div>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-3 text-center backdrop-blur relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>
                  <div className="text-3xl font-bold text-emerald-400 font-mono relative">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-1 relative">Secs</div>
                </div>
              </div>
            </div>
          )}

          {/* Available Days Info */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-1">Payout Windows</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  Withdrawals are processed on <span className="font-semibold">{availableDayNames.join(' & ')}</span> each week. 
                  Plan your payouts accordingly for the best experience.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Payout Features
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5">
                <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Fast Processing</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5">
                <div className="w-7 h-7 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5">
                <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Low Fees</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5">
                <div className="w-7 h-7 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Multi-Crypto</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 active:scale-[0.98] text-sm"
          >
            {isAvailable ? 'Proceed to Withdraw' : 'Got it, thanks!'}
          </button>
        </div>
      </div>
    </Popup>
  )
}
