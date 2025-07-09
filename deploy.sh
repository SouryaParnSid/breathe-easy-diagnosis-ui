#!/bin/bash

# Deployment script for combined backend+frontend on Render

echo "🚀 Starting deployment preparation..."

# Build frontend
echo "📦 Building frontend..."
npm install
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend built successfully!"

# Check if backend files exist
if [ ! -f "backend/main.py" ]; then
    echo "❌ Backend files not found!"
    exit 1
fi

if [ ! -f "backend/pneumonia_detection_model.pth" ]; then
    echo "❌ Model file not found!"
    exit 1
fi

echo "✅ Backend files found!"

echo "🎉 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push this code to GitHub"
echo "2. Go to render.com"
echo "3. Create a new Web Service"
echo "4. Connect your GitHub repository"
echo "5. Use these settings:"
echo "   - Build Command: pip install -r backend/requirements.txt && npm install && npm run build"
echo "   - Start Command: cd backend && gunicorn wsgi:app --bind 0.0.0.0:\$PORT --workers 1 --timeout 120"
echo "   - Environment: Python 3"
echo ""
echo "Your app will be available at: https://your-app-name.onrender.com" 