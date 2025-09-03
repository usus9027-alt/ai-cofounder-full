import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Инициализируем Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
})

// Получаем индекс
const getIndex = () => {
  return pinecone.index(process.env.PINECONE_INDEX_NAME || 'ai-cofounder-ideas')
}

// Создаем эмбеддинг для текста
export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })
    return response.data[0].embedding
  } catch (error) {
    console.error('Error creating embedding:', error)
    throw error
  }
}

// Сохраняем идею в векторную базу данных
export async function saveIdeaToVectorDB(idea: {
  id: string
  content: string
  projectId: string
  userId?: string
  metadata?: any
}) {
  try {
    const embedding = await createEmbedding(idea.content)
    const index = getIndex()
    
    await index.upsert([
      {
        id: idea.id,
        values: embedding,
        metadata: {
          content: idea.content,
          projectId: idea.projectId,
          userId: idea.userId,
          createdAt: new Date().toISOString(),
          ...idea.metadata
        }
      }
    ])
    
    console.log('Idea saved to vector database:', idea.id)
  } catch (error) {
    console.error('Error saving idea to vector database:', error)
    throw error
  }
}

// Ищем похожие идеи
export async function findSimilarIdeas(query: string, projectId?: string, limit = 5) {
  try {
    const queryEmbedding = await createEmbedding(query)
    const index = getIndex()
    
    const searchRequest: any = {
      vector: queryEmbedding,
      topK: limit,
      includeMetadata: true,
    }
    
    // Фильтруем по проекту, если указан
    if (projectId) {
      searchRequest.filter = { projectId: { $eq: projectId } }
    }
    
    const searchResponse = await index.query(searchRequest)
    
    return searchResponse.matches?.map(match => ({
      id: match.id,
      score: match.score,
      content: match.metadata?.content,
      projectId: match.metadata?.projectId,
      userId: match.metadata?.userId,
      createdAt: match.metadata?.createdAt,
      ...match.metadata
    })) || []
  } catch (error) {
    console.error('Error finding similar ideas:', error)
    return []
  }
}

// Получаем рекомендации на основе истории разговора
export async function getIdeaRecommendations(conversationHistory: any[], projectId?: string) {
  try {
    // Создаем контекст из последних сообщений
    const recentMessages = conversationHistory.slice(-5)
    const context = recentMessages
      .map(msg => msg.text)
      .join(' ')
    
    if (!context.trim()) {
      return []
    }
    
    // Ищем похожие идеи
    const similarIdeas = await findSimilarIdeas(context, projectId, 3)
    
    // Фильтруем и ранжируем результаты
    return similarIdeas
      .filter(idea => idea.score && idea.score > 0.7)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
  } catch (error) {
    console.error('Error getting idea recommendations:', error)
    return []
  }
}

// Удаляем идею из векторной базы данных
export async function deleteIdeaFromVectorDB(ideaId: string) {
  try {
    const index = getIndex()
    await index.deleteOne(ideaId)
    console.log('Idea deleted from vector database:', ideaId)
  } catch (error) {
    console.error('Error deleting idea from vector database:', error)
    throw error
  }
}
