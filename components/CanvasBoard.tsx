'use client'

import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { supabase } from '../lib/supabase'

interface CanvasBoardProps {
  projectId?: string
}

export default function CanvasBoard({ projectId = 'default-project' }: CanvasBoardProps) {
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

  const addText = () => {
    if (!fabricCanvasRef.current) return

    const text = new fabric.IText('Нажмите для редактирования', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#333333'
    })

    fabricCanvasRef.current.add(text)
    fabricCanvasRef.current.setActiveObject(text)
  }

  const addRectangle = () => {
    if (!fabricCanvasRef.current) return

    const rect = new fabric.Rect({
      left: 200,
      top: 200,
      width: 100,
      height: 100,
      fill: '#e3f2fd',
      stroke: '#1976d2',
      strokeWidth: 2
    })

    fabricCanvasRef.current.add(rect)
  }

  const addCircle = () => {
    if (!fabricCanvasRef.current) return

    const circle = new fabric.Circle({
      left: 300,
      top: 300,
      radius: 50,
      fill: '#f3e5f5',
      stroke: '#7b1fa2',
      strokeWidth: 2
    })

    fabricCanvasRef.current.add(circle)
  }

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
      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-4 border-b border-gray-100">
        <button
          onClick={addText}
          className="px-3 py-1 text-xs font-light text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
        >
          📝 Текст
        </button>
        <button
          onClick={addRectangle}
          className="px-3 py-1 text-xs font-light text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
        >
          ⬜ Прямоугольник
        </button>
        <button
          onClick={addCircle}
          className="px-3 py-1 text-xs font-light text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
        >
          ⭕ Круг
        </button>
        <div className="flex-1"></div>
        <button
          onClick={exportCanvas}
          className="px-3 py-1 text-xs font-light text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
        >
          💾 Экспорт
        </button>
        <button
          onClick={clearCanvas}
          className="px-3 py-1 text-xs font-light text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
        >
          🗑️ Очистить
        </button>
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
          Перетаскивайте объекты, редактируйте текст, изменяйте размеры. Все изменения сохраняются автоматически.
        </p>
      </div>
    </div>
  )
}
