// API service for backend communication

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export interface PredictionResponse {
  prediction: 'Normal' | 'Pneumonia';
  confidence: number;
}

export interface ApiError {
  error: string;
  message?: string;
}

export class ApiService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BACKEND_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  static async healthCheck(): Promise<{ status: string; message: string; model_loaded: boolean }> {
    return this.makeRequest('/api/health');
  }

  static async predictPneumonia(file: File): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.makeRequest<PredictionResponse>('/predict', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for FormData, let the browser set it with boundary
    });
  }
}

// Utility function to check if backend is available
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    await ApiService.healthCheck();
    return true;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}; 