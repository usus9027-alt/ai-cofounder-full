'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { CanvasBoard } from '@/components/canvas/CanvasBoard'
import { Header } from '@/components/layout/Header'
import { useCanvas } from '@/hooks/useCanvas'

export default function HomePage() {
  const { data: session } = useSession()
  const { canvas, initCanvas } = useCanvas()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initCanvas()
    }
  }, [initCanvas])

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            AI Co-founder Platform
          </h1>
          <p className="text-gray-600 mb-8">
            Войдите в систему, чтобы начать работу с AI-кофаундером
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Войти
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
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
