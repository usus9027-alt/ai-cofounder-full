import { NextRequest, NextResponse } from 'next/server'
import { sendMessage } from '@/lib/api/chat'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await sendMessage(body)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
