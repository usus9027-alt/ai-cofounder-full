'use client'

import { useEffect, useRef } from 'react'
import { fabric } from 'fabric'

interface CanvasBoardProps {
  canvas: fabric.Canvas | null
}

export function CanvasBoard({ canvas }: CanvasBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const canvasElement = canvasRef.current
      const container = canvasElement.parentElement
      
      if (container) {
        const width = container.clientWidth - 20
        const height = container.clientHeight - 20
        
        const newCanvas = new fabric.Canvas(canvasElement, {
          width,
          height,
          backgroundColor: '#f8fafc'
        })

        // Обработка изменения размера окна
        const handleResize = () => {
          const newWidth = container.clientWidth - 20
          const newHeight = container.clientHeight - 20
          newCanvas.setDimensions({ width: newWidth, height: newHeight })
        }

        window.addEventListener('resize', handleResize)

        return () => {
          window.removeEventListener('resize', handleResize)
          newCanvas.dispose()
        }
      }
    }
  }, [canvas])

  return (
    <>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold flex items-center">
          <i className="fas fa-palette mr-2 text-green-600"></i>
          Canvas Доска
        </h3>
      </div>
      
      <div className="flex-1 p-4">
        <div className="w-full h-full rounded-lg relative border-2 border-dashed border-gray-300">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>
    </>
  )
}
