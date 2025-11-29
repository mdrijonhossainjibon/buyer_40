import {
  SPIN_WHEEL_ACTIONS,
  SpinPrize,
  SpinResult,
  UserTicketsInfo,
  SetPrizesAction,
  SetSpinResultAction,
  SetSpinningAction,
  SetLoadingAction,
  SetCanSpinAction,
  SetNextSpinTimeAction,
  SetSpinsTodayAction,
  SetFreeSpinsUsedAction,
  SetExtraSpinsUnlockedAction,
  SetWatchingAdAction,
  SetSpinTicketsAction,
  SetTicketPriceAction,
  SetPurchasingAction,
  SetUserTicketsInfoAction,
  SetErrorAction,
  ClearErrorAction,
  ClearSpinResultAction,
  FetchSpinConfigRequestAction,
  FetchSpinConfigSuccessAction,
  FetchSpinConfigFailureAction,
  FetchUserTicketsRequestAction,
  FetchUserTicketsSuccessAction,
  FetchUserTicketsFailureAction,
  SpinWheelRequestAction,
  SpinWheelSuccessAction,
  SpinWheelFailureAction,
  UnlockExtraSpinRequestAction,
  UnlockExtraSpinSuccessAction,
  UnlockExtraSpinFailureAction,
  PurchaseTicketRequestAction,
  PurchaseTicketSuccessAction,
  PurchaseTicketFailureAction,
  SpinWithTicketRequestAction,
  SpinWithTicketSuccessAction,
  SpinWithTicketFailureAction
} from './types'

// State management actions
export const setPrizes = (prizes: SpinPrize[]): SetPrizesAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_PRIZES,
  payload: prizes
})

export const setSpinResult = (result: SpinResult | null): SetSpinResultAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_SPIN_RESULT,
  payload: result
})

export const setSpinning = (isSpinning: boolean): SetSpinningAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_SPINNING,
  payload: isSpinning
})

export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_LOADING,
  payload: isLoading
})

export const setCanSpin = (canSpin: boolean): SetCanSpinAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_CAN_SPIN,
  payload: canSpin
})

export const setNextSpinTime = (time: number | null): SetNextSpinTimeAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_NEXT_SPIN_TIME,
  payload: time
})

export const setSpinsToday = (count: number): SetSpinsTodayAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_SPINS_TODAY,
  payload: count
})

export const setFreeSpinsUsed = (count: number): SetFreeSpinsUsedAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_FREE_SPINS_USED,
  payload: count
})

export const setExtraSpinsUnlocked = (count: number): SetExtraSpinsUnlockedAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_EXTRA_SPINS_UNLOCKED,
  payload: count
})

export const setWatchingAd = (isWatching: boolean): SetWatchingAdAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_WATCHING_AD,
  payload: isWatching
})

export const setSpinTickets = (tickets: number): SetSpinTicketsAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_SPIN_TICKETS,
  payload: tickets
})

export const setTicketPrice = (price: number): SetTicketPriceAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_TICKET_PRICE,
  payload: price
})

export const setPurchasing = (isPurchasing: boolean): SetPurchasingAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_PURCHASING,
  payload: isPurchasing
})

export const setUserTicketsInfo = (info: UserTicketsInfo | null): SetUserTicketsInfoAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_USER_TICKETS_INFO,
  payload: info
})

export const setError = (error: string | null): SetErrorAction => ({
  type: SPIN_WHEEL_ACTIONS.SET_ERROR,
  payload: error
})

export const clearError = (): ClearErrorAction => ({
  type: SPIN_WHEEL_ACTIONS.CLEAR_ERROR
})

export const clearSpinResult = (): ClearSpinResultAction => ({
  type: SPIN_WHEEL_ACTIONS.CLEAR_SPIN_RESULT
})

// Saga actions
export const fetchSpinConfigRequest = (userId: number): FetchSpinConfigRequestAction => ({
  type: SPIN_WHEEL_ACTIONS.FETCH_SPIN_CONFIG_REQUEST,
  payload: { userId }
})

export const fetchSpinConfigSuccess = (
  prizes: SpinPrize[],
  canSpin: boolean,
  nextSpinTime: number | null,
  spinsToday: number,
  maxSpinsPerDay: number,
  freeSpinsUsed: number,
  maxFreeSpins: number,
  extraSpinsUnlocked: number,
  extraSpinsUsed: number,
  maxExtraSpins: number,
  spinTickets: number,
  ticketPrice: number
): FetchSpinConfigSuccessAction => ({
  type: SPIN_WHEEL_ACTIONS.FETCH_SPIN_CONFIG_SUCCESS,
  payload: { 
    prizes, 
    canSpin, 
    nextSpinTime, 
    spinsToday, 
    maxSpinsPerDay,
    freeSpinsUsed,
    maxFreeSpins,
    extraSpinsUnlocked,
    extraSpinsUsed,
    maxExtraSpins,
    spinTickets,
    ticketPrice
  }
})

