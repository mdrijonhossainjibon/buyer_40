import { call, put, takeLatest } from 'redux-saga/effects'
 
import { API_CALL, generateSignature } from 'auth-fingerprint'
import { baseURL } from 'lib/api-string'
import { getCurrentUser } from 'lib/getCurrentUser'
import {
  SPIN_WHEEL_ACTIONS,
  FetchSpinConfigRequestAction,
  FetchUserTicketsRequestAction,
  SpinWheelRequestAction,
  UnlockExtraSpinRequestAction,
  PurchaseTicketRequestAction,
  SpinWithTicketRequestAction
} from './types'
import {
  fetchSpinConfigSuccess,
  fetchSpinConfigFailure,
  fetchUserTicketsSuccess,
  fetchUserTicketsFailure,
  spinWheelSuccess,
  spinWheelFailure,
  unlockExtraSpinSuccess,
  unlockExtraSpinFailure,
  purchaseTicketSuccess,
  purchaseTicketFailure,
  spinWithTicketSuccess,
  spinWithTicketFailure,
  setSpinTickets,
  setTicketPrice
} from './actions'
import { updateXP } from '../user/actions'


// Fetch spin configuration saga
function* fetchSpinConfigSaga(action: FetchSpinConfigRequestAction): Generator<any, void, any> {
  const currentUser  = getCurrentUser();
  const { hash , signature , timestamp  } =  generateSignature(JSON.stringify({ ...currentUser }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')
  const { response } = yield call(API_CALL, {
    baseURL,
    url: `/spin-wheel/config`,
    method: 'GET',
    params : { hash , signature , timestamp }
  })

  if (response && response.success && response.data) {
    yield put(
      fetchSpinConfigSuccess(
        response.data.prizes,
        response.data.canSpin,
        response.data.nextSpinTime,
        response.data.spinsToday,
        response.data.maxSpinsPerDay,
        response.data.freeSpinsUsed,
        response.data.maxFreeSpins,
        response.data.extraSpinsUnlocked,
        response.data.extraSpinsUsed || 0,
        response.data.maxExtraSpins,
        response.data.spinTickets || 0,
        response.data.ticketPrice || 100
      )
    )
    yield put(setTicketPrice(response.data.ticketPrice || 100))
  } else {
    yield put(fetchSpinConfigFailure(response?.error || 'Failed to fetch spin configuration'))
    //toast.error(response?.error || 'Failed to fetch spin configuration')
  }
}

// Spin wheel saga
function* performSpinSaga(action: SpinWheelRequestAction): Generator<any, void, any> {
  const currentUser = getCurrentUser();
  const { hash, signature, timestamp } = generateSignature(JSON.stringify({ ...currentUser }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')
  
  const { response } : any = yield call(API_CALL, {
    baseURL,
    url: '/spin-wheel/spin',
    method: 'POST',
    body: { hash, signature, timestamp }
  })

  if (response && response.success && response.data) {
    const { result,  nextSpinTime, spinsToday, freeSpinsUsed, extraSpinsUnlocked, extraSpinsUsed } = response.data

    yield put(spinWheelSuccess(result, nextSpinTime, spinsToday, freeSpinsUsed, extraSpinsUnlocked, extraSpinsUsed))
 
  } else {
    yield put(spinWheelFailure(response?.message || 'Failed to spin the wheel'))
    //toast.error(response?.messager || 'Failed to spin the wheel')
  }
}

// Purchase ticket saga
function* purchaseTicketSaga(action: PurchaseTicketRequestAction): Generator<any, void, any> {
  const { quantity } = action.payload
  const currentUser = getCurrentUser();
  const { hash, signature, timestamp } = generateSignature(JSON.stringify({ ...currentUser, quantity }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')

  //toast.loading('Purchasing spin ticket...', { id: 'purchase-ticket' })

  const { response } = yield call(API_CALL, {
    baseURL,
    url: '/spin-wheel/purchase-ticket',
    method: 'POST',
    body: { hash, signature, timestamp, quantity }
  })

  if (response && response.success && response.data) {
    yield put(
      purchaseTicketSuccess(
        response.data.totalTickets || response.data.spinTickets,
        response.data.remainingBalance || response.data.newXP
      )
    )

    // Update user XP if provided
    if (response.data.remainingBalance !== undefined) {
      yield put(updateXP(response.data.remainingBalance))
    }

    //toast.success(`🎟️ ${response.data.message || 'Ticket purchased successfully!'}`, { id: 'purchase-ticket' })
  } else {
    yield put(purchaseTicketFailure(response?.error || 'Failed to purchase ticket'))
    //toast.error(response?.error || 'Failed to purchase ticket', { id: 'purchase-ticket' })
  }
}

// Spin with ticket saga
function* spinWithTicketSaga(action: SpinWithTicketRequestAction): Generator<any, void, any> {
  const currentUser = getCurrentUser();
  const { hash, signature, timestamp } = generateSignature(JSON.stringify({ ...currentUser }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')

  const { response } = yield call(API_CALL, {
    baseURL,
    url: '/spin-wheel/spin-with-ticket',
    method: 'POST',
    body: { hash, signature, timestamp }
  })

  if (response && response.success && response.data) {
    const { result, spinTickets } = response.data

    yield put(spinWithTicketSuccess(result, spinTickets))
 
  } else {
    yield put(spinWithTicketFailure(response?.error || 'Failed to spin with ticket'))
    //toast.error(response?.error || 'Failed to spin with ticket')
  }
}

// Fetch user tickets saga
function* fetchUserTicketsSaga(action: FetchUserTicketsRequestAction): Generator<any, void, any> {
  const currentUser = getCurrentUser();
  const { hash, signature, timestamp } = generateSignature(JSON.stringify({ ...currentUser }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')

  const { response } = yield call(API_CALL, {
    baseURL,
    url: `/spin-wheel/user-tickets/`,
    method: 'GET',
    params : { hash , signature , timestamp }
 
  })

  if (response && response.success && response.data) {
    yield put(fetchUserTicketsSuccess(response.data))
  } else {
    yield put(fetchUserTicketsFailure(response?.error || 'Failed to fetch user tickets'))
  }
}

// Root saga
export function* spinWheelSaga() {
  yield takeLatest(SPIN_WHEEL_ACTIONS.FETCH_SPIN_CONFIG_REQUEST, fetchSpinConfigSaga)
  yield takeLatest(SPIN_WHEEL_ACTIONS.FETCH_USER_TICKETS_REQUEST, fetchUserTicketsSaga)
  yield takeLatest(SPIN_WHEEL_ACTIONS.SPIN_WHEEL_REQUEST, performSpinSaga)
  yield takeLatest(SPIN_WHEEL_ACTIONS.PURCHASE_TICKET_REQUEST, purchaseTicketSaga)
  yield takeLatest(SPIN_WHEEL_ACTIONS.SPIN_WITH_TICKET_REQUEST, spinWithTicketSaga)
}
