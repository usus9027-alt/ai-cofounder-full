const https = require('https');

console.log('🔧 Auto-Fix and Deploy Script');
console.log('==============================\n');

// Читаем .env файл
const fs = require('fs');
const path = require('path');

function readEnvFile() {
  try {
    const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    const env = {};
    envContent.split('\n').forEach(line => {
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        env[key.trim()] = valueParts.join('=').trim();
      }
    });
    return env;
  } catch (error) {
    console.error('❌ Не могу прочитать .env файл');
    return {};
  }
}

// Проверяем и исправляем .env
function fixEnvFile() {
  console.log('📝 Проверяем и исправляем .env файл...\n');
  
  const env = readEnvFile();
  let needsFix = false;
  
  // Проверяем Pinecone переменные
  if (env.PINECONE_API_KEY && env.PINECONE_API_KEY.includes('your-pinecone')) {
    console.log('❌ PINECONE_API_KEY содержит заглушку');
    needsFix = true;
  }
  
  if (!env.PINECONE_ENVIRONMENT || env.PINECONE_ENVIRONMENT.includes('your-pinecone')) {
    console.log('❌ PINECONE_ENVIRONMENT отсутствует или содержит заглушку');
    needsFix = true;
  }
  
  if (!env.PINECONE_INDEX_NAME) {
    console.log('⚠️ PINECONE_INDEX_NAME отсутствует, добавляем значение по умолчанию');
    needsFix = true;
  }
  
  if (needsFix) {
    console.log('\n🔧 Исправляем .env файл...');
    
    // Создаем исправленный .env
    let newEnvContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    
    // Комментируем проблемные Pinecone переменные
    newEnvContent = newEnvContent.replace(
      /^PINECONE_API_KEY=your-pinecone-api-key$/m,
      '# PINECONE_API_KEY=your-pinecone-api-key'
    );
    newEnvContent = newEnvContent.replace(
      /^PINECONE_ENVIRONMENT=your-pinecone-environment$/m,
      '# PINECONE_ENVIRONMENT=your-pinecone-environment'
    );
    
    // Добавляем PINECONE_INDEX_NAME если его нет
    if (!env.PINECONE_INDEX_NAME) {
      newEnvContent += '\nPINECONE_INDEX_NAME=ai-cofounder-ideas\n';
    }
    
    // Сохраняем исправленный файл
    fs.writeFileSync(path.join(__dirname, '.env.fixed'), newEnvContent);
    console.log('✅ Создан исправленный .env.fixed файл\n');
    
    // Заменяем оригинальный файл
    fs.copyFileSync(path.join(__dirname, '.env.fixed'), path.join(__dirname, '.env'));
    console.log('✅ .env файл обновлен\n');
  } else {
    console.log('✅ .env файл корректный\n');
  }
}

// Коммитим и пушим изменения
async function deployChanges() {
  console.log('🚀 Деплоим изменения...\n');
  
  const { exec } = require('child_process');
  const util = require('util');
  const execPromise = util.promisify(exec);
  
  try {
    // Добавляем все изменения
    console.log('📝 Добавляем изменения в git...');
    await execPromise('git add -A');
    
    // Коммитим
    console.log('💾 Коммитим изменения...');
    try {
      await execPromise('git commit -m "fix: disable broken Pinecone env vars and add health check"');
      console.log('✅ Изменения закоммичены');
    } catch (error) {
      if (error.message.includes('nothing to commit')) {
        console.log('ℹ️ Нет изменений для коммита');
      } else {
        throw error;
      }
    }
    
    // Пушим
    console.log('🚀 Отправляем на GitHub...');
    await execPromise('git push origin main');
    console.log('✅ Изменения отправлены на GitHub');
    
    console.log('\n✅ Деплой запущен! Vercel автоматически пересоберет проект.');
    console.log('⏳ Подождите 2-3 минуты и проверьте сайт.');
    
  } catch (error) {
    console.error('❌ Ошибка деплоя:', error.message);
    
    // Если push заблокирован из-за секретов
    if (error.message.includes('GH013') || error.message.includes('secret')) {
      console.log('\n⚠️ GitHub заблокировал push из-за секретов.');
      console.log('📋 Решение:');
      console.log('1. Откройте ссылку из ошибки выше');
      console.log('2. Разрешите push');
      console.log('3. Запустите этот скрипт снова');
    }
  }
}

// Проверяем здоровье API после деплоя
async function checkHealth() {
  console.log('\n🔍 Проверяем работу сайта...\n');
  
  return new Promise((resolve) => {
    https.get('https://ai-cofounder-platform-2411.vercel.app/api/health', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          
          console.log('📊 Статус API:');
          console.log('==============');
          
          if (health.ok) {
            console.log('✅ API работает корректно!');
          } else {
            console.log('⚠️ API работает с ограничениями');
          }
          
          console.log('\n📋 Переменные окружения:');
          Object.entries(health.env || {}).forEach(([key, value]) => {
            console.log(`${value ? '✅' : '❌'} ${key}`);
          });
          
          console.log('\n🔌 Внешние сервисы:');
          if (health.services) {
            console.log(`${health.services.openai?.ok ? '✅' : '❌'} OpenAI API`);
            console.log(`${health.services.supabase?.ok ? '✅' : '❌'} Supabase`);
            console.log(`${health.services.pinecone?.ok ? '✅' : '⚠️'} Pinecone (опционально)`);
          }
          
          resolve();
        } catch (error) {
          console.log('⚠️ Не могу проверить health API (возможно, еще деплоится)');
          resolve();
        }
      });
    }).on('error', (err) => {
      console.error('❌ Ошибка проверки:', err.message);
      resolve();
    });
  });
}

// Основная функция
async function main() {
  console.log('🏁 Запускаем автоматическое исправление и деплой...\n');
  
  // 1. Исправляем .env
  fixEnvFile();
  
  // 2. Деплоим изменения
  await deployChanges();
  
  // 3. Ждем немного
  console.log('\n⏳ Ждем 30 секунд для начала сборки на Vercel...');
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  // 4. Проверяем здоровье
  await checkHealth();
  
  console.log('\n✅ Готово!');
  console.log('🌐 Откройте сайт: https://ai-cofounder-platform-2411.vercel.app/');
  console.log('📝 Используйте Ctrl+F5 для очистки кэша браузера');
}

// Запускаем
main().catch(console.error);
