# PowerShell script to start TaskFlow Pro development server
Write-Host "Starting TaskFlow Pro Development Server..." -ForegroundColor Green

$env:NODE_ENV = "development"
npx tsx server/index.ts

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")