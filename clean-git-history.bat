@echo off
echo 🧹 Cleaning Git History
echo ======================

echo 🔄 Resetting to clean state...
git reset --hard HEAD~2

echo 🗑️ Removing sensitive files...
del .env.backup 2>nul
del .env.new 2>nul

echo 📝 Adding only safe files...
git add lib/pinecone.ts
git add fix-github-push.bat
git add clean-git-history.bat

echo 💾 Committing clean changes...
git commit -m "Fix Pinecone environment error - clean commit"

echo 🚀 Pushing to GitHub...
git push origin main --force

echo ✅ Clean deploy complete!
pause
