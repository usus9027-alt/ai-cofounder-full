'use client'

import { useState } from 'react'

export default function HomePage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Привет! Я твой AI-кофаундер. Расскажи о своей идее, и я помогу тебе пройти путь от идеи до запуска продукта!", isAI: true }
  ])
  const [inputText, setInputText] = useState('')

  const handleSendMessage = () => {
    if (inputText.trim()) {
      // Добавляем сообщение пользователя
      const userMessage = { id: Date.now(), text: inputText, isAI: false }
      setMessages(prev => [...prev, userMessage])
      
      // Имитируем ответ AI
      setTimeout(() => {
        const aiResponse = { 
          id: Date.now() + 1, 
          text: "Отличная идея! Давайте разберем её подробнее. Расскажи, какую проблему решает твоя идея?", 
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
    <div className="min-h-screen bg-white">
      <div className="flex h-screen">
        {/* Left Column - Chat Interface */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col">
          {/* Chat Header */}
          <div className="p-8 border-b border-gray-50">
            <h2 className="text-lg font-light text-gray-400 tracking-wide">AI Чат</h2>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`${message.isAI ? 'text-gray-600' : 'text-gray-800'}`}>
                  <p className="text-sm leading-relaxed font-light">
                    {message.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-8 border-t border-gray-50">
            <div className="flex items-center space-x-3 border border-gray-200 rounded-full px-4 py-3 hover:border-gray-300 transition-colors">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Опишите вашу идею..."
                className="flex-1 bg-transparent text-sm font-light text-gray-700 placeholder-gray-400 focus:outline-none"
              />
              <button 
                onClick={handleSendMessage}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="w-2/3 flex items-center justify-center">
          <div className="text-center max-w-md">
            {/* Main Title */}
            <h1 className="text-6xl font-serif text-gray-900 mb-6 leading-tight">
              Ideas.<br />
              Simplified.
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg font-light text-gray-500 mb-12 tracking-wide">
              Pure entrepreneurial focus
            </p>
            
            {/* CTA Button */}
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full text-sm font-light tracking-wide hover:border-gray-400 hover:text-gray-800 transition-all duration-200">
              Begin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
