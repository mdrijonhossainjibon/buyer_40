import { useState, useEffect, useMemo } from 'react'
import { Popup, Toast } from 'antd-mobile'
import { CloseOutline, DownOutline } from 'antd-mobile-icons'
import { QRCode } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import CoinSelectorPopup from './CoinSelectorPopup'
import NetworkSelectorPopup from './NetworkSelectorPopup'

interface DepositPopupProps {
  visible: boolean
  onClose: () => void
  loading?: boolean
}

type Network = {
  id: string
  name: string
  isDefault: boolean
  minDeposit: string
  confirmations: number
  fee: string
  requiresMemo?: boolean
}

type Coin = {
  id: string
  name: string
  symbol: string
  icon: string
  networks: Network[]
}

// Helper function to get crypto icon path
const getCryptoIcon = (symbol: string): string => {
  return `/svg/color/${symbol.toLowerCase()}.svg`
}

// Mock data - replace with actual API call in production
const CRYPTO_COINS: Coin[] = [
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    icon: getCryptoIcon('USDT'),
    networks: [
      {
        id: 'bep20-mainnet',
        name: 'BEP20 (BSC Mainnet)',
        isDefault: true,
        minDeposit: '10',
        confirmations: 15,
        fee: '1',
      },
      {
        id: 'bep20-testnet',
        name: 'BEP20 (BSC Testnet)',
        isDefault: false,
        minDeposit: '10',
        confirmations: 15,
        fee: '0',
      },
      {
        id: 'erc20-mainnet',
        name: 'ERC20 (Ethereum)',
        isDefault: false,
        minDeposit: '50',
        confirmations: 12,
        fee: '15',
      },
      {
        id: 'trc20-mainnet',
        name: 'TRC20 (TRON)',
        isDefault: false,
        minDeposit: '10',
        confirmations: 15,
        fee: '1',
        requiresMemo: true,
      },
    ],
  },
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: getCryptoIcon('BTC'),
    networks: [
      {
        id: 'btc-mainnet',
        name: 'Bitcoin (Mainnet)',
        isDefault: true,
        minDeposit: '0.001',
        confirmations: 1,
        fee: '0.0005',
      },
      {
        id: 'btc-testnet',
        name: 'Bitcoin (Testnet)',
        isDefault: false,
        minDeposit: '0.0001',
        confirmations: 1,
        fee: '0.0001',
      },
    ],
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: getCryptoIcon('ETH'),
    networks: [
      {
        id: 'eth-mainnet',
        name: 'Ethereum (Mainnet)',
        isDefault: true,
        minDeposit: '0.01',
        confirmations: 12,
        fee: '0.01',
      },
      {
        id: 'eth-goerli',
        name: 'Ethereum (Goerli Testnet)',
        isDefault: false,
        minDeposit: '0.01',
        confirmations: 12,
        fee: '0',
      },
    ],
  },
  {
    id: 'bnb',
    name: 'BNB',
    symbol: 'BNB',
    icon: getCryptoIcon('BNB'),
    networks: [
      {
        id: 'bsc-mainnet',
        name: 'BSC (Mainnet)',
        isDefault: true,
        minDeposit: '0.01',
        confirmations: 15,
        fee: '0.01',
      },
      {
        id: 'bsc-testnet',
        name: 'BSC (Testnet)',
        isDefault: false,
        minDeposit: '0.01',
        confirmations: 15,
        fee: '0',
      },
    ],
  },
]

