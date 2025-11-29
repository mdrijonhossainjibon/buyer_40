import { Popup } from 'antd-mobile'
import { RootState } from 'modules'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
 

export default function ProcessingPopup() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  // Get processing state from Redux
  const { isConverting, processingStep, processingProgress } = useSelector((state: RootState) => state.converter)

  const steps = [
    { icon: 'fa-check-circle', label: 'Verifying transaction', step: 'verifying' },
    { icon: 'fa-exchange-alt', label: 'Processing conversion', step: 'processing' },
    { icon: 'fa-shield-alt', label: 'Securing transaction', step: 'securing' },
    { icon: 'fa-check-double', label: 'Finalizing...', step: 'finalizing' }
  ]

  // Update current step based on Redux state
  useEffect(() => {
    if (!isConverting) {
      setCurrentStep(0)
      setProgress(0)
      return
    }

    if (processingStep) {
      const stepIndex = steps.findIndex(s => s.step === processingStep)
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex)
        setProgress(processingProgress || ((stepIndex + 1) / steps.length) * 100)
      }
    } else if (processingProgress > 0) {
      setProgress(processingProgress)
    }

    // Fallback: Auto-progress if no updates
    const fallbackTimer = setTimeout(() => {
      if (currentStep === 0 && !processingStep) {
        setCurrentStep(1)
        setProgress(25)
      }
    }, 500)

    return () => {
      clearTimeout(fallbackTimer)
    }
  }, [isConverting, processingStep, processingProgress])

  return (
    <Popup
      visible={isConverting}
      position='bottom'
      bodyClassName='h-screen'
      showCloseButton={false}
      closeOnMaskClick={false}
    >
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="w-full max-w-md">
          {/* Animated Icon */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="w-32 h-32 rounded-full border-4 border-transparent border-t-yellow-400 border-r-yellow-400"></div>
              </div>
              {/* Inner pulsing circle */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-20"></div>
                <i className="fas fa-sync-alt fa-spin text-5xl text-yellow-500 relative z-10"></i>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Processing Conversion
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8">
            Please wait while we securely process your transaction
          </p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">{Math.min(progress, 100)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Processing Steps */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    index <= currentStep ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  {/* Step Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index < currentStep 
                      ? 'bg-green-500 text-white' 
                      : index === currentStep
                      ? 'bg-yellow-500 text-white animate-pulse'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>
                    {index < currentStep ? (
                      <i className="fas fa-check text-sm"></i>
                    ) : (
                      <i className={`fas ${step.icon} text-sm ${index === currentStep ? 'animate-spin-slow' : ''}`}></i>
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="flex-1">
                    <p className={`text-sm font-semibold transition-colors ${
                      index <= currentStep 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      {step.label}
                    </p>
                    {index === currentStep && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    )}
                  </div>

                  {/* Status Indicator */}
                  {index < currentStep && (
                    <i className="fas fa-check-circle text-green-500 text-sm"></i>
                  )}
                  {index === currentStep && (
                    <div className="flex gap-0.5">
                      <div className="w-1 h-1 bg-yellow-500 rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <i className="fas fa-lock text-green-500"></i>
            <span>Encrypted & Secure</span>
            <span className="mx-1">•</span>
            <i className="fas fa-shield-alt text-green-500"></i>
            <span>Protected Transaction</span>
          </div>

          {/* Animated Dots */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Do not close this window
              <span className="inline-flex ml-1">
                <span className="animate-bounce" style={{ animationDelay: '0s' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
              </span>
            </span>
          </div>
        </div>
      </div>

   
    </Popup>
  )
}
