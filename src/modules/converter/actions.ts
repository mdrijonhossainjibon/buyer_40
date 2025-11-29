import {
  CONVERTER_ACTIONS,
  CurrencyType,
  ConversionRate,
  SetRatesAction,
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
  ConvertRequestAction,
  ConvertSuccessAction,
  ConvertFailureAction,
  SetProcessingStepAction,
  SetShowSuccessPopupAction,
  SetShowFailurePopupAction
} from './types'

// State management actions
export const setRates = (rates: ConversionRate[]): SetRatesAction => ({
  type: CONVERTER_ACTIONS.SET_RATES,
  payload: rates
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
  newBalances: {
    xp?: number
    usdt?: number
  }
): ConvertSuccessAction => ({
  type: CONVERTER_ACTIONS.CONVERT_SUCCESS,
  payload: { newBalances }
})

export const convertFailure = (error: string): ConvertFailureAction => ({
  type: CONVERTER_ACTIONS.CONVERT_FAILURE,
  payload: error
})

export const setProcessingStep = (step: string | null, progress: number): SetProcessingStepAction => ({
  type: CONVERTER_ACTIONS.SET_PROCESSING_STEP,
  payload: { step, progress }
})

export const setShowSuccessPopup = (show: boolean): SetShowSuccessPopupAction => ({
  type: CONVERTER_ACTIONS.SET_SHOW_SUCCESS_POPUP,
  payload: show
})

export const setShowFailurePopup = (show: boolean): SetShowFailurePopupAction => ({
  type: CONVERTER_ACTIONS.SET_SHOW_FAILURE_POPUP,
  payload: show
})
