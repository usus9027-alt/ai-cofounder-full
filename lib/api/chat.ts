import { OpenAI } from 'openai'
import { TwitterAnalyzer } from '@/lib/twitter'
import { saveToVectorDB, searchVectorDB } from '@/lib/vector'
import { saveMessage, getMessages } from '@/lib/database'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function sendMessage(data: { content: string; projectId: string }) {
  try {
    // Сохраняем сообщение пользователя
    await saveMessage({
      projectId: data.projectId,
      content: data.content,
      role: 'user'
    })

    // Ищем релевантную информацию в векторной БД
    const relevantContext = await searchVectorDB(data.projectId, data.content)

    // Генерируем ответ AI
    const aiResponse = await generateAIResponse(data.content, relevantContext)

    // Сохраняем ответ AI
    await saveMessage({
      projectId: data.projectId,
      content: aiResponse.content,
      role: 'assistant'
    })

    // Сохраняем контекст в векторную БД
    await saveToVectorDB(data.projectId, aiResponse.content, {
      type: 'ai_response',
      context: relevantContext
    })

    // Анализируем, нужно ли создавать объекты на Canvas
    const canvasObjects = await analyzeForCanvasObjects(data.content, aiResponse.content)

    return {
      success: true,
      message: aiResponse.content,
      canvasObjects
    }
  } catch (error) {
    console.error('Error sending message:', error)
    throw new Error('Failed to send message')
  }
}

async function generateAIResponse(userMessage: string, context: any[]) {
  const systemPrompt = `Ты AI-кофаундер, помогающий предпринимателям развивать их идеи. 
  
  Контекст из предыдущих разговоров:
  ${context.map(c => c.content).join('\n')}
  
  Отвечай на русском языке, будь дружелюбным и конструктивным. 
  Помогай структурировать идеи и давай практические советы.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.7,
    max_tokens: 500
  })

  return {
    content: response.choices[0].message.content || 'Извините, произошла ошибка.'
  }
}

async function analyzeForCanvasObjects(userMessage: string, aiResponse: string) {
  const canvasObjects = []

  // Анализируем сообщение пользователя
  if (userMessage.toLowerCase().includes('проблема') || userMessage.toLowerCase().includes('проблемы')) {
    canvasObjects.push({
      type: 'problem',
      content: userMessage.substring(0, 50) + '...',
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50
    })
  }

  if (userMessage.toLowerCase().includes('идея') || userMessage.toLowerCase().includes('идеи')) {
    canvasObjects.push({
      type: 'insight',
      content: userMessage.substring(0, 50) + '...',
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50
    })
  }

  if (userMessage.toLowerCase().includes('пользователь') || userMessage.toLowerCase().includes('аудитория')) {
    canvasObjects.push({
      type: 'persona',
      content: userMessage.substring(0, 50) + '...',
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50
    })
  }

  if (userMessage.toLowerCase().includes('решение') || userMessage.toLowerCase().includes('продукт')) {
    canvasObjects.push({
      type: 'solution',
      content: userMessage.substring(0, 50) + '...',
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50
    })
  }

  return canvasObjects
}

export { getMessages }
