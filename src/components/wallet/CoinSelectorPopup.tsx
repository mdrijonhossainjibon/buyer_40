import { useState, useMemo } from 'react'
import { Popup, SearchBar } from 'antd-mobile'
import { CloseOutline, CheckOutline } from 'antd-mobile-icons'
import CryptoIcon from 'components/CryptoIcons'

type Network = {
  id: string
  name: string
  isDefault: boolean
  minDeposit: string
  confirmations: number
  fee: string
}

type Coin = {
  id: string
  name: string
  symbol: string
  icon: string
  networks: Network[]
}

interface CoinSelectorPopupProps {
  visible: boolean
  onClose: () => void
  coins: Coin[]
  selectedCoin: Coin | null
  onSelect: (coin: Coin) => void
}

export default function CoinSelectorPopup({
  visible,
  onClose,
  coins,
  selectedCoin,
  onSelect,
}: CoinSelectorPopupProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter coins based on search query
  const filteredCoins = useMemo(() => {
    if (!searchQuery) return coins
    const query = searchQuery.toLowerCase()
    return coins.filter(
      (coin) =>
        coin.symbol.toLowerCase().includes(query) ||
        coin.name.toLowerCase().includes(query)
    )
  }, [coins, searchQuery])

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        width: '100vw',
        height: '100vh',
        padding: '0',
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 px-5 pt-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Select Coin
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {filteredCoins.length} {filteredCoins.length === 1 ? 'coin' : 'coins'} available
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <CloseOutline fontSize={24} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Search Bar */}
          <SearchBar
            placeholder="Search coin name or symbol"
            value={searchQuery}
            onChange={setSearchQuery}
            style={{
              '--background': 'var(--adm-color-background)',
              '--border-radius': '12px',
              '--height': '44px',
            }}
          />
        </div>

        {/* Coin List */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {filteredCoins.length > 0 ? (
            <div className="space-y-1.5">
              {filteredCoins.map((coin) => (
                <div
                  key={coin.id}
                  onClick={() => {
                    onSelect(coin)
                    onClose()
                  }}
                  className={`group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${selectedCoin?.id === coin.id
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* Coin Icon */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCoin?.id === coin.id
                          ? 'bg-white dark:bg-gray-800'
                          : 'bg-white dark:bg-gray-700'
                        }`}>

                        <CryptoIcon symbol={coin.id} className="w-7 h-7 rounded-full" />
                      </div>
                      {selectedCoin?.id === coin.id && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckOutline className="text-white" fontSize={10} />
                        </div>
                      )}
                    </div>

                    {/* Coin Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {coin.symbol}
                        </span>
                        {selectedCoin?.id === coin.id && (
                          <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[10px] font-medium rounded">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {coin.name}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          {coin.networks.length} networks
                        </span>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    {selectedCoin?.id !== coin.id && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No coins found</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </Popup>
  )
}
