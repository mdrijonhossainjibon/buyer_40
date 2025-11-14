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
import toast from 'react-hot-toast'


// Fetch spin configuration saga
function* fetchSpinConfigSaga(action: FetchSpinConfigRequestAction): Generator<any, void, any> {
  const currentUser = getCurrentUser();
  const { hash, signature, timestamp } = generateSignature(JSON.stringify({ ...currentUser }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')
  const { success, data, error, message } = yield call(API_CALL, {
    baseURL,
    url: `/spin-wheel/config`,
    method: 'GET',
    params: { hash, signature, timestamp }
  })

  if (success && data) {
    yield put(
      fetchSpinConfigSuccess(
        data.prizes,
        data.canSpin,
        data.nextSpinTime,
        data.spinsToday,
        data.maxSpinsPerDay,
        data.freeSpinsUsed,
        data.maxFreeSpins,
        data.extraSpinsUnlocked,
        data.extraSpinsUsed || 0,
        data.maxExtraSpins,
        data.spinTickets || 0,
        data.ticketPrice || 100
      )
    )
    yield put(setTicketPrice(data.ticketPrice || 100))
  } else {
    yield put(fetchSpinConfigFailure(error || 'Failed to fetch spin configuration'))
    toast.error(error || 'Failed to fetch spin configuration')
  }
}

// Spin wheel saga
function* performSpinSaga(action: SpinWheelRequestAction): Generator<any, void, any> {
  const currentUser = getCurrentUser();
  const { hash, signature, timestamp } = generateSignature(JSON.stringify({ ...currentUser }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')

  const { success, data, error, message }: any = yield call(API_CALL, {
    baseURL,
    url: '/spin-wheel/spin',
    method: 'POST',
    body: { hash, signature, timestamp }
  })

  if (success && data) {
    const { result, nextSpinTime, spinsToday, freeSpinsUsed, extraSpinsUnlocked, extraSpinsUsed } = data

    yield put(spinWheelSuccess(result, nextSpinTime, spinsToday, freeSpinsUsed, extraSpinsUnlocked, extraSpinsUsed))

  } else {
    yield put(spinWheelFailure(message || 'Failed to spin the wheel'))
    toast.error(message || 'Failed to spin the wheel')
  }
}

// Purchase ticket saga
function* purchaseTicketSaga(action: PurchaseTicketRequestAction): Generator<any, void, any> {
  const { quantity } = action.payload
  const currentUser = getCurrentUser();
  const { hash, signature, timestamp } = generateSignature(JSON.stringify({ ...currentUser, quantity }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')

  //toast.loading('Purchasing spin ticket...', { id: 'purchase-ticket' })

  const { success, data, error, message } = yield call(API_CALL, {
    baseURL,
    url: '/spin-wheel/purchase-ticket',
    method: 'POST',
    body: { hash, signature, timestamp, quantity }
  })

  if (success && data) {
    yield put(
      purchaseTicketSuccess(
        data.totalTickets || data.spinTickets,
        data.remainingBalance || data.newXP
      )
    )

    // Update user XP if provided
    if (data.remainingBalance !== undefined) {
      yield put(updateXP(data.remainingBalance))
    }

    //toast.success(`🎟️ ${data.message || 'Ticket purchased successfully!'}`, { id: 'purchase-ticket' })
  } else {
    yield put(purchaseTicketFailure(error || 'Failed to purchase ticket'))
    toast.error(error || 'Failed to purchase ticket', { id: 'purchase-ticket' })
  }
}

// Spin with ticket saga
function* spinWithTicketSaga(action: SpinWithTicketRequestAction): Generator<any, void, any> {
  const currentUser = getCurrentUser();
  const { hash, signature, timestamp } = generateSignature(JSON.stringify({ ...currentUser }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')

  const { success, data, error, message } = yield call(API_CALL, {
    baseURL,
    url: '/spin-wheel/spin-with-ticket',
    method: 'POST',
    body: { hash, signature, timestamp }
  })

  if (success && data) {
    const { result, spinTickets } = data

    yield put(spinWithTicketSuccess(result, spinTickets))

  } else {
    yield put(spinWithTicketFailure(error || 'Failed to spin with ticket'))
    toast.error(error || 'Failed to spin with ticket')
  }
}

// Fetch user tickets saga
function* fetchUserTicketsSaga(action: FetchUserTicketsRequestAction): Generator<any, void, any> {
  const currentUser = getCurrentUser();
  const { hash, signature, timestamp } = generateSignature(JSON.stringify({ ...currentUser }), process.env.NEXT_PUBLIC_SECRET_KEY || 'app')

  const { success, data, error, message } = yield call(API_CALL, {
    baseURL,
    url: `/spin-wheel/user-tickets/`,
    method: 'GET',
    params: { hash, signature, timestamp }

  })

  if (success && data) {
    yield put(fetchUserTicketsSuccess(data))
  } else {
    yield put(fetchUserTicketsFailure(error || 'Failed to fetch user tickets'))
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
