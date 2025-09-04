const { execSync } = require('child_process');

console.log('🔍 Checking Repository Mismatch');
console.log('===============================');

try {
  // Получаем remote URL
  const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
  console.log('📁 Git Remote URL:', remoteUrl);
  
  // Получаем текущую ветку
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  console.log('🌿 Current Branch:', currentBranch);
  
  // Получаем последний коммит
  const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf8' }).trim();
  console.log('📝 Last Commit:', lastCommit);
  
  // Проверяем статус
  const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  console.log('📊 Git Status:', status || 'Clean working tree');
  
  console.log('\n🎯 Analysis:');
  console.log('============');
  
  if (remoteUrl.includes('ai-cofounder-full') && remoteUrl.includes('ai-cofounder-demo')) {
    console.log('⚠️  POTENTIAL ISSUE: Repository name mismatch detected!');
    console.log('   - Git remote:', remoteUrl);
    console.log('   - Vercel site: ai-cofounder-platform-2411.vercel.app');
    console.log('   - This might cause deployment issues');
  } else {
    console.log('✅ Repository URLs look consistent');
  }
  
  if (currentBranch !== 'main') {
    console.log('⚠️  WARNING: Not on main branch!');
    console.log('   - Current branch:', currentBranch);
    console.log('   - Vercel might be deploying from main branch');
  } else {
    console.log('✅ On main branch');
  }
  
  console.log('\n💡 Recommendations:');
  console.log('===================');
  console.log('1. Verify Vercel is connected to the correct repository');
  console.log('2. Check Vercel deployment logs');
  console.log('3. Ensure Vercel is deploying from the correct branch');
  console.log('4. Try manual redeploy from Vercel dashboard');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
