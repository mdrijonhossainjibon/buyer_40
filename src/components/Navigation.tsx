'use client'

interface NavigationProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export default function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const navItems = [
    { id: 'home', icon: 'fas fa-home', label: 'Home' },
    { id: 'support', icon: 'fas fa-headset', label: 'Support' },
    { id: 'tasks', icon: 'fas fa-tasks', label: 'Tasks' },
    { id: 'withdraw', icon: 'fas fa-wallet', label: 'Withdraw' },
  ]

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-btn ${currentPage === item.id ? 'active' : ''}`}
          onClick={() => setCurrentPage(item.id)}
        >
          <i className={item.icon}></i>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
