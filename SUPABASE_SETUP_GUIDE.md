# 🚀 Supabase Setup Guide

Полная инструкция по настройке Supabase для AI Co-founder Platform.

## 📋 Шаг 1: Создание проекта Supabase

1. **Перейдите на [supabase.com](https://supabase.com)**
2. **Нажмите "Start your project"**
3. **Войдите через GitHub** (рекомендуется)
4. **Создайте новый проект:**
   - **Name**: `ai-cofounder-platform`
   - **Database Password**: создайте надежный пароль
   - **Region**: выберите ближайший к вам
   - **Pricing Plan**: Free (достаточно для начала)

## 🔑 Шаг 2: Получение API ключей

1. **В панели Supabase** перейдите в **Settings** → **API**
2. **Скопируйте следующие значения:**
   - **Project URL** (например: `https://abcdefgh.supabase.co`)
   - **anon public** key (начинается с `eyJ...`)
   - **service_role** key (начинается с `eyJ...`)

## ⚙️ Шаг 3: Настройка переменных окружения

1. **Скопируйте `env.example` в `.env`:**
   ```bash
   cp env.example .env
   ```

2. **Заполните `.env` файл:**
   ```env
   # Supabase Database
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
       # OpenAI API
    OPENAI_API_KEY=your-openai-api-key-here
    
    # Twitter API
    TWITTER_API_KEY=your-twitter-api-key-here
   
   # Pinecone Vector Database
   PINECONE_API_KEY=your-pinecone-api-key
   PINECONE_ENVIRONMENT=your-pinecone-environment
   
   # NextAuth.js
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

## 🗄️ Шаг 4: Автоматическое создание таблиц

**Запустите скрипт настройки:**
```bash
npm run setup-db
```

**Этот скрипт автоматически создаст:**
- ✅ **4 таблицы** (users, projects, messages, canvas_objects)
- ✅ **Индексы** для оптимизации
- ✅ **Row Level Security (RLS)** для безопасности
- ✅ **Политики доступа** для изоляции данных пользователей
- ✅ **Триггеры** для автоматического обновления timestamps

## 🎯 Шаг 5: Проверка настройки

1. **В панели Supabase** перейдите в **Table Editor**
2. **Убедитесь, что созданы таблицы:**
   - `users`
   - `projects` 
   - `messages`
   - `canvas_objects`

3. **Проверьте политики безопасности** в **Authentication** → **Policies**

## 🚀 Шаг 6: Запуск приложения

```bash
npm run dev
```

**Откройте:** http://localhost:3000

## 🔧 Что создается автоматически:

### 📊 **Таблицы:**

#### **users**
```sql
- id (UUID, Primary Key)
- email (Text, Unique, Required)
- name (Text)
- created_at (Timestamp)
```

#### **projects**
```sql
- id (UUID, Primary Key)
- title (Text, Required)
- description (Text)
- owner_id (UUID, Foreign Key → users.id)
- current_phase (Integer, Default: 1)
- created_at (Timestamp)
```

#### **messages**
```sql
- id (UUID, Primary Key)
- project_id (UUID, Foreign Key → projects.id)
- content (Text, Required)
- role (Text, Enum: user/assistant, Required)
- created_at (Timestamp)
```

#### **canvas_objects**
```sql
- id (UUID, Primary Key)
- project_id (UUID, Foreign Key → projects.id)
- type (Text, Enum: problem/insight/persona/solution/milestone/note/image)
- position_x (Float)
- position_y (Float)
- width (Float)
- height (Float)
- content (JSONB)
- style (JSONB)
- created_by (Text, Enum: ai/user)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### 🔒 **Безопасность:**
- **Row Level Security (RLS)** включен на всех таблицах
- **Политики доступа** настроены для изоляции данных пользователей
- **Пользователи видят только свои данные**

### ⚡ **Производительность:**
- **Индексы** созданы для быстрого поиска
- **Foreign Key constraints** для целостности данных
- **Автоматические триггеры** для обновления timestamps

## 🎉 Готово!

Ваша AI Co-founder Platform теперь полностью настроена с Supabase!

### 🌟 **Преимущества Supabase:**
- ✅ **Автоматические API** - все таблицы доступны через REST API
- ✅ **Реальное время** - синхронизация данных в реальном времени
- ✅ **Встроенная аутентификация** - готовая система пользователей
- ✅ **Row Level Security** - безопасность на уровне строк
- ✅ **PostgreSQL** - мощная и надежная база данных
- ✅ **Бесплатный план** - 500MB, 50MB файлов, 50K операций/день

### 🔄 **Модернизация в будущем:**
Теперь я могу легко:
- Добавлять новые таблицы
- Создавать новые API endpoints
- Настраивать сложные запросы
- Управлять безопасностью
- Оптимизировать производительность

**Все без вашего участия!** 🚀
