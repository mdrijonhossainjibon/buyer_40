import {
  CONVERTER_ACTIONS,
  CurrencyType,
  ConversionRate,
  ConversionHistory,
  SetRatesAction,
  SetHistoryAction,
  SetLoadingAction,
  SetConvertingAction,
  SetErrorAction,
  SetFromCurrencyAction,
  SetToCurrencyAction,
  SetFromAmountAction,
  SetToAmountAction,
  SwapCurrenciesAction,
  ClearErrorAction,
  ResetFormAction,
  FetchRatesRequestAction,
  FetchRatesSuccessAction,
  FetchRatesFailureAction,
  FetchHistoryRequestAction,
  FetchHistorySuccessAction,
  FetchHistoryFailureAction,
  ConvertRequestAction,
  ConvertSuccessAction,
  ConvertFailureAction
} from './types'

// State management actions
export const setRates = (rates: ConversionRate[]): SetRatesAction => ({
  type: CONVERTER_ACTIONS.SET_RATES,
  payload: rates
})

export const setHistory = (history: ConversionHistory[]): SetHistoryAction => ({
  type: CONVERTER_ACTIONS.SET_HISTORY,
  payload: history
})

export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: CONVERTER_ACTIONS.SET_LOADING,
  payload: isLoading
})

export const setConverting = (isConverting: boolean): SetConvertingAction => ({
  type: CONVERTER_ACTIONS.SET_CONVERTING,
  payload: isConverting
})

export const setError = (error: string | null): SetErrorAction => ({
  type: CONVERTER_ACTIONS.SET_ERROR,
  payload: error
})

export const setFromCurrency = (currency: CurrencyType): SetFromCurrencyAction => ({
  type: CONVERTER_ACTIONS.SET_FROM_CURRENCY,
  payload: currency
})

export const setToCurrency = (currency: CurrencyType): SetToCurrencyAction => ({
  type: CONVERTER_ACTIONS.SET_TO_CURRENCY,
  payload: currency
})

export const setFromAmount = (amount: number): SetFromAmountAction => ({
  type: CONVERTER_ACTIONS.SET_FROM_AMOUNT,
  payload: amount
})

export const setToAmount = (amount: number): SetToAmountAction => ({
  type: CONVERTER_ACTIONS.SET_TO_AMOUNT,
  payload: amount
})

export const swapCurrencies = (): SwapCurrenciesAction => ({
  type: CONVERTER_ACTIONS.SWAP_CURRENCIES
})

export const clearError = (): ClearErrorAction => ({
  type: CONVERTER_ACTIONS.CLEAR_ERROR
})

export const resetForm = (): ResetFormAction => ({
  type: CONVERTER_ACTIONS.RESET_FORM
})

// Saga actions
export const fetchRatesRequest = (): FetchRatesRequestAction => ({
  type: CONVERTER_ACTIONS.FETCH_RATES_REQUEST
})

export const fetchRatesSuccess = (rates: ConversionRate[]): FetchRatesSuccessAction => ({
  type: CONVERTER_ACTIONS.FETCH_RATES_SUCCESS,
  payload: rates
})

export const fetchRatesFailure = (error: string): FetchRatesFailureAction => ({
  type: CONVERTER_ACTIONS.FETCH_RATES_FAILURE,
  payload: error
})

export const fetchHistoryRequest = (userId: number): FetchHistoryRequestAction => ({
  type: CONVERTER_ACTIONS.FETCH_HISTORY_REQUEST,
  payload: { userId }
})

export const fetchHistorySuccess = (history: ConversionHistory[]): FetchHistorySuccessAction => ({
  type: CONVERTER_ACTIONS.FETCH_HISTORY_SUCCESS,
  payload: history
})

export const fetchHistoryFailure = (error: string): FetchHistoryFailureAction => ({
  type: CONVERTER_ACTIONS.FETCH_HISTORY_FAILURE,
  payload: error
})

export const convertRequest = (
  userId: number,
  fromCurrency: CurrencyType,
  toCurrency: CurrencyType,
  amount: number
): ConvertRequestAction => ({
  type: CONVERTER_ACTIONS.CONVERT_REQUEST,
  payload: { userId, fromCurrency, toCurrency, amount }
})

export const convertSuccess = (
  conversion: ConversionHistory,
  newBalances: {
    xp?: number
    tickets?: number
    balance?: number
  }
): ConvertSuccessAction => ({
  type: CONVERTER_ACTIONS.CONVERT_SUCCESS,
  payload: { conversion, newBalances }
})

export const convertFailure = (error: string): ConvertFailureAction => ({
  type: CONVERTER_ACTIONS.CONVERT_FAILURE,
  payload: error
})
