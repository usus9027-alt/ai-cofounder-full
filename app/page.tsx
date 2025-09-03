'use client'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          AI Co-founder Platform
        </h1>
        <p className="text-gray-600 mb-8">
          Платформа успешно развернута! 🎉
        </p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>✅ Сайт работает</p>
          <p>✅ Vercel развертывание успешно</p>
          <p>✅ Все компоненты загружены</p>
        </div>
      </div>
    </div>
  )
}
