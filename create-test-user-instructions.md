# Создание тестового пользователя в Supabase

## Шаги для создания тестового пользователя:

### 1. Откройте Supabase Dashboard
- Перейдите на https://supabase.com/dashboard
- Войдите в свой аккаунт
- Выберите проект: `lcltztfilgnajpcazrmb`

### 2. Создайте пользователя
- Перейдите в раздел **Authentication** → **Users**
- Нажмите кнопку **"Add user"**
- Заполните поля:
  - **Email**: `test@example.com`
  - **Password**: `test123`
  - **Auto Confirm User**: ✅ **Включено** (важно!)
- Нажмите **"Create user"**

### 3. Проверьте создание
- Пользователь должен появиться в списке
- Статус должен быть "Confirmed"
- Email должен быть `test@example.com`

### 4. Альтернативный способ (через SQL)
Если у вас есть доступ к SQL Editor, выполните:

```sql
-- Создание пользователя через SQL (если нужно)
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    gen_random_uuid(),
    'test@example.com',
    crypt('test123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
);
```

## После создания пользователя:

1. **Выполните RLS политики** из файла `setup-rls-policies.sql`
2. **Протестируйте вход** на сайте: https://ai-cofounder-platform-2411.vercel.app
3. **Проверьте сохранение сообщений** - отправьте сообщение и обновите страницу

## Тестовые данные:
- **Email**: test@example.com
- **Password**: test123
- **Статус**: Подтвержден автоматически
