@echo off
echo 🚀 Force Vercel Update - AI Cofounder Platform
echo ==============================================
echo.

echo 📋 Current Status Check:
echo - GitHub repo: https://github.com/usus9027-alt/ai-cofounder-demo
echo - Vercel site: https://ai-cofounder-platform-2411.vercel.app
echo.

echo 🔄 Step 1: Running auto test...
node autotest.js
echo.

echo 🔄 Step 2: Force empty commit to trigger Vercel...
git commit --allow-empty -m "Force Vercel cache refresh - $(date)"
git push origin main
echo.

echo 🔄 Step 3: Check Vercel deployment status...
echo Please check: https://vercel.com/dashboard
echo.

echo ⏰ Wait 2-3 minutes for Vercel to rebuild...
echo Then run: node autotest.js
echo.

echo 🎯 Expected Results After Update:
echo ✅ No "Begin" button
echo ✅ Login/Registration form visible
echo ✅ AI Chat interface
echo ✅ Canvas board with AI functions
echo.

pause
