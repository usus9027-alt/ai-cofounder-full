@echo off
echo 🚀 Deploying AI Cofounder Platform changes...
echo.

echo 📁 Current directory: %CD%
echo.

echo 🔄 Adding changes to git...
git add .
echo.

echo 💾 Committing changes...
git commit -m "Fix authentication and canvas issues"
echo.

echo 🚀 Pushing to GitHub...
git push origin main
echo.

echo ✅ Deployment initiated! Check Vercel dashboard for progress.
echo 🌐 Site URL: https://ai-cofounder-platform-2411.vercel.app
echo.

pause
