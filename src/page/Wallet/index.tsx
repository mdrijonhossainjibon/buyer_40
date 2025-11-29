'use client'

import DepositPopup from 'components/wallet/DepositPopup'
import WithdrawPopup from 'components/wallet/WithdrawPopup'
import { RootState } from 'modules'
import { useState } from 'react'
import { useSelector } from 'react-redux'



export default function WalletPage() {
  const userState = useSelector((state: RootState) => state.user)


  const [showDepositPopup, setShowDepositPopup] = useState(false)
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
 


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">

      {/* Assets Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {/* Assets List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            {/* Header with Actions */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Assets</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDepositPopup(true)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <i className="fas fa-plus-circle"></i>
                    <span>Deposit</span>
                  </button>
                  <button
                    onClick={() => setShowWithdrawPopup(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <i className="fas fa-arrow-circle-up"></i>
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Asset Items */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* USDT */}
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <i className="fas fa-dollar-sign text-green-600 dark:text-green-400"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">USDT</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tether USD</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{(userState.wallet.available.usdt || 0).toFixed(2)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">≈ ${(userState.wallet.available.usdt || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* XP */}
              <div className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <i className="fas fa-star text-purple-600 dark:text-purple-400"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">XP</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Experience Points</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{userState.wallet.available.xp?.toFixed(3) || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Points</p>
                  </div>
                </div>
              </div>

              {/* Spin Tickets */}
              <div className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                      <i className="fas fa-ticket-alt text-yellow-600 dark:text-yellow-400"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Spin Tickets</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Lottery Tickets</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{userState.wallet.available.spin || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tickets</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Popup */}
      <DepositPopup
        visible={showDepositPopup}
        onClose={() => setShowDepositPopup(false)}
      />

      {/* Withdraw Popup */}
      <WithdrawPopup
        visible={showWithdrawPopup}
        onClose={() => setShowWithdrawPopup(false)}
      />
    </div>
  )
}
