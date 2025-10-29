'use client'

import { useState, useEffect } from 'react'

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Simulate online status check
    const checkOnlineStatus = () => {
      const hour = new Date().getHours()
      // Online between 8 AM and 11 PM
      setIsOnline(hour >= 8 && hour < 23)
    }
    
    checkOnlineStatus()
    const interval = setInterval(checkOnlineStatus, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])

  const openTutorial = () => {
    window.open('https://youtu.be/WfZ2mvsOXAo?si=r5yRIqLyI9NbfQah', '_blank')
  }

  const openTelegram = () => {
    window.open('https://t.me/yoursupportbot', '_blank')
  }

  const openEmail = () => {
    window.location.href = 'mailto:support@earnfromads.com'
  }

  const openWhatsApp = () => {
    window.open('https://wa.me/1234567890', '_blank')
  }

  const supportOptions = [
    {
      icon: 'fas fa-video',
      title: 'Video Tutorial',
      description: 'Watch step-by-step guide',
      color: 'from-red-500 to-pink-600',
      iconColor: 'text-red-500',
      action: openTutorial,
      badge: 'Recommended',
      responseTime: 'Instant',
    },
    {
      icon: 'fab fa-telegram',
      title: 'Telegram Support',
      description: 'Chat with our team',
      color: 'from-blue-500 to-cyan-600',
      iconColor: 'text-blue-500',
      action: openTelegram,
      badge: isOnline ? 'Online' : 'Offline',
      responseTime: '< 5 min',
    },
    
    {
      icon: 'fas fa-envelope',
      title: 'Email Support',
      description: 'Send detailed queries',
      color: 'from-purple-500 to-indigo-600',
      iconColor: 'text-purple-500',
      action: openEmail,
      badge: null,
      responseTime: '< 24 hrs',
    },
  ]
 

  const faqs = [
    {
      question: 'How do I earn USDT?',
      answer: 'You can earn USDT by completing tasks, watching ads, spinning the wheel, and referring friends. Each activity rewards you with different amounts.',
    },
    {
      question: 'What is XP and how to use it?',
      answer: 'XP (Experience Points) is earned from various activities. You can use XP to purchase spin tickets or convert it to cash in the Wallet section.',
    },
    {
      question: 'How do withdrawals work?',
      answer: 'Go to the Withdraw page, select your payment method (bKash, Nagad, Rocket, or Bank), enter your account details and amount. Minimum withdrawal is configurable by admin.',
    },
    {
      question: 'What are Spin Tickets?',
      answer: 'Spin Tickets allow you to spin the wheel anytime without waiting for free spins. Purchase tickets with XP and use them to win prizes instantly.',
    },
    {
      question: 'How does the referral system work?',
      answer: 'Share your unique referral link with friends. When they join and complete activities, you earn commission. Check the Referral page for your earnings.',
    },
  ]

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="pb-6 animate-fade-in">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-600 dark:via-blue-700 dark:to-purple-700 p-6 rounded-2xl mx-4 mb-5 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl -ml-12 -mb-12"></div>
        
        <div className="relative text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-headset text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold mb-2">Support Center</h2>
          <p className="text-sm opacity-90">We're here to help you 24/7</p>
          
          {/* Live Status Indicator */}
          <div className="mt-3 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
            <span className="text-xs font-medium">
              {isOnline ? 'Support team is online' : 'Support team offline'}
            </span>
          </div>
        </div>
      </div>
 
      {/* Support Options Grid */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
          <i className="fas fa-life-ring text-cyan-500"></i>
          Get Help
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {supportOptions.map((option, index) => (
            <div
              key={index}
              onClick={option.action}
              className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] overflow-hidden group"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}></div>
              
              <div className="relative flex items-center gap-4">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <i className={`${option.icon} text-2xl text-white`}></i>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                      {option.title}
                    </h4>
                    {option.badge && (
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        option.badge === 'Online' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : option.badge === 'Offline'
                          ? 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {option.description}
                  </p>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                    <i className="far fa-clock mr-1"></i>
                    Response time: {option.responseTime}
                  </p>
                </div>

                {/* Arrow */}
                <i className="fas fa-chevron-right text-gray-400 dark:text-gray-600 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors"></i>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
          <i className="fas fa-question-circle text-cyan-500"></i>
          Frequently Asked Questions
        </h3>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              {/* Question */}
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <i
                  className={`fas fa-chevron-down text-cyan-500 transition-transform duration-200 ${
                    expandedFaq === index ? 'rotate-180' : ''
                  }`}
                ></i>
              </button>

              {/* Answer */}
              {expandedFaq === index && (
                <div className="px-4 pb-4 pt-0 animate-fade-in">
                  <div className="pl-4 border-l-2 border-cyan-500">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-center text-white">
            <i className="fas fa-clock text-2xl mb-2 opacity-90"></i>
            <div className="text-xl font-bold">24/7</div>
            <div className="text-xs opacity-90">Support</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-center text-white">
            <i className="fas fa-users text-2xl mb-2 opacity-90"></i>
            <div className="text-xl font-bold">10K+</div>
            <div className="text-xs opacity-90">Users</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-center text-white">
            <i className="fas fa-star text-2xl mb-2 opacity-90"></i>
            <div className="text-xl font-bold">4.8</div>
            <div className="text-xs opacity-90">Rating</div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border border-cyan-200 dark:border-cyan-900/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-info text-white"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                Need More Help?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Our support team is available 24/7 to assist you with any questions or issues.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                  <i className="fas fa-envelope mr-1 text-cyan-500"></i>
                  support@earnfromads.com
                </span>
                <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                  <i className="fab fa-telegram mr-1 text-cyan-500"></i>
                  @earnfromads_support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
