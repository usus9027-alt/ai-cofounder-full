'use client'

import { useState } from 'react'

interface AuthFormProps {
  onAuthSuccess: (user: any) => void
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const body = isLogin 
        ? { email, password }
        : { email, password, name }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        onAuthSuccess(data.user)
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-gray-900 mb-2">
            {isLogin ? 'Вход' : 'Регистрация'}
          </h1>
          <p className="text-lg font-light text-gray-500">
            {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                Имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-full text-sm font-light focus:outline-none focus:border-gray-400"
                placeholder="Ваше имя"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-full text-sm font-light focus:outline-none focus:border-gray-400"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-full text-sm font-light focus:outline-none focus:border-gray-400"
              placeholder="Пароль"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-full text-sm font-light tracking-wide hover:border-gray-400 hover:text-gray-800 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-light text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Есть аккаунт? Войти'}
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-light text-gray-700 mb-2">Тестовый аккаунт:</h3>
          <p className="text-xs text-gray-500">Email: test@example.com</p>
          <p className="text-xs text-gray-500">Пароль: test123</p>
        </div>
      </div>
    </div>
  )
}
