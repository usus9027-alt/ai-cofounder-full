import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    error: 'Authentication disabled',
    message: 'This platform runs in single-user mode without authentication'
  }, { status: 404 })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    error: 'Authentication disabled',
    message: 'This platform runs in single-user mode without authentication'
  }, { status: 404 })
}
