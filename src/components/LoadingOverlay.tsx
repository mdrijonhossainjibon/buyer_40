'use client'

export default function LoadingOverlay() {
  return (
    <div className="boot-overlay">
      <div className="boot-card">
        <div className="boot-logo">
          <i className="fa-solid fa-bolt"></i>
        </div>
        <div className="boot-title">Loading your dashboard…</div>
        <div className="boot-sub">Securely syncing profile & config</div>
        <div className="boot-progress">
          <div className="boot-bar"></div>
        </div>
        <div className="boot-hint">Please wait a moment</div>
      </div>
    </div>
  )
}
