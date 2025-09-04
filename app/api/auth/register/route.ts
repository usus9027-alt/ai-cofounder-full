import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Создаем пользователя в Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name || email.split('@')[0]
        }
      }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Создаем профиль пользователя в таблице users
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: email,
            name: name || email.split('@')[0],
            created_at: new Date().toISOString()
          }
        ])

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        // Не возвращаем ошибку, так как пользователь уже создан в auth
      }
    }

    return NextResponse.json({ 
      success: true,
      user: authData.user,
      message: 'User created successfully'
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
