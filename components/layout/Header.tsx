'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <i className="fas fa-robot text-2xl"></i>
            <h1 className="text-xl font-bold">AI Co-founder Platform</h1>
          </div>
          
          {session && (
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Привет, {session.user?.name || session.user?.email}!
              </span>
              <button
                onClick={() => signOut()}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm"
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
