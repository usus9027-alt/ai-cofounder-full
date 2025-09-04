@echo off
echo 🚀 Deploying Pinecone Graceful Fallback
echo =======================================
echo.

echo ✅ Pinecone functions updated with graceful fallback:
echo    - Functions work with or without Pinecone API key
echo    - No build errors if Pinecone is not configured
echo    - Vector database will work when API key is added
echo.

echo 🔄 Adding changes to git...
git add .
echo.

echo 💾 Committing Pinecone graceful fallback...
git commit -m "Add graceful Pinecone fallback - works with or without API key"
echo.

echo 🚀 Pushing to GitHub...
git push origin main
echo.

echo ✅ Pinecone graceful fallback deployed!
echo 🌐 Check Vercel deployment: https://vercel.com/dashboard
echo 🌐 Test site: https://ai-cofounder-platform-2411.vercel.app
echo.

echo 🎯 What this fixes:
echo    - Build will succeed even without Pinecone API key
echo    - Vector database functions will work when API key is added
echo    - Long-term memory will be preserved for future use
echo.

echo ⏰ Wait 2-3 minutes for Vercel to rebuild...
echo Then run: node autotest.js
echo.

pause
