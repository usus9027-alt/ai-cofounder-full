// Скрипт для редеплоя через Vercel API
// Нужен Vercel Token: https://vercel.com/account/tokens

const VERCEL_TOKEN = 'YOUR_VERCEL_TOKEN'; // Замените на ваш токен
const PROJECT_ID = 'ai-cofounder-platform-2411'; // Ваш проект

async function redeploy() {
  console.log('🚀 Запускаем редеплой с очисткой кэша...');
  
  try {
    // 1. Получаем последний деплой
    const deploymentsRes = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${VERCEL_TOKEN}`,
        }
      }
    );
    
    const deployments = await deploymentsRes.json();
    
    if (!deployments.deployments || deployments.deployments.length === 0) {
      console.error('❌ Не найдены деплойменты');
      return;
    }
    
    const lastDeployment = deployments.deployments[0];
    console.log(`📦 Последний деплой: ${lastDeployment.url}`);
    
    // 2. Запускаем редеплой с очисткой кэша
    const redeployRes = await fetch(
      `https://api.vercel.com/v13/deployments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: PROJECT_ID,
          gitSource: {
            ref: lastDeployment.meta?.githubCommitRef || 'main',
            repoId: lastDeployment.meta?.githubRepoId,
            type: 'github',
          },
          target: 'production',
          // Форсируем пересборку
          buildCache: false,
        })
      }
    );
    
    if (!redeployRes.ok) {
      const error = await redeployRes.text();
      console.error('❌ Ошибка редеплоя:', error);
      return;
    }
    
    const newDeployment = await redeployRes.json();
    console.log('✅ Редеплой запущен!');
    console.log(`🔗 URL: https://${newDeployment.url}`);
    console.log(`📊 Статус: ${newDeployment.readyState}`);
    console.log('⏳ Подождите 2-3 минуты для завершения...');
    
    // 3. Проверяем статус каждые 10 секунд
    let checkCount = 0;
    const checkInterval = setInterval(async () => {
      checkCount++;
      
      const statusRes = await fetch(
        `https://api.vercel.com/v13/deployments/${newDeployment.id}`,
        {
          headers: {
            'Authorization': `Bearer ${VERCEL_TOKEN}`,
          }
        }
      );
      
      const status = await statusRes.json();
      console.log(`📊 Статус: ${status.readyState}`);
      
      if (status.readyState === 'READY') {
        console.log('✅ Деплой завершен успешно!');
        console.log(`🌐 Сайт: https://${status.url}`);
        clearInterval(checkInterval);
      } else if (status.readyState === 'ERROR' || status.readyState === 'CANCELED') {
        console.error('❌ Деплой завершился с ошибкой');
        clearInterval(checkInterval);
      } else if (checkCount > 30) { // 5 минут максимум
        console.log('⏱️ Превышено время ожидания');
        clearInterval(checkInterval);
      }
    }, 10000);
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

// Инструкция
console.log('📋 Инструкция:');
console.log('1. Получите Vercel Token: https://vercel.com/account/tokens');
console.log('2. Замените YOUR_VERCEL_TOKEN на ваш токен в этом файле');
console.log('3. Запустите: node vercel-redeploy.js');
console.log('');

// Если токен установлен, запускаем
if (VERCEL_TOKEN !== 'YOUR_VERCEL_TOKEN') {
  redeploy();
} else {
  console.log('⚠️  Сначала установите VERCEL_TOKEN в файле!');
}
