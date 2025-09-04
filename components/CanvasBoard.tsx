'use client'

import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { supabase } from '../lib/supabase'

interface CanvasBoardProps {
  projectId?: string
  onCanvasUpdate?: (objects: any[]) => void
}

export default function CanvasBoard({ projectId = 'default-project', onCanvasUpdate }: CanvasBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!canvasRef.current) return

    // Инициализируем Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selection: true,
    })

    fabricCanvasRef.current = canvas

    // Загружаем сохраненные объекты
    loadCanvasObjects()

    // Сохраняем изменения при изменении canvas
    canvas.on('object:added', () => saveCanvasObjects())
    canvas.on('object:removed', () => saveCanvasObjects())
    canvas.on('object:modified', () => saveCanvasObjects())

    setIsLoading(false)

    return () => {
      canvas.dispose()
    }
  }, [])

  const loadCanvasObjects = async () => {
    try {
      const { data, error } = await supabase
        .from('canvas_objects')
        .select('*')
        .eq('project_id', projectId)

      if (error) {
        console.error('Error loading canvas objects:', error)
        return
      }

      if (data && data.length > 0 && fabricCanvasRef.current) {
        // Очищаем canvas
        fabricCanvasRef.current.clear()

        // Загружаем объекты
        data.forEach(obj => {
          try {
            const fabricObject = JSON.parse(obj.content)
            fabric.util.enlivenObjects([fabricObject], (objects: fabric.Object[]) => {
              objects.forEach(object => {
                fabricCanvasRef.current?.add(object)
              })
            })
          } catch (error) {
            console.error('Error parsing canvas object:', error)
          }
        })
      }
    } catch (error) {
      console.error('Error loading canvas objects:', error)
    }
  }

  const saveCanvasObjects = async () => {
    if (!fabricCanvasRef.current) return

    try {
      const objects = fabricCanvasRef.current.getObjects()
      
      // Удаляем старые объекты
      await supabase
        .from('canvas_objects')
        .delete()
        .eq('project_id', projectId)

      // Сохраняем новые объекты
      if (objects.length > 0) {
        const objectsToSave = objects.map((obj, index) => ({
          project_id: projectId,
          type: obj.type || 'object',
          content: JSON.stringify(obj.toObject()),
          position_x: obj.left || 0,
          position_y: obj.top || 0,
          created_by: 'user' as const,
          created_at: new Date().toISOString()
        }))

        const { error } = await supabase
          .from('canvas_objects')
          .insert(objectsToSave)

        if (error) {
          console.error('Error saving canvas objects:', error)
        }
      }
    } catch (error) {
      console.error('Error saving canvas objects:', error)
    }
  }

  // Функции для AI - создание объектов
  const addTextFromAI = (text: string, x: number = 100, y: number = 100) => {
    if (!fabricCanvasRef.current) return

    const textObj = new fabric.IText(text, {
      left: x,
      top: y,
      fontFamily: 'Arial',
      fontSize: 16,
      fill: '#333333',
      selectable: true,
      editable: true
    })

    fabricCanvasRef.current.add(textObj)
    fabricCanvasRef.current.setActiveObject(textObj)
    return textObj
  }

  const addRectangleFromAI = (x: number = 200, y: number = 200, width: number = 100, height: number = 100, color: string = '#e3f2fd') => {
    if (!fabricCanvasRef.current) return

    const rect = new fabric.Rect({
      left: x,
      top: y,
      width: width,
      height: height,
      fill: color,
      stroke: '#1976d2',
      strokeWidth: 2,
      selectable: true,
      movable: true
    })

    fabricCanvasRef.current.add(rect)
    return rect
  }

  const addCircleFromAI = (x: number = 300, y: number = 300, radius: number = 50, color: string = '#f3e5f5') => {
    if (!fabricCanvasRef.current) return

    const circle = new fabric.Circle({
      left: x,
      top: y,
      radius: radius,
      fill: color,
      stroke: '#7b1fa2',
      strokeWidth: 2,
      selectable: true,
      movable: true
    })

    fabricCanvasRef.current.add(circle)
    return circle
  }

  // Экспорт функций для AI
  useEffect(() => {
    if (fabricCanvasRef.current) {
      // Добавляем функции в глобальный объект для доступа из API
      (window as any).canvasAPI = {
        addText: addTextFromAI,
        addRectangle: addRectangleFromAI,
        addCircle: addCircleFromAI,
        clearCanvas: clearCanvas
      }
    }
  }, [fabricCanvasRef.current])

  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return
    fabricCanvasRef.current.clear()
  }

  const exportCanvas = () => {
    if (!fabricCanvasRef.current) return
    
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1
    })
    
    const link = document.createElement('a')
    link.download = `canvas-${projectId}-${Date.now()}.png`
    link.href = dataURL
    link.click()
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-400">Загрузка Canvas...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-lg font-light text-gray-400 tracking-wide">AI Canvas</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportCanvas}
            className="px-3 py-1 text-xs font-light text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            💾 Экспорт
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-sm border border-gray-200">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          AI создает объекты на основе ваших идей. Вы можете перетаскивать, редактировать текст и изменять размеры.
        </p>
      </div>
    </div>
  )
}
