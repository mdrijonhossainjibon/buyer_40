'use client'

export default function SupportPage() {
  const openTutorial = () => {
    window.open('https://youtube.com/watch?v=tutorial', '_blank')
  }

  return (
    <div className="page active">
      <h2>Support</h2>
      <div className="task-container">
        <i className="fas fa-circle-play task-icon"></i>
        <h3>Tutorial Video</h3>
        <p>কিভাবে অ্যাপটি ব্যবহার করবেন—টিউটোরিয়াল দেখে নিন।</p>
        <button className="action-btn" onClick={openTutorial}>
          <span>Open Tutorial</span>
        </button>
        <small style={{ display: 'block', marginTop: '6px', opacity: 0.8 }}>
          🎞️ <b>ভিডিও দেখে</b> সব কিছু বুঝে নিন
        </small>
      </div>
    </div>
  )
}
