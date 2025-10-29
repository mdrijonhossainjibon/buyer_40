import { Popup } from 'antd-mobile'
import { useEffect, useState } from 'react'

interface WithdrawProcessingPopupProps {
  visible: boolean
  onComplete?: () => void
}

export default function WithdrawProcessingPopup({ visible, onComplete }: WithdrawProcessingPopupProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { id: 1, label: 'Verifying transaction', duration: 1000 },
    { id: 2, label: 'Processing withdrawal', duration: 1500 },
    { id: 3, label: 'Securing transaction', duration: 1000 },
    { id: 4, label: 'Finalizing...', duration: 500 },
  ]

  useEffect(() => {
    if (visible) {
      setProgress(0)
      setCurrentStep(0)

      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 1
        })
      }, 40) // 4 seconds total (100 * 40ms)

      // Step progression
      let stepIndex = 0
      const stepTimeout = setTimeout(function processStep() {
        if (stepIndex < steps.length) {
          setCurrentStep(stepIndex)
          stepIndex++
          setTimeout(processStep, steps[stepIndex - 1]?.duration || 0)
        }
      }, 0)

      return () => {
        clearInterval(progressInterval)
        clearTimeout(stepTimeout)
      }
    }
  }, [visible])

  return (
    <Popup
      visible={visible}
      bodyStyle={{
        height: '100vh',
        overflow: 'hidden',
        padding: 0,
      }}
    >
      <div className="h-full flex flex-col bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
          {/* Animated Icon */}
          <div className="relative mb-8">
            {/* Outer ring */}
            <div className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center">
              {/* Inner animated ring */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500 animate-spin"></div>
              {/* Center icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Processing Withdrawal
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Please wait while we process your request</p>

          {/* Progress Bar */}
          <div className="w-full max-w-md mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-500">{progress}%</span>
            </div>
            <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Processing Steps */}
          <div className="w-full max-w-md space-y-2 mb-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`relative flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : index === currentStep
                    ? 'bg-yellow-50 dark:bg-yellow-900/20'
                    : 'bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                {/* Step Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-green-500'
                    : index === currentStep
                    ? 'bg-yellow-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {index < currentStep ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : index === currentStep ? (
                    <div className="flex gap-0.5">
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-white">{step.id}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="flex-1">
                  <span className={`text-sm font-medium ${
                    index < currentStep
                      ? 'text-green-700 dark:text-green-400'
                      : index === currentStep
                      ? 'text-yellow-700 dark:text-yellow-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>

                {/* Status indicator */}
                {index === currentStep && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Security Notice */}
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Please do not close this window</span>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  )
}
