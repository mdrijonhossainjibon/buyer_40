import {
  CONVERTER_ACTIONS,
  ConverterState,
  ConverterActionTypes
} from './types'

const initialState: ConverterState = {
  rates: [],
  isLoading: false,
  isConverting: false,
  error: null,
  selectedFromCurrency: 'xp',
  selectedToCurrency: 'usdt',
  fromAmount: 0,
  toAmount: 0,
  processingStep: null,
  processingProgress: 0,
  showSuccessPopup: false,
  showFailurePopup: false,
  lastConversion: null
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

    case CONVERTER_ACTIONS.CONVERT_REQUEST:
      return {
        ...state,
        isConverting: true,
        error: null
      }

    case CONVERTER_ACTIONS.CONVERT_SUCCESS:
      return {
        ...state,
        isConverting: false,
        error: null,
        lastConversion: {
          fromAmount: state.fromAmount,
          fromCurrency: state.selectedFromCurrency,
          toAmount: state.toAmount,
          toCurrency: state.selectedToCurrency
        },
        fromAmount: 0,
        toAmount: 0,
        processingStep: null,
        processingProgress: 0,
        showSuccessPopup: true
      }

    case CONVERTER_ACTIONS.CONVERT_FAILURE:
      return {
        ...state,
        isConverting: false,
        error: action.payload,
        processingStep: null,
        processingProgress: 0,
        showFailurePopup: true
      }

    case CONVERTER_ACTIONS.SET_PROCESSING_STEP:
      return {
        ...state,
        processingStep: action.payload.step,
        processingProgress: action.payload.progress
      }

    case CONVERTER_ACTIONS.SET_SHOW_SUCCESS_POPUP:
      return {
        ...state,
        showSuccessPopup: action.payload
      }

    case CONVERTER_ACTIONS.SET_SHOW_FAILURE_POPUP:
      return {
        ...state,
        showFailurePopup: action.payload
      }

    default:
      return state
  }
}
