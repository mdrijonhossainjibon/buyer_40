import { UI_ACTIONS, UIState, UIActionTypes } from './types'

const initialState: UIState = {
  currentPage: 'home',
  showReferralPopup: false,
  showSpinPopup: false,
  showTasksPopup: false,
  showWatchAdsPopup: false,
  showWalletPopup: false,
  showConverterPopup: false,
  showPurchaseTicketsPopup: false,
  showSupportPopup: false,
  showWithdrawHistoryPopup: false,
  showMysteryBoxPopup: false
}

export const uiReducer = (
  state = initialState,
  action: UIActionTypes
): UIState => {
  switch (action.type) {
    case UI_ACTIONS.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      }

    case UI_ACTIONS.TOGGLE_REFERRAL_POPUP:
      return {
        ...state,
        showReferralPopup: action.payload
      }

    case UI_ACTIONS.TOGGLE_SPIN_POPUP:
      return {
        ...state,
        showSpinPopup: action.payload
      }

    case UI_ACTIONS.TOGGLE_TASKS_POPUP:
      return {
        ...state,
        showTasksPopup: action.payload
      }

    case UI_ACTIONS.TOGGLE_WATCH_ADS_POPUP:
      return {
        ...state,
        showWatchAdsPopup: action.payload
      }

    case UI_ACTIONS.TOGGLE_WALLET_POPUP:
      return {
        ...state,
        showWalletPopup: action.payload
      }

    case UI_ACTIONS.TOGGLE_CONVERTER_POPUP:
      return {
        ...state,
        showConverterPopup: action.payload
      }

    case UI_ACTIONS.TOGGLE_PURCHASE_TICKETS_POPUP:
      return {
        ...state,
        showPurchaseTicketsPopup: action.payload
      }

    case UI_ACTIONS.TOGGLE_SUPPORT_POPUP:
      return {
        ...state,
        showSupportPopup: action.payload
      }

    case UI_ACTIONS.TOGGLE_WITHDRAW_HISTORY_POPUP:
      return {
        ...state,
        showWithdrawHistoryPopup: action.payload
      }

    case UI_ACTIONS.TOGGLE_MYSTERY_BOX_POPUP:
      return {
        ...state,
        showMysteryBoxPopup: action.payload
      }

    case UI_ACTIONS.CLOSE_ALL_POPUPS:
      return {
        ...state,
        showReferralPopup: false,
        showSpinPopup: false,
        showTasksPopup: false,
        showWatchAdsPopup: false,
        showWalletPopup: false,
        showConverterPopup: false,
        showPurchaseTicketsPopup: false,
        showSupportPopup: false,
        showWithdrawHistoryPopup: false,
        showMysteryBoxPopup: false
      }

    default:
      return state
  }
}
