import { call, put, takeLatest } from 'redux-saga/effects'
import { toast } from 'react-hot-toast'
import { SpinWheelAPI } from '@/lib/api/spinWheel'
import {
  SPIN_WHEEL_ACTIONS,
  FetchSpinConfigRequestAction,
  SpinWheelRequestAction,
  UnlockExtraSpinRequestAction,
  PurchaseTicketRequestAction,
  SpinWithTicketRequestAction
} from './types'
import {
  fetchSpinConfigSuccess,
  fetchSpinConfigFailure,
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
import { updateBalance, updateXP } from '../user/actions'

// Fetch spin configuration saga
function* fetchSpinConfigSaga(action: FetchSpinConfigRequestAction): Generator<any, void, any> {
  try {
    const { userId } = action.payload

    if (!userId) {
      yield put(fetchSpinConfigFailure('User ID is required'))
      return
    }

    const response = yield call(SpinWheelAPI.getSpinConfig, userId)

    if (response.success && response.data) {
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
          response.data.maxExtraSpins
        )
      )
      
      // Update tickets and price
      yield put(setSpinTickets(response.data.spinTickets || 0))
      yield put(setTicketPrice(response.data.ticketPrice || 100))
    } else {
      yield put(fetchSpinConfigFailure(response.error || 'Failed to fetch spin configuration'))
      toast.error(response.error || 'Failed to fetch spin configuration')
    }
  } catch (error: any) {
    yield put(fetchSpinConfigFailure(error.message || 'An error occurred'))
    toast.error(error.message || 'An error occurred while fetching spin configuration')
  }
}

// Spin wheel saga
function* performSpinSaga(action: SpinWheelRequestAction): Generator<any, void, any> {
  try {
    const { userId } = action.payload

    if (!userId) {
      yield put(spinWheelFailure('User ID is required'))
      return
    }

    const response = yield call(SpinWheelAPI.spin, userId)

    if (response.success && response.data) {
      const { result, newBalance, nextSpinTime, spinsToday } = response.data

      yield put(spinWheelSuccess(result, nextSpinTime, spinsToday))

      // Update user balance
      yield put(updateBalance(result.amount))

      // Show success toast after animation
      setTimeout(() => {
        toast.success(`🎉 Congratulations! You won ${result.amount} USDT!`, {
          duration: 5000
        })
      }, 3000)
    } else {
      yield put(spinWheelFailure(response.error || 'Failed to spin the wheel'))
      toast.error(response.error || 'Failed to spin the wheel')
    }
  } catch (error: any) {
    yield put(spinWheelFailure(error.message || 'An error occurred'))
    toast.error(error.message || 'An error occurred while spinning')
  }
}

// Unlock extra spin saga
function* unlockExtraSpinSaga(action: UnlockExtraSpinRequestAction): Generator<any, void, any> {
  try {
    const { userId } = action.payload

    if (!userId) {
      yield put(unlockExtraSpinFailure('User ID is required'))
      return
    }

    // Show ad watching toast
    toast.loading('Watch the ad to unlock an extra spin...', { id: 'unlock-spin' })

    const response = yield call(SpinWheelAPI.unlockExtraSpin, userId)

    if (response.success && response.data) {
      yield put(
        unlockExtraSpinSuccess(
          response.data.extraSpinsUnlocked,
          response.data.canSpin
        )
      )

      toast.success('🎉 Extra spin unlocked! You can spin again!', { id: 'unlock-spin' })
    } else {
      yield put(unlockExtraSpinFailure(response.error || 'Failed to unlock extra spin'))
      toast.error(response.error || 'Failed to unlock extra spin', { id: 'unlock-spin' })
    }
  } catch (error: any) {
    yield put(unlockExtraSpinFailure(error.message || 'An error occurred'))
    toast.error(error.message || 'An error occurred while unlocking spin', { id: 'unlock-spin' })
  }
}

// Purchase ticket saga
function* purchaseTicketSaga(action: PurchaseTicketRequestAction): Generator<any, void, any> {
  try {
    const { userId, quantity } = action.payload

    if (!userId) {
      yield put(purchaseTicketFailure('User ID is required'))
      return
    }

    toast.loading('Purchasing spin ticket...', { id: 'purchase-ticket' })

    const response = yield call(SpinWheelAPI.purchaseTicket, userId, quantity)

    if (response.success && response.data) {
      yield put(
        purchaseTicketSuccess(
          response.data.spinTickets,
          response.data.newXP
        )
      )

      // Update user XP
      yield put(updateXP(response.data.newXP))

      toast.success(`🎟️ ${response.data.message || 'Ticket purchased successfully!'}`, { id: 'purchase-ticket' })
    } else {
      yield put(purchaseTicketFailure(response.error || 'Failed to purchase ticket'))
      toast.error(response.error || 'Failed to purchase ticket', { id: 'purchase-ticket' })
    }
  } catch (error: any) {
    yield put(purchaseTicketFailure(error.message || 'An error occurred'))
    toast.error(error.message || 'An error occurred while purchasing ticket', { id: 'purchase-ticket' })
  }
}

// Spin with ticket saga
function* spinWithTicketSaga(action: SpinWithTicketRequestAction): Generator<any, void, any> {
  try {
    const { userId } = action.payload

    if (!userId) {
      yield put(spinWithTicketFailure('User ID is required'))
      return
    }

    const response = yield call(SpinWheelAPI.spinWithTicket, userId)

    if (response.success && response.data) {
      const { result, spinTickets, newBalance } = response.data

      yield put(spinWithTicketSuccess(result, spinTickets))

      // Update user balance
      yield put(updateBalance(newBalance))

      // Show success toast after animation
      setTimeout(() => {
        toast.success(`🎉 Congratulations! You won ${result.amount} USDT!`, {
          duration: 5000
        })
      }, 3000)
    } else {
      yield put(spinWithTicketFailure(response.error || 'Failed to spin with ticket'))
      toast.error(response.error || 'Failed to spin with ticket')
    }
  } catch (error: any) {
    yield put(spinWithTicketFailure(error.message || 'An error occurred'))
    toast.error(error.message || 'An error occurred while spinning')
  }
}

// Root saga
export function* spinWheelSaga() {
  yield takeLatest(SPIN_WHEEL_ACTIONS.FETCH_SPIN_CONFIG_REQUEST, fetchSpinConfigSaga)
  yield takeLatest(SPIN_WHEEL_ACTIONS.SPIN_WHEEL_REQUEST, performSpinSaga)
  yield takeLatest(SPIN_WHEEL_ACTIONS.UNLOCK_EXTRA_SPIN_REQUEST, unlockExtraSpinSaga)
  yield takeLatest(SPIN_WHEEL_ACTIONS.PURCHASE_TICKET_REQUEST, purchaseTicketSaga)
  yield takeLatest(SPIN_WHEEL_ACTIONS.SPIN_WITH_TICKET_REQUEST, spinWithTicketSaga)
}
