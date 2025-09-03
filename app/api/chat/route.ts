import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { saveIdeaToVectorDB, getIdeaRecommendations } from '../../../lib/pinecone'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [], projectId = 'default-project' } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Сохраняем идею в векторную базу данных
    try {
      await saveIdeaToVectorDB({
        id: `idea-${Date.now()}`,
        content: message,
        projectId: projectId,
        metadata: {
          type: 'user_message',
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Error saving to vector database:', error)
      // Продолжаем выполнение даже если векторная БД недоступна
    }

    // Формируем системный промпт для AI-кофаундера
    const systemPrompt = `Ты - AI-кофаундер, эксперт по предпринимательству и развитию стартапов. 
Твоя задача - помочь пользователю пройти путь от идеи до запуска продукта.

Твой стиль общения:
- Дружелюбный и мотивирующий
- Конкретный и практичный
- Задаешь правильные вопросы
- Даешь пошаговые рекомендации
- Фокусируешься на действиях

Отвечай на русском языке, кратко и по делу. Максимум 2-3 предложения.`

    // Формируем массив сообщений для OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.isAI ? 'assistant' : 'user',
        content: msg.text
      })),
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content || 'Извините, не могу ответить сейчас.'

    // Сохраняем ответ AI в векторную базу данных
    try {
      await saveIdeaToVectorDB({
        id: `ai-response-${Date.now()}`,
        content: aiResponse,
        projectId: projectId,
        metadata: {
          type: 'ai_response',
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Error saving AI response to vector database:', error)
    }

    // Получаем рекомендации похожих идей
    let recommendations = []
    try {
      recommendations = await getIdeaRecommendations(conversationHistory, projectId)
    } catch (error) {
      console.error('Error getting recommendations:', error)
    }

    return NextResponse.json({ 
      response: aiResponse,
      success: true,
      recommendations: recommendations
    })

  } catch (error) {
    console.error('OpenAI API Error:', error)
    
    // Fallback ответ если API недоступен
    const fallbackResponses = [
      "Отличная идея! Расскажи подробнее о проблеме, которую решает твой продукт.",
      "Интересно! Кто твоя целевая аудитория?",
      "Хорошо! Как ты планируешь монетизировать эту идею?",
      "Понятно! Какие у тебя есть ресурсы для реализации?",
      "Отлично! С чего ты хочешь начать?"
    ]
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    
    return NextResponse.json({ 
      response: randomResponse,
      success: false,
      error: 'API temporarily unavailable'
    })
  }
}