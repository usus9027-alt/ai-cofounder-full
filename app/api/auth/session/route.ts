import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    user: null,
    session: null,
    message: 'Authentication disabled - single user mode'
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    user: null,
    session: null,
    message: 'Authentication disabled - single user mode'
  })
}
