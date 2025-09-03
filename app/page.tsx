'use client'

import { useState, useEffect } from 'react'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { CanvasBoard } from '@/components/canvas/CanvasBoard'
import { useCanvas } from '@/hooks/useCanvas'

export default function HomePage() {
  const { canvas, initCanvas } = useCanvas()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initCanvas()
    }
  }, [initCanvas])

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">AI Co-founder Platform</h1>
        <p className="text-sm opacity-90">Полнофункциональная платформа для предпринимателей</p>
      </div>
      <div className="flex-1 flex">
        {/* Chat Panel - 1/3 экрана */}
        <div className="w-1/3 bg-white border-r flex flex-col">
          <ChatInterface />
        </div>

        {/* Canvas Panel - 2/3 экрана */}
        <div className="w-2/3 bg-white flex flex-col">
          <CanvasBoard canvas={canvas} />
        </div>
      </div>
    </div>
  )
}
