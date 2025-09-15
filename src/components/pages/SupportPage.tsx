'use client'

export default function SupportPage() {
  const openTutorial = () => {
    window.open('https://www.youtube.com/shorts/WIb8gPivETM', '_blank')
  }

  return (
    <div className="block animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Support</h2>
      <div className="p-5 rounded-xl text-center mb-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <i className="fas fa-circle-play text-5xl mb-4 text-red-600 dark:text-red-400"></i>
        <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Tutorial Video</h3>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">কিভাবে অ্যাপটি ব্যবহার করবেন—টিউটোরিয়াল দেখে নিন।</p>
        <button className="w-full p-3.5 text-base font-bold text-white border-none rounded-lg cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors duration-200" onClick={openTutorial}>
          <span>Open Tutorial</span>
        </button>
        <small className="block mt-1.5 opacity-80 text-gray-600 dark:text-gray-400">
          🎞️ <b>ভিডিও দেখে</b> সব কিছু বুঝে নিন
        </small>
      </div>
    </div>
  )
}
