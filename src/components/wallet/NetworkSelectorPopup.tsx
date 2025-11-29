import { useState, useMemo } from 'react'
import { Popup, SearchBar } from 'antd-mobile'
import { CloseOutline, CheckOutline } from 'antd-mobile-icons'

type Network = {
  id: string
  name: string
  isDefault: boolean
  minDeposit: string
  confirmations: number
  fee: string
}

interface NetworkSelectorPopupProps {
  visible: boolean
  onClose: () => void
  networks: Network[]
  selectedNetwork: Network | null
  coinSymbol: string
  onSelect: (network: Network) => void
}

export default function NetworkSelectorPopup({
  visible,
  onClose,
  networks,
  selectedNetwork,
  coinSymbol,
  onSelect,
}: NetworkSelectorPopupProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter networks based on search query
  const filteredNetworks = useMemo(() => {
    if (!searchQuery) return networks
    const query = searchQuery.toLowerCase()
    return networks.filter((network) =>
      network.name.toLowerCase().includes(query)
    )
  }, [networks, searchQuery])

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
                Select Network
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {filteredNetworks.length} {filteredNetworks.length === 1 ? 'network' : 'networks'} available
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
            placeholder="Search network name"
            value={searchQuery}
            onChange={setSearchQuery}
            style={{
              '--background': 'var(--adm-color-background)',
              '--border-radius': '12px',
              '--height': '44px',
            }}
          />
        </div>

        {/* Network List */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {filteredNetworks.length > 0 ? (
            <div className="space-y-1.5">
              {filteredNetworks.map((network) => (
                <div
                  key={network.id}
                  onClick={() => {
                    onSelect(network)
                    onClose()
                  }}
                  className={`group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    selectedNetwork?.id === network.id
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* Network Icon */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedNetwork?.id === network.id
                          ? 'bg-white dark:bg-gray-800'
                          : 'bg-white dark:bg-gray-700'
                      }`}>
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      {selectedNetwork?.id === network.id && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckOutline className="text-white" fontSize={10} />
                        </div>
                      )}
                    </div>

                    {/* Network Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {network.name}
                        </span>
                        {selectedNetwork?.id === network.id && (
                          <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[10px] font-medium rounded flex-shrink-0">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] rounded">
                          Min: {network.minDeposit}
                        </span>
                        <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] rounded">
                          Fee: {network.fee}
                        </span>
                        <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] rounded">
                          {network.confirmations} confirmations
                        </span>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    {selectedNetwork?.id !== network.id && (
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
              <p className="text-gray-500 dark:text-gray-400 text-sm">No networks found</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </Popup>
  )
}
