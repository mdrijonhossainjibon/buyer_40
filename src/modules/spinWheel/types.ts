// Spin wheel prize interface
export interface SpinPrize {
  id: string
  label: string
  amount: number
  color: string
  probability: number
}

// Spin result interface
export interface SpinResult {
  prizeId: string
  amount: number
  label: string
}

// User tickets info interface
export interface UserTicketsInfo {
  userId: number
  ticketCount: number
  totalPurchased: number
  totalSpins: number
  totalWinnings: number
  lastPurchaseDate: string | null
}

// Spin wheel state interface
export interface SpinWheelState {
  prizes: SpinPrize[]
  spinResult: SpinResult | null
  isSpinning: boolean
  isLoading: boolean
  canSpin: boolean
  nextSpinTime: number | null
  spinsToday: number
  maxSpinsPerDay: number
  freeSpinsUsed: number
  maxFreeSpins: number
  extraSpinsUnlocked: number
  extraSpinsUsed: number
  maxExtraSpins: number
  isWatchingAd: boolean
  spinTickets: number
  ticketPrice: number
  isPurchasing: boolean
  userTicketsInfo: UserTicketsInfo | null
  error: string | null
}

// Action types
export const SPIN_WHEEL_ACTIONS = {
  SET_PRIZES: 'SET_SPIN_PRIZES',
  SET_SPIN_RESULT: 'SET_SPIN_RESULT',
  SET_SPINNING: 'SET_SPINNING',
  SET_LOADING: 'SET_SPIN_LOADING',
  SET_CAN_SPIN: 'SET_CAN_SPIN',
  SET_NEXT_SPIN_TIME: 'SET_NEXT_SPIN_TIME',
  SET_SPINS_TODAY: 'SET_SPINS_TODAY',
  SET_FREE_SPINS_USED: 'SET_FREE_SPINS_USED',
  SET_EXTRA_SPINS_UNLOCKED: 'SET_EXTRA_SPINS_UNLOCKED',
  SET_WATCHING_AD: 'SET_WATCHING_AD',
  SET_SPIN_TICKETS: 'SET_SPIN_TICKETS',
  SET_TICKET_PRICE: 'SET_TICKET_PRICE',
  SET_PURCHASING: 'SET_PURCHASING',
  SET_USER_TICKETS_INFO: 'SET_USER_TICKETS_INFO',
  SET_ERROR: 'SET_SPIN_ERROR',
  CLEAR_ERROR: 'CLEAR_SPIN_ERROR',
  CLEAR_SPIN_RESULT: 'CLEAR_SPIN_RESULT',
  // Saga actions
  FETCH_SPIN_CONFIG_REQUEST: 'FETCH_SPIN_CONFIG_REQUEST',
  FETCH_SPIN_CONFIG_SUCCESS: 'FETCH_SPIN_CONFIG_SUCCESS',
  FETCH_SPIN_CONFIG_FAILURE: 'FETCH_SPIN_CONFIG_FAILURE',
  FETCH_USER_TICKETS_REQUEST: 'FETCH_USER_TICKETS_REQUEST',
  FETCH_USER_TICKETS_SUCCESS: 'FETCH_USER_TICKETS_SUCCESS',
  FETCH_USER_TICKETS_FAILURE: 'FETCH_USER_TICKETS_FAILURE',
  SPIN_WHEEL_REQUEST: 'SPIN_WHEEL_REQUEST',
  SPIN_WHEEL_SUCCESS: 'SPIN_WHEEL_SUCCESS',
  SPIN_WHEEL_FAILURE: 'SPIN_WHEEL_FAILURE',
  UNLOCK_EXTRA_SPIN_REQUEST: 'UNLOCK_EXTRA_SPIN_REQUEST',
  UNLOCK_EXTRA_SPIN_SUCCESS: 'UNLOCK_EXTRA_SPIN_SUCCESS',
  UNLOCK_EXTRA_SPIN_FAILURE: 'UNLOCK_EXTRA_SPIN_FAILURE',
  PURCHASE_TICKET_REQUEST: 'PURCHASE_TICKET_REQUEST',
  PURCHASE_TICKET_SUCCESS: 'PURCHASE_TICKET_SUCCESS',
  PURCHASE_TICKET_FAILURE: 'PURCHASE_TICKET_FAILURE',
  SPIN_WITH_TICKET_REQUEST: 'SPIN_WITH_TICKET_REQUEST',
  SPIN_WITH_TICKET_SUCCESS: 'SPIN_WITH_TICKET_SUCCESS',
  SPIN_WITH_TICKET_FAILURE: 'SPIN_WITH_TICKET_FAILURE',
  // Socket-based spin actions
  SPIN_WHEEL_SOCKET_REQUEST: 'SPIN_WHEEL_SOCKET_REQUEST',
  SPIN_WHEEL_SOCKET_SUCCESS: 'SPIN_WHEEL_SOCKET_SUCCESS',
  SPIN_WHEEL_SOCKET_FAILURE: 'SPIN_WHEEL_SOCKET_FAILURE'
} as const

