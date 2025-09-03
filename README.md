# AI Co-founder Platform - Full Version

Полнофункциональная платформа AI-кофаундера с реальными базами данных, AI и анализом рынка.

## 🚀 Возможности

- **Реальный AI чат** с OpenAI GPT-4
- **Векторная память** с Pinecone для контекста
- **Анализ рынка** через Twitter API + fallback данные
- **Интерактивная Canvas доска** с Fabric.js
- **База данных** с Supabase (PostgreSQL)
- **Аутентификация** с NextAuth.js
- **Автоматическое создание объектов** на Canvas

## 🛠 Технологический стек

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **База данных**: Supabase (PostgreSQL)
- **Векторная БД**: Pinecone
- **AI**: OpenAI GPT-4 + Embeddings
- **Анализ рынка**: TwitterAPI.io
- **Canvas**: Fabric.js
- **UI**: Tailwind CSS
- **Аутентификация**: NextAuth.js
- **Деплой**: Vercel

## 📋 Требования

- Node.js 18+
- API ключи:
  - OpenAI API Key
  - TwitterAPI.io Key
  - Supabase Project URL и Anon Key
  - Pinecone API Key

## 🚀 Быстрый старт

### 1. Клонирование и установка

```bash
cd ai-cofounder-full
npm install
```

### 2. Настройка переменных окружения

```bash
cp env.example .env
```

Заполните `.env` файл:

```env
# OpenAI API
OPENAI_API_KEY=sk-proj-your-openai-key

# Twitter API
TWITTER_API_KEY=your-twitter-api-key

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Pinecone Vector Database
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment

# NextAuth.js
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Настройка инфраструктуры

```bash
npm run setup
```

Этот скрипт автоматически:
- Создаст все таблицы в Supabase
- Настроит Pinecone индекс
- Создаст fallback данные

### 4. Запуск приложения

```bash
npm run dev
```

Откройте http://localhost:3000

## 📊 Структура проекта

```
ai-cofounder-full/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── globals.css        # Глобальные стили
│   ├── layout.tsx         # Корневой layout
│   ├── page.tsx           # Главная страница
│   └── providers.tsx      # React провайдеры
├── components/            # React компоненты
│   ├── canvas/           # Canvas компоненты
│   ├── chat/             # Чат компоненты
│   └── layout/           # Layout компоненты
├── hooks/                # React хуки
├── lib/                  # Библиотеки и утилиты
│   ├── api/              # API функции
│   ├── database.ts       # Supabase клиент
│   ├── vector.ts         # Pinecone клиент
│   ├── twitter.ts        # Twitter API клиент
│   └── fallback-data.ts  # Fallback данные
├── scripts/              # Скрипты настройки
└── data/                 # Данные (создается автоматически)
```

## 🔧 API Endpoints

- `POST /api/chat` - Отправка сообщения в чат
- `POST /api/market-analysis` - Анализ рынка

## 🎨 Canvas объекты

- **Problem** (красный) - Проблемы пользователей
- **Insight** (синий) - Инсайты из анализа
- **Persona** (зеленый) - Целевая аудитория
- **Solution** (фиолетовый) - Решения и MVP
- **Milestone** (желтый) - Этапы развития
- **Note** (серый) - Заметки

## 🚀 Деплой на Vercel

1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения в Vercel
3. Деплой автоматически запустится

```bash
npm run deploy
```

## 📈 Мониторинг

- **Логи**: Vercel Functions logs
- **База данных**: Supabase dashboard
- **Векторная БД**: Pinecone console
- **AI**: OpenAI usage dashboard

## 🔒 Безопасность

- API ключи хранятся в переменных окружения
- NextAuth.js для аутентификации
- HTTPS для всех соединений
- Валидация входных данных

## 🐛 Отладка

```bash
# Локальная разработка
npm run dev

# Проверка типов
npm run lint

# Сборка
npm run build
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте переменные окружения
2. Убедитесь, что все API ключи действительны
3. Проверьте логи в консоли браузера
4. Проверьте логи Vercel Functions

## 🎯 Roadmap

- [ ] Мультиязычность
- [ ] Экспорт Canvas в PDF
- [ ] Интеграция с другими AI моделями
- [ ] Расширенная аналитика
- [ ] Мобильное приложение
