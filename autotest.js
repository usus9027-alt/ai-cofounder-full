const https = require('https');
const fs = require('fs');

console.log('🧪 AI Cofounder Platform - Auto Test');
console.log('=====================================');

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
          body: data
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
    hasBeginButton: content.includes('Begin'),
    hasAuthForm: content.includes('AuthForm') || content.includes('Вход') || content.includes('Регистрация'),
    hasCanvasBoard: content.includes('CanvasBoard') || content.includes('AI Canvas'),
    hasChatInterface: content.includes('AI Чат') || content.includes('Опишите вашу идею'),
    hasSupabaseIntegration: content.includes('supabase'),
    hasNextAuth: content.includes('next-auth'),
    isStaticVersion: content.includes('Ideas.') && content.includes('Simplified.'),
    isDynamicVersion: content.includes('useState') || content.includes('useEffect')
  };
  
  return analysis;
}

// Основная функция тестирования
async function runAutoTest() {
  try {
    console.log('📡 Fetching website content...');
    const result = await fetchWebsite('https://ai-cofounder-platform-2411.vercel.app/');
    
    console.log(`✅ Status Code: ${result.statusCode}`);
    console.log(`📅 Last Modified: ${result.headers['last-modified'] || 'Not available'}`);
    console.log(`🔄 Cache Control: ${result.headers['cache-control'] || 'Not available'}`);
    
    console.log('\n🔍 Analyzing content...');
    const analysis = analyzeContent(result.body);
    
    console.log('\n📊 Analysis Results:');
    console.log('===================');
    console.log(`❌ Has Begin Button: ${analysis.hasBeginButton ? 'YES' : 'NO'}`);
    console.log(`✅ Has Auth Form: ${analysis.hasAuthForm ? 'YES' : 'NO'}`);
    console.log(`✅ Has Canvas Board: ${analysis.hasCanvasBoard ? 'YES' : 'NO'}`);
    console.log(`✅ Has Chat Interface: ${analysis.hasChatInterface ? 'YES' : 'NO'}`);
    console.log(`✅ Has Supabase Integration: ${analysis.hasSupabaseIntegration ? 'YES' : 'NO'}`);
    console.log(`⚠️  Has NextAuth: ${analysis.hasNextAuth ? 'YES' : 'NO'}`);
    console.log(`📄 Is Static Version: ${analysis.isStaticVersion ? 'YES' : 'NO'}`);
    console.log(`⚡ Is Dynamic Version: ${analysis.isDynamicVersion ? 'YES' : 'NO'}`);
    
    console.log('\n🎯 Diagnosis:');
    console.log('=============');
    
    if (analysis.hasBeginButton && analysis.isStaticVersion) {
      console.log('🚨 PROBLEM: Site is still showing OLD static version!');
      console.log('   - Begin button is present');
      console.log('   - No authentication form');
      console.log('   - No dynamic React components');
      console.log('\n💡 Possible causes:');
      console.log('   1. Vercel cache not updated');
      console.log('   2. Wrong deployment branch');
      console.log('   3. Build failed silently');
      console.log('   4. Static files being served instead of Next.js app');
    } else if (analysis.hasAuthForm && analysis.hasCanvasBoard) {
      console.log('✅ SUCCESS: Site is showing NEW dynamic version!');
      console.log('   - Authentication form present');
      console.log('   - Canvas board integrated');
      console.log('   - Dynamic React components loaded');
    } else {
      console.log('⚠️  MIXED: Site shows partial updates');
      console.log('   - Some new features present');
      console.log('   - Some old features still visible');
    }
    
    // Сохраняем результат для анализа
    const report = {
      timestamp: new Date().toISOString(),
      url: 'https://ai-cofounder-platform-2411.vercel.app/',
      statusCode: result.statusCode,
      headers: result.headers,
      analysis: analysis,
      contentLength: result.body.length
    };
    
    fs.writeFileSync('autotest-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Report saved to: autotest-report.json');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Запускаем тест
runAutoTest();