// Action interfaces
export interface SetPrizesAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_PRIZES
  payload: SpinPrize[]
  [key: string]: any
}

export interface SetSpinResultAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_SPIN_RESULT
  payload: SpinResult | null
  [key: string]: any
}

export interface SetSpinningAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_SPINNING
  payload: boolean
  [key: string]: any
}

export interface SetLoadingAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_LOADING
  payload: boolean
  [key: string]: any
}

export interface SetCanSpinAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_CAN_SPIN
  payload: boolean
  [key: string]: any
}

export interface SetNextSpinTimeAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_NEXT_SPIN_TIME
  payload: number | null
  [key: string]: any
}

export interface SetSpinsTodayAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_SPINS_TODAY
  payload: number
  [key: string]: any
}

export interface SetFreeSpinsUsedAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_FREE_SPINS_USED
  payload: number
  [key: string]: any
}

export interface SetExtraSpinsUnlockedAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_EXTRA_SPINS_UNLOCKED
  payload: number
  [key: string]: any
}

export interface SetWatchingAdAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_WATCHING_AD
  payload: boolean
  [key: string]: any
}

export interface SetSpinTicketsAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_SPIN_TICKETS
  payload: number
  [key: string]: any
}

export interface SetTicketPriceAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_TICKET_PRICE
  payload: number
  [key: string]: any
}

export interface SetPurchasingAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_PURCHASING
  payload: boolean
  [key: string]: any
}

export interface SetUserTicketsInfoAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_USER_TICKETS_INFO
  payload: UserTicketsInfo | null
  [key: string]: any
}

export interface SetErrorAction {
  type: typeof SPIN_WHEEL_ACTIONS.SET_ERROR
  payload: string | null
  [key: string]: any
}

export interface ClearErrorAction {
  type: typeof SPIN_WHEEL_ACTIONS.CLEAR_ERROR
  [key: string]: any
}

export interface ClearSpinResultAction {
  type: typeof SPIN_WHEEL_ACTIONS.CLEAR_SPIN_RESULT
  [key: string]: any
}

// Saga action interfaces
export interface FetchSpinConfigRequestAction {
  type: typeof SPIN_WHEEL_ACTIONS.FETCH_SPIN_CONFIG_REQUEST
  payload: { userId: number }
  [key: string]: any
}

export interface FetchSpinConfigSuccessAction {
  type: typeof SPIN_WHEEL_ACTIONS.FETCH_SPIN_CONFIG_SUCCESS
  payload: {
    prizes: SpinPrize[]
    canSpin: boolean
    nextSpinTime: number | null
    spinsToday: number
    maxSpinsPerDay: number
    freeSpinsUsed: number
    maxFreeSpins: number
    extraSpinsUnlocked: number
    extraSpinsUsed: number
    maxExtraSpins: number
    spinTickets: number
    ticketPrice: number
  }
  [key: string]: any
}

export interface FetchSpinConfigFailureAction {
  type: typeof SPIN_WHEEL_ACTIONS.FETCH_SPIN_CONFIG_FAILURE
  payload: string
  [key: string]: any
}

export interface SpinWheelRequestAction {
  type: typeof SPIN_WHEEL_ACTIONS.SPIN_WHEEL_REQUEST
  payload: { userId: number }
  [key: string]: any
}

export interface SpinWheelSuccessAction {
  type: typeof SPIN_WHEEL_ACTIONS.SPIN_WHEEL_SUCCESS
  payload: {
    result: SpinResult
    nextSpinTime: number
    spinsToday: number
    freeSpinsUsed?: number
    extraSpinsUnlocked?: number
    extraSpinsUsed?: number
  }
  [key: string]: any
}

export interface SpinWheelFailureAction {
  type: typeof SPIN_WHEEL_ACTIONS.SPIN_WHEEL_FAILURE
  payload: string
  [key: string]: any
}

export interface UnlockExtraSpinRequestAction {
  type: typeof SPIN_WHEEL_ACTIONS.UNLOCK_EXTRA_SPIN_REQUEST
  payload: { userId: number }
  [key: string]: any
}

