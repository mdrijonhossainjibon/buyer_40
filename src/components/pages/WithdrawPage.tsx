'use client'

import { RootState } from '@/store'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, Button, Selector, Toast, Card } from 'antd-mobile'
import { API_CALL, generateSignature } from 'auth-fingerprint'


export default function WithdrawPage() {
  const [withdrawMethod, setWithdrawMethod] = useState('Bkash')
  const [accountNumber, setAccountNumber] = useState('')
  const [amount, setAmount] = useState('')
  const user = useSelector((state: RootState) => state.user)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const minWithdraw = 1500
  const requiredReferrals = 20

  const handleSubmit = async () => {
    if (!user.userId || !withdrawMethod || !accountNumber || !amount) {
      Toast.show({
        content: 'সকল ক্ষেত্র পূরণ করুন',
        duration: 3000,
        position: 'bottom'
      })
      return
    }


    setIsSubmitting(true)

    Toast.show({
      content: 'উইথড্র অনুরোধ জমা দেওয়া হচ্ছে...',
      duration: 3000,
      icon: 'loading',
    })

    try {
      const { response } = await API_CALL({
        url: '/withdraw',
        method: 'POST',
        body: {
          ...generateSignature(
            JSON.stringify({
              userId: user.userId,
              withdrawMethod,
              accountNumber,
              amount: parseInt(amount)
            }),
            process.env.NEXT_PUBLIC_SECRET_KEY || ''
          )
        }
      })

      if (response && response.success) {
        Toast.show({
          content: response.message || 'উইথড্র অনুরোধ সফলভাবে জমা দেওয়া হয়েছে!',
          duration: 3000,
          position: 'bottom'
        })

        // Clear form
        setAccountNumber('')
        setAmount('')


      } else {
        Toast.show({
          content: response?.message || 'উইথড্র অনুরোধে সমস্যা হয়েছে',
          duration: 3000,
          position: 'bottom'
        })
      }
    } catch (error) {
      console.error('Withdraw error:', error)
      Toast.show({
        content: 'নেটওয়ার্ক সমস্যা! আবার চেষ্টা করুন।',
        duration: 3000, position: 'bottom'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const paymentMethods = [
    { label: 'Bkash', value: 'Bkash' },
    { label: 'Nagad', value: 'Nagad' },
  ]

  return (
    <div className="block animate-fade-in p-4">
      <Card className="mb-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Withdraw (BDT)</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-5 leading-relaxed">
          ন্যূনতম <b>{minWithdraw}</b> টাকা এবং কমপক্ষে <b>{requiredReferrals}</b> টি রেফারেল প্রয়োজন।
        </p>

        {/* Suspended Account Warning */}
        {user.status === 'suspend' && (
          <Card className="mb-4" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
            <div className="flex items-center">
              <i className="fa-solid fa-exclamation-triangle text-red-600 mr-3"></i>
              <div>
                <h4 className="text-red-800 font-semibold">অ্যাকাউন্ট স্থগিত</h4>
                <p className="text-red-700 text-sm">
                  আপনার অ্যাকাউন্ট স্থগিত করা হয়েছে। উইথড্র করতে পারবেন না।
                </p>
              </div>
            </div>
          </Card>
        )}
      </Card>

      <Card>
        <Form
          onFinish={handleSubmit}
          footer={
            <Button
              block
              type='submit'
              color='primary'
              size='large'
              disabled={user.status === 'suspend' || isSubmitting}
              loading={isSubmitting}
            >
              {user.status === 'suspend'
                ? 'Account suspended'
                : isSubmitting
                  ? 'Submitting...'
                  : 'Submit withdrawal request'
              }
            </Button>
          }
        >
          <Form.Item
            label="পেমেন্ট পদ্ধতি:"
            name="withdrawMethod"
            rules={[{ required: true, message: 'Select payment method' }]}
          >
            <Selector
              options={paymentMethods}
              value={[withdrawMethod]}
              onChange={(val) => setWithdrawMethod(val[0] || 'Bkash')}
            />
          </Form.Item>

          <Form.Item
            label="Account Number:"
            name="accountNumber"
            rules={[{ required: true, message: 'Account number required' }]}
          >
            <Input
              value={accountNumber}
              onChange={(val) => setAccountNumber(val)}
              placeholder="০১XXXXXXXXX"
              clearable
            />
          </Form.Item>

          <Form.Item
            label="Amount (BDT)):"
            name="amount"
            rules={[
              { required: true, message: 'quantity required' },
              {
                validator: (_, value) => {
                  if (value && parseInt(value) < minWithdraw) {
                    return Promise.reject(`ন্যূনতম ${minWithdraw} টাকা প্রয়োজন`)
                  }
                  if (value && parseInt(value) > user.balanceTK) {
                    return Promise.reject('অপর্যাপ্ত ব্যালেন্স!')
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input
              type="text"
              value={amount}
              onChange={(val) => {
                // Keep only numbers
                const numericValue = val.replace(/\D/g, '')
                setAmount(numericValue)
              }}
              placeholder="১০০০"
              clearable
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
