const fs = require('fs');
const path = require('path');

// Простой скрипт для подготовки файлов к деплою
console.log('🚀 Preparing files for deployment...');

// Список файлов для проверки
const filesToCheck = [
  'app/page.tsx',
  'components/AuthForm.tsx',
  'components/CanvasBoard.tsx',
  'app/api/auth/login/route.ts',
  'app/api/auth/register/route.ts',
  'app/api/auth/logout/route.ts',
  'app/api/chat/route.ts',
  'lib/supabase.ts'
];

console.log('📋 Checking critical files:');
filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
  }
});

console.log('\n📁 Additional files created:');
const additionalFiles = [
  'setup-rls-policies.sql',
  'create-test-user-instructions.md',
  'check-project-status.md',
  'final-deploy.bat'
];

additionalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
  }
});

console.log('\n🎯 Next steps:');
console.log('1. Run: git add .');
console.log('2. Run: git commit -m "Fix authentication and canvas issues"');
console.log('3. Run: git push origin main');
console.log('4. Check Vercel dashboard for deployment progress');
console.log('\n🌐 Site URL: https://ai-cofounder-platform-2411.vercel.app');
