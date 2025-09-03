'use client'

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">AI Co-founder Platform</h1>
        <p className="text-sm opacity-90">Полнофункциональная платформа для предпринимателей</p>
      </div>
      <div className="flex-1 flex">
        {/* Chat Panel - 1/3 экрана */}
        <div className="w-1/3 bg-white border-r p-4">
          <h2 className="text-lg font-semibold mb-4">AI Чат</h2>
          <div className="space-y-4">
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-sm text-gray-600">AI: Привет! Я ваш AI-кофаундер. Какую идею хотите развить?</p>
            </div>
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Введите ваше сообщение..."
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Отправить
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Panel - 2/3 экрана */}
        <div className="w-2/3 bg-white p-4">
          <h2 className="text-lg font-semibold mb-4">Canvas Доска</h2>
          <div className="border-2 border-dashed border-gray-300 h-full rounded flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">🎨 Интерактивная доска</p>
              <p className="text-sm">Здесь будут отображаться ваши идеи и проекты</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
