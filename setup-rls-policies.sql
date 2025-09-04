-- Настройка RLS политик для AI Cofounder Platform
-- Выполните эти команды в Supabase Dashboard → SQL Editor

-- 1. Политики для таблицы messages
-- Пользователи могут читать только свои сообщения
CREATE POLICY "Users can read their own messages" ON messages
    FOR SELECT USING (auth.uid() = user_id);

-- Пользователи могут создавать сообщения только для себя
CREATE POLICY "Users can insert their own messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Пользователи могут обновлять только свои сообщения
CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Пользователи могут удалять только свои сообщения
CREATE POLICY "Users can delete their own messages" ON messages
    FOR DELETE USING (auth.uid() = user_id);

-- 2. Политики для таблицы canvas_objects
-- Пользователи могут читать только свои объекты canvas
CREATE POLICY "Users can read their own canvas objects" ON canvas_objects
    FOR SELECT USING (auth.uid() = user_id);

-- Пользователи могут создавать объекты canvas только для себя
CREATE POLICY "Users can insert their own canvas objects" ON canvas_objects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Пользователи могут обновлять только свои объекты canvas
CREATE POLICY "Users can update their own canvas objects" ON canvas_objects
    FOR UPDATE USING (auth.uid() = user_id);

-- Пользователи могут удалять только свои объекты canvas
CREATE POLICY "Users can delete their own canvas objects" ON canvas_objects
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Политики для таблицы projects
-- Пользователи могут читать только свои проекты
CREATE POLICY "Users can read their own projects" ON projects
    FOR SELECT USING (auth.uid() = owner_id);

-- Пользователи могут создавать проекты только для себя
CREATE POLICY "Users can insert their own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Пользователи могут обновлять только свои проекты
CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = owner_id);

-- Пользователи могут удалять только свои проекты
CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (auth.uid() = owner_id);

-- 4. Политики для таблицы users
-- Пользователи могут читать только свой профиль
CREATE POLICY "Users can read their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Пользователи могут создавать только свой профиль
CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Пользователи могут обновлять только свой профиль
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Пользователи могут удалять только свой профиль
CREATE POLICY "Users can delete their own profile" ON users
    FOR DELETE USING (auth.uid() = id);

-- Проверяем, что RLS включен на всех таблицах
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('messages', 'canvas_objects', 'projects', 'users');
