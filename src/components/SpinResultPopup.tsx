'use client'

import { Popup } from 'antd-mobile'
import { 
  TrophyOutlined, 
  DollarCircleOutlined,
  StarOutlined,
  RocketOutlined
} from '@ant-design/icons'
import Image from 'next/image'

interface SpinResultPopupProps {
  visible: boolean
  spinResult: {
    prizeId: string
    amount: number
    label: string
  } | null
  onClose: () => void
}

export default function SpinResultPopup({ visible, spinResult, onClose }: SpinResultPopupProps) {
  if (!spinResult) return null

  const isWinner = spinResult.amount > 0

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        minHeight: '40vh',
        maxHeight: '90vh',
        overflow: 'auto'
      }}
    >
      <div className="relative p-6">
        {/* Confetti Elements - Only for winners */}
        {isWinner && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB'][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
        
        {/* Result Card */}
        <div className="relative">
          <div className={`border-4 rounded-3xl p-6 ${
            isWinner ? 'border-yellow-400' : 'border-gray-400'
          }`}>
            {/* Glow Effect */}
            <div className={`absolute inset-0 animate-pulse rounded-3xl ${
              isWinner 
                ? 'bg-gradient-to-br from-yellow-400/20 via-pink-400/20 to-purple-400/20'
                : 'bg-gradient-to-br from-gray-400/20 via-gray-500/20 to-gray-600/20'
            }`}></div>
            
            <div className="relative z-10 text-center">
              {isWinner ? (
                <>
                  {/* Winner - Trophy Icon with Glow */}
                  <div className="flex justify-center mb-4 relative">
                    <div className="absolute inset-0 bg-yellow-400/50 blur-3xl rounded-full"></div>
                    <TrophyOutlined className="relative text-5xl text-yellow-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(234, 179, 8, 0.8))' }} />
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
                    <StarOutlined className="text-yellow-500 text-base animate-spin" style={{ animationDuration: '3s' }} />
                    Congratulations!
                    <StarOutlined className="text-yellow-500 text-base animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
                  </h2>
                  
                  {/* Subtitle */}
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">
                      🎉 You're a Winner! 🎉
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      You won an amazing reward
                    </p>
                  </div>
                  
                  {/* Amount Display */}
                  <div className="my-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-300 dark:border-green-700 shadow-lg">
                    <div className="flex items-center justify-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-400/50 blur-xl rounded-full"></div>
                        <Image 
                          src='/icons/usdt.svg'
                          alt="USDT"
                          width={32}
                          height={32}
                          className="relative animate-bounce"
                        />
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent" style={{ textShadow: '0 0 30px rgba(16, 185, 129, 0.5)' }}>
                          {spinResult.amount}
                        </div>
                        <span className="text-lg font-bold text-gray-700 dark:text-gray-300">USDT</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Claim Button */}
                  <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-lg font-semibold text-sm hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <DollarCircleOutlined className="relative text-base group-hover:rotate-180 transition-transform duration-500" />
                    <span className="relative">Claim Your Reward</span>
                    <RocketOutlined className="relative text-sm animate-pulse" />
                  </button>
                  
                  {/* Footer Message */}
                  <div className="mt-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                      ✨ Thank you for being awesome! Keep spinning! ✨
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* No Win - Sad Emoji */}
                  <div className="flex justify-center mb-4 relative">
                    <div className="text-5xl">😢</div>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 bg-clip-text text-transparent mb-2">
                    Better Luck Next Time!
                  </h2>
                  
                  {/* Subtitle */}
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      😔 No reward this time
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Keep trying, you'll win soon!
                    </p>
                  </div>
                  
                  {/* Thanx Display */}
                  <div className="my-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl border border-gray-300 dark:border-gray-700 shadow-lg">
                    <div className="flex items-center justify-center gap-3">
                      <div className="text-3xl">🙏</div>
                      <div className="flex items-baseline gap-1.5">
                        <div className="text-3xl font-bold bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 bg-clip-text text-transparent">
                          Thanx
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Try Again Button */}
                  <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 text-white rounded-lg font-semibold text-sm hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative">Try Again</span>
                    <RocketOutlined className="relative text-sm animate-pulse" />
                  </button>
                  
                  {/* Footer Message */}
                  <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      💪 Don't give up! Your luck will turn around! 💪
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </Popup>
  )
}
