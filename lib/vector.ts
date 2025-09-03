import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

let pinecone: Pinecone | null = null

async function getPineconeClient() {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || '',
    })
  }
  return pinecone
}

export async function saveToVectorDB(projectId: string, content: string, metadata: any) {
  try {
    const client = await getPineconeClient()
    const index = client.index('ai-cofounder-memory')

    // Генерируем embedding
    const embedding = await generateEmbedding(content)

    // Сохраняем в Pinecone
    await index.upsert([{
      id: `${projectId}-${Date.now()}`,
      values: embedding,
      metadata: {
        projectId,
        content,
        ...metadata,
        timestamp: new Date().toISOString()
      }
    }])

    console.log('Saved to vector DB:', content.substring(0, 50))
  } catch (error) {
    console.error('Error saving to vector DB:', error)
  }
}

export async function searchVectorDB(projectId: string, query: string, topK = 5) {
  try {
    const client = await getPineconeClient()
    const index = client.index('ai-cofounder-memory')

    // Генерируем embedding для запроса
    const queryEmbedding = await generateEmbedding(query)

    // Ищем похожие векторы
    const results = await index.query({
      vector: queryEmbedding,
      topK,
      filter: {
        projectId: { $eq: projectId }
      },
      includeMetadata: true
    })

    return results.matches?.map(match => ({
      content: match.metadata?.content,
      score: match.score,
      metadata: match.metadata
    })) || []
  } catch (error) {
    console.error('Error searching vector DB:', error)
    return []
  }
}

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    // Возвращаем нулевой вектор в случае ошибки
    return new Array(1536).fill(0)
  }
}

export async function ensureVectorIndex() {
  try {
    const client = await getPineconeClient()
    
    // Проверяем, существует ли индекс
    const indexes = await client.listIndexes()
    const indexExists = indexes.indexes?.some(index => index.name === 'ai-cofounder-memory')

    if (!indexExists) {
      // Создаем индекс
      await client.createIndex({
        name: 'ai-cofounder-memory',
        dimension: 1536, // OpenAI ada-002 embedding dimension
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      })

      console.log('Created Pinecone index: ai-cofounder-memory')
    } else {
      console.log('Pinecone index already exists: ai-cofounder-memory')
    }
  } catch (error) {
    console.error('Error ensuring vector index:', error)
  }
}
