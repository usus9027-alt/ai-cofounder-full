const https = require('https');

console.log('🔍 Checking Platform Limits and Status');
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
          body: data,
          contentLength: data.length
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Функция для анализа лимитов
function analyzeLimits(content, headers) {
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
    cacheControl: headers['cache-control'] || 'Not set',
    lastModified: headers['last-modified'] || 'Not set',
    etag: headers['etag'] || 'Not set',
    
    // Проверяем размер контента
    contentLength: content.length,
    isMinimalContent: content.length < 1000
  };
  
  return analysis;
}

// Основная функция проверки
async function checkLimitsAndStatus() {
  try {
    console.log('📡 Fetching website content...');
    const result = await fetchWebsite('https://ai-cofounder-platform-2411.vercel.app/');
    
    console.log(`✅ Status Code: ${result.statusCode}`);
    console.log(`📏 Content Length: ${result.contentLength} bytes`);
    console.log(`🔄 Cache Control: ${result.headers['cache-control'] || 'Not set'}`);
    console.log(`📅 Last Modified: ${result.headers['last-modified'] || 'Not set'}`);
    console.log(`🏷️  ETag: ${result.headers['etag'] || 'Not set'}`);
    
    console.log('\n🔍 Analyzing content and limits...');
    const analysis = analyzeLimits(result.body, result.headers);
    
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
    console.log(`🏷️  ETag: ${analysis.etag}`);
    console.log(`📏 Content Length: ${analysis.contentLength} bytes`);
    
    console.log('\n🎯 Diagnosis:');
    console.log('=============');
    
    if (analysis.hasLimitErrors) {
      console.log('🚨 LIMIT ISSUE: Site shows limit/quota errors');
      console.log('   - Check Vercel usage limits');
      console.log('   - Check Supabase usage limits');
      console.log('   - Check OpenAI API limits');
    } else if (analysis.hasDatabaseErrors) {
      console.log('🚨 DATABASE ISSUE: Database connection problems');
      console.log('   - Check Supabase connection');
      console.log('   - Check RLS policies');
      console.log('   - Check environment variables');
    } else if (analysis.hasAuthErrors) {
      console.log('🚨 AUTH ISSUE: Authentication problems');
      console.log('   - Check Supabase Auth settings');
      console.log('   - Check API endpoints');
    } else if (analysis.isMinimalContent) {
      console.log('🚨 CONTENT ISSUE: Site returns minimal content');
      console.log('   - Possible build failure');
      console.log('   - Possible serverless function timeout');
    } else if (analysis.hasBeginButton && analysis.isStaticVersion) {
      console.log('🚨 DEPLOYMENT ISSUE: Still showing old static version');
      console.log('   - Vercel cache not updated');
      console.log('   - Build failed silently');
      console.log('   - Wrong deployment branch');
    } else if (analysis.hasAuthForm && analysis.hasCanvasBoard) {
      console.log('✅ SUCCESS: Site shows new dynamic version!');
    } else {
      console.log('⚠️  MIXED: Site shows partial updates');
    }
    
    // Проверяем возможные лимиты
    console.log('\n📋 Possible Limits to Check:');
    console.log('============================');
    console.log('1. Vercel Free Tier:');
    console.log('   - 100GB bandwidth/month');
    console.log('   - 100 serverless function executions/day');
    console.log('   - 1 concurrent build');
    console.log('');
    console.log('2. Supabase Free Tier:');
    console.log('   - 500MB database');
    console.log('   - 50,000 monthly active users');
    console.log('   - 2GB bandwidth');
    console.log('');
    console.log('3. OpenAI API:');
    console.log('   - Usage-based pricing');
    console.log('   - Rate limits per minute');
    console.log('   - Token limits per request');
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
}

// Запускаем проверку
checkLimitsAndStatus();
