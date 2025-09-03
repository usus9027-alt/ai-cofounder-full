'use client'

import { useState } from 'react'

export default function HomePage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "AI: Привет! Я ваш AI-кофаундер. Какую идею хотите развить?", isAI: true }
  ])
  const [inputText, setInputText] = useState('')

  const handleSendMessage = () => {
    if (inputText.trim()) {
      // Добавляем сообщение пользователя
      const userMessage = { id: Date.now(), text: `Вы: ${inputText}`, isAI: false }
      setMessages(prev => [...prev, userMessage])
      
      // Имитируем ответ AI
      setTimeout(() => {
        const aiResponse = { 
          id: Date.now() + 1, 
          text: `AI: Отличная идея! Давайте разберем её подробнее. Что именно вы хотите создать?`, 
          isAI: true 
        }
        setMessages(prev => [...prev, aiResponse])
      }, 1000)
      
      setInputText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">AI Co-founder Platform</h1>
        <p className="text-sm opacity-90">Полнофункциональная платформа для предпринимателей</p>
      </div>
      <div className="flex-1 flex">
        {/* Chat Panel - 1/3 экрана */}
        <div className="w-1/3 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">AI Чат</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`p-3 rounded ${message.isAI ? 'bg-gray-100' : 'bg-blue-100'}`}>
                  <p className="text-sm">{message.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите ваше сообщение..."
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Panel - 2/3 экрана */}
        <div className="w-2/3 bg-white p-4">
          <h2 className="text-lg font-semibold mb-4">Canvas Доска</h2>
          <div className="border-2 border-dashed border-gray-300 h-full rounded flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">🎨 Интерактивная доска</p>
              <p className="text-sm">Здесь будут отображаться ваши идеи и проекты</p>
              <p className="text-xs mt-2 text-gray-400">Функциональность будет добавлена в следующих версиях</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
