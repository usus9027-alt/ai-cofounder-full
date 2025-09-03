'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-serif text-gray-900 mb-6">
          Добро пожаловать
        </h1>
        <p className="text-lg font-light text-gray-500 mb-12">
          Войдите, чтобы сохранить свои идеи
        </p>
        
        <div className="space-y-4">
          {providers && Object.values(providers).map((provider: any) => (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id)}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-full text-sm font-light tracking-wide hover:border-gray-400 hover:text-gray-800 transition-all duration-200"
            >
              Войти через {provider.name}
            </button>
          ))}
        </div>
        
        <p className="text-xs text-gray-400 mt-8">
          Ваши данные защищены и не передаются третьим лицам
        </p>
      </div>
    </div>
  )
}
