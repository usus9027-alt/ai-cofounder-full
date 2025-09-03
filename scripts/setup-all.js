const { setupSupabase } = require('./setup-supabase');
const { setupPinecone } = require('./setup-pinecone');
const { setupFallbackData } = require('./setup-fallback-data');

async function setupAll() {
  console.log('🚀 AI Co-founder Platform - Full Setup');
  console.log('=====================================');
  
  try {
    // 1. Настройка базы данных
    console.log('\n📊 Step 1: Setting up Supabase database...');
    await setupSupabase();
    
    // 2. Настройка векторной базы данных
    console.log('\n🧠 Step 2: Setting up Pinecone vector database...');
    await setupPinecone();
    
    // 3. Настройка fallback данных
    console.log('\n📚 Step 3: Setting up fallback market insights...');
    await setupFallbackData();
    
    console.log('\n🎉 All setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Copy env.example to .env and fill in your API keys');
    console.log('2. Run: npm install');
    console.log('3. Run: npm run dev');
    console.log('4. Open: http://localhost:3000');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Запуск скрипта
if (require.main === module) {
  setupAll();
}

module.exports = { setupAll };
