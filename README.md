# Breathe Easy - Pneumonia Detection System

An AI-powered web application for detecting pneumonia from chest X-ray images using deep learning.

## Project Overview

This project consists of:
- **Frontend**: React + TypeScript web application with modern UI
- **Backend**: Flask API with PyTorch-based CNN model for image analysis

## Quick Start

### Option 1: Start Both Servers Together (Recommended)

**Windows:**
```cmd
start-dev.bat
```

**Linux/Mac:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Option 2: Start Servers Separately

#### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python run.py
```
Backend will be available at: http://localhost:5000

#### 2. Frontend Setup
```bash
npm install
npm run dev
```
Frontend will be available at: http://localhost:8080

## API Endpoints

### Health Check
- **GET** `/` - Check if the backend is running and model is loaded

### Prediction
- **POST** `/predict` - Upload an image file for pneumonia detection
  - Content-Type: `multipart/form-data`
  - Body: `file` (image file)
  - Response: `{ "prediction": "Normal"|"Pneumonia", "confidence": 95.67 }`

## Features

### Frontend
- 🎨 Modern, responsive UI with glass morphism design
- 📁 Drag & drop file upload
- 🔄 Real-time processing animation
- 📊 Detailed results with confidence scores
- 🔗 Backend connection status indicator
- 📱 Mobile-friendly interface

### Backend
- 🤖 CNN-based pneumonia detection model
- 🖼️ Image preprocessing and normalization
- ⚡ Fast inference with PyTorch
- 🔧 CORS-enabled for frontend communication
- 📝 Comprehensive error handling and logging

## Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- shadcn/ui (UI components)
- React Router (navigation)

### Backend
- Flask (web framework)
- PyTorch (deep learning)
- Pillow (image processing)
- Flask-CORS (cross-origin requests)

## Development

### Project Structure
```
breathe-easy-diagnosis-ui/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities and API services
│   └── hooks/             # Custom React hooks
├── backend/               # Backend Python code
│   ├── main.py           # Flask application
│   ├── run.py            # Server startup script
│   └── requirements.txt  # Python dependencies
└── package.json          # Frontend dependencies
```

### Environment Variables

Create a `.env` file in the root directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### Testing the Connection

1. Start both servers
2. Open http://localhost:8080 in your browser
3. Check the "AI Service Connected" indicator in the detection section
4. Upload an image to test the full pipeline

## Troubleshooting

### Backend Issues
- **Model not loading**: Ensure `pneumonia_detection_model.pth` is in the backend directory
- **Port conflicts**: Change the port in `backend/run.py` if 5000 is occupied
- **CUDA errors**: The model automatically falls back to CPU

### Frontend Issues
- **Connection errors**: Verify the backend URL in `.env` file
- **CORS errors**: Backend is configured to accept requests from any origin
- **Build errors**: Run `npm install` to ensure all dependencies are installed

### Common Issues
1. **"AI Service Disconnected"**: Backend server is not running
2. **File upload fails**: Check file format (JPEG, PNG supported)
3. **Analysis fails**: Check backend logs for detailed error messages

## Deployment

### Backend Deployment
The backend can be deployed to any Python hosting service (Heroku, Railway, etc.) using the `requirements.txt` file.

### Frontend Deployment
The frontend can be deployed to any static hosting service (Vercel, Netlify, etc.) after building with `npm run build`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## License

This project is licensed under the MIT License.
