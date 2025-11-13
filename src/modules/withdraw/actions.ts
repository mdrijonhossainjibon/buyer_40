import {
  WITHDRAW_ACTIONS,
  Coin,
  Network,
  RecentAddress,
  CryptoPrices,
  CryptoWithdrawRequest,
  TransactionData,
  SetSelectedCoinAction,
  SetSelectedNetworkAction,
  SetWithdrawAddressAction,
  SetWithdrawMemoAction,
  SetWithdrawAmountAction,
  SetPercentageAmountAction,
  FetchCryptoPricesRequestAction,
  FetchCryptoPricesSuccessAction,
  FetchCryptoPricesFailureAction,
  LoadRecentAddressesAction,
  AddRecentAddressAction,
  DeleteRecentAddressAction,
  SelectRecentAddressAction,
  ToggleCoinSelectorAction,
  ToggleNetworkSelectorAction,
  ToggleRecentAddressesAction,
  ToggleConfirmationAction,
  ToggleProcessingAction,
  ToggleSuccessAction,
  ToggleFailureAction,
  SubmitWithdrawRequestAction,
  SubmitWithdrawSuccessAction,
  SubmitWithdrawFailureAction,
  ResetWithdrawFormAction,
  ClearWithdrawErrorAction,
  WithdrawalStatusUpdateAction,
} from './types'

// Selection actions
export const setSelectedCoin = (coin: Coin | null): SetSelectedCoinAction => ({
  type: WITHDRAW_ACTIONS.SET_SELECTED_COIN,
  payload: coin,
})

export const setSelectedNetwork = (network: Network | null): SetSelectedNetworkAction => ({
  type: WITHDRAW_ACTIONS.SET_SELECTED_NETWORK,
  payload: network,
})

// Input actions
export const setWithdrawAddress = (address: string): SetWithdrawAddressAction => ({
  type: WITHDRAW_ACTIONS.SET_WITHDRAW_ADDRESS,
  payload: address,
})

export const setWithdrawMemo = (memo: string): SetWithdrawMemoAction => ({
  type: WITHDRAW_ACTIONS.SET_WITHDRAW_MEMO,
  payload: memo,
})

export const setWithdrawAmount = (amount: string): SetWithdrawAmountAction => ({
  type: WITHDRAW_ACTIONS.SET_WITHDRAW_AMOUNT,
  payload: amount,
})

export const setPercentageAmount = (percentage: number, balance: number): SetPercentageAmountAction => ({
  type: WITHDRAW_ACTIONS.SET_PERCENTAGE_AMOUNT,
  payload: { percentage, balance },
})

// Crypto prices actions
export const fetchCryptoPricesRequest = (): FetchCryptoPricesRequestAction => ({
  type: WITHDRAW_ACTIONS.FETCH_CRYPTO_PRICES_REQUEST,
})

export const fetchCryptoPricesSuccess = (prices: CryptoPrices): FetchCryptoPricesSuccessAction => ({
  type: WITHDRAW_ACTIONS.FETCH_CRYPTO_PRICES_SUCCESS,
  payload: prices,
})

export const fetchCryptoPricesFailure = (error: string): FetchCryptoPricesFailureAction => ({
  type: WITHDRAW_ACTIONS.FETCH_CRYPTO_PRICES_FAILURE,
  payload: error,
})

// Recent addresses actions
export const loadRecentAddresses = (addresses: RecentAddress[]): LoadRecentAddressesAction => ({
  type: WITHDRAW_ACTIONS.LOAD_RECENT_ADDRESSES,
  payload: addresses,
})

export const addRecentAddress = (address: Omit<RecentAddress, 'id' | 'lastUsed'>): AddRecentAddressAction => ({
  type: WITHDRAW_ACTIONS.ADD_RECENT_ADDRESS,
  payload: address,
})

export const deleteRecentAddress = (addressId: string): DeleteRecentAddressAction => ({
  type: WITHDRAW_ACTIONS.DELETE_RECENT_ADDRESS,
  payload: addressId,
})

export const selectRecentAddress = (address: RecentAddress): SelectRecentAddressAction => ({
  type: WITHDRAW_ACTIONS.SELECT_RECENT_ADDRESS,
  payload: address,
})

// UI state actions
export const toggleCoinSelector = (show?: boolean): ToggleCoinSelectorAction => ({
  type: WITHDRAW_ACTIONS.TOGGLE_COIN_SELECTOR,
  payload: show,
})

export const toggleNetworkSelector = (show?: boolean): ToggleNetworkSelectorAction => ({
  type: WITHDRAW_ACTIONS.TOGGLE_NETWORK_SELECTOR,
  payload: show,
})

export const toggleRecentAddresses = (show?: boolean): ToggleRecentAddressesAction => ({
  type: WITHDRAW_ACTIONS.TOGGLE_RECENT_ADDRESSES,
  payload: show,
})

export const toggleConfirmation = (show?: boolean): ToggleConfirmationAction => ({
  type: WITHDRAW_ACTIONS.TOGGLE_CONFIRMATION,
  payload: show,
})

export const toggleProcessing = (show?: boolean): ToggleProcessingAction => ({
  type: WITHDRAW_ACTIONS.TOGGLE_PROCESSING,
  payload: show,
})

export const toggleSuccess = (show?: boolean): ToggleSuccessAction => ({
  type: WITHDRAW_ACTIONS.TOGGLE_SUCCESS,
  payload: show,
})

export const toggleFailure = (show?: boolean): ToggleFailureAction => ({
  type: WITHDRAW_ACTIONS.TOGGLE_FAILURE,
  payload: show,
})

// Submit withdraw actions
export const submitWithdrawRequest = (data: CryptoWithdrawRequest): SubmitWithdrawRequestAction => ({
  type: WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_REQUEST,
  payload: data,
})

export const submitWithdrawSuccess = (message: string, transactionData: TransactionData): SubmitWithdrawSuccessAction => ({
  type: WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_SUCCESS,
  payload: { message, transactionData },
})

export const submitWithdrawFailure = (error: string): SubmitWithdrawFailureAction => ({
  type: WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_FAILURE,
  payload: error,
})

// Reset actions
export const resetWithdrawForm = (): ResetWithdrawFormAction => ({
  type: WITHDRAW_ACTIONS.RESET_WITHDRAW_FORM,
})

export const clearWithdrawError = (): ClearWithdrawErrorAction => ({
  type: WITHDRAW_ACTIONS.CLEAR_WITHDRAW_ERROR,
})

// Socket real-time update action
export const withdrawalStatusUpdate = (data: {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  transactionId?: string
  txHash?: string
  message?: string
  error?: string
}): WithdrawalStatusUpdateAction => ({
  type: WITHDRAW_ACTIONS.WITHDRAWAL_STATUS_UPDATE,
  payload: data,
})
