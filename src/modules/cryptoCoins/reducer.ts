import {
  CryptoCoinsState,
  CryptoCoinsActionTypes,
  FETCH_CRYPTO_COINS_REQUEST,
  FETCH_CRYPTO_COINS_SUCCESS,
  FETCH_CRYPTO_COINS_FAILURE,
  CLEAR_CRYPTO_COINS_ERROR,
} from './types'

// Initial state
const initialState: CryptoCoinsState = {
  coins: [],
  isLoading: false,
  error: null,
  lastFetched: null,
}

// Reducer
const cryptoCoinsReducer = (
  state = initialState,
  action: CryptoCoinsActionTypes
): CryptoCoinsState => {
  switch (action.type) {
    case FETCH_CRYPTO_COINS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case FETCH_CRYPTO_COINS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        coins: action.payload,
        error: null,
        lastFetched: Date.now(),
      }

    case FETCH_CRYPTO_COINS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }

    case CLEAR_CRYPTO_COINS_ERROR:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export default cryptoCoinsReducer
