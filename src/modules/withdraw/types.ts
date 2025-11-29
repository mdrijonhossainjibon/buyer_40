// Network type
export interface Network {
  id: string
  name: string
  isDefault: boolean
  minDeposit: string
  confirmations: number
  fee: string
  requiresMemo?: boolean
}

// Coin type
export interface Coin {
  id: string
  name: string
  symbol: string
  icon: string
  networks: Network[]
}

// Recent address type
export interface RecentAddress {
  id: string
  address: string
  label: string
  network: string
  coinSymbol: string
  lastUsed: number
}

// Crypto prices type
export interface CryptoPrices {
  [coinId: string]: number
}

// Crypto withdraw request
export interface CryptoWithdrawRequest {
  coinSymbol: string
  network: string
  walletAddress: string
  amount: number
  memo?: string
}

// Transaction data
export interface TransactionData {
  amount: string
  currency: string
  network: string
  address: string
  transactionId: string | null
  timestamp: number
}

// Withdraw state interface
export interface WithdrawState {
  selectedCoin: Coin | null
  selectedNetwork: Network | null
  withdrawAddress: string
  withdrawMemo: string
  withdrawAmount: string
  cryptoPrices: CryptoPrices
  pricesLoading: boolean
  recentAddresses: RecentAddress[]
  showCoinSelector: boolean
  showNetworkSelector: boolean
  showRecentAddresses: boolean
  showConfirmation: boolean
  showProcessing: boolean
  showSuccess: boolean
  showFailure: boolean
  isSubmitting: boolean
  error: string | null
  successMessage: string | null
  transactionData: TransactionData | null
  withdrawalStatus: 'idle' | 'pending' | 'processing' | 'completed' | 'failed'
}

// Action types
export const WITHDRAW_ACTIONS = {
  // Selection actions
  SET_SELECTED_COIN: 'WITHDRAW/SET_SELECTED_COIN',
  SET_SELECTED_NETWORK: 'WITHDRAW/SET_SELECTED_NETWORK',
  
  // Input actions
  SET_WITHDRAW_ADDRESS: 'WITHDRAW/SET_WITHDRAW_ADDRESS',
  SET_WITHDRAW_MEMO: 'WITHDRAW/SET_WITHDRAW_MEMO',
  SET_WITHDRAW_AMOUNT: 'WITHDRAW/SET_WITHDRAW_AMOUNT',
  SET_PERCENTAGE_AMOUNT: 'WITHDRAW/SET_PERCENTAGE_AMOUNT',
  
  // Crypto prices actions
  FETCH_CRYPTO_PRICES_REQUEST: 'WITHDRAW/FETCH_CRYPTO_PRICES_REQUEST',
  FETCH_CRYPTO_PRICES_SUCCESS: 'WITHDRAW/FETCH_CRYPTO_PRICES_SUCCESS',
  FETCH_CRYPTO_PRICES_FAILURE: 'WITHDRAW/FETCH_CRYPTO_PRICES_FAILURE',
  
  // Recent addresses actions
  LOAD_RECENT_ADDRESSES: 'WITHDRAW/LOAD_RECENT_ADDRESSES',
  ADD_RECENT_ADDRESS: 'WITHDRAW/ADD_RECENT_ADDRESS',
  DELETE_RECENT_ADDRESS: 'WITHDRAW/DELETE_RECENT_ADDRESS',
  SELECT_RECENT_ADDRESS: 'WITHDRAW/SELECT_RECENT_ADDRESS',
  
  // UI state actions
  TOGGLE_COIN_SELECTOR: 'WITHDRAW/TOGGLE_COIN_SELECTOR',
  TOGGLE_NETWORK_SELECTOR: 'WITHDRAW/TOGGLE_NETWORK_SELECTOR',
  TOGGLE_RECENT_ADDRESSES: 'WITHDRAW/TOGGLE_RECENT_ADDRESSES',
  TOGGLE_CONFIRMATION: 'WITHDRAW/TOGGLE_CONFIRMATION',
  TOGGLE_PROCESSING: 'WITHDRAW/TOGGLE_PROCESSING',
  TOGGLE_SUCCESS: 'WITHDRAW/TOGGLE_SUCCESS',
  TOGGLE_FAILURE: 'WITHDRAW/TOGGLE_FAILURE',
  
  // Submit withdraw actions
  SUBMIT_WITHDRAW_REQUEST: 'WITHDRAW/SUBMIT_WITHDRAW_REQUEST',
  SUBMIT_WITHDRAW_SUCCESS: 'WITHDRAW/SUBMIT_WITHDRAW_SUCCESS',
  SUBMIT_WITHDRAW_FAILURE: 'WITHDRAW/SUBMIT_WITHDRAW_FAILURE',
  
  // Reset actions
  RESET_WITHDRAW_FORM: 'WITHDRAW/RESET_WITHDRAW_FORM',
  CLEAR_WITHDRAW_ERROR: 'WITHDRAW/CLEAR_WITHDRAW_ERROR',
  
  // Socket real-time updates
  WITHDRAWAL_STATUS_UPDATE: 'WITHDRAW/WITHDRAWAL_STATUS_UPDATE',
} as const

// Action interfaces
export interface SetSelectedCoinAction {
  type: typeof WITHDRAW_ACTIONS.SET_SELECTED_COIN
  payload: Coin | null
  [key: string]: any
}

export interface SetSelectedNetworkAction {
  type: typeof WITHDRAW_ACTIONS.SET_SELECTED_NETWORK
  payload: Network | null
  [key: string]: any
}

