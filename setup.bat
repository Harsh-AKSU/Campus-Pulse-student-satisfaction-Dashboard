@echo off
REM Campus Pulse - Setup Script for Windows
REM This script sets up the entire project

echo ============================================
echo   Campus Pulse Dashboard - Setup Script
echo ============================================
echo.

REM Step 1: Setup Backend
echo [STEP 1] Setting up Backend...
cd backend
echo Creating virtual environment...
python -m venv venv
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Backend setup failed!
    pause
    exit /b 1
)
cd ..
echo.

REM Step 2: Generate Data
echo [STEP 2] Generating Synthetic Data...
backend\venv\Scripts\python.exe data\generate_data.py
if errorlevel 1 (
    echo Error: Data generation failed!
    pause
    exit /b 1
)
echo.

REM Step 3: Setup Frontend
echo [STEP 3] Setting up Frontend...
cd frontend
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo Error: Frontend setup failed!
    pause
    exit /b 1
)
cd ..
echo.

echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Next Steps:
echo 1. Open Terminal 1: cd backend ^&^& venv\Scripts\activate.bat ^&^& python main.py
echo 2. Open Terminal 2: cd frontend && npm start
echo 3. Open browser: http://localhost:3000
echo.
echo OR use the standalone dashboard:
echo    Open: dashboard.html in your browser
echo    (Requires backend to be running)
echo.
pause
