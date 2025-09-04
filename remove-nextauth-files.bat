@echo off
echo 🗑️ Removing NextAuth files that are causing build errors...
echo.

echo 📁 Removing NextAuth signin page...
if exist "app\auth\signin\page.tsx" (
    del "app\auth\signin\page.tsx"
    echo ✅ Removed app\auth\signin\page.tsx
) else (
    echo ❌ File not found: app\auth\signin\page.tsx
)

echo.
echo 📁 Removing NextAuth API route...
if exist "app\api\auth\[...nextauth]\route.ts" (
    del "app\api\auth\[...nextauth]\route.ts"
    echo ✅ Removed app\api\auth\[...nextauth]\route.ts
) else (
    echo ❌ File not found: app\api\auth\[...nextauth]\route.ts
)

echo.
echo 📁 Removing empty auth directories...
if exist "app\auth\signin" (
    rmdir "app\auth\signin"
    echo ✅ Removed app\auth\signin directory
)

if exist "app\auth" (
    rmdir "app\auth"
    echo ✅ Removed app\auth directory
)

echo.
echo 🧹 Cleaning up NextAuth references in next.config.js...
powershell -Command "(Get-Content 'next.config.js') -replace 'NEXTAUTH_SECRET', 'REMOVED_NEXTAUTH_SECRET' | Set-Content 'next.config.js'"
echo ✅ Updated next.config.js

echo.
echo ✅ NextAuth cleanup completed!
echo 🚀 Now run: git add . && git commit -m "Remove NextAuth files" && git push origin main

pause
