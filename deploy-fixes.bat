@echo off
echo 🚀 Deploying Pinecone Fixes
echo ==========================

echo 📝 Adding changes...
git add .

echo 💾 Committing fixes...
git commit -m "Fix Pinecone environment error - disable Pinecone temporarily"

echo 🚀 Pushing to GitHub...
git push origin main

echo ✅ Deploy complete! Check Vercel dashboard.
echo 🌐 Site: https://ai-cofounder-platform-2411.vercel.app/
pause
