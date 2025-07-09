# Deployment Guide for Render (Free Tier)

This guide will help you deploy your Pneumonia Detection application to Render using the free tier.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Model File**: Ensure `pneumonia_detection_model.pth` is in the `backend/` directory

## Deployment Options

### Option 1: Combined Deployment (Recommended - Single Service)

Deploy both frontend and backend as a single web service.

#### Step 1: Prepare Your Code

1. **Run the deployment script:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Prepare for combined deployment"
   git push origin main
   ```

#### Step 2: Deploy on Render

1. **Go to Render Dashboard:**
   - Visit [render.com](https://render.com) and sign in
   - Click "New +" and select "Web Service"

2. **Connect Repository:**
   - Connect your GitHub account
   - Select your repository: `breathe-easy-diagnosis-ui`

3. **Configure Service:**
   - **Name**: `breathe-easy-app`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt && npm install && npm run build`
   - **Start Command**: `cd backend && gunicorn wsgi:app --bind 0.0.0.0:$PORT --workers 1 --timeout 120`
   - **Plan**: Free

4. **Environment Variables:**
   - `PYTHON_VERSION`: `3.9.0`
   - `FLASK_ENV`: `production`

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

#### Step 3: Access Your App

- **URL**: `https://breathe-easy-app.onrender.com`
- **API Health Check**: `https://breathe-easy-app.onrender.com/api/health`

### Option 2: Separate Services (Two Free Services)

Deploy frontend and backend as separate services.

#### Step 1: Deploy Backend

1. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure Backend:**
   - **Name**: `breathe-easy-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn wsgi:app --bind 0.0.0.0:$PORT --workers 1 --timeout 120`
   - **Plan**: Free

3. **Environment Variables:**
   - `PYTHON_VERSION`: `3.9.0`
   - `ALLOWED_ORIGINS`: `https://your-frontend-url.onrender.com` (update after frontend deployment)

4. **Deploy Backend:**
   - Click "Create Web Service"
   - Note the URL: `https://breathe-easy-api.onrender.com`

#### Step 2: Deploy Frontend

1. **Create Static Site:**
   - Click "New +" → "Static Site"
   - Connect your repository

2. **Configure Frontend:**
   - **Name**: `breathe-easy-ui`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

3. **Environment Variables:**
   - `VITE_BACKEND_URL`: `https://breathe-easy-api.onrender.com`

4. **Deploy Frontend:**
   - Click "Create Static Site"
   - Note the URL: `https://breathe-easy-ui.onrender.com`

#### Step 3: Update CORS

1. **Go back to backend service**
2. **Update Environment Variables:**
   - Change `ALLOWED_ORIGINS` to: `https://breathe-easy-ui.onrender.com`
3. **Redeploy Backend:**
   - Click "Manual Deploy" → "Deploy latest commit"

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `requirements.txt`
   - Ensure Python version is compatible (3.9.0)
   - Check build logs in Render dashboard

2. **Model Loading Errors**
   - Ensure `pneumonia_detection_model.pth` is in the `backend/` directory
   - Check backend logs for detailed error messages

3. **CORS Errors (Separate Services)**
   - Verify `ALLOWED_ORIGINS` environment variable is set correctly
   - Check that frontend URL is included in allowed origins

4. **Memory Issues**
   - PyTorch models can be memory-intensive
   - Backend is configured with 1 worker to manage memory usage

### Checking Logs

1. Go to your Render dashboard
2. Select the service
3. Click on "Logs" tab
4. Look for error messages or warnings

### Performance Optimization

1. **Combined Service**: Single service reduces complexity
2. **Separate Services**: Better for scaling but uses 2 free services
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

### Combined Service
- `PYTHON_VERSION`: 3.9.0
- `FLASK_ENV`: production
- `PORT`: Set automatically by Render

### Separate Services
- **Backend**: `PYTHON_VERSION`, `ALLOWED_ORIGINS`
- **Frontend**: `VITE_BACKEND_URL`

## Monitoring

- **Health Check**: Visit `/api/health` endpoint
- **Frontend**: Visit the root URL `/`
- **Error Tracking**: Check Render logs for detailed error information

## Cost Considerations

- **Free Tier**: Both options work with Render's free tier
- **Limitations**: Free tier has cold starts and limited resources
- **Upgrade**: Consider upgrading for production use with higher traffic

## Security Notes

- CORS is configured appropriately for production
- Debug mode is disabled in production
- Model file is included in the repository (consider using external storage for larger models)

## Recommended Approach

**Use Option 1 (Combined Deployment)** because:
- Uses only 1 free service
- Simpler configuration
- No CORS issues
- Easier to manage
- Single URL for your application 