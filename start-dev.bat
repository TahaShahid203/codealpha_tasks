@echo off
echo Starting TaskFlow Pro Development Server...
echo.
set NODE_ENV=development
npx tsx server/index.ts
pause