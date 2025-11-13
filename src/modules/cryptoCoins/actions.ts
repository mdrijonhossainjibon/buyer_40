import {
  FETCH_CRYPTO_COINS_REQUEST,
  FETCH_CRYPTO_COINS_SUCCESS,
  FETCH_CRYPTO_COINS_FAILURE,
  CLEAR_CRYPTO_COINS_ERROR,
  FetchCryptoCoinsRequestAction,
  FetchCryptoCoinsSuccessAction,
  FetchCryptoCoinsFailureAction,
  ClearCryptoCoinsErrorAction,
  CryptoCoin,
} from './types'

// Action creators
export const fetchCryptoCoinsRequest = (): FetchCryptoCoinsRequestAction => ({
  type: FETCH_CRYPTO_COINS_REQUEST,
})

export const fetchCryptoCoinsSuccess = (coins: CryptoCoin[]): FetchCryptoCoinsSuccessAction => ({
  type: FETCH_CRYPTO_COINS_SUCCESS,
  payload: coins,
})

export const fetchCryptoCoinsFailure = (error: string): FetchCryptoCoinsFailureAction => ({
  type: FETCH_CRYPTO_COINS_FAILURE,
  payload: error,
})

export const clearCryptoCoinsError = (): ClearCryptoCoinsErrorAction => ({
  type: CLEAR_CRYPTO_COINS_ERROR,
})
