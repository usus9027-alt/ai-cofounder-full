'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { supabase } from '../lib/supabase'
import CanvasBoard from '../components/CanvasBoard'
import AuthButton from '../components/AuthButton'
import Recommendations from '../components/Recommendations'

export default function HomePage() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState([
    { id: 1, text: "Привет! Я твой AI-кофаундер. Расскажи о своей идее, и я помогу тебе пройти путь от идеи до запуска продукта!", isAI: true }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])

  // Загружаем сообщения из Supabase при загрузке страницы
  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('project_id', 'default-project')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error loading messages:', error)
        return
      }

      if (data && data.length > 0) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          text: msg.content,
          isAI: msg.role === 'assistant'
        }))
        setMessages(formattedMessages)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const saveMessage = async (content: string, role: 'user' | 'assistant') => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            project_id: 'default-project',
            content: content,
            role: role,
            created_at: new Date().toISOString()
          }
        ])

      if (error) {
        console.error('Error saving message:', error)
      }
    } catch (error) {
      console.error('Error saving message:', error)
    }
  }

  const handleSendMessage = async () => {
    if (inputText.trim() && !isLoading) {
      const currentInput = inputText
      setInputText('')
      setIsLoading(true)
      
      // Сохраняем сообщение пользователя
      await saveMessage(currentInput, 'user')
      const userMessage = { id: Date.now(), text: currentInput, isAI: false }
      setMessages(prev => [...prev, userMessage])
      
      try {
        // Отправляем запрос к GPT API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentInput,
            conversationHistory: messages
          }),
        })

        const data = await response.json()
        
        if (data.success) {
          // Сохраняем ответ AI
          await saveMessage(data.response, 'assistant')
          const aiResponse = { 
            id: Date.now() + 1, 
            text: data.response, 
            isAI: true 
          }
          setMessages(prev => [...prev, aiResponse])
          
          // Обновляем рекомендации
          if (data.recommendations) {
            setRecommendations(data.recommendations)
          }
        } else {
          // Fallback ответ если API недоступен
          const fallbackResponse = data.response || "Извините, сервис временно недоступен. Попробуйте позже."
          await saveMessage(fallbackResponse, 'assistant')
          const aiResponse = { 
            id: Date.now() + 1, 
            text: fallbackResponse, 
            isAI: true 
          }
          setMessages(prev => [...prev, aiResponse])
        }
      } catch (error) {
        console.error('Chat API Error:', error)
        const errorResponse = "Извините, произошла ошибка. Попробуйте еще раз."
        await saveMessage(errorResponse, 'assistant')
        const aiResponse = { 
          id: Date.now() + 1, 
          text: errorResponse, 
          isAI: true 
        }
        setMessages(prev => [...prev, aiResponse])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSelectRecommendation = (recommendation: any) => {
    setInputText(recommendation.content)
    setRecommendations([])
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
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-light text-gray-400 tracking-wide">AI Чат</h2>
            <AuthButton />
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
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Recommendations */}
            <Recommendations 
              recommendations={recommendations}
              onSelectRecommendation={handleSelectRecommendation}
            />
          </div>
        </div>

        {/* Right Column - Canvas Board */}
        <div className="w-2/3 flex flex-col">
          <CanvasBoard projectId="default-project" />
        </div>
      </div>
    </div>
  )
}
