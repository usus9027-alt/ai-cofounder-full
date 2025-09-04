const fs = require('fs');
const path = require('path');

console.log('🔍 Vercel Deployment Diagnosis');
console.log('==============================');

// Проверяем структуру проекта
console.log('\n📁 Project Structure:');
const checkFile = (filePath, description) => {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`);
  return exists;
};

const criticalFiles = [
  ['package.json', 'Package configuration'],
  ['next.config.js', 'Next.js configuration'],
  ['vercel.json', 'Vercel configuration'],
  ['app/page.tsx', 'Main page component'],
  ['app/layout.tsx', 'Root layout'],
  ['components/AuthForm.tsx', 'Authentication form'],
  ['components/CanvasBoard.tsx', 'Canvas board component'],
  ['lib/supabase.ts', 'Supabase client'],
  ['app/api/chat/route.ts', 'Chat API endpoint'],
  ['app/api/auth/login/route.ts', 'Login API endpoint']
];

let allFilesExist = true;
criticalFiles.forEach(([file, desc]) => {
  if (!checkFile(file, desc)) {
    allFilesExist = false;
  }
});

// Проверяем package.json
console.log('\n📦 Package.json Analysis:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`✅ Name: ${packageJson.name}`);
  console.log(`✅ Version: ${packageJson.version}`);
  console.log(`✅ Next.js: ${packageJson.dependencies?.next || 'NOT FOUND'}`);
  console.log(`✅ React: ${packageJson.dependencies?.react || 'NOT FOUND'}`);
  console.log(`✅ Supabase: ${packageJson.dependencies?.['@supabase/supabase-js'] || 'NOT FOUND'}`);
  
  const scripts = packageJson.scripts || {};
  console.log(`✅ Build script: ${scripts.build || 'NOT FOUND'}`);
  console.log(`✅ Dev script: ${scripts.dev || 'NOT FOUND'}`);
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Проверяем Next.js конфигурацию
console.log('\n⚙️ Next.js Configuration:');
try {
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  console.log('✅ next.config.js exists');
  if (nextConfig.includes('appDir: true')) {
    console.log('✅ App Router enabled');
  } else {
    console.log('❌ App Router NOT enabled');
  }
} catch (error) {
  console.log('❌ Error reading next.config.js:', error.message);
}

// Проверяем Vercel конфигурацию
console.log('\n🚀 Vercel Configuration:');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  console.log(`✅ Framework: ${vercelConfig.framework || 'NOT SET'}`);
  console.log(`✅ Build Command: ${vercelConfig.buildCommand || 'NOT SET'}`);
  console.log(`✅ Output Directory: ${vercelConfig.outputDirectory || 'NOT SET'}`);
  console.log(`✅ Install Command: ${vercelConfig.installCommand || 'NOT SET'}`);
} catch (error) {
  console.log('❌ Error reading vercel.json:', error.message);
}

// Проверяем главную страницу
console.log('\n📄 Main Page Analysis:');
try {
  const pageContent = fs.readFileSync('app/page.tsx', 'utf8');
  console.log('✅ app/page.tsx exists');
  
  if (pageContent.includes('AuthForm')) {
    console.log('✅ AuthForm component imported');
  } else {
    console.log('❌ AuthForm component NOT imported');
  }
  
  if (pageContent.includes('CanvasBoard')) {
    console.log('✅ CanvasBoard component imported');
  } else {
    console.log('❌ CanvasBoard component NOT imported');
  }
  
  if (pageContent.includes('supabase')) {
    console.log('✅ Supabase integration present');
  } else {
    console.log('❌ Supabase integration NOT present');
  }
  
  if (pageContent.includes('useState') && pageContent.includes('useEffect')) {
    console.log('✅ React hooks present (dynamic version)');
  } else {
    console.log('❌ React hooks NOT present (static version)');
  }
} catch (error) {
  console.log('❌ Error reading app/page.tsx:', error.message);
}

console.log('\n🎯 Diagnosis Summary:');
console.log('====================');
if (allFilesExist) {
  console.log('✅ All critical files exist');
  console.log('✅ Project structure is correct');
  console.log('✅ Configuration files are present');
  console.log('\n🚨 LIKELY ISSUE: Vercel deployment settings');
  console.log('   - Check Framework Preset in Vercel Dashboard');
  console.log('   - Ensure it\'s set to "Next.js" not "Other"');
  console.log('   - Try manual redeploy with cache disabled');
} else {
  console.log('❌ Some critical files are missing');
  console.log('❌ Project structure is incomplete');
  console.log('\n💡 SOLUTION: Fix missing files first');
}

console.log('\n📋 Next Steps:');
console.log('==============');
console.log('1. Check Vercel Dashboard settings');
console.log('2. Verify Framework Preset = Next.js');
console.log('3. Try manual redeploy');
console.log('4. Check deployment logs');
console.log('5. If still failing, recreate Vercel project');
