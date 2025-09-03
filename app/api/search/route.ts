import { NextRequest, NextResponse } from 'next/server'
import { findSimilarIdeas } from '../../../lib/pinecone'

export async function POST(request: NextRequest) {
  try {
    const { query, projectId, limit = 5 } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const similarIdeas = await findSimilarIdeas(query, projectId, limit)

    return NextResponse.json({ 
      ideas: similarIdeas,
      success: true 
    })

  } catch (error) {
    console.error('Search API Error:', error)
    
    return NextResponse.json({ 
      ideas: [],
      success: false,
      error: 'Search temporarily unavailable'
    })
  }
}
