@echo off
echo 🔧 Fixing GitHub Push Protection
echo ================================

echo 🗑️ Removing sensitive files...
del .env.backup 2>nul
del .env.new 2>nul

echo 📝 Adding only safe files...
git add lib/pinecone.ts
git add quick-deploy.bat
git add test-api-keys.js
git add debug-site-content.js

echo 💾 Committing safe changes...
git commit -m "Fix Pinecone environment error - disable Pinecone temporarily"

echo 🚀 Pushing to GitHub...
git push origin main

echo ✅ Deploy complete! Check Vercel dashboard.
pause
