'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { PullToRefresh  } from 'antd-mobile'
import { RootState } from '@/store'
import { fetchSpinConfigRequest, purchaseTicketRequest } from '@/store/modules/spinWheel'
import { fetchUserDataRequest } from '@/store/modules/user'
import { toast } from 'react-toastify'

export default function PurchaseTicketsPage() {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const spinWheel = useSelector((state: RootState) => state.spinWheel)
  const [quantity, setQuantity] = useState(1)

  const totalCost = quantity * (spinWheel.ticketPrice || 100)
  const canAfford = user.wallet.available.xp >= totalCost

  useEffect(() => {
    if (user.userId) {
      dispatch(fetchSpinConfigRequest(user.userId))
    }
  }, [dispatch, user.userId])

  const onRefresh = async () => {
    if (user.userId) {
      dispatch(fetchUserDataRequest())
      dispatch(fetchSpinConfigRequest(user.userId))
    }
  }

  const handlePurchase = () => {
    if (!canAfford) {
      toast.error(`❌ Insufficient XP! You need ${totalCost} XP`)
      return
    }

    if (user.userId) {
      dispatch(purchaseTicketRequest(user.userId, quantity))
      setQuantity(1) // Reset to 1 after purchase
    }
  }

  const quickAmounts = [1, 5, 10, 20]

  return (
    <PullToRefresh onRefresh={onRefresh}>
      <div className="pb-4 animate-fade-in">
        {/* Balance Overview */}
        <div className="mx-4 mb-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800 shadow-md">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <i className="fas fa-star text-white text-sm"></i>
                </div>
                <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">Your XP</p>
              </div>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{user.wallet.available.xp || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-800/20 rounded-xl p-3 border border-yellow-200 dark:border-yellow-800 shadow-md">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                  <i className="fas fa-ticket-alt text-white text-sm"></i>
                </div>
                <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">Tickets</p>
              </div>
              <p className="text-2xl font-black text-yellow-600 dark:text-yellow-400">{spinWheel.spinTickets || 0}</p>
            </div>
          </div>
        </div>

        {/* Purchase Card */}
        <div className="mx-4 mb-5">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-md">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <i className="fas fa-shopping-cart text-yellow-500"></i>
              Purchase Spin Tickets
            </h3>

            {/* Ticket Price Info */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-3 mb-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-md">
                    <i className="fas fa-ticket-alt text-white text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">1 Spin Ticket</p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">Spin anytime, no cooldown</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-purple-600 dark:text-purple-400">{spinWheel.ticketPrice || 100}</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase">XP</p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-900 dark:text-white mb-2 block">
                Select Quantity
              </label>
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  disabled={quantity <= 1}
                >
                  <i className="fas fa-minus text-gray-700 dark:text-gray-300"></i>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg py-2 text-gray-900 dark:text-white"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <i className="fas fa-plus text-gray-700 dark:text-gray-300"></i>
                </button>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setQuantity(amount)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      quantity === amount
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Cost */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">Quantity:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{quantity} ticket{quantity > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">Price per ticket:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{spinWheel.ticketPrice || 100} XP</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Total Cost:</span>
                  <span className="text-xl font-black text-purple-600 dark:text-purple-400">{totalCost} XP</span>
                </div>
              </div>
            </div>

            {/* Validation Message */}
            {!canAfford && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <i className="fas fa-exclamation-circle"></i>
                  Insufficient XP! You need {totalCost - user.xp} more XP
                </p>
              </div>
            )}

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              disabled={!canAfford || spinWheel.isPurchasing}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {spinWheel.isPurchasing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span className="text-sm">Processing...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-shopping-cart"></i>
                  <span className="text-sm">Purchase {quantity} Ticket{quantity > 1 ? 's' : ''}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mx-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <i className="fas fa-gift text-yellow-500 text-sm"></i>
            Ticket Benefits
          </h3>
          <div className="space-y-2.5">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-infinity text-yellow-600 dark:text-yellow-400 text-sm"></i>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">No Cooldown</p>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">Spin anytime without waiting</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-coins text-green-600 dark:text-green-400 text-sm"></i>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">Win Prizes</p>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">Every spin has a chance to win USDT</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-star text-purple-600 dark:text-purple-400 text-sm"></i>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">Earn XP</p>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">Complete tasks to earn more XP for tickets</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PullToRefresh>
  )
}
