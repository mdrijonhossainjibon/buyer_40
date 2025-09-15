'use client'

 
interface LoadingOverlayProps {
  visible: boolean
  onClose?: () => void
}

export default function LoadingOverlay({ visible, onClose }: LoadingOverlayProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center px-6 py-8">
        {/* Logo with glow effect */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg animate-pulse">
          <i className="fa-solid fa-bolt text-4xl text-gray-900"></i>
        </div>
 

      

        {/* Subtitle */}
        <div className="text-sm text-gray-300 leading-relaxed max-w-xs">
          Securely syncing your profile and configuration data
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-60 h-1 bg-white bg-opacity-10 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full animate-loading-bar"></div>
        </div>

        {/* Hint text */}
        <div className="text-xs text-gray-500 mt-2">
          Please wait a moment...
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 75%;
            margin-left: 0%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
