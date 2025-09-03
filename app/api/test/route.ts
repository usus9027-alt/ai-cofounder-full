import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Проверяем переменные окружения
    const envCheck = {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
      PINECONE_API_KEY: process.env.PINECONE_API_KEY ? '✅ Set' : '❌ Missing',
      PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME ? '✅ Set' : '❌ Missing',
    }

    // Тестируем Supabase
    let supabaseTest = '❌ Not tested'
    try {
      const { createClient } = require('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      supabaseTest = '✅ Client created'
    } catch (error) {
      supabaseTest = `❌ Error: ${error.message}`
    }

    // Тестируем OpenAI
    let openaiTest = '❌ Not tested'
    try {
      const OpenAI = require('openai')
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
      openaiTest = '✅ Client created'
    } catch (error) {
      openaiTest = `❌ Error: ${error.message}`
    }

    return NextResponse.json({
      status: 'Environment Test',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      tests: {
        supabase: supabaseTest,
        openai: openaiTest
      }
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      message: error.message
    }, { status: 500 })
  }
}
