'use client'

import { RootState } from '@/store'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Selector, Card } from 'antd-mobile'
import { Input, InputNumber, Button } from 'antd'
import {
  setWithdrawMethod,
  setAccountNumber,
  setAmount,
  submitWithdrawRequest,
  fetchWithdrawConfigRequest,
  clearError,
  clearSuccessMessage
} from '@/store/modules/withdraw/actions'


export default function WithdrawPage() {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const withdraw = useSelector((state: RootState) => state.withdraw)

  const {
    withdrawMethod,
    accountNumber,
    amount,
    isSubmitting,
    isLoading,
    error,
    successMessage,
    minWithdraw,
    requiredReferrals
  } = withdraw

  
  // Clear messages on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError())
      dispatch(clearSuccessMessage())
    }
  }, [dispatch])

  const handleSubmit = () => {
    if (!user.userId || !withdrawMethod || !accountNumber || !amount) {
      return
    }

    // Dispatch Redux action to submit withdrawal request
    dispatch(submitWithdrawRequest({
      userId: user.userId,
      withdrawMethod,
      accountNumber,
      amount: parseInt(amount)
    }))
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
              type='primary'
              size='large'
              disabled={user.status === 'suspend' || isSubmitting}
              loading={isSubmitting}
              htmlType="submit"
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
              onChange={(val) => dispatch(setWithdrawMethod(val[0] || 'Bkash'))}
            />
          </Form.Item>

          <Form.Item
            label="Account Number:"
            name="accountNumber"
            rules={[
              { required: true, message: 'Account number required' },
              { max: 11, message: 'Account number must be maximum 11 digits' },
              { min: 11, message: 'Account number must be exactly 11 digits' }
            ]}
          >
            <Input
              value={accountNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '') // Only allow digits
                if (value.length <= 11) {
                  dispatch(setAccountNumber(value))
                }
              }}
              placeholder="০১XXXXXXXXX"
              size="large"
              className="w-full"
              maxLength={11}
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
            <div className="flex gap-2">
              <InputNumber
                value={amount ? parseInt(amount) : undefined}
                onChange={(value) => {
                  dispatch(setAmount(value ? value.toString() : ''))
                }}
                placeholder={minWithdraw.toString()}
                min={minWithdraw}
                max={user.balanceTK}
                size="large"
                className="flex-1"
                controls={false}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0}
              />
              <Button
                size="large"
                onClick={() => {
                  dispatch(setAmount(user.balanceTK.toString()))
                }}
                className="px-4 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600 font-medium"
              >
                Max
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
