import {
  WithdrawState,
  WithdrawActionTypes,
  WITHDRAW_ACTIONS,
  RecentAddress,
} from './types'

// LocalStorage key for recent addresses
const RECENT_ADDRESSES_KEY = 'withdraw_recent_addresses'

// Helper functions for localStorage
const loadRecentAddresses = (): RecentAddress[] => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const stored = localStorage.getItem(RECENT_ADDRESSES_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load recent addresses:', error)
  }
  return []
}

const saveRecentAddresses = (addresses: RecentAddress[]) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.setItem(RECENT_ADDRESSES_KEY, JSON.stringify(addresses))
  } catch (error) {
    console.error('Failed to save recent addresses:', error)
  }
}

// Initial state
const initialState: WithdrawState = {
  selectedCoin: null,
  selectedNetwork: null,
  withdrawAddress: '',
  withdrawMemo: '',
  withdrawAmount: '',
  cryptoPrices: {},
  pricesLoading: false,
  recentAddresses: loadRecentAddresses(),
  showCoinSelector: false,
  showNetworkSelector: false,
  showRecentAddresses: false,
  showConfirmation: false,
  showProcessing: false,
  showSuccess: false,
  showFailure: false,
  isSubmitting: false,
  error: null,
  successMessage: null,
  transactionData: null,
  withdrawalStatus: 'idle',
}

