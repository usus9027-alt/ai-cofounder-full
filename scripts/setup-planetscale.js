const { connect } = require('@planetscale/database');
require('dotenv').config();

const config = {
  url: process.env.PLANETSCALE_DATABASE_URL,
};

const conn = connect(config);

async function setupDatabase() {
  console.log('🔧 Setting up PlanetScale database...');
  
  try {
    // Создание таблицы пользователей
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Создание таблицы проектов
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        owner_id VARCHAR(255),
        current_phase INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id)
      )
    `);
    console.log('✅ Projects table created');

    // Создание таблицы сообщений
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(255) PRIMARY KEY,
        project_id VARCHAR(255),
        content TEXT NOT NULL,
        role ENUM('user', 'assistant') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id)
      )
    `);
    console.log('✅ Messages table created');

    // Создание таблицы объектов Canvas
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS canvas_objects (
        id VARCHAR(255) PRIMARY KEY,
        project_id VARCHAR(255),
        type ENUM('problem', 'insight', 'persona', 'solution', 'milestone', 'note', 'image'),
        position_x FLOAT,
        position_y FLOAT,
        width FLOAT,
        height FLOAT,
        content JSON,
        style JSON,
        created_by ENUM('ai', 'user'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id)
      )
    `);
    console.log('✅ Canvas objects table created');

    // Создание индексов для оптимизации
    await conn.execute(`
      CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
    `);
    await conn.execute(`
      CREATE INDEX IF NOT EXISTS idx_canvas_objects_project_id ON canvas_objects(project_id);
    `);
    await conn.execute(`
      CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
    `);
    console.log('✅ Database indexes created');

    console.log('🎉 PlanetScale database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  }
}

// Запуск скрипта
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('Database setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