// Mock user deposit addresses - replace with actual API call in production
const USER_DEPOSIT_ADDRESSES: Record<string, Record<string, string>> = {
  usdt: {
    'bep20-mainnet': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    'bep20-testnet': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    'erc20-mainnet': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    'trc20-mainnet': 'TYASr5UV6HEcXatwdFQfmLVUqQQQMUxHLS',
  },
  btc: {
    'btc-mainnet': 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    'btc-testnet': 'tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  },
  eth: {
    'eth-mainnet': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    'eth-goerli': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  },
  bnb: {
    'bsc-mainnet': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    'bsc-testnet': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  },
}

// Mock user deposit memos for networks that require them
const USER_DEPOSIT_MEMOS: Record<string, Record<string, string>> = {
  usdt: {
    'trc20-mainnet': '1234567890',
  },
}

export default function DepositPopup({ visible, onClose, loading = false }: DepositPopupProps) {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedMemo, setCopiedMemo] = useState(false)
  const [showCoinSelector, setShowCoinSelector] = useState(false)
  const [showNetworkSelector, setShowNetworkSelector] = useState(false)

  // Set default coin and network when component mounts or visible changes
  useEffect(() => {
    if (visible) {
      const defaultCoin = CRYPTO_COINS[0]
      setSelectedCoin(defaultCoin)
      setSelectedNetwork(defaultCoin.networks.find(net => net.isDefault) || defaultCoin.networks[0])
    } else {
      setSelectedCoin(null)
      setSelectedNetwork(null)
      setCopied(false)
    }
  }, [visible])

  const depositAddress = useMemo(() => {
    if (!selectedCoin || !selectedNetwork) return ''
    const addresses = USER_DEPOSIT_ADDRESSES[selectedCoin.id as keyof typeof USER_DEPOSIT_ADDRESSES]
    if (!addresses) return ''
    return (addresses as Record<string, string>)[selectedNetwork.id] || ''
  }, [selectedCoin, selectedNetwork])

  const depositMemo = useMemo(() => {
    if (!selectedCoin || !selectedNetwork || !selectedNetwork.requiresMemo) return ''
    const memos = USER_DEPOSIT_MEMOS[selectedCoin.id as keyof typeof USER_DEPOSIT_MEMOS]
    if (!memos) return ''
    return (memos as Record<string, string>)[selectedNetwork.id] || ''
  }, [selectedCoin, selectedNetwork])

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress)
    setCopied(true)
    Toast.show({
      icon: 'success',
      content: 'Address copied!',
      position: 'bottom',
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(depositMemo)
    setCopiedMemo(true)
    Toast.show({
      icon: 'success',
      content: 'Memo copied!',
      position: 'bottom',
    })
    setTimeout(() => setCopiedMemo(false), 2000)
  }


  if (!selectedCoin || !selectedNetwork) return null

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
      <div className="flex flex-col h-full relative">
        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="w-20 h-20 mx-auto mb-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Coming Soon</h3>
            <p className="text-gray-300 text-sm mb-6 max-w-xs mx-auto">
              Deposit feature is currently under development. Stay tuned for updates!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-all shadow-lg"
            >
              Got it
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Deposit Funds
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <CloseOutline fontSize={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
          <div className="space-y-5 mt-4">
              {/* Binance-Style Coin Selection */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Coin
                  </span>
                </div>
                <div 
                  onClick={() => setShowCoinSelector(true)}
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedCoin.icon} 
                      alt={selectedCoin.name} 
                      className="w-7 h-7 rounded-full"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedCoin.symbol}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedCoin.name}
                      </span>
                    </div>
                  </div>
                  <DownOutline className="text-gray-400" />
                </div>
              </div>

              {/* Binance-Style Network Selection */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Network
                  </span>
                </div>
                <div 
                  onClick={() => setShowNetworkSelector(true)}
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedNetwork.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Min: {selectedNetwork.minDeposit} {selectedCoin.symbol} • Fee: {selectedNetwork.fee} {selectedCoin.symbol}
                    </span>
                  </div>
                  <DownOutline className="text-gray-400" />
                </div>
              </div>

            

              {/* Deposit Address - Binance Style */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Deposit Address
                  </span>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded px-3 py-2.5 text-sm text-gray-900 dark:text-white font-mono">
                      {depositAddress.length > 20 
                        ? `${depositAddress.slice(0, 10)}...${depositAddress.slice(-10)}`
                        : depositAddress
                      }
                    </div>
                    <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-semibold rounded transition-all shadow-sm whitespace-nowrap">
                      <CopyOutlined className="text-sm" />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Memo/Tag - Conditionally Rendered */}
              {selectedNetwork.requiresMemo && depositMemo && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-700">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Memo/Tag (Required)
                    </span>
                    <button onClick={handleCopyMemo} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-all">
                      <CopyOutlined />
                      {copiedMemo ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-950 rounded-lg p-4 break-all text-sm text-gray-900 dark:text-white font-mono border border-gray-200 dark:border-gray-700">
                    {depositMemo}
                  </div>
                  <div className="mt-3 flex items-start gap-2 text-xs text-purple-700 dark:text-purple-300">
                    <span className="text-purple-500 mt-0.5">⚠️</span>
                    <span className="font-medium">
                      Important: You must include this memo/tag when sending {selectedCoin.symbol}. Deposits without the correct memo will be lost.
                    </span>
                  </div>
                </div>
              )}

              {/* QR Code - Binance Style */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    QR Code
                  </span>
                </div>
                <div className="p-4 flex flex-col items-center">
                  <div className="bg-white p-3 rounded-lg relative">
                    <QRCode value={depositAddress} size={180} />
                    {/* Coin icon overlay in center */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
                      <img src={selectedCoin.icon} alt={selectedCoin.symbol} className="w-8 h-8" />
                    </div>
                  </div>
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                    Scan to deposit {selectedCoin.symbol}
                  </p>
                </div>
              </div>

              {/* Important Notice - Binance Style */}
               {selectedNetwork && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        <span className="font-semibold">Important:</span> Only send {selectedCoin.symbol} to this {selectedNetwork.name} address.
                        Sending any other asset will result in permanent loss.
                      </p>
                      <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-300">
                        <p>• Minimum deposit: {selectedNetwork.minDeposit} {selectedCoin.symbol}</p>
                        <p>• Network fee: {selectedNetwork.fee} {selectedCoin.symbol}</p>
                        <p>• Confirmations required: {selectedNetwork.confirmations}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Coin Selection Popup */}
      <CoinSelectorPopup
        visible={showCoinSelector}
        onClose={() => setShowCoinSelector(false)}
        coins={CRYPTO_COINS}
        selectedCoin={selectedCoin}
        onSelect={(coin) => {
          setSelectedCoin(coin)
          setSelectedNetwork(coin.networks.find(net => net.isDefault) || coin.networks[0])
        }}
      />

      {/* Network Selection Popup */}
      <NetworkSelectorPopup
        visible={showNetworkSelector}
        onClose={() => setShowNetworkSelector(false)}
        networks={selectedCoin.networks}
        selectedNetwork={selectedNetwork}
        coinSymbol={selectedCoin.symbol}
        onSelect={(network) => setSelectedNetwork(network)}
      />
    </Popup>
  )
}
