import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Authentication logging disabled - single user mode'
  })
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Authentication logging disabled - single user mode'
  })
}
