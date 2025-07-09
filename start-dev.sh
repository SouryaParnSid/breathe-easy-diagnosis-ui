#!/bin/bash

# Start both frontend and backend development servers
echo "🚀 Starting Pneumonia Detection Development Environment..."

# Function to cleanup background processes on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend server
echo "🔧 Starting backend server on http://localhost:5000..."
cd backend
python run.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting frontend server on http://localhost:8080..."
npm run dev &
FRONTEND_PID=$!

echo "✅ Development environment started!"
echo "📱 Frontend: http://localhost:8080"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait 