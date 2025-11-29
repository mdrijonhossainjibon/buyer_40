import {
  UI_ACTIONS,
  SetCurrentPageAction,
  ToggleReferralPopupAction,
  ToggleSpinPopupAction,
  ToggleTasksPopupAction,
  ToggleWatchAdsPopupAction,
  ToggleWalletPopupAction,
  ToggleConverterPopupAction,
  TogglePurchaseTicketsPopupAction,
  ToggleSupportPopupAction,
  ToggleWithdrawHistoryPopupAction,
  ToggleMysteryBoxPopupAction,
  CloseAllPopupsAction
} from './types'

export const setCurrentPage = (page: string): SetCurrentPageAction => ({
  type: UI_ACTIONS.SET_CURRENT_PAGE,
  payload: page
})

export const toggleReferralPopup = (show: boolean): ToggleReferralPopupAction => ({
  type: UI_ACTIONS.TOGGLE_REFERRAL_POPUP,
  payload: show
})

export const toggleSpinPopup = (show: boolean): ToggleSpinPopupAction => ({
  type: UI_ACTIONS.TOGGLE_SPIN_POPUP,
  payload: show
})

export const toggleTasksPopup = (show: boolean): ToggleTasksPopupAction => ({
  type: UI_ACTIONS.TOGGLE_TASKS_POPUP,
  payload: show
})

export const toggleWatchAdsPopup = (show: boolean): ToggleWatchAdsPopupAction => ({
  type: UI_ACTIONS.TOGGLE_WATCH_ADS_POPUP,
  payload: show
})

export const toggleWalletPopup = (show: boolean): ToggleWalletPopupAction => ({
  type: UI_ACTIONS.TOGGLE_WALLET_POPUP,
  payload: show
})

export const toggleConverterPopup = (show: boolean): ToggleConverterPopupAction => ({
  type: UI_ACTIONS.TOGGLE_CONVERTER_POPUP,
  payload: show
})

export const togglePurchaseTicketsPopup = (show: boolean): TogglePurchaseTicketsPopupAction => ({
  type: UI_ACTIONS.TOGGLE_PURCHASE_TICKETS_POPUP,
  payload: show
})

export const toggleSupportPopup = (show: boolean): ToggleSupportPopupAction => ({
  type: UI_ACTIONS.TOGGLE_SUPPORT_POPUP,
  payload: show
})

export const toggleWithdrawHistoryPopup = (show: boolean): ToggleWithdrawHistoryPopupAction => ({
  type: UI_ACTIONS.TOGGLE_WITHDRAW_HISTORY_POPUP,
  payload: show
})

export const toggleMysteryBoxPopup = (show: boolean): ToggleMysteryBoxPopupAction => ({
  type: UI_ACTIONS.TOGGLE_MYSTERY_BOX_POPUP,
  payload: show
})

export const closeAllPopups = (): CloseAllPopupsAction => ({
  type: UI_ACTIONS.CLOSE_ALL_POPUPS
})
