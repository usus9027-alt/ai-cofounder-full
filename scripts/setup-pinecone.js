const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

async function setupPinecone() {
  console.log('🔧 Setting up Pinecone vector database...');
  
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // Проверяем, существует ли индекс
    const indexes = await pinecone.listIndexes();
    const indexExists = indexes.indexes?.some(index => index.name === 'ai-cofounder-memory');

    if (!indexExists) {
      // Создаем индекс
      await pinecone.createIndex({
        name: 'ai-cofounder-memory',
        dimension: 1536, // OpenAI ada-002 embedding dimension
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });

      console.log('✅ Created Pinecone index: ai-cofounder-memory');
      console.log('⏳ Index is being created, this may take a few minutes...');
    } else {
      console.log('✅ Pinecone index already exists: ai-cofounder-memory');
    }

    console.log('🎉 Pinecone setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up Pinecone:', error);
    throw error;
  }
}

// Запуск скрипта
if (require.main === module) {
  setupPinecone()
    .then(() => {
      console.log('Pinecone setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Pinecone setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupPinecone };
