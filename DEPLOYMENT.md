# Deployment Guide for Render

This guide will help you deploy both the frontend and backend of your Pneumonia Detection application to Render.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Model File**: Ensure `pneumonia_detection_model.pth` is in the `backend/` directory

## Deployment Steps

### Step 1: Connect Your Repository

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" and select "Blueprint"
3. Connect your GitHub account and select your repository
4. Render will automatically detect the `render.yaml` file

### Step 2: Configure Environment Variables

The `render.yaml` file is already configured, but you may need to adjust:

- **Backend Service**: `breathe-easy-api`
- **Frontend Service**: `breathe-easy-ui`

### Step 3: Deploy

1. Click "Apply" to start the deployment
2. Render will deploy the backend first, then the frontend
3. The deployment process will take 5-10 minutes

## Service URLs

After deployment, you'll get:
- **Backend API**: `https://breathe-easy-api.onrender.com`
- **Frontend UI**: `https://breathe-easy-ui.onrender.com`

## Troubleshooting

### Common Issues

1. **Model Loading Errors**
   - Ensure `pneumonia_detection_model.pth` is in the `backend/` directory
   - Check the backend logs in Render dashboard

2. **CORS Errors**
   - The backend is configured to accept requests from the frontend URL
   - Check that `ALLOWED_ORIGINS` environment variable is set correctly

3. **Build Failures**
   - Check that all dependencies are in `requirements.txt`
   - Ensure Python version is compatible (3.9.0)

4. **Memory Issues**
   - PyTorch models can be memory-intensive
   - The backend is configured with 1 worker to manage memory usage

### Checking Logs

1. Go to your Render dashboard
2. Select the service (backend or frontend)
3. Click on "Logs" tab
4. Look for error messages or warnings

### Performance Optimization

1. **Backend**: Uses Gunicorn with 1 worker to manage memory
2. **Frontend**: Static files served by Render's CDN
3. **Model**: Loaded once at startup for faster inference

## Local Development

For local development, use the provided scripts:

```bash
# Start both services
./start-dev.sh  # Linux/Mac
start-dev.bat   # Windows

# Or start individually
cd backend && python run.py  # Backend on port 5000
npm run dev                  # Frontend on port 8080
```

## Environment Variables

### Backend (breathe-easy-api)
- `PYTHON_VERSION`: 3.9.0
- `ALLOWED_ORIGINS`: https://breathe-easy-ui.onrender.com
- `PORT`: Set automatically by Render

### Frontend (breathe-easy-ui)
- `VITE_BACKEND_URL`: Automatically set to backend service URL

## Monitoring

- **Health Check**: Visit `https://breathe-easy-api.onrender.com/` to check backend status
- **API Documentation**: The backend provides a simple health endpoint
- **Error Tracking**: Check Render logs for detailed error information

## Cost Considerations

- **Free Tier**: Both services can run on Render's free tier
- **Limitations**: Free tier has cold starts and limited resources
- **Upgrade**: Consider upgrading for production use with higher traffic

## Security Notes

- CORS is configured to only allow requests from the frontend domain
- Debug mode is disabled in production
- Model file is included in the repository (consider using external storage for larger models) 