@echo off
echo 🚀 Quick Deploy - Fixing Pinecone Error
echo ======================================

echo 📝 Adding files to git...
git add .

echo 💾 Committing changes...
git commit -m "Fix Pinecone environment error - disable Pinecone temporarily"

echo 🚀 Pushing to GitHub...
git push origin main

echo ✅ Deploy complete! Check Vercel dashboard.
pause
