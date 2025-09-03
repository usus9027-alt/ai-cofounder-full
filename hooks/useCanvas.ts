'use client'

import { useState, useCallback } from 'react'
import { fabric } from 'fabric'

export function useCanvas() {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)

  const initCanvas = useCallback(() => {
    // Canvas инициализируется в компоненте CanvasBoard
  }, [])

  const createCanvasObject = useCallback((type: string, content: string, x = 100, y = 100) => {
    if (!canvas) return

    const colors = {
      problem: '#fef2f2',
      insight: '#eff6ff',
      persona: '#f0fdf4',
      solution: '#faf5ff',
      milestone: '#fffbeb',
      note: '#f9fafb'
    }

    const icons = {
      problem: '⚠️',
      insight: '💡',
      persona: '👤',
      solution: '🔧',
      milestone: '🏁',
      note: '📝'
    }

    const rect = new fabric.Rect({
      left: x,
      top: y,
      width: 200,
      height: 120,
      fill: colors[type as keyof typeof colors] || colors.note,
      stroke: '#d1d5db',
      strokeWidth: 2,
      rx: 8,
      ry: 8
    })

    const text = new fabric.Text(`${icons[type as keyof typeof icons]} ${content}`, {
      left: x + 10,
      top: y + 10,
      fontSize: 14,
      fill: '#374151',
      width: 180,
      textAlign: 'left'
    })

    const group = new fabric.Group([rect, text], {
      left: x,
      top: y
    })

    canvas.add(group)
    canvas.renderAll()
  }, [canvas])

  const clearCanvas = useCallback(() => {
    if (canvas) {
      canvas.clear()
    }
  }, [canvas])

  const saveCanvas = useCallback(() => {
    if (canvas) {
      const data = JSON.stringify(canvas.toJSON())
      localStorage.setItem('ai-cofounder-canvas', data)
    }
  }, [canvas])

  const loadCanvas = useCallback(() => {
    if (canvas) {
      const saved = localStorage.getItem('ai-cofounder-canvas')
      if (saved) {
        canvas.loadFromJSON(saved, () => {
          canvas.renderAll()
        })
      }
    }
  }, [canvas])

  return {
    canvas,
    setCanvas,
    initCanvas,
    createCanvasObject,
    clearCanvas,
    saveCanvas,
    loadCanvas
  }
}
