// Тест переменных окружения
console.log('🔍 Testing Environment Variables:');
console.log('================================');

// Проверяем основные переменные
const envVars = [
  'OPENAI_API_KEY',
  'NEXT_PUBLIC_SUPABASE_URL', 
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'PINECONE_API_KEY',
  'PINECONE_INDEX_NAME'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('\n🧪 Testing API Connections:');
console.log('===========================');

// Тест Supabase
try {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created successfully');
  } else {
    console.log('❌ Supabase credentials missing');
  }
} catch (error) {
  console.log('❌ Supabase error:', error.message);
}

// Тест OpenAI
try {
  const OpenAI = require('openai');
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('✅ OpenAI client created successfully');
} catch (error) {
  console.log('❌ OpenAI error:', error.message);
}

// Тест Pinecone
try {
  const { Pinecone } = require('@pinecone-database/pinecone');
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
  });
  console.log('✅ Pinecone client created successfully');
} catch (error) {
  console.log('❌ Pinecone error:', error.message);
}

console.log('\n🎯 Environment test completed!');
