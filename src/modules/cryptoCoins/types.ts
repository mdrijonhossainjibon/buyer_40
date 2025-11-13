// Network interface
export interface Network {
  id: string
  name: string
  isDefault: boolean
  minDeposit: string
  confirmations: number
  fee: string
  requiresMemo?: boolean
}

// Crypto coin interface
export interface CryptoCoin {
  id: string
  name: string
  symbol: string
  icon: string
  networks: Network[]
}

// Crypto coins state interface
export interface CryptoCoinsState {
  coins: CryptoCoin[]
  isLoading: boolean
  error: string | null
  lastFetched: number | null
}

// Action types
export const FETCH_CRYPTO_COINS_REQUEST = 'cryptoCoins/FETCH_CRYPTO_COINS_REQUEST'
export const FETCH_CRYPTO_COINS_SUCCESS = 'cryptoCoins/FETCH_CRYPTO_COINS_SUCCESS'
export const FETCH_CRYPTO_COINS_FAILURE = 'cryptoCoins/FETCH_CRYPTO_COINS_FAILURE'
export const CLEAR_CRYPTO_COINS_ERROR = 'cryptoCoins/CLEAR_CRYPTO_COINS_ERROR'

// Action interfaces
export interface FetchCryptoCoinsRequestAction {
  type: typeof FETCH_CRYPTO_COINS_REQUEST
  [key: string]: any
}

export interface FetchCryptoCoinsSuccessAction {
  type: typeof FETCH_CRYPTO_COINS_SUCCESS
  payload: CryptoCoin[]
  [key: string]: any
}

export interface FetchCryptoCoinsFailureAction {
  type: typeof FETCH_CRYPTO_COINS_FAILURE
  payload: string
  [key: string]: any
}

export interface ClearCryptoCoinsErrorAction {
  type: typeof CLEAR_CRYPTO_COINS_ERROR
  [key: string]: any
}

// Union type for all crypto coins actions
export type CryptoCoinsActionTypes =
  | FetchCryptoCoinsRequestAction
  | FetchCryptoCoinsSuccessAction
  | FetchCryptoCoinsFailureAction
  | ClearCryptoCoinsErrorAction
