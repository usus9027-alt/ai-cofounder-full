import axios from 'axios'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class TwitterAnalyzer {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.TWITTER_API_KEY || ''
    this.baseUrl = 'https://api.twitterapi.io/v1'
  }

  async searchTweets(queries: string[], maxResults = 100) {
    const allTweets = []
    
    for (const query of queries) {
      try {
        const response = await axios.get(`${this.baseUrl}/search`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          params: {
            q: query,
            count: Math.floor(maxResults / queries.length),
            result_type: 'recent',
            lang: 'en'
          }
        })
        
        allTweets.push(...response.data.statuses)
      } catch (error) {
        console.error(`Error searching for "${query}":`, error)
      }
    }
    
    return allTweets
  }

  async analyzeMarketSentiment(idea: string) {
    // Генерация поисковых запросов
    const queries = await this.generateSearchQueries(idea)
    
    // Сбор твитов
    const tweets = await this.searchTweets(queries)
    
    // Анализ через OpenAI
    return this.analyzeTweetsWithAI(tweets, idea)
  }

  async generateSearchQueries(idea: string) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: `Ты исследователь рынка. Сгенерируй 7-10 поисковых запросов для Twitter, чтобы найти людей, жалующихся на проблемы, связанные с идеей: "${idea}".
        
        ПРАВИЛА:
        - НЕ используй слова "приложение", "сервис", "платформа"
        - Фокусируйся на проблемах и жалобах пользователей
        - Используй разговорный язык
        - Включи эмоциональные слова: "hate", "frustrated", "annoying"
        
        Верни JSON массив строк.`
      }],
      temperature: 0.7
    })

    try {
      return JSON.parse(response.choices[0].message.content || '[]')
    } catch (error) {
      console.error('Error parsing search queries:', error)
      return [`${idea} problems`, `${idea} issues`, `${idea} complaints`]
    }
  }

  async analyzeTweetsWithAI(tweets: any[], idea: string) {
    if (tweets.length === 0) return null

    const tweetTexts = tweets.map(t => t.text).join('\n---\n')

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: `Проанализируй эти твиты и найди ключевые проблемы пользователей, связанные с идеей: "${idea}".
        
        Верни JSON:
        {
          "summary": "Краткое резюме главных проблем",
          "problems": ["проблема 1", "проблема 2", ...],
          "userQuotes": ["цитата 1", "цитата 2", ...],
          "sentiment": "positive|negative|neutral",
          "confidence": 0.8,
          "source": "Twitter Analysis"
        }`
      }, {
        role: 'user',
        content: tweetTexts
      }],
      temperature: 0.3
    })

    try {
      return JSON.parse(response.choices[0].message.content || '{}')
    } catch (error) {
      console.error('Error parsing AI analysis:', error)
      return {
        summary: `Анализ рынка для "${idea}"`,
        problems: ['Проблема 1', 'Проблема 2'],
        userQuotes: ['Цитата 1', 'Цитата 2'],
        sentiment: 'neutral',
        confidence: 0.5,
        source: 'Twitter Analysis (Fallback)'
      }
    }
  }
}
