const https = require('https');

console.log('🔍 Debugging Site Content');
console.log('=========================');

// Функция для получения содержимого сайта
function fetchWebsite(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          contentLength: data.length
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Функция для анализа содержимого
function analyzeContent(content) {
  const analysis = {
    // Проверяем версию сайта
    hasBeginButton: content.includes('Begin'),
    hasAuthForm: content.includes('AuthForm') || content.includes('Вход') || content.includes('Регистрация'),
    hasCanvasBoard: content.includes('CanvasBoard') || content.includes('AI Canvas'),
    isStaticVersion: content.includes('Ideas.') && content.includes('Simplified.'),
    isDynamicVersion: content.includes('useState') || content.includes('useEffect'),
    
    // Проверяем ошибки
    hasErrors: content.includes('Error') || content.includes('error') || content.includes('404'),
    hasDatabaseErrors: content.includes('database') && content.includes('error'),
    hasAuthErrors: content.includes('auth') && content.includes('error'),
    hasLimitErrors: content.includes('limit') || content.includes('quota') || content.includes('exceeded'),
    
    // Проверяем кэширование
    cacheControl: content.includes('cache-control') ? 'Found' : 'Not found',
    lastModified: content.includes('last-modified') ? 'Found' : 'Not found',
    
    // Проверяем размер контента
    contentLength: content.length,
    isMinimalContent: content.length < 1000
  };
  
  return analysis;
}

// Основная функция отладки
async function debugSiteContent() {
  try {
    console.log('📡 Fetching website content...');
    const result = await fetchWebsite('https://ai-cofounder-platform-2411.vercel.app/');
    
    console.log(`✅ Status Code: ${result.statusCode}`);
    console.log(`📏 Content Length: ${result.contentLength} bytes`);
    console.log(`🔄 Cache Control: ${result.headers['cache-control'] || 'Not set'}`);
    console.log(`📅 Last Modified: ${result.headers['last-modified'] || 'Not set'}`);
    console.log(`🏷️  ETag: ${result.headers['etag'] || 'Not set'}`);
    
    console.log('\n🔍 Analyzing content...');
    const analysis = analyzeContent(result.body);
    
    console.log('\n📊 Content Analysis:');
    console.log('===================');
    console.log(`❌ Has Begin Button: ${analysis.hasBeginButton ? 'YES' : 'NO'}`);
    console.log(`✅ Has Auth Form: ${analysis.hasAuthForm ? 'YES' : 'NO'}`);
    console.log(`✅ Has Canvas Board: ${analysis.hasCanvasBoard ? 'YES' : 'NO'}`);
    console.log(`📄 Is Static Version: ${analysis.isStaticVersion ? 'YES' : 'NO'}`);
    console.log(`⚡ Is Dynamic Version: ${analysis.isDynamicVersion ? 'YES' : 'NO'}`);
    
    console.log('\n🚨 Error Analysis:');
    console.log('==================');
    console.log(`❌ Has General Errors: ${analysis.hasErrors ? 'YES' : 'NO'}`);
    console.log(`❌ Has Database Errors: ${analysis.hasDatabaseErrors ? 'YES' : 'NO'}`);
    console.log(`❌ Has Auth Errors: ${analysis.hasAuthErrors ? 'YES' : 'NO'}`);
    console.log(`❌ Has Limit Errors: ${analysis.hasLimitErrors ? 'YES' : 'NO'}`);
    
    console.log('\n💾 Caching Analysis:');
    console.log('====================');
    console.log(`🔄 Cache Control: ${analysis.cacheControl}`);
    console.log(`📅 Last Modified: ${analysis.lastModified}`);
    console.log(`📏 Content Length: ${analysis.contentLength} bytes`);
    
    // Показываем первые 500 символов содержимого
    console.log('\n📄 First 500 characters of content:');
    console.log('===================================');
    console.log(result.body.substring(0, 500));
    console.log('...');
    
    // Показываем последние 500 символов содержимого
    console.log('\n📄 Last 500 characters of content:');
    console.log('==================================');
    console.log('...');
    console.log(result.body.substring(result.body.length - 500));
    
    console.log('\n🎯 Diagnosis:');
    console.log('=============');
    
    if (analysis.hasBeginButton && analysis.isStaticVersion) {
      console.log('🚨 DEPLOYMENT ISSUE: Still showing old static version!');
      console.log('   - Begin button is present');
      console.log('   - No authentication form');
      console.log('   - No dynamic React components');
      console.log('\n💡 Possible causes:');
      console.log('   1. Vercel cache not updated');
      console.log('   2. Build failed silently');
      console.log('   3. Wrong deployment branch');
      console.log('   4. Static files being served instead of Next.js app');
    } else if (analysis.hasAuthForm && analysis.hasCanvasBoard) {
      console.log('✅ SUCCESS: Site shows new dynamic version!');
    } else {
      console.log('⚠️  MIXED: Site shows partial updates');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

// Запускаем отладку
debugSiteContent();
