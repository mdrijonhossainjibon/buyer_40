import {
  SPIN_WHEEL_ACTIONS,
  SpinWheelState,
  SpinWheelActionTypes
} from './types'

const initialState: SpinWheelState = {
  prizes: [],
  spinResult: null,
  isSpinning: false,
  isLoading: false,
  canSpin: false,
  nextSpinTime: null,
  spinsToday: 0,
  maxSpinsPerDay: 10,
  freeSpinsUsed: 0,
  maxFreeSpins: 4,
  extraSpinsUnlocked: 0,
  maxExtraSpins: 6,
  isWatchingAd: false,
  spinTickets: 0,
  ticketPrice: 100,
  isPurchasing: false,
  error: null
}

export const spinWheelReducer = (
  state = initialState,
  action: SpinWheelActionTypes
): SpinWheelState => {
  switch (action.type) {
    case SPIN_WHEEL_ACTIONS.SET_PRIZES:
      return {
        ...state,
        prizes: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SET_SPIN_RESULT:
      return {
        ...state,
        spinResult: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SET_SPINNING:
      return {
        ...state,
        isSpinning: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SET_CAN_SPIN:
      return {
        ...state,
        canSpin: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SET_NEXT_SPIN_TIME:
      return {
        ...state,
        nextSpinTime: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SET_SPINS_TODAY:
      return {
        ...state,
        spinsToday: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SET_FREE_SPINS_USED:
      return {
        ...state,
        freeSpinsUsed: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SET_EXTRA_SPINS_UNLOCKED:
      return {
        ...state,
        extraSpinsUnlocked: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SET_WATCHING_AD:
      return {
        ...state,
        isWatchingAd: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SET_SPIN_TICKETS:
      return {
        ...state,
        spinTickets: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SET_TICKET_PRICE:
      return {
        ...state,
        ticketPrice: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SET_PURCHASING:
      return {
        ...state,
        isPurchasing: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      }

    case SPIN_WHEEL_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    case SPIN_WHEEL_ACTIONS.CLEAR_SPIN_RESULT:
      return {
        ...state,
        spinResult: null
      }

    case SPIN_WHEEL_ACTIONS.FETCH_SPIN_CONFIG_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case SPIN_WHEEL_ACTIONS.FETCH_SPIN_CONFIG_SUCCESS:
      return {
        ...state,
        prizes: action.payload.prizes,
        canSpin: action.payload.canSpin,
        nextSpinTime: action.payload.nextSpinTime,
        spinsToday: action.payload.spinsToday,
        maxSpinsPerDay: action.payload.maxSpinsPerDay,
        freeSpinsUsed: action.payload.freeSpinsUsed,
        maxFreeSpins: action.payload.maxFreeSpins,
        extraSpinsUnlocked: action.payload.extraSpinsUnlocked,
        maxExtraSpins: action.payload.maxExtraSpins,
        isLoading: false,
        error: null
      }

    case SPIN_WHEEL_ACTIONS.FETCH_SPIN_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SPIN_WHEEL_REQUEST:
      return {
        ...state,
        isSpinning: true,
        error: null
      }

    case SPIN_WHEEL_ACTIONS.SPIN_WHEEL_SUCCESS:
      return {
        ...state,
        spinResult: action.payload.result,
        nextSpinTime: action.payload.nextSpinTime,
        spinsToday: action.payload.spinsToday,
        canSpin: false,
        isSpinning: false,
        error: null
      }

    case SPIN_WHEEL_ACTIONS.SPIN_WHEEL_FAILURE:
      return {
        ...state,
        isSpinning: false,
        error: action.payload
      }

    case SPIN_WHEEL_ACTIONS.UNLOCK_EXTRA_SPIN_REQUEST:
      return {
        ...state,
        isWatchingAd: true,
        error: null
      }

    case SPIN_WHEEL_ACTIONS.UNLOCK_EXTRA_SPIN_SUCCESS:
      return {
        ...state,
        extraSpinsUnlocked: action.payload.extraSpinsUnlocked,
        canSpin: action.payload.canSpin,
        isWatchingAd: false,
        error: null
      }

    case SPIN_WHEEL_ACTIONS.UNLOCK_EXTRA_SPIN_FAILURE:
      return {
        ...state,
        isWatchingAd: false,
        error: action.payload
      }

    case SPIN_WHEEL_ACTIONS.PURCHASE_TICKET_REQUEST:
      return {
        ...state,
        isPurchasing: true,
        error: null
      }

    case SPIN_WHEEL_ACTIONS.PURCHASE_TICKET_SUCCESS:
      return {
        ...state,
        spinTickets: action.payload.spinTickets,
        isPurchasing: false,
        error: null
      }

    case SPIN_WHEEL_ACTIONS.PURCHASE_TICKET_FAILURE:
      return {
        ...state,
        isPurchasing: false,
        error: action.payload
      }

    case SPIN_WHEEL_ACTIONS.SPIN_WITH_TICKET_REQUEST:
      return {
        ...state,
        isSpinning: true,
        error: null
      }

    case SPIN_WHEEL_ACTIONS.SPIN_WITH_TICKET_SUCCESS:
      return {
        ...state,
        spinResult: action.payload.result,
        spinTickets: action.payload.spinTickets,
        isSpinning: false,
        error: null
      }

    case SPIN_WHEEL_ACTIONS.SPIN_WITH_TICKET_FAILURE:
      return {
        ...state,
        isSpinning: false,
        error: action.payload
      }

    default:
      return state
  }
}
