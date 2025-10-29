'use client'

interface NavigationProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export default function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const navItems = [
    { id: 'home', icon: 'fas fa-home', label: 'Home' },
   /*  { id: 'support', icon: 'fas fa-headset', label: 'Support' }, */
    { id: 'tasks', icon: 'fas fa-tasks', label: 'Tasks' },
    { id: 'spin', icon: 'fas fa-dharmachakra', label: 'Spin' },
    { id: 'wallet', icon: 'fas fa-wallet', label: 'Wallet' },
    { id: 'ads', icon: 'fas fa-play-circle', label: 'Watch Ads' },
    { id: 'withdraw', icon: 'fas fa-money-check-alt', label: 'Withdraw' },
  ]

  return (
    <nav className="fixed left-0 right-0 bottom-0 w-full max-w-[500px] mx-auto flex justify-around items-center gap-2 px-2 py-1.5 border-t border-gray-200 dark:border-gray-700 z-[1000] backdrop-blur-lg bg-white/90 dark:bg-gray-900/90" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`flex-1 min-w-0 max-w-[120px] flex flex-col items-center justify-center gap-0.5 px-1.5 py-2 border-none bg-transparent rounded-xl cursor-pointer font-sans text-xs leading-tight transition-all duration-75 active:scale-95 ${
            currentPage === item.id 
              ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-600/10 dark:bg-blue-400/10' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={() => setCurrentPage(item.id)}
        >
          <i className={`${item.icon} text-xl leading-none`}></i>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
