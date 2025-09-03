'use client'

import { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { sendMessage, getMessages } from '@/lib/api/chat'
import { useCanvas } from '@/hooks/useCanvas'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: string
  canvasObjects?: any[]
}

export function ChatInterface() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { createCanvasObject } = useCanvas()

  const { data: messages = [], refetch } = useQuery({
    queryKey: ['messages'],
    queryFn: getMessages,
  })

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (response) => {
      refetch()
      if (response.canvasObjects) {
        response.canvasObjects.forEach((obj: any) => {
          createCanvasObject(obj.type, obj.content, obj.x, obj.y)
        })
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')

    sendMessageMutation.mutate({
      content: userMessage,
      projectId: 'default-project', // В реальном приложении будет динамический ID
    })
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold flex items-center">
          <i className="fas fa-comments mr-2 text-blue-600"></i>
          AI Чат
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <i className="fas fa-robot text-blue-600 mt-1"></i>
            <div>
              <p className="text-sm text-gray-700">
                Привет! Я твой AI-кофаундер. Расскажи мне о своей идее, и я помогу тебе пройти путь от идеи до запуска продукта!
              </p>
            </div>
          </div>
        </div>

        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-gray-100 ml-8'
                : 'bg-blue-50'
            }`}
          >
            <div className="flex items-start space-x-2">
              <i
                className={`fas ${
                  message.role === 'user' ? 'fa-user text-gray-600' : 'fa-robot text-blue-600'
                } mt-1`}
              ></i>
              <div>
                <p className="text-sm text-gray-700">{message.content}</p>
                {message.canvasObjects && message.canvasObjects.length > 0 && (
                  <div className="mt-2 text-xs text-green-600">
                    <i className="fas fa-palette mr-1"></i>
                    Создано {message.canvasObjects.length} объектов на Canvas
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {sendMessageMutation.isPending && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <i className="fas fa-robot text-blue-600 mt-1"></i>
              <div>
                <p className="text-sm text-gray-700">AI анализирует...</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Опишите вашу идею..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sendMessageMutation.isPending}
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isPending || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </>
  )
}
