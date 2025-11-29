
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { socketConnectRequest ,   RootState } from 'modules'
 
import WebApp from '@twa-dev/sdk';
 

 



export default function LoadingOverlay({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const { userId } = useSelector((state: RootState) => state.user)
  const [progress] = useState(0);
 
  

  useEffect(() => {
    dispatch(socketConnectRequest());
  }, [dispatch]);


   

  if (!userId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0E11] overflow-hidden">
        {/* Binance animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Yellow glow - top left */}
          <div
            className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-30 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #F0B90B 0%, transparent 70%)',
              animation: 'float 8s ease-in-out infinite'
            }}
          />
          {/* Yellow glow - bottom right */}
          <div
            className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #F0B90B 0%, transparent 70%)',
              animation: 'float 10s ease-in-out infinite reverse'
            }}
          />
          {/* Blue accent glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #1E3A8A 0%, transparent 70%)',
              animation: 'pulse 6s ease-in-out infinite'
            }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(240, 185, 11, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240, 185, 11, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Main content */}
        <div className="relative flex flex-col items-center gap-12 px-6">
          {/* Binance-style logo with animation */}
          <div className="relative">
            {/* Outer rotating ring */}
            <div
              className="absolute inset-0 w-32 h-32 -m-4 rounded-full border-2 border-[#F0B90B]/20"
              style={{
                animation: 'spin 20s linear infinite'
              }}
            />

            {/* Logo container */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Glowing background */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#F0B90B] to-[#F8D12F] rounded-2xl blur-xl opacity-50"
                style={{
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              />

              {/* Logo square */}
              <div className="relative w-full h-full bg-gradient-to-br from-[#F0B90B] to-[#F8D12F] rounded-2xl flex items-center justify-center shadow-2xl">
                {/* Binance-style geometric pattern */}
                <div className="relative w-16 h-16">
                  {/* Top right square */}
                  <div className="absolute top-0 right-0 w-6 h-6 bg-[#0B0E11] rounded-sm" />
                  {/* Middle squares */}
                  <div className="absolute top-5 right-5 w-6 h-6 bg-[#0B0E11] rounded-sm" />
                  <div className="absolute top-5 left-0 w-6 h-6 bg-[#0B0E11] rounded-sm" />
                  {/* Bottom squares */}
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#0B0E11] rounded-sm" />
                  <div className="absolute bottom-0 left-5 w-6 h-6 bg-[#0B0E11] rounded-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Brand name */}
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              EarnFromAds
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#F0B90B]" />
              <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">
                Powered by Blockchain
              </p>
              <div className="w-1 h-1 rounded-full bg-[#F0B90B]" />
            </div>
          </div>

          {/* Loading indicator */}
          <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            {/* Progress bar - Binance style */}
            <div className="w-full h-1 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-[#F0B90B] via-[#F8D12F] to-[#F0B90B] rounded-full transition-all duration-300 ease-out relative"
                style={{
                  width: `${progress}%`,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s linear infinite'
                }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm" />
              </div>
            </div>

          </div>

        </div>

        {/*    <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.1); }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style> */}
      </div>
    )
  }

  return (
    <>{children}</>
  )

}