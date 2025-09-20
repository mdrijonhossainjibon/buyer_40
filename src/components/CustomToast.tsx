'use client'

import React, { useState, useEffect } from 'react'

interface ToastOptions {
  content: string
  duration?: number
  position?: 'top' | 'center' | 'bottom'
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading'
}

interface ToastItem extends ToastOptions {
  id: string
  timestamp: number
}

let toastContainer: HTMLDivElement | null = null
let toasts: ToastItem[] = []
let updateCallback: (() => void) | null = null

const createToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.style.cssText = `
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 90vw;
      width: auto;
    `
    document.body.appendChild(toastContainer)
  }
  return toastContainer
}

const getPositionStyles = (position: 'top' | 'center' | 'bottom') => {
  switch (position) {
    case 'top':
      return 'top: 20px;'
    case 'center':
      return 'top: 50%; transform: translateX(-50%) translateY(-50%);'
    case 'bottom':
    default:
      return 'bottom: 20px;'
  }
}

const getTypeStyles = (type: string) => {
  switch (type) {
    case 'success':
      return {
        background: '#52c41a',
        icon: '✓'
      }
    case 'error':
      return {
        background: '#ff4d4f',
        icon: '✕'
      }
    case 'warning':
      return {
        background: '#faad14',
        icon: '⚠'
      }
    case 'info':
      return {
        background: '#1890ff',
        icon: 'ℹ'
      }
    case 'loading':
      return {
        background: '#1890ff',
        icon: '⟳'
      }
    default:
      return {
        background: '#333',
        icon: ''
      }
  }
}

const renderToast = (toast: ToastItem) => {
  const container = createToastContainer()
  const position = toast.position || 'bottom'
  const typeStyles = getTypeStyles(toast.type || 'info')
  
  // Update container position
  container.style.cssText += getPositionStyles(position)
  
  const toastElement = document.createElement('div')
  toastElement.id = `toast-${toast.id}`
  toastElement.style.cssText = `
    background: ${typeStyles.background};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(${position === 'top' ? '-' : ''}20px);
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 300px;
    word-wrap: break-word;
  `
  
  // Add icon and content
  toastElement.innerHTML = `
    ${typeStyles.icon ? `<span style="font-size: 16px; flex-shrink: 0;">${typeStyles.icon}</span>` : ''}
    <span>${toast.content}</span>
  `
  
  // Add click to dismiss
  toastElement.addEventListener('click', () => {
    removeToast(toast.id)
  })
  
  container.appendChild(toastElement)
  
  // Animate in
  requestAnimationFrame(() => {
    toastElement.style.opacity = '1'
    toastElement.style.transform = 'translateY(0)'
  })
  
  // Auto remove after duration
  if (toast.type !== 'loading') {
    setTimeout(() => {
      removeToast(toast.id)
    }, toast.duration || 3000)
  }
}

const removeToast = (id: string) => {
  const toastElement = document.getElementById(`toast-${id}`)
  if (toastElement) {
    toastElement.style.opacity = '0'
    toastElement.style.transform = `translateY(${toastElement.parentElement?.style.bottom ? '' : '-'}20px)`
    
    setTimeout(() => {
      toastElement.remove()
      toasts = toasts.filter(t => t.id !== id)
      
      // Remove container if no toasts left
      if (toasts.length === 0 && toastContainer) {
        toastContainer.remove()
        toastContainer = null
      }
    }, 300)
  }
}

class CustomToast {
  static show(options: ToastOptions) {
    try {
      const toast: ToastItem = {
        ...options,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now()
      }
      
      toasts.push(toast)
      renderToast(toast)
      
      return toast.id
    } catch (error) {
      console.error('Toast error:', error)
      // Fallback to browser alert if Toast fails
      alert(options.content)
      return null
    }
  }

  static success(content: string, duration?: number) {
    return this.show({ content, type: 'success', duration })
  }

  static error(content: string, duration?: number) {
    return this.show({ content, type: 'error', duration })
  }

  static warning(content: string, duration?: number) {
    return this.show({ content, type: 'warning', duration })
  }

  static info(content: string, duration?: number) {
    return this.show({ content, type: 'info', duration })
  }

  static loading(content: string) {
    return this.show({ content, type: 'loading', duration: 0 })
  }

  static clear() {
    try {
      toasts.forEach(toast => removeToast(toast.id))
      toasts = []
      if (toastContainer) {
        toastContainer.remove()
        toastContainer = null
      }
    } catch (error) {
      console.error('Toast clear error:', error)
    }
  }

  static remove(id: string) {
    if (id) {
      removeToast(id)
    }
  }
}

export default CustomToast
