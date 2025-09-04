@echo off
echo 🚀 Fixing Pinecone Environment Error
echo ====================================
echo.

echo ✅ Pinecone configuration updated:
echo    - Added default environment: us-east-1-aws
echo    - Graceful fallback still works
echo    - Build should succeed now
echo.

echo 🔄 Adding changes to git...
git add .
echo.

echo 💾 Committing Pinecone environment fix...
git commit -m "Fix Pinecone environment parameter - add default value"
echo.

echo 🚀 Pushing to GitHub...
git push origin main
echo.

echo ✅ Pinecone environment fix deployed!
echo 🌐 Check Vercel deployment: https://vercel.com/dashboard
echo 🌐 Test site: https://ai-cofounder-platform-2411.vercel.app
echo.

echo ⏰ Wait 2-3 minutes for Vercel to rebuild...
echo Then run: node autotest.js
echo.

pause
