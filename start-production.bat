@echo off
REM Vesturo Production Startup Script for Windows

echo 🌟 Starting Vesturo Fashion Platform...

REM Check if .env exists
if not exist "backend\.env" (
    echo ❌ Environment file not found!
    echo 💡 Run: node setup-production.js
    exit /b 1
)

REM Start the application
echo 🚀 Starting backend server...
cd backend && npm start
