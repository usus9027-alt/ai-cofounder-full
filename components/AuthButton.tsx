'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="px-4 py-2 text-sm font-light text-gray-400">
        Загрузка...
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-3">
        <div className="text-sm font-light text-gray-600">
          Привет, {session.user?.name || session.user?.email}
        </div>
        <button
          onClick={() => signOut()}
          className="px-3 py-1 text-xs font-light text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
        >
          Выйти
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => signIn('google')}
        className="px-3 py-1 text-xs font-light text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
      >
        Google
      </button>
      <button
        onClick={() => signIn('github')}
        className="px-3 py-1 text-xs font-light text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
      >
        GitHub
      </button>
    </div>
  )
}