export const fetchSpinConfigFailure = (error: string): FetchSpinConfigFailureAction => ({
  type: SPIN_WHEEL_ACTIONS.FETCH_SPIN_CONFIG_FAILURE,
  payload: error
})

export const fetchUserTicketsRequest = (userId: number): FetchUserTicketsRequestAction => ({
  type: SPIN_WHEEL_ACTIONS.FETCH_USER_TICKETS_REQUEST,
  payload: { userId }
})

export const fetchUserTicketsSuccess = (info: UserTicketsInfo): FetchUserTicketsSuccessAction => ({
  type: SPIN_WHEEL_ACTIONS.FETCH_USER_TICKETS_SUCCESS,
  payload: info
})

export const fetchUserTicketsFailure = (error: string): FetchUserTicketsFailureAction => ({
  type: SPIN_WHEEL_ACTIONS.FETCH_USER_TICKETS_FAILURE,
  payload: error
})

export const spinWheelRequest = (userId: number): SpinWheelRequestAction => ({
  type: SPIN_WHEEL_ACTIONS.SPIN_WHEEL_REQUEST,
  payload: { userId }
})

export const spinWheelSuccess = (
  result: SpinResult,
  nextSpinTime: number,
  spinsToday: number,
  freeSpinsUsed?: number,
  extraSpinsUnlocked?: number,
  extraSpinsUsed?: number
): SpinWheelSuccessAction => ({
  type: SPIN_WHEEL_ACTIONS.SPIN_WHEEL_SUCCESS,
  payload: { result, nextSpinTime, spinsToday, freeSpinsUsed, extraSpinsUnlocked, extraSpinsUsed }
})

export const spinWheelFailure = (error: string): SpinWheelFailureAction => ({
  type: SPIN_WHEEL_ACTIONS.SPIN_WHEEL_FAILURE,
  payload: error
})

export const unlockExtraSpinRequest = (userId: number): UnlockExtraSpinRequestAction => ({
  type: SPIN_WHEEL_ACTIONS.UNLOCK_EXTRA_SPIN_REQUEST,
  payload: { userId }
})

export const unlockExtraSpinSuccess = (
  extraSpinsUnlocked: number,
  canSpin: boolean
): UnlockExtraSpinSuccessAction => ({
  type: SPIN_WHEEL_ACTIONS.UNLOCK_EXTRA_SPIN_SUCCESS,
  payload: { extraSpinsUnlocked, canSpin }
})

export const unlockExtraSpinFailure = (error: string): UnlockExtraSpinFailureAction => ({
  type: SPIN_WHEEL_ACTIONS.UNLOCK_EXTRA_SPIN_FAILURE,
  payload: error
})

export const purchaseTicketRequest = (userId: number, quantity: number): PurchaseTicketRequestAction => ({
  type: SPIN_WHEEL_ACTIONS.PURCHASE_TICKET_REQUEST,
  payload: { userId, quantity }
})

export const purchaseTicketSuccess = (
  spinTickets: number,
  newXP: number
): PurchaseTicketSuccessAction => ({
  type: SPIN_WHEEL_ACTIONS.PURCHASE_TICKET_SUCCESS,
  payload: { spinTickets, newXP }
})

export const purchaseTicketFailure = (error: string): PurchaseTicketFailureAction => ({
  type: SPIN_WHEEL_ACTIONS.PURCHASE_TICKET_FAILURE,
  payload: error
})

export const spinWithTicketRequest = (userId: number): SpinWithTicketRequestAction => ({
  type: SPIN_WHEEL_ACTIONS.SPIN_WITH_TICKET_REQUEST,
  payload: { userId }
})

export const spinWithTicketSuccess = (
  result: SpinResult,
  spinTickets: number
): SpinWithTicketSuccessAction => ({
  type: SPIN_WHEEL_ACTIONS.SPIN_WITH_TICKET_SUCCESS,
  payload: { result, spinTickets }
})

export const spinWithTicketFailure = (error: string): SpinWithTicketFailureAction => ({
  type: SPIN_WHEEL_ACTIONS.SPIN_WITH_TICKET_FAILURE,
  payload: error
})
