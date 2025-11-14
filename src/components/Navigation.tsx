'use client'

import { useDispatch } from 'react-redux'
import { setCurrentPage, toggleTasksPopup, toggleWalletPopup, toggleWatchAdsPopup, toggleSpinPopup } from 'modules/ui'

export default function Navigation() {
  const dispatch = useDispatch()

  const navItems = [
    { id: 'home', icon: 'fas fa-home', label: 'Home', action: () => dispatch(setCurrentPage('home')), spin: 'group-hover:animate-spin' },
    { id: 'tasks', icon: 'fas fa-tasks', label: 'Tasks', action: () => dispatch(toggleTasksPopup(true)), spin: 'group-hover:animate-spin' },
     { id: 'spin', icon: 'fas fa-dharmachakra', label: 'Spin Wheel', action: () => dispatch(toggleSpinPopup(true)), spin: 'animate-spin' },
    { id: 'ads', icon: 'fas fa-play-circle', label: 'Watch Ads', action: () => dispatch(toggleWatchAdsPopup(true)), spin: 'group-hover:animate-spin' },
    { id: 'wallet', icon: 'fas fa-wallet', label: 'Wallet', action: () => dispatch(toggleWalletPopup(true)), spin: 'group-hover:animate-spin' },
  
    
  ]

  return (
    <nav className="fixed left-0 right-0 bottom-0 w-full max-w-[500px] mx-auto flex justify-around items-center gap-2 px-2 py-1.5 border-t border-gray-200 dark:border-gray-700 z-[1000] backdrop-blur-lg bg-white/90 dark:bg-gray-900/90" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}>
      {navItems.map((item) => (
        <button
          key={item.id}
          className="flex-1 min-w-0 max-w-[120px] flex flex-col items-center justify-center gap-0.5 px-1.5 py-2 border-none bg-transparent rounded-xl cursor-pointer font-sans text-xs leading-tight transition-all duration-75 active:scale-95 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 group"
          onClick={item.action}
        >
          <i className={`${item.icon} text-xl leading-none transition-transform duration-500 ${item.spin}`}></i>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
