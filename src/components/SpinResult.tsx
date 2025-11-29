'use client'

import { Popup } from 'antd-mobile'
import { 
  TrophyOutlined, 
  StarOutlined,
  RocketOutlined,
  CloseOutlined,
  GiftOutlined
} from '@ant-design/icons'

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
        borderRadius: '0',
        minHeight: '100vh',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
        overflow: 'auto',
        backgroundColor: 'white'
      }}
    >
      <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 via-white to-orange-50">
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-md"
          >
            <CloseOutlined className="text-gray-600 text-lg" />
          </button>
        </div>

        {/* Confetti Elements - Only for winners */}
        {isWinner && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ['#F0B90B', '#FCD535', '#F0B90B', '#FCD535', '#F0B90B'][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        )}
        
        {/* Result Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="relative z-10 text-center">
              {isWinner ? (
                <>
                  {/* Winner - Trophy Icon with Glow */}
                  <div className="flex justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-yellow-400/30 blur-3xl rounded-full"></div>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <TrophyOutlined 
                        className="text-[80px] text-yellow-500 " 
                        style={{ 
                          filter: 'drop-shadow(0 0 30px rgba(234, 179, 8, 0.8))',
                          animationDuration: '2s'
                        }} 
                      />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-3">
                    <StarOutlined className="text-yellow-500 text-2xl animate-spin" style={{ animationDuration: '3s' }} />
                    Congratulations!
                    <StarOutlined className="text-yellow-500 text-2xl animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
                  </h2>
                  
                  {/* Subtitle */}
                  <div className="mb-8">
                    <p className="text-lg sm:text-xl font-semibold text-yellow-600 mb-2">
                      You're a Winner!
                    </p>
                    <p className="text-sm text-gray-600">
                      You won an amazing reward
                    </p>
                  </div>
                  
                  {/* Prize Display */}
                  <div className="my-8 p-6 bg-white rounded-2xl border-2 border-yellow-400 shadow-2xl">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-400/30 blur-2xl rounded-full"></div>
                        <GiftOutlined className="relative text-6xl text-yellow-500 animate-pulse" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-6xl font-bold text-yellow-600" style={{ textShadow: '0 0 40px rgba(234, 179, 8, 0.3)' }}>
                          {spinResult.label}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">Reward Credited Automatically</p>
                    </div>
                  </div>
                  
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="w-full px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
                    style={{ boxShadow: '0 4px 20px rgba(234, 179, 8, 0.3)' }}
                  >
                    Continue
                  </button>
                  
                  {/* Footer Message */}
                  <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <p className="text-sm font-medium text-gray-700">
                      Your reward has been added to your balance!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* No Win - Icon */}
                  <div className="flex justify-center mb-8 relative">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <div className="text-8xl opacity-70">😢</div>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                    Better Luck Next Time!
                  </h2>
                  
                  {/* Subtitle */}
                  <div className="mb-8">
                    <p className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                      No reward this time
                    </p>
                    <p className="text-sm text-gray-500">
                      Keep trying, you'll win soon!
                    </p>
                  </div>
                  
                  {/* Thanx Display */}
                  <div className="my-8 p-6 bg-white rounded-2xl border-2 border-gray-300 shadow-2xl">
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-6xl">🙏</div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-4xl font-bold text-gray-700">
                          Thanks
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">For Playing</p>
                    </div>
                  </div>
                  
                  {/* Try Again Button */}
                  <button
                    onClick={onClose}
                    className="w-full px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
                  >
                    <RocketOutlined className="text-xl group-hover:animate-bounce" />
                    <span>Try Again</span>
                  </button>
                  
                  {/* Footer Message */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                      Don't give up! Your luck will turn around!
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
 
    </Popup>
  )
}
