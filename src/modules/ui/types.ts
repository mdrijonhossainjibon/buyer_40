// UI State interface
export interface UIState {
  currentPage: string
  showReferralPopup: boolean
  showSpinPopup: boolean
  showTasksPopup: boolean
  showWatchAdsPopup: boolean
  showWalletPopup: boolean
  showConverterPopup: boolean
  showPurchaseTicketsPopup: boolean
  showSupportPopup: boolean
  showWithdrawHistoryPopup: boolean
  showMysteryBoxPopup: boolean
}

// Action types
export const UI_ACTIONS = {
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  TOGGLE_REFERRAL_POPUP: 'TOGGLE_REFERRAL_POPUP',
  TOGGLE_SPIN_POPUP: 'TOGGLE_SPIN_POPUP',
  TOGGLE_TASKS_POPUP: 'TOGGLE_TASKS_POPUP',
  TOGGLE_WATCH_ADS_POPUP: 'TOGGLE_WATCH_ADS_POPUP',
  TOGGLE_WALLET_POPUP: 'TOGGLE_WALLET_POPUP',
  TOGGLE_CONVERTER_POPUP: 'TOGGLE_CONVERTER_POPUP',
  TOGGLE_PURCHASE_TICKETS_POPUP: 'TOGGLE_PURCHASE_TICKETS_POPUP',
  TOGGLE_SUPPORT_POPUP: 'TOGGLE_SUPPORT_POPUP',
  TOGGLE_WITHDRAW_HISTORY_POPUP: 'TOGGLE_WITHDRAW_HISTORY_POPUP',
  TOGGLE_MYSTERY_BOX_POPUP: 'TOGGLE_MYSTERY_BOX_POPUP',
  CLOSE_ALL_POPUPS: 'CLOSE_ALL_POPUPS'
} as const

// Action interfaces
export interface SetCurrentPageAction {
  type: typeof UI_ACTIONS.SET_CURRENT_PAGE
  payload: string
  [key: string]: any
}

export interface ToggleReferralPopupAction {
  type: typeof UI_ACTIONS.TOGGLE_REFERRAL_POPUP
  payload: boolean
  [key: string]: any
}

export interface ToggleSpinPopupAction {
  type: typeof UI_ACTIONS.TOGGLE_SPIN_POPUP
  payload: boolean
  [key: string]: any
}

export interface ToggleTasksPopupAction {
  type: typeof UI_ACTIONS.TOGGLE_TASKS_POPUP
  payload: boolean
  [key: string]: any
}

export interface ToggleWatchAdsPopupAction {
  type: typeof UI_ACTIONS.TOGGLE_WATCH_ADS_POPUP
  payload: boolean
  [key: string]: any
}

export interface ToggleWalletPopupAction {
  type: typeof UI_ACTIONS.TOGGLE_WALLET_POPUP
  payload: boolean
  [key: string]: any
}

export interface ToggleConverterPopupAction {
  type: typeof UI_ACTIONS.TOGGLE_CONVERTER_POPUP
  payload: boolean
  [key: string]: any
}

export interface TogglePurchaseTicketsPopupAction {
  type: typeof UI_ACTIONS.TOGGLE_PURCHASE_TICKETS_POPUP
  payload: boolean
  [key: string]: any
}

export interface ToggleSupportPopupAction {
  type: typeof UI_ACTIONS.TOGGLE_SUPPORT_POPUP
  payload: boolean
  [key: string]: any
}

export interface ToggleWithdrawHistoryPopupAction {
  type: typeof UI_ACTIONS.TOGGLE_WITHDRAW_HISTORY_POPUP
  payload: boolean
  [key: string]: any
}

export interface ToggleMysteryBoxPopupAction {
  type: typeof UI_ACTIONS.TOGGLE_MYSTERY_BOX_POPUP
  payload: boolean
  [key: string]: any
}

export interface CloseAllPopupsAction {
  type: typeof UI_ACTIONS.CLOSE_ALL_POPUPS
  [key: string]: any
}

export type UIActionTypes =
  | SetCurrentPageAction
  | ToggleReferralPopupAction
  | ToggleSpinPopupAction
  | ToggleTasksPopupAction
  | ToggleWatchAdsPopupAction
  | ToggleWalletPopupAction
  | ToggleConverterPopupAction
  | TogglePurchaseTicketsPopupAction
  | ToggleSupportPopupAction
  | ToggleWithdrawHistoryPopupAction
  | ToggleMysteryBoxPopupAction
  | CloseAllPopupsAction
