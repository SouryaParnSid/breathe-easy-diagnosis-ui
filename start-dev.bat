@echo off
echo 🚀 Starting Pneumonia Detection Development Environment...

REM Start backend server
echo 🔧 Starting backend server on http://localhost:5000...
cd backend
start "Backend Server" python run.py
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
echo 🎨 Starting frontend server on http://localhost:8080...
start "Frontend Server" npm run dev

echo ✅ Development environment started!
echo 📱 Frontend: http://localhost:8080
echo 🔧 Backend: http://localhost:5000
echo.
echo Press any key to stop servers...
pause >nul

REM Kill the processes (this is a simple approach)
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1 