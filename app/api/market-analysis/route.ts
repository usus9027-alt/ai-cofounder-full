import { NextRequest, NextResponse } from 'next/server'
import { TwitterAnalyzer } from '@/lib/twitter'
import { getFallbackInsights } from '@/lib/fallback-data'
import { saveToVectorDB } from '@/lib/vector'

export async function POST(request: NextRequest) {
  try {
    const { idea, projectId } = await request.json()

    let insights

    try {
      // Попробовать Twitter API
      const twitter = new TwitterAnalyzer()
      insights = await twitter.analyzeMarketSentiment(idea)
      
      if (!insights || insights.problems.length === 0) {
        throw new Error('No Twitter data found')
      }
    } catch (error) {
      console.log('Falling back to database:', error)
      // Fallback на готовые данные
      insights = getFallbackInsights(idea)
    }

    // Сохранить в векторную БД
    await saveToVectorDB(projectId, insights.summary, {
      type: 'market_analysis',
      problems: insights.problems,
      source: insights.source
    })

    return NextResponse.json({
      success: true,
      insights,
      canvasObjectCreated: true
    })
  } catch (error) {
    console.error('Market analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze market' },
      { status: 500 }
    )
  }
}
