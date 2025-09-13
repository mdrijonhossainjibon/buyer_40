'use client'

import { useEffect } from 'react'

interface NewsModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  content?: string
}

export default function NewsModal({ isOpen, onClose, title = "স্বাগতম!", content = "" }: NewsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div className="news-overlay" onClick={onClose}></div>
      <div className="news-modal" role="dialog" aria-modal="true" aria-labelledby="newsTitle">
        <div className="news-hero">
          <button type="button" className="news-close" aria-label="Close" onClick={onClose}>
            ✕
          </button>
          <h3 id="newsTitle">{title}</h3>
          <div className="news-emoji">🔥</div>
        </div>
        <div className="news-body">
          {content || (
            <div>
              <p>আপনাকে আমাদের অ্যাপে স্বাগতম! এখানে আপনি বিজ্ঞাপন দেখে টাকা আয় করতে পারবেন।</p>
              <p>নতুন ফিচার এবং আপডেটের জন্য নিয়মিত চেক করুন।</p>
            </div>
          )}
        </div>
        <div className="news-foot">
          <button type="button" className="btn-ok" onClick={onClose}>
            বুঝেছি
          </button>
        </div>
      </div>
    </>
  )
}
