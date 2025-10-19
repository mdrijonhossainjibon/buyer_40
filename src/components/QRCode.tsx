'use client'

import React, { useEffect, useRef } from 'react'

interface QRCodeProps {
  value: string
  size?: number
  backgroundColor?: string
  foregroundColor?: string
  bordered?: boolean
  style?: React.CSSProperties
  className?: string
}

// QR Code generation constants
const QR_MODE_BYTE = 4
const QR_ERROR_CORRECT_L = 1
const QR_ERROR_CORRECT_M = 0
const QR_ERROR_CORRECT_Q = 3
const QR_ERROR_CORRECT_H = 2

export default function QRCode({
  value,
  size = 128,
  backgroundColor = '#ffffff',
  foregroundColor = '#000000',
  bordered = true,
  style,
  className
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !value) return

    generateQRCode(canvasRef.current, value, size, backgroundColor, foregroundColor)
  }, [value, size, backgroundColor, foregroundColor])

  const generateQRCode = (
    canvas: HTMLCanvasElement,
    text: string,
    size: number,
    bgColor: string,
    fgColor: string
  ) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    // Generate QR matrix
    const qrMatrix = createQRMatrix(text)
    const moduleCount = qrMatrix.length
    const moduleSize = size / moduleCount

    // Fill background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    // Draw QR modules
    ctx.fillStyle = fgColor
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qrMatrix[row][col]) {
          ctx.fillRect(
            col * moduleSize,
            row * moduleSize,
            moduleSize,
            moduleSize
          )
        }
      }
    }
  }

  const createQRMatrix = (text: string): boolean[][] => {
    // Simplified QR code generation
    // This creates a basic QR-like pattern for demonstration
    const size = 25 // Standard QR size for this demo
    const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false))

    // Add finder patterns (corner squares)
    addFinderPattern(matrix, 0, 0)
    addFinderPattern(matrix, size - 7, 0)
    addFinderPattern(matrix, 0, size - 7)

    // Add timing patterns
    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = i % 2 === 0
      matrix[i][6] = i % 2 === 0
    }

    // Add data pattern based on text
    const hash = hashString(text)
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!isReservedArea(row, col, size)) {
          const cellHash = hash + row * size + col
          matrix[row][col] = (cellHash % 3) === 0
        }
      }
    }

    return matrix
  }

  const addFinderPattern = (matrix: boolean[][], startRow: number, startCol: number) => {
    const pattern = [
      [true, true, true, true, true, true, true],
      [true, false, false, false, false, false, true],
      [true, false, true, true, true, false, true],
      [true, false, true, true, true, false, true],
      [true, false, true, true, true, false, true],
      [true, false, false, false, false, false, true],
      [true, true, true, true, true, true, true]
    ]

    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 7; col++) {
        if (startRow + row < matrix.length && startCol + col < matrix[0].length) {
          matrix[startRow + row][startCol + col] = pattern[row][col]
        }
      }
    }
  }

  const isReservedArea = (row: number, col: number, size: number): boolean => {
    // Check if position is in finder pattern areas
    if ((row < 9 && col < 9) || // Top-left
        (row < 9 && col >= size - 8) || // Top-right
        (row >= size - 8 && col < 9)) { // Bottom-left
      return true
    }

    // Check if position is in timing pattern
    if (row === 6 || col === 6) {
      return true
    }

    return false
  }

  const hashString = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        border: bordered ? '1px solid #ddd' : 'none',
        ...style
      }}
      className={className}
    />
  )
}
