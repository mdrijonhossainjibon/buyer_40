'use client'

import { useState } from 'react'

interface UserState {
  userId: number | null
  balanceTK: number
  referralCount: number
  dailyAdLimit: number
  watchedToday: number
  telegramBonus: number
  youtubeBonus: number
  isBotVerified: number
}

interface WithdrawPageProps {
  userState: UserState
}

export default function WithdrawPage({ userState }: WithdrawPageProps) {
  const [withdrawMethod, setWithdrawMethod] = useState('Bkash')
  const [accountNumber, setAccountNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const minWithdraw = 1500
  const requiredReferrals = 20

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (userState.balanceTK < minWithdraw) {
      alert(`Minimum withdrawal amount is ${minWithdraw} TK`)
      return
    }
    
    if (userState.referralCount < requiredReferrals) {
      alert(`You need at least ${requiredReferrals} referrals to withdraw`)
      return
    }

    if (parseInt(amount) > userState.balanceTK) {
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
    <div className="page active">
      <h2>Withdraw (টাকা)</h2>
      <p>
        ন্যূনতম <b>{minWithdraw}</b> টাকা এবং কমপক্ষে <b>{requiredReferrals}</b> টি রেফারেল প্রয়োজন।
      </p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '700' }}>
            Method:
          </label>
          <select 
            value={withdrawMethod}
            onChange={(e) => setWithdrawMethod(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              border: '1px solid var(--border-color-light)',
              background: 'var(--secondary-bg-light)',
              color: 'var(--text-color-light)'
            }}
            required
          >
            <option value="Bkash">Bkash</option>
            <option value="Nagad">Nagad</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '700' }}>
            Account Number:
          </label>
          <input 
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="01XXXXXXXXX"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              border: '1px solid var(--border-color-light)',
              background: 'var(--secondary-bg-light)',
              color: 'var(--text-color-light)'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '700' }}>
            Amount (টাকা):
          </label>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1500"
            min={minWithdraw}
            max={userState.balanceTK}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              border: '1px solid var(--border-color-light)',
              background: 'var(--secondary-bg-light)',
              color: 'var(--text-color-light)'
            }}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="action-btn"
          disabled={isSubmitting}
          style={{ marginTop: '8px', width: '100%' }}
        >
          <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
        </button>
      </form>
    </div>
  )
}