export interface SetWithdrawAddressAction {
  type: typeof WITHDRAW_ACTIONS.SET_WITHDRAW_ADDRESS
  payload: string
  [key: string]: any
}

export interface SetWithdrawMemoAction {
  type: typeof WITHDRAW_ACTIONS.SET_WITHDRAW_MEMO
  payload: string
  [key: string]: any
}

export interface SetWithdrawAmountAction {
  type: typeof WITHDRAW_ACTIONS.SET_WITHDRAW_AMOUNT
  payload: string
  [key: string]: any
}

export interface SetPercentageAmountAction {
  type: typeof WITHDRAW_ACTIONS.SET_PERCENTAGE_AMOUNT
  payload: { percentage: number; balance: number }
  [key: string]: any
}

export interface FetchCryptoPricesRequestAction {
  type: typeof WITHDRAW_ACTIONS.FETCH_CRYPTO_PRICES_REQUEST
  [key: string]: any
}

export interface FetchCryptoPricesSuccessAction {
  type: typeof WITHDRAW_ACTIONS.FETCH_CRYPTO_PRICES_SUCCESS
  payload: CryptoPrices
  [key: string]: any
}

export interface FetchCryptoPricesFailureAction {
  type: typeof WITHDRAW_ACTIONS.FETCH_CRYPTO_PRICES_FAILURE
  payload: string
  [key: string]: any
}

export interface LoadRecentAddressesAction {
  type: typeof WITHDRAW_ACTIONS.LOAD_RECENT_ADDRESSES
  payload: RecentAddress[]
  [key: string]: any
}

export interface AddRecentAddressAction {
  type: typeof WITHDRAW_ACTIONS.ADD_RECENT_ADDRESS
  payload: Omit<RecentAddress, 'id' | 'lastUsed'>
  [key: string]: any
}

export interface DeleteRecentAddressAction {
  type: typeof WITHDRAW_ACTIONS.DELETE_RECENT_ADDRESS
  payload: string
  [key: string]: any
}

export interface SelectRecentAddressAction {
  type: typeof WITHDRAW_ACTIONS.SELECT_RECENT_ADDRESS
  payload: RecentAddress
  [key: string]: any
}

export interface ToggleCoinSelectorAction {
  type: typeof WITHDRAW_ACTIONS.TOGGLE_COIN_SELECTOR
  payload?: boolean
  [key: string]: any
}

export interface ToggleNetworkSelectorAction {
  type: typeof WITHDRAW_ACTIONS.TOGGLE_NETWORK_SELECTOR
  payload?: boolean
  [key: string]: any
}

export interface ToggleRecentAddressesAction {
  type: typeof WITHDRAW_ACTIONS.TOGGLE_RECENT_ADDRESSES
  payload?: boolean
  [key: string]: any
}

export interface ToggleConfirmationAction {
  type: typeof WITHDRAW_ACTIONS.TOGGLE_CONFIRMATION
  payload?: boolean
  [key: string]: any
}

export interface ToggleProcessingAction {
  type: typeof WITHDRAW_ACTIONS.TOGGLE_PROCESSING
  payload?: boolean
  [key: string]: any
}

export interface ToggleSuccessAction {
  type: typeof WITHDRAW_ACTIONS.TOGGLE_SUCCESS
  payload?: boolean
  [key: string]: any
}

export interface ToggleFailureAction {
  type: typeof WITHDRAW_ACTIONS.TOGGLE_FAILURE
  payload?: boolean
  [key: string]: any
}

export interface SubmitWithdrawRequestAction {
  type: typeof WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_REQUEST
  payload: CryptoWithdrawRequest
  [key: string]: any
}

export interface SubmitWithdrawSuccessAction {
  type: typeof WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_SUCCESS
  payload: {
    message: string
    transactionData: TransactionData
  }
  [key: string]: any
}

export interface SubmitWithdrawFailureAction {
  type: typeof WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_FAILURE
  payload: string
  [key: string]: any
}

export interface ResetWithdrawFormAction {
  type: typeof WITHDRAW_ACTIONS.RESET_WITHDRAW_FORM
  [key: string]: any
}

export interface ClearWithdrawErrorAction {
  type: typeof WITHDRAW_ACTIONS.CLEAR_WITHDRAW_ERROR
  [key: string]: any
}

export interface WithdrawalStatusUpdateAction {
  type: typeof WITHDRAW_ACTIONS.WITHDRAWAL_STATUS_UPDATE
  payload: {
    status: 'pending' | 'processing' | 'completed' | 'failed'
    transactionId?: string
    txHash?: string
    message?: string
    error?: string
  }
  [key: string]: any
}

// Union type for all withdraw actions
export type WithdrawActionTypes =
  | SetSelectedCoinAction
  | SetSelectedNetworkAction
  | SetWithdrawAddressAction
  | SetWithdrawMemoAction
  | SetWithdrawAmountAction
  | SetPercentageAmountAction
  | FetchCryptoPricesRequestAction
  | FetchCryptoPricesSuccessAction
  | FetchCryptoPricesFailureAction
  | LoadRecentAddressesAction
  | AddRecentAddressAction
  | DeleteRecentAddressAction
  | SelectRecentAddressAction
  | ToggleCoinSelectorAction
  | ToggleNetworkSelectorAction
  | ToggleRecentAddressesAction
  | ToggleConfirmationAction
  | ToggleProcessingAction
  | ToggleSuccessAction
  | ToggleFailureAction
  | SubmitWithdrawRequestAction
  | SubmitWithdrawSuccessAction
  | SubmitWithdrawFailureAction
  | ResetWithdrawFormAction
  | ClearWithdrawErrorAction
  | WithdrawalStatusUpdateAction
