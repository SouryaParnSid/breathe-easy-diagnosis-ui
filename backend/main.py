from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
import io
import os

app = Flask(__name__, static_folder='../dist', static_url_path='')

# Configure CORS properly for production
import os
allowed_origins = os.environ.get('ALLOWED_ORIGINS', '*')
def get_allowed_origins():
    origins = set()
    if allowed_origins == '*':
        origins.add('*')
    else:
        for origin in allowed_origins.split(','):
            origins.add(origin.strip())
    # Always include the deployed frontend URL
    origins.add('https://breathe-easy-ui.onrender.com')
    return list(origins)
CORS(app, origins=get_allowed_origins(), methods=['GET', 'POST', 'OPTIONS'], allow_headers=['Content-Type'])

# Enable debug mode only in development
app.debug = os.environ.get('FLASK_ENV') == 'development'

# Define the model architecture (improved version)
class PneumoniaCNN(nn.Module):
    def __init__(self):
        super(PneumoniaCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(32),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.BatchNorm2d(64),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(64),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.BatchNorm2d(128),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.BatchNorm2d(256),
            nn.MaxPool2d(2, 2),
        )
        # Calculate the correct input size for the linear layer
        # 150x150 -> 75x75 -> 37x37 -> 18x18 -> 9x9 -> 4x4
        # So the final feature map is 256 * 4 * 4 = 4096
        self.classifier = nn.Sequential(
            nn.Linear(256 * 4 * 4, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        return self.classifier(x)

# Load the model
try:
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pneumonia_detection_model.pth")
    print(f"Attempting to load model from: {model_path}")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    model = PneumoniaCNN().to(device)
    print("Model architecture created")
    
    state_dict = torch.load(model_path, map_location=device)
    print(f"State dict loaded, keys: {state_dict.keys()}")
    
    model.load_state_dict(state_dict)
    print("State dict loaded into model")
    
    model.eval()
    print("Model set to eval mode")
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    print(f"Error type: {type(e).__name__}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Directory contents: {os.listdir(os.path.dirname(os.path.abspath(__file__)))}")
    model = None
    print("Model loading failed, but continuing without model")

# Define image transforms - same as training
transform = transforms.Compose([
    transforms.Resize((150, 150)),  # Resize to match model's expected input size
    transforms.ToTensor(),          # Convert to tensor and scale to [0, 1]
])

@app.route('/')
def home():
    try:
        # Check if we're in production (serving frontend)
        if os.path.exists('../dist/index.html'):
            return send_from_directory('../dist', 'index.html')
        
        # Fallback to API response if frontend not built
        if model is None:
            raise RuntimeError("Model not loaded")
            
        return jsonify({
            'status': 'ok',
            'message': 'Pneumonia Detection API is running',
            'model_loaded': True,
            'endpoints': {
                '/predict': 'POST - Make pneumonia predictions from chest X-ray images'
            }
        })
    except Exception as e:
        print(f"Error in home endpoint: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/health')
def api_health():
    """API health check endpoint"""
    try:
        if model is None:
            raise RuntimeError("Model not loaded")
            
        return jsonify({
            'status': 'ok',
            'message': 'Pneumonia Detection API is running',
            'model_loaded': True,
            'endpoints': {
                '/predict': 'POST - Make pneumonia predictions from chest X-ray images'
            }
        })
    except Exception as e:
        print(f"Error in health endpoint: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        print("\n=== New Prediction Request ===\n")
        print("Request files:", request.files)
        print("Request form:", request.form)
        print("Request headers:", dict(request.headers))
        
        if 'file' not in request.files:
            print("No file in request.files")
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['file']
        if file.filename == '':
            print("Empty filename")
            return jsonify({'error': 'No file selected'}), 400
            
        print(f"Processing file: {file.filename}")
        
        try:
            # Read and preprocess the image
            image_bytes = file.read()
            print(f"Read {len(image_bytes)} bytes")
            
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            print(f"Image opened and converted to RGB, size: {image.size}")
            
            image_tensor = transform(image).unsqueeze(0).to(device)
            print(f"Image transformed to tensor, shape: {image_tensor.shape}, dtype: {image_tensor.dtype}")
            
            # Verify model is loaded and in eval mode
            if model is None:
                raise RuntimeError("Model not loaded")
            if not model.training:
                print("Model is in eval mode")
            else:
                print("WARNING: Model is in training mode")
                model.eval()
            
            # Make prediction
            with torch.no_grad():
                print("Making prediction...")
                output = model(image_tensor)
                print(f"Raw output shape: {output.shape}, values: {output}")
                
                # Model already has sigmoid in final layer
                pneumonia_prob = output[0][0]
                print(f"Model output (already sigmoid): {pneumonia_prob.item():.6f}")
                
                # Determine prediction and confidence
                if pneumonia_prob > 0.5:
                    prediction = "Pneumonia"
                    confidence = float(pneumonia_prob) * 100
                else:
                    prediction = "Normal"
                    confidence = float(1 - pneumonia_prob) * 100
                
                # Apply confidence calibration to reduce overconfidence
                # This makes extreme probabilities less extreme
                if confidence > 95:
                    confidence = 85 + (confidence - 95) * 0.3  # Cap at ~88%
                elif confidence < 5:
                    confidence = 15 - (5 - confidence) * 0.3   # Floor at ~12%
                
                print(f"Pneumonia probability: {pneumonia_prob.item():.6f}")
                print(f"Raw confidence: {confidence:.2f}%")
                print(f"Final prediction: {prediction}, Confidence: {confidence:.2f}%")
                print(f"Model confidence level: {'Very High' if confidence > 90 else 'High' if confidence > 70 else 'Medium' if confidence > 50 else 'Low'}")
            
            response = jsonify({
                'prediction': prediction,
                'confidence': round(confidence, 2)
            })
            return response
            
        except torch.cuda.OutOfMemoryError as e:
            print(f"CUDA out of memory: {str(e)}")
            return jsonify({'error': 'GPU memory error'}), 500
        except RuntimeError as e:
            if "CUDA" in str(e):
                print(f"CUDA error: {str(e)}")
                return jsonify({'error': 'GPU error'}), 500
            raise
            
    except Exception as e:
        print("\n=== Error in prediction endpoint ===\n")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        import traceback
        print("\nTraceback:")
        traceback.print_exc()
        return jsonify({'error': f"{type(e).__name__}: {str(e)}"}), 500

@app.route('/test-model', methods=['GET'])
def test_model():
    """Test endpoint to check model outputs with a sample image"""
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
            
        # Create a random test tensor (simulating an image)
        test_tensor = torch.randn(1, 3, 64, 64).to(device)
        
        with torch.no_grad():
            output = model(test_tensor)
            pneumonia_prob = torch.sigmoid(output[0][0])
            
        return jsonify({
            'test_output': {
                'raw_output': float(output[0][0]),
                'sigmoid_output': float(pneumonia_prob),
                'prediction': 'Pneumonia' if pneumonia_prob > 0.5 else 'Normal',
                'confidence': float(pneumonia_prob if pneumonia_prob > 0.5 else 1 - pneumonia_prob) * 100
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/debug-labels', methods=['GET'])
def debug_labels():
    """Debug endpoint to check dataset class mapping"""
    try:
        import kagglehub
        from torchvision import datasets
        
        # Download and check dataset structure
        path = kagglehub.dataset_download("paultimothymooney/chest-xray-pneumonia")
        train_folder = os.path.join(path, 'chest_xray/train/')
        
        # Load dataset to check class mapping
        dataset = datasets.ImageFolder(train_folder)
        
        return jsonify({
            'class_mapping': dataset.class_to_idx,
            'classes': dataset.classes,
            'num_classes': len(dataset.classes),
            'interpretation': {
                'label_0': dataset.classes[0] if len(dataset.classes) > 0 else 'Unknown',
                'label_1': dataset.classes[1] if len(dataset.classes) > 1 else 'Unknown'
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
