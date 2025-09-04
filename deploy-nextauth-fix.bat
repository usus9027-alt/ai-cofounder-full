@echo off
echo 🚀 Deploying NextAuth Fix
echo ========================
echo.

echo ✅ NextAuth files have been removed:
echo    - app\auth\signin\page.tsx
echo    - app\api\auth\[...nextauth]\route.ts
echo.

echo 🔄 Adding changes to git...
git add .
echo.

echo 💾 Committing NextAuth removal...
git commit -m "Remove NextAuth files causing build errors - use Supabase Auth"
echo.

echo 🚀 Pushing to GitHub...
git push origin main
echo.

echo ✅ NextAuth fix deployed!
echo 🌐 Check Vercel deployment: https://vercel.com/dashboard
echo 🌐 Test site: https://ai-cofounder-platform-2411.vercel.app
echo.

echo ⏰ Wait 2-3 minutes for Vercel to rebuild...
echo Then run: node autotest.js
echo.

pause
