# Pneumonia Detection Backend

This is the Flask backend for the Pneumonia Detection application. It provides a REST API for making predictions on chest X-ray images.

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Running the Backend

### Option 1: Using the run script
```bash
python run.py
```

### Option 2: Direct execution
```bash
python main.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### GET /
Health check endpoint that returns the API status.

### POST /predict
Upload a chest X-ray image to get a pneumonia prediction.

**Request:**
- Content-Type: multipart/form-data
- Body: file (image file)

**Response:**
```json
{
  "prediction": "Normal" | "Pneumonia",
  "confidence": 95.67
}
```

## Model Information

- The backend uses a CNN model trained on chest X-ray images
- Model file: `pneumonia_detection_model.pth`
- Input image size: 64x64 pixels
- Output: Binary classification (Normal vs Pneumonia)

## Troubleshooting

1. **Model loading issues**: Make sure the `pneumonia_detection_model.pth` file is in the same directory as `main.py`
2. **CUDA errors**: The model will automatically fall back to CPU if CUDA is not available
3. **CORS issues**: The backend is configured to accept requests from any origin (for development) 