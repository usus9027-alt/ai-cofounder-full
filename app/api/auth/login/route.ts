import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Авторизуем пользователя
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 401 })
    }

    return NextResponse.json({ 
      success: true,
      user: authData.user,
      session: authData.session,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
