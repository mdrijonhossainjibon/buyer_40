'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { PullToRefresh  } from 'antd-mobile'
 
import { fetchSpinConfigRequest, purchaseTicketRequest } from 'modules/spinWheel'
 
import { RootState } from 'modules'
import { formatNumber } from 'lib/formatNumber'
 

 
export default function PurchaseTicketsPage() {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const spinWheel = useSelector((state: RootState) => state.spinWheel)
  const [quantity, setQuantity] = useState(1)

  const totalCost = quantity * (spinWheel.ticketPrice || 100)
  const canAfford = user.wallet.available.xp >= totalCost
 
  const onRefresh = async () => {
    
  }

  const handlePurchase = () => {
    if (!canAfford) {
      //toast.error(`❌ Insufficient XP! You need ${totalCost} XP`)
      return
    }

    if (user.userId) {
      dispatch(purchaseTicketRequest(user.userId, quantity))
      setQuantity(1) // Reset to 1 after purchase
    }
  }

  const quickAmounts = [1, 5, 10, 20]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <PullToRefresh onRefresh={onRefresh}>
        <div className="max-w-lg mx-auto px-4 py-5">
          <div className="space-y-5 pb-32">
            {/* Balance Overview */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <i className="fas fa-star text-white text-sm"></i>
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Your XP</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(user.wallet.available.xp || 0)}</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                    <i className="fas fa-ticket-alt text-white text-sm"></i>
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Tickets</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{spinWheel.spinTickets || 0}</p>
              </div>
            </div>

            {/* Ticket Price Info */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ticket Price</span>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                      <i className="fas fa-ticket-alt text-white text-lg"></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">1 Spin Ticket</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">No cooldown • Instant spin</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{spinWheel.ticketPrice || 100}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">XP</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Quantity</span>
              </div>
              <div className="p-3 space-y-3">
                {/* Quantity Input */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-minus text-gray-700 dark:text-gray-300"></i>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 text-gray-900 dark:text-white focus:outline-none focus:border-yellow-500"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
                      className={`py-2 px-3 text-xs font-semibold rounded border transition-all ${
                        quantity === amount
                          ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-yellow-500'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 hover:border-yellow-500 text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Cost */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Summary</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Quantity</span>
                  <span className="font-bold text-gray-900 dark:text-white">{quantity} ticket{quantity > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Price per ticket</span>
                  <span className="font-bold text-gray-900 dark:text-white">{spinWheel.ticketPrice || 100} XP</span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Total Cost</span>
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{totalCost} XP</span>
                </div>
              </div>
            </div>

            {/* Validation Messages */}
            {!canAfford && (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-red-200 dark:border-red-800/30 overflow-hidden">
                <div className="p-3 space-y-2">
                  <div className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                    <span className="mt-0.5">⚠️</span>
                    <div>
                      <p className="font-medium">Insufficient XP</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        You need {totalCost - user.wallet.available.xp} more XP to complete this purchase
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Info Cards */}
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-blue-200 dark:border-blue-800/30 p-3">
                <div className="flex items-start gap-2">
                  <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">About Spin Tickets</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      Spin tickets let you spin the wheel anytime without waiting for the cooldown timer. Each spin gives you a chance to win amazing rewards!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg border border-green-200 dark:border-green-800/30 p-3">
                <div className="flex items-start gap-2">
                  <i className="fas fa-gift text-green-500 mt-0.5"></i>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">Earn More XP</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      Complete tasks, watch ads, and participate in events to earn more XP for purchasing tickets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PullToRefresh>

      {/* Purchase Button - Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handlePurchase}
            disabled={!canAfford || spinWheel.isLoading}
            className={`w-full py-4 font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              canAfford && !spinWheel.isLoading
                ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-gray-900 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            {spinWheel.isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <i className="fas fa-shopping-cart"></i>
                <span>Purchase {quantity} Ticket{quantity > 1 ? 's' : ''}</span>
              </>
            )}
          </button>
          
          {/* Quick Stats Below Button */}
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Instant</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>No Cooldown</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
