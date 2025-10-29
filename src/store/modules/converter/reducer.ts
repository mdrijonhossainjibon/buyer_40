import {
  CONVERTER_ACTIONS,
  ConverterState,
  ConverterActionTypes
} from './types'

const initialState: ConverterState = {
  rates: [],
  history: [],
  isLoading: false,
  isConverting: false,
  error: null,
  selectedFromCurrency: 'xp',
  selectedToCurrency: 'tickets',
  fromAmount: 0,
  toAmount: 0
}

export const converterReducer = (
  state = initialState,
  action: ConverterActionTypes
): ConverterState => {
  switch (action.type) {
    case CONVERTER_ACTIONS.SET_RATES:
      return {
        ...state,
        rates: action.payload
      }

    case CONVERTER_ACTIONS.SET_HISTORY:
      return {
        ...state,
        history: action.payload
      }

    case CONVERTER_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    case CONVERTER_ACTIONS.SET_CONVERTING:
      return {
        ...state,
        isConverting: action.payload
      }

    case CONVERTER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      }

    case CONVERTER_ACTIONS.SET_FROM_CURRENCY:
      return {
        ...state,
        selectedFromCurrency: action.payload
      }

    case CONVERTER_ACTIONS.SET_TO_CURRENCY:
      return {
        ...state,
        selectedToCurrency: action.payload
      }

    case CONVERTER_ACTIONS.SET_FROM_AMOUNT:
      return {
        ...state,
        fromAmount: action.payload
      }

    case CONVERTER_ACTIONS.SET_TO_AMOUNT:
      return {
        ...state,
        toAmount: action.payload
      }

    case CONVERTER_ACTIONS.SWAP_CURRENCIES:
      return {
        ...state,
        selectedFromCurrency: state.selectedToCurrency,
        selectedToCurrency: state.selectedFromCurrency,
        fromAmount: state.toAmount,
        toAmount: state.fromAmount
      }

    case CONVERTER_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    case CONVERTER_ACTIONS.RESET_FORM:
      return {
        ...state,
        fromAmount: 0,
        toAmount: 0,
        error: null
      }

    case CONVERTER_ACTIONS.FETCH_RATES_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case CONVERTER_ACTIONS.FETCH_RATES_SUCCESS:
      return {
        ...state,
        rates: action.payload,
        isLoading: false,
        error: null
      }

    case CONVERTER_ACTIONS.FETCH_RATES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case CONVERTER_ACTIONS.FETCH_HISTORY_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case CONVERTER_ACTIONS.FETCH_HISTORY_SUCCESS:
      return {
        ...state,
        history: action.payload,
        isLoading: false,
        error: null
      }

    case CONVERTER_ACTIONS.FETCH_HISTORY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case CONVERTER_ACTIONS.CONVERT_REQUEST:
      return {
        ...state,
        isConverting: true,
        error: null
      }

    case CONVERTER_ACTIONS.CONVERT_SUCCESS:
      return {
        ...state,
        history: [action.payload.conversion, ...state.history],
        isConverting: false,
        error: null,
        fromAmount: 0,
        toAmount: 0
      }

    case CONVERTER_ACTIONS.CONVERT_FAILURE:
      return {
        ...state,
        isConverting: false,
        error: action.payload
      }

    default:
      return state
  }
}