// Reducer
export const withdrawReducer = (
  state = initialState,
  action: WithdrawActionTypes
): WithdrawState => {
  switch (action.type) {
    // Selection actions
    case WITHDRAW_ACTIONS.SET_SELECTED_COIN:
      return {
        ...state,
        selectedCoin: action.payload,
      }

    case WITHDRAW_ACTIONS.SET_SELECTED_NETWORK:
      return {
        ...state,
        selectedNetwork: action.payload,
      }

    // Input actions
    case WITHDRAW_ACTIONS.SET_WITHDRAW_ADDRESS:
      return {
        ...state,
        withdrawAddress: action.payload,
      }

    case WITHDRAW_ACTIONS.SET_WITHDRAW_MEMO:
      return {
        ...state,
        withdrawMemo: action.payload,
      }

    case WITHDRAW_ACTIONS.SET_WITHDRAW_AMOUNT:
      return {
        ...state,
        withdrawAmount: action.payload,
      }

    case WITHDRAW_ACTIONS.SET_PERCENTAGE_AMOUNT: {
      const { percentage, balance } = action.payload
      const amount = (balance * percentage / 100).toFixed(8)
      return {
        ...state,
        withdrawAmount: amount,
      }
    }

    // Crypto prices actions
    case WITHDRAW_ACTIONS.FETCH_CRYPTO_PRICES_REQUEST:
      return {
        ...state,
        pricesLoading: true,
      }

    case WITHDRAW_ACTIONS.FETCH_CRYPTO_PRICES_SUCCESS:
      return {
        ...state,
        cryptoPrices: action.payload,
        pricesLoading: false,
      }

    case WITHDRAW_ACTIONS.FETCH_CRYPTO_PRICES_FAILURE:
      return {
        ...state,
        pricesLoading: false,
        error: action.payload,
      }

    // Recent addresses actions
    case WITHDRAW_ACTIONS.LOAD_RECENT_ADDRESSES:
      return {
        ...state,
        recentAddresses: action.payload,
      }

    case WITHDRAW_ACTIONS.ADD_RECENT_ADDRESS: {
      const addresses = [...state.recentAddresses]
      const existingIndex = addresses.findIndex(
        addr =>
          addr.address === action.payload.address &&
          addr.network === action.payload.network &&
          addr.coinSymbol === action.payload.coinSymbol
      )

      const newAddress: RecentAddress = {
        ...action.payload,
        id: Date.now().toString(),
        lastUsed: Date.now(),
      }

      if (existingIndex !== -1) {
        addresses[existingIndex] = { ...addresses[existingIndex], ...newAddress }
      } else {
        addresses.unshift(newAddress)
      }

      const updatedAddresses = addresses.slice(0, 10)
      saveRecentAddresses(updatedAddresses)

      return {
        ...state,
        recentAddresses: updatedAddresses,
      }
    }

    case WITHDRAW_ACTIONS.DELETE_RECENT_ADDRESS: {
      const updatedAddresses = state.recentAddresses.filter(
        addr => addr.id !== action.payload
      )
      saveRecentAddresses(updatedAddresses)

      return {
        ...state,
        recentAddresses: updatedAddresses,
      }
    }

    case WITHDRAW_ACTIONS.SELECT_RECENT_ADDRESS: {
      const addresses = [...state.recentAddresses]
      const existingIndex = addresses.findIndex(
        addr => addr.id === action.payload.id
      )

      if (existingIndex !== -1) {
        addresses[existingIndex] = {
          ...addresses[existingIndex],
          lastUsed: Date.now(),
        }
        saveRecentAddresses(addresses)
      }

      return {
        ...state,
        withdrawAddress: action.payload.address,
        recentAddresses: addresses,
        showRecentAddresses: false,
      }
    }

    // UI state actions
    case WITHDRAW_ACTIONS.TOGGLE_COIN_SELECTOR:
      return {
        ...state,
        showCoinSelector: action.payload !== undefined ? action.payload : !state.showCoinSelector,
      }

    case WITHDRAW_ACTIONS.TOGGLE_NETWORK_SELECTOR:
      return {
        ...state,
        showNetworkSelector: action.payload !== undefined ? action.payload : !state.showNetworkSelector,
      }

    case WITHDRAW_ACTIONS.TOGGLE_RECENT_ADDRESSES:
      return {
        ...state,
        showRecentAddresses: action.payload !== undefined ? action.payload : !state.showRecentAddresses,
      }

    case WITHDRAW_ACTIONS.TOGGLE_CONFIRMATION:
      return {
        ...state,
        showConfirmation: action.payload !== undefined ? action.payload : !state.showConfirmation,
      }

    case WITHDRAW_ACTIONS.TOGGLE_PROCESSING:
      return {
        ...state,
        showProcessing: action.payload !== undefined ? action.payload : !state.showProcessing,
      }

    case WITHDRAW_ACTIONS.TOGGLE_SUCCESS:
      return {
        ...state,
        showSuccess: action.payload !== undefined ? action.payload : !state.showSuccess,
      }

    case WITHDRAW_ACTIONS.TOGGLE_FAILURE:
      return {
        ...state,
        showFailure: action.payload !== undefined ? action.payload : !state.showFailure,
      }

    // Submit withdraw actions
    case WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_REQUEST:
      return {
        ...state,
        isSubmitting: true,
        error: null,
        withdrawalStatus: 'pending',
      }

    case WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_SUCCESS:
      return {
        ...state,
        isSubmitting: false,
        successMessage: action.payload.message,
        transactionData: action.payload.transactionData,
        showConfirmation: false,
        showProcessing: false,
        showSuccess: true,
      }

    case WITHDRAW_ACTIONS.SUBMIT_WITHDRAW_FAILURE:
      return {
        ...state,
        isSubmitting: false,
        error: action.payload,
        showConfirmation: false,
        showProcessing: false,
        showFailure: true,
      }

    // Reset actions
    case WITHDRAW_ACTIONS.RESET_WITHDRAW_FORM:
      return {
        ...state,
        withdrawAddress: '',
        withdrawMemo: '',
        withdrawAmount: '',
        error: null,
        successMessage: null,
        showConfirmation: false,
        showProcessing: false,
        showSuccess: false,
        showFailure: false,
        withdrawalStatus: 'idle',
      }

    case WITHDRAW_ACTIONS.CLEAR_WITHDRAW_ERROR:
      return {
        ...state,
        error: null,
      }

    // Socket real-time withdrawal status update
    case WITHDRAW_ACTIONS.WITHDRAWAL_STATUS_UPDATE: {
      const { status, transactionId, txHash, message, error } = action.payload

      switch (status) {
        case 'pending':
          return {
            ...state,
            withdrawalStatus: 'pending',
            isSubmitting: true,
            showProcessing: true,
            error: null,
          }

        case 'processing':
          return {
            ...state,
            withdrawalStatus: 'processing',
            isSubmitting: true,
            showProcessing: true,
          }

        case 'completed':
          return {
            ...state,
            withdrawalStatus: 'completed',
            isSubmitting: false,
            showProcessing: false,
            showSuccess: true,
            successMessage: message || 'Withdrawal completed successfully',
            transactionData:  {
              amount: state.withdrawAmount,
              currency: state.selectedCoin?.symbol || '',
              network: state.selectedNetwork?.name || '',
              address: state.withdrawAddress,
              transactionId: txHash || null,
              timestamp: Date.now(),
            }  
          }

        case 'failed':
          return {
            ...state,
            withdrawalStatus: 'failed',
            isSubmitting: false,
            showProcessing: false,
            showFailure: true,
            error: error || 'Withdrawal failed',
          }

        default:
          return state
      }
    }

    default:
      return state
  }
}
