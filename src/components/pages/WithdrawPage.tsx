'use client'

import { RootState } from '@/store'
import { useState } from 'react'
import { useSelector } from 'react-redux'

interface user {
  userId: number | null
  balanceTK: number
  referralCount: number
  dailyAdLimit: number
  watchedToday: number
  telegramBonus: number
  youtubeBonus: number
  isBotVerified: number
}

 
export default function WithdrawPage( ) {
  const [withdrawMethod, setWithdrawMethod] = useState('Bkash')
  const [accountNumber, setAccountNumber] = useState('')
  const [amount, setAmount] = useState('')
  const user = useSelector((state: RootState) => state.user)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const minWithdraw = 1500
  const requiredReferrals = 20

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (user.balanceTK < minWithdraw) {
      alert(`Minimum withdrawal amount is ${minWithdraw} TK`)
      return
    }
    
    if (user.referralCount < requiredReferrals) {
      alert(`You need at least ${requiredReferrals} referrals to withdraw`)
      return
    }

    if (parseInt(amount) > user.balanceTK) {
      alert('Insufficient balance!')
      return
    }

    setIsSubmitting(true)
    
    // Simulate withdrawal request
    setTimeout(() => {
      alert('Withdrawal request submitted successfully!')
      setIsSubmitting(false)
      setAccountNumber('')
      setAmount('')
    }, 2000)
  }

  return (
    <div className="block animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Withdraw (টাকা)</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-5 leading-relaxed">
        ন্যূনতম <b>{minWithdraw}</b> টাকা এবং কমপক্ষে <b>{requiredReferrals}</b> টি রেফারেল প্রয়োজন।
      </p>
      
      <form onSubmit={handleSubmit} className="mt-5">
        <div className="mb-3.5">
          <label className="block mb-1.5 text-sm font-bold text-gray-900 dark:text-white">
            Method:
          </label>
          <select 
            value={withdrawMethod}
            onChange={(e) => setWithdrawMethod(e.target.value)}
            className="w-full px-3.5 py-3 rounded-lg text-base outline-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          >
            <option value="Bkash">Bkash</option>
            <option value="Nagad">Nagad</option>
          </select>
        </div>
        
        <div className="mb-3.5">
          <label className="block mb-1.5 text-sm font-bold text-gray-900 dark:text-white">
            Account Number:
          </label>
          <input 
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="01XXXXXXXXX"
            className="w-full px-3.5 py-3 rounded-lg text-base outline-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          />
        </div>
        
        <div className="mb-3.5">
          <label className="block mb-1.5 text-sm font-bold text-gray-900 dark:text-white">
            Amount (টাকা):
          </label>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1500"
            min={minWithdraw}
            max={user.balanceTK}
            className="w-full px-3.5 py-3 rounded-lg text-base outline-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="mt-2 w-full p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
        </button>
      </form>
    </div>
  )
}
