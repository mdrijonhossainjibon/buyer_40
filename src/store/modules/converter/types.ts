// Converter types and interfaces

export type CurrencyType = 'xp' | 'tickets' | 'usdt' | 'balance'

export interface ConversionRate {
  from: CurrencyType
  to: CurrencyType
  rate: number
  minAmount: number
  maxAmount: number
  fee: number // Percentage fee (0-100)
}

export interface ConversionHistory {
  id: string
  userId: number
  fromCurrency: CurrencyType
  toCurrency: CurrencyType
  fromAmount: number
  toAmount: number
  rate: number
  fee: number
  timestamp: number
}

export interface ConverterState {
  rates: ConversionRate[]
  history: ConversionHistory[]
  isLoading: boolean
  isConverting: boolean
  error: string | null
  selectedFromCurrency: CurrencyType
  selectedToCurrency: CurrencyType
  fromAmount: number
  toAmount: number
}

// Action types
export const CONVERTER_ACTIONS = {
  // State management
  SET_RATES: 'SET_CONVERTER_RATES',
  SET_HISTORY: 'SET_CONVERTER_HISTORY',
  SET_LOADING: 'SET_CONVERTER_LOADING',
  SET_CONVERTING: 'SET_CONVERTER_CONVERTING',
  SET_ERROR: 'SET_CONVERTER_ERROR',
  SET_FROM_CURRENCY: 'SET_FROM_CURRENCY',
  SET_TO_CURRENCY: 'SET_TO_CURRENCY',
  SET_FROM_AMOUNT: 'SET_FROM_AMOUNT',
  SET_TO_AMOUNT: 'SET_TO_AMOUNT',
  SWAP_CURRENCIES: 'SWAP_CURRENCIES',
  CLEAR_ERROR: 'CLEAR_CONVERTER_ERROR',
  RESET_FORM: 'RESET_CONVERTER_FORM',
  
  // Saga actions
  FETCH_RATES_REQUEST: 'FETCH_CONVERTER_RATES_REQUEST',
  FETCH_RATES_SUCCESS: 'FETCH_CONVERTER_RATES_SUCCESS',
  FETCH_RATES_FAILURE: 'FETCH_CONVERTER_RATES_FAILURE',
  
  FETCH_HISTORY_REQUEST: 'FETCH_CONVERTER_HISTORY_REQUEST',
  FETCH_HISTORY_SUCCESS: 'FETCH_CONVERTER_HISTORY_SUCCESS',
  FETCH_HISTORY_FAILURE: 'FETCH_CONVERTER_HISTORY_FAILURE',
  
  CONVERT_REQUEST: 'CONVERT_REQUEST',
  CONVERT_SUCCESS: 'CONVERT_SUCCESS',
  CONVERT_FAILURE: 'CONVERT_FAILURE'
} as const

// Action interfaces
export interface SetRatesAction {
  type: typeof CONVERTER_ACTIONS.SET_RATES
  payload: ConversionRate[]
  [key: string]: any
}

export interface SetHistoryAction {
  type: typeof CONVERTER_ACTIONS.SET_HISTORY
  payload: ConversionHistory[]
  [key: string]: any
}

export interface SetLoadingAction {
  type: typeof CONVERTER_ACTIONS.SET_LOADING
  payload: boolean
  [key: string]: any
}

export interface SetConvertingAction {
  type: typeof CONVERTER_ACTIONS.SET_CONVERTING
  payload: boolean
  [key: string]: any
}

export interface SetErrorAction {
  type: typeof CONVERTER_ACTIONS.SET_ERROR
  payload: string | null
  [key: string]: any
}

export interface SetFromCurrencyAction {
  type: typeof CONVERTER_ACTIONS.SET_FROM_CURRENCY
  payload: CurrencyType
  [key: string]: any
}

export interface SetToCurrencyAction {
  type: typeof CONVERTER_ACTIONS.SET_TO_CURRENCY
  payload: CurrencyType
  [key: string]: any
}

export interface SetFromAmountAction {
  type: typeof CONVERTER_ACTIONS.SET_FROM_AMOUNT
  payload: number
  [key: string]: any
}

export interface SetToAmountAction {
  type: typeof CONVERTER_ACTIONS.SET_TO_AMOUNT
  payload: number
  [key: string]: any
}

export interface SwapCurrenciesAction {
  type: typeof CONVERTER_ACTIONS.SWAP_CURRENCIES
  [key: string]: any
}

export interface ClearErrorAction {
  type: typeof CONVERTER_ACTIONS.CLEAR_ERROR
  [key: string]: any
}

export interface ResetFormAction {
  type: typeof CONVERTER_ACTIONS.RESET_FORM
  [key: string]: any
}

export interface FetchRatesRequestAction {
  type: typeof CONVERTER_ACTIONS.FETCH_RATES_REQUEST
  [key: string]: any
}

export interface FetchRatesSuccessAction {
  type: typeof CONVERTER_ACTIONS.FETCH_RATES_SUCCESS
  payload: ConversionRate[]
  [key: string]: any
}

export interface FetchRatesFailureAction {
  type: typeof CONVERTER_ACTIONS.FETCH_RATES_FAILURE
  payload: string
  [key: string]: any
}

export interface FetchHistoryRequestAction {
  type: typeof CONVERTER_ACTIONS.FETCH_HISTORY_REQUEST
  payload: { userId: number }
  [key: string]: any
}

export interface FetchHistorySuccessAction {
  type: typeof CONVERTER_ACTIONS.FETCH_HISTORY_SUCCESS
  payload: ConversionHistory[]
  [key: string]: any
}

export interface FetchHistoryFailureAction {
  type: typeof CONVERTER_ACTIONS.FETCH_HISTORY_FAILURE
  payload: string
  [key: string]: any
}

export interface ConvertRequestAction {
  type: typeof CONVERTER_ACTIONS.CONVERT_REQUEST
  payload: {
    userId: number
    fromCurrency: CurrencyType
    toCurrency: CurrencyType
    amount: number
  }
  [key: string]: any
}

export interface ConvertSuccessAction {
  type: typeof CONVERTER_ACTIONS.CONVERT_SUCCESS
  payload: {
    conversion: ConversionHistory
    newBalances: {
      xp?: number
      tickets?: number
      balance?: number
    }
  }
  [key: string]: any
}

export interface ConvertFailureAction {
  type: typeof CONVERTER_ACTIONS.CONVERT_FAILURE
  payload: string
  [key: string]: any
}

export type ConverterActionTypes =
  | SetRatesAction
  | SetHistoryAction
  | SetLoadingAction
  | SetConvertingAction
  | SetErrorAction
  | SetFromCurrencyAction
  | SetToCurrencyAction
  | SetFromAmountAction
  | SetToAmountAction
  | SwapCurrenciesAction
  | ClearErrorAction
  | ResetFormAction
  | FetchRatesRequestAction
  | FetchRatesSuccessAction
  | FetchRatesFailureAction
  | FetchHistoryRequestAction
  | FetchHistorySuccessAction
  | FetchHistoryFailureAction
  | ConvertRequestAction
  | ConvertSuccessAction
  | ConvertFailureAction
