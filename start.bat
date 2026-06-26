@echo off
title IMHMA - Full Stack Launcher

echo ================================================
echo   IMHMA Mental Wellness App - Starting...
echo ================================================
echo.

:: Start the Flask AI Agent backend
echo [1/2] Starting AI Agent backend (Flask on port 5001)...
start "AI Agent Backend" cmd /k "cd /d "%~dp0AIAgent" && python server.py"

:: Wait a moment for Flask to initialise
timeout /t 3 /nobreak > nul

:: Start the Vite React frontend
echo [2/2] Starting React frontend (Vite)...
start "React Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo ================================================
echo   Both servers are starting in separate windows.
echo   React app: http://localhost:5173
echo   AI Backend: http://localhost:5001
echo ================================================
echo.
pause