export interface UnlockExtraSpinSuccessAction {
  type: typeof SPIN_WHEEL_ACTIONS.UNLOCK_EXTRA_SPIN_SUCCESS
  payload: {
    extraSpinsUnlocked: number
    canSpin: boolean
  }
  [key: string]: any
}

export interface UnlockExtraSpinFailureAction {
  type: typeof SPIN_WHEEL_ACTIONS.UNLOCK_EXTRA_SPIN_FAILURE
  payload: string
  [key: string]: any
}

export interface PurchaseTicketRequestAction {
  type: typeof SPIN_WHEEL_ACTIONS.PURCHASE_TICKET_REQUEST
  payload: { userId: number, quantity: number }
  [key: string]: any
}

export interface PurchaseTicketSuccessAction {
  type: typeof SPIN_WHEEL_ACTIONS.PURCHASE_TICKET_SUCCESS
  payload: {
    spinTickets: number
    newXP: number
  }
  [key: string]: any
}

export interface PurchaseTicketFailureAction {
  type: typeof SPIN_WHEEL_ACTIONS.PURCHASE_TICKET_FAILURE
  payload: string
  [key: string]: any
}

export interface SpinWithTicketRequestAction {
  type: typeof SPIN_WHEEL_ACTIONS.SPIN_WITH_TICKET_REQUEST
  payload: { userId: number }
  [key: string]: any
}

export interface SpinWithTicketSuccessAction {
  type: typeof SPIN_WHEEL_ACTIONS.SPIN_WITH_TICKET_SUCCESS
  payload: {
    result: SpinResult
    spinTickets: number
  }
  [key: string]: any
}

export interface SpinWithTicketFailureAction {
  type: typeof SPIN_WHEEL_ACTIONS.SPIN_WITH_TICKET_FAILURE
  payload: string
  [key: string]: any
}

export interface FetchUserTicketsRequestAction {
  type: typeof SPIN_WHEEL_ACTIONS.FETCH_USER_TICKETS_REQUEST
  payload: { userId: number }
  [key: string]: any
}

export interface FetchUserTicketsSuccessAction {
  type: typeof SPIN_WHEEL_ACTIONS.FETCH_USER_TICKETS_SUCCESS
  payload: UserTicketsInfo
  [key: string]: any
}

export interface FetchUserTicketsFailureAction {
  type: typeof SPIN_WHEEL_ACTIONS.FETCH_USER_TICKETS_FAILURE
  payload: string
  [key: string]: any
}

// Socket-based spin action interfaces
export interface SpinWheelSocketRequestAction {
  type: typeof SPIN_WHEEL_ACTIONS.SPIN_WHEEL_SOCKET_REQUEST
  payload: { userId: number, spinType: 'free' | 'extra' | 'ticket' }
  [key: string]: any
}

export interface SpinWheelSocketSuccessAction {
  type: typeof SPIN_WHEEL_ACTIONS.SPIN_WHEEL_SOCKET_SUCCESS
  payload: {
    result: SpinResult
    spinTickets?: number
    spinsToday?: number
    freeSpinsUsed?: number
    extraSpinsUsed?: number
  }
  [key: string]: any
}

export interface SpinWheelSocketFailureAction {
  type: typeof SPIN_WHEEL_ACTIONS.SPIN_WHEEL_SOCKET_FAILURE
  payload: string
  [key: string]: any
}

export type SpinWheelActionTypes = 
  | SetPrizesAction
  | SetSpinResultAction
  | SetSpinningAction
  | SetLoadingAction
  | SetCanSpinAction
  | SetNextSpinTimeAction
  | SetSpinsTodayAction
  | SetFreeSpinsUsedAction
  | SetExtraSpinsUnlockedAction
  | SetWatchingAdAction
  | SetErrorAction
  | ClearErrorAction
  | ClearSpinResultAction
  | FetchSpinConfigRequestAction
  | FetchSpinConfigSuccessAction
  | FetchSpinConfigFailureAction
  | FetchUserTicketsRequestAction
  | FetchUserTicketsSuccessAction
  | FetchUserTicketsFailureAction
  | SpinWheelRequestAction
  | SpinWheelSuccessAction
  | SpinWheelFailureAction
  | UnlockExtraSpinRequestAction
  | UnlockExtraSpinSuccessAction
  | UnlockExtraSpinFailureAction
  | SetSpinTicketsAction
  | SetTicketPriceAction
  | SetPurchasingAction
  | SetUserTicketsInfoAction
  | PurchaseTicketRequestAction
  | PurchaseTicketSuccessAction
  | PurchaseTicketFailureAction
  | SpinWithTicketRequestAction
  | SpinWithTicketSuccessAction
  | SpinWithTicketFailureAction
