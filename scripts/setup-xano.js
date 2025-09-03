const fs = require('fs');
const path = require('path');

// Схема таблиц для Xano
const xanoSchema = {
  users: {
    fields: [
      { name: 'id', type: 'text', primary: true },
      { name: 'email', type: 'text', unique: true, required: true },
      { name: 'name', type: 'text' },
      { name: 'created_at', type: 'datetime', default: 'now()' }
    ]
  },
  projects: {
    fields: [
      { name: 'id', type: 'text', primary: true },
      { name: 'title', type: 'text', required: true },
      { name: 'description', type: 'text' },
      { name: 'owner_id', type: 'text', foreign_key: 'users.id' },
      { name: 'current_phase', type: 'number', default: 1 },
      { name: 'created_at', type: 'datetime', default: 'now()' }
    ]
  },
  messages: {
    fields: [
      { name: 'id', type: 'text', primary: true },
      { name: 'project_id', type: 'text', foreign_key: 'projects.id' },
      { name: 'content', type: 'text', required: true },
      { name: 'role', type: 'text', enum: ['user', 'assistant'], required: true },
      { name: 'created_at', type: 'datetime', default: 'now()' }
    ]
  },
  canvas_objects: {
    fields: [
      { name: 'id', type: 'text', primary: true },
      { name: 'project_id', type: 'text', foreign_key: 'projects.id' },
      { name: 'type', type: 'text', enum: ['problem', 'insight', 'persona', 'solution', 'milestone', 'note', 'image'] },
      { name: 'position_x', type: 'number' },
      { name: 'position_y', type: 'number' },
      { name: 'width', type: 'number' },
      { name: 'height', type: 'number' },
      { name: 'content', type: 'json' },
      { name: 'style', type: 'json' },
      { name: 'created_by', type: 'text', enum: ['ai', 'user'] },
      { name: 'created_at', type: 'datetime', default: 'now()' },
      { name: 'updated_at', type: 'datetime', default: 'now()' }
    ]
  }
};

async function setupXano() {
  console.log('🔧 Setting up Xano database schema...');
  
  try {
    const schemaDir = path.join(__dirname, '..', 'xano-schema');
    
    // Создаем папку для схемы если её нет
    if (!fs.existsSync(schemaDir)) {
      fs.mkdirSync(schemaDir, { recursive: true });
    }
    
    // Сохраняем схему в JSON файл
    const schemaPath = path.join(schemaDir, 'database-schema.json');
    fs.writeFileSync(schemaPath, JSON.stringify(xanoSchema, null, 2));
    
    console.log('✅ Xano database schema saved to xano-schema/database-schema.json');
    
    // Создаем инструкции по настройке
    const instructions = `
# Xano Database Setup Instructions

## 1. Создайте таблицы в Xano

Войдите в ваш Xano workspace и создайте следующие таблицы:

### users
- id (Text, Primary Key)
- email (Text, Unique, Required)
- name (Text)
- created_at (DateTime, Default: now())

### projects
- id (Text, Primary Key)
- title (Text, Required)
- description (Text)
- owner_id (Text, Foreign Key → users.id)
- current_phase (Number, Default: 1)
- created_at (DateTime, Default: now())

### messages
- id (Text, Primary Key)
- project_id (Text, Foreign Key → projects.id)
- content (Text, Required)
- role (Text, Enum: user, assistant, Required)
- created_at (DateTime, Default: now())

### canvas_objects
- id (Text, Primary Key)
- project_id (Text, Foreign Key → projects.id)
- type (Text, Enum: problem, insight, persona, solution, milestone, note, image)
- position_x (Number)
- position_y (Number)
- width (Number)
- height (Number)
- content (JSON)
- style (JSON)
- created_by (Text, Enum: ai, user)
- created_at (DateTime, Default: now())
- updated_at (DateTime, Default: now())

## 2. Настройте API Endpoints

Создайте следующие API endpoints в Xano:

### GET /messages
- Query: project_id
- Returns: messages for the project

### POST /messages
- Body: project_id, content, role
- Creates: new message

### GET /canvas_objects
- Query: project_id
- Returns: canvas objects for the project

### POST /canvas_objects
- Body: project_id, type, content, position_x, position_y, created_by
- Creates: new canvas object

### GET /projects
- Query: owner_id
- Returns: projects for the owner

### POST /projects
- Body: title, description, owner_id
- Creates: new project

## 3. Получите API URL и Key

1. Скопируйте API URL из Xano (например: https://your-workspace.xano.io/api:your-api-group)
2. Создайте API Key в настройках
3. Добавьте их в .env файл:

XANO_API_URL=https://your-workspace.xano.io/api:your-api-group
XANO_API_KEY=your-xano-api-key

## 4. Тестирование

После настройки запустите:
npm run dev

И проверьте работу API endpoints.
`;

    const instructionsPath = path.join(schemaDir, 'SETUP_INSTRUCTIONS.md');
    fs.writeFileSync(instructionsPath, instructions);
    
    console.log('📋 Setup instructions saved to xano-schema/SETUP_INSTRUCTIONS.md');
    console.log('📊 Created schema for 4 tables: users, projects, messages, canvas_objects');
    
    console.log('🎉 Xano setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Follow instructions in xano-schema/SETUP_INSTRUCTIONS.md');
    console.log('2. Create tables and API endpoints in Xano');
    console.log('3. Add XANO_API_URL and XANO_API_KEY to .env file');
    console.log('4. Run: npm run dev');
    
  } catch (error) {
    console.error('❌ Error setting up Xano:', error);
    throw error;
  }
}

// Запуск скрипта
if (require.main === module) {
  setupXano()
    .then(() => {
      console.log('Xano setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Xano setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupXano };
