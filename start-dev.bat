@echo off
title Navsa Website - Dev Server
color 0A

echo ================================================
echo   NAVSA WEBSITE - STARTING DEV SERVERS
echo ================================================
echo.

:: Start Laravel API server (port 8000) in a new window
echo [1/2] Starting Laravel API server on port 8000...
start "Navsa API - Port 8000" cmd /k "cd /d "%~dp0navsa-api" && C:\xampp\php\php.exe artisan serve --port=8000"

:: Small delay before starting frontend
ping 127.0.0.1 -n 3 >nul

:: Start Vite frontend dev server in a new window
echo [2/2] Starting Vite frontend dev server...
start "Navsa Frontend - Vite" cmd /k "cd /d "%~dp0navsa-frontend" && npm run dev"

echo.
echo ================================================
echo   Both servers started in separate windows!
echo.
echo   Frontend : http://localhost:5173
echo   API      : http://127.0.0.1:8000
echo ================================================
echo.
echo   Close those 2 cmd windows to stop servers.
pause
