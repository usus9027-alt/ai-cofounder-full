const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🔑 Testing API Keys and Configuration');
console.log('=====================================');

// Читаем переменные окружения из .env файла
let envVars = {};

try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    if (line.includes('=') && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      envVars[key.trim()] = value;
    }
  }
} catch (error) {
  console.log('❌ Could not read .env file:', error.message);
}

console.log('\n📋 Environment Variables Check:');
console.log('================================');

// Проверяем каждый ключ
const requiredKeys = [
  'OPENAI_API_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'PINECONE_API_KEY',
  'PINECONE_INDEX_NAME'
];

let allKeysPresent = true;

requiredKeys.forEach(key => {
  const value = envVars[key];
  const isPresent = value && value.length > 0;
  const isSecure = value && !value.includes('your_') && !value.includes('replace_');
  
  console.log(`${isPresent ? '✅' : '❌'} ${key}: ${isPresent ? 'Present' : 'Missing'}`);
  
  if (isPresent) {
    console.log(`   Length: ${value.length} characters`);
    console.log(`   Secure: ${isSecure ? 'Yes' : 'No (contains placeholder)'}`);
    console.log(`   Preview: ${value.substring(0, 10)}...`);
  }
  
  if (!isPresent || !isSecure) {
    allKeysPresent = false;
  }
  
  console.log('');
});

console.log('\n🧪 API Keys Validation:');
console.log('========================');

// Тестируем OpenAI API
async function testOpenAI() {
  if (!envVars.OPENAI_API_KEY) {
    console.log('❌ OpenAI API: No key provided');
    return false;
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${envVars.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ OpenAI API: Working');
      return true;
    } else {
      console.log(`❌ OpenAI API: Error ${response.status} - ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ OpenAI API: Error - ${error.message}`);
    return false;
  }
}

// Тестируем Supabase API
async function testSupabase() {
  if (!envVars.NEXT_PUBLIC_SUPABASE_URL || !envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('❌ Supabase API: Missing URL or Anon Key');
    return false;
  }
  
  try {
    const response = await fetch(`${envVars.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Supabase API: Working');
      return true;
    } else {
      console.log(`❌ Supabase API: Error ${response.status} - ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Supabase API: Error - ${error.message}`);
    return false;
  }
}

// Тестируем Pinecone API
async function testPinecone() {
  if (!envVars.PINECONE_API_KEY) {
    console.log('❌ Pinecone API: No key provided');
    return false;
  }
  
  try {
    const response = await fetch('https://api.pinecone.io/actions/whoami', {
      headers: {
        'Api-Key': envVars.PINECONE_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ Pinecone API: Working');
      return true;
    } else {
      console.log(`❌ Pinecone API: Error ${response.status} - ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Pinecone API: Error - ${error.message}`);
    return false;
  }
}

// Основная функция тестирования
async function runTests() {
  console.log('🔄 Testing API connections...\n');
  
  const openaiResult = await testOpenAI();
  const supabaseResult = await testSupabase();
  const pineconeResult = await testPinecone();
  
  console.log('\n📊 Test Results Summary:');
  console.log('=========================');
  console.log(`✅ OpenAI API: ${openaiResult ? 'Working' : 'Failed'}`);
  console.log(`✅ Supabase API: ${supabaseResult ? 'Working' : 'Failed'}`);
  console.log(`✅ Pinecone API: ${pineconeResult ? 'Working' : 'Failed'}`);
  
  const allAPIsWorking = openaiResult && supabaseResult && pineconeResult;
  
  console.log('\n🎯 Overall Status:');
  console.log('==================');
  if (allKeysPresent && allAPIsWorking) {
    console.log('✅ All API keys are present and working!');
    console.log('   The issue might be with Vercel deployment or caching.');
  } else if (allKeysPresent && !allAPIsWorking) {
    console.log('⚠️  API keys are present but some APIs are not working.');
    console.log('   Check the API key values and permissions.');
  } else {
    console.log('❌ Some API keys are missing or incorrect.');
    console.log('   Fix the .env file and redeploy.');
  }
  
  console.log('\n💡 Recommendations:');
  console.log('===================');
  if (!allKeysPresent) {
    console.log('1. Fix missing or incorrect API keys in .env file');
    console.log('2. Ensure all keys are properly set in Vercel environment variables');
  }
  if (!allAPIsWorking) {
    console.log('3. Check API key permissions and quotas');
    console.log('4. Verify API endpoints are accessible');
  }
  if (allKeysPresent && allAPIsWorking) {
    console.log('1. Check Vercel deployment logs for build errors');
    console.log('2. Try manual redeploy from Vercel dashboard');
    console.log('3. Clear Vercel cache and redeploy');
  }
}

// Запускаем тесты
runTests().catch(console.error);
