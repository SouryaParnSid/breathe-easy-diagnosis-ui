
import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import ProcessingAnimation from './ProcessingAnimation';
import ResultsPanel from './ResultsPanel';
import { ApiService, checkBackendHealth } from '../lib/api';
import { useToast } from '@/hooks/use-toast';

const DetectionSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const { toast } = useToast();

  // Check backend health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendStatus(isHealthy ? 'connected' : 'disconnected');
      
      if (!isHealthy) {
        toast({
          title: "Backend Connection Error",
          description: "Unable to connect to the AI analysis service. Please ensure the backend server is running.",
          variant: "destructive",
        });
      }
    };
    
    checkHealth();
  }, [toast]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResults(null);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;
    
    if (backendStatus !== 'connected') {
      toast({
        title: "Backend Not Available",
        description: "Please ensure the backend server is running before starting analysis.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const predictionData = await ApiService.predictPneumonia(selectedFile);
      
      // Transform backend response to match our UI's expected format
      const results = {
        probability: predictionData.confidence,
        confidence: predictionData.confidence,
        diagnosis: predictionData.prediction.toLowerCase()
      };
      
      setResults(results);
      
      toast({
        title: "Analysis Complete",
        description: `Analysis completed successfully. Confidence: ${predictionData.confidence.toFixed(1)}%`,
      });
    } catch (error) {
      console.error('Error during analysis:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during analysis.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setResults(null);
    setImageUrl('');
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
  };

  return (
    <section id="detection" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">AI-Powered</span> CT Scan Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your CT scan image and let our advanced AI analyze it for signs of pneumonia
          </p>
          
          {/* Backend Status Indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              backendStatus === 'connected' ? 'bg-green-500' :
              backendStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <span className="text-sm text-muted-foreground">
              {backendStatus === 'connected' ? 'AI Service Connected' :
               backendStatus === 'disconnected' ? 'AI Service Disconnected' : 'Checking Connection...'}
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {!selectedFile && !isProcessing && !results && (
            <FileUpload onFileSelect={handleFileSelect} />
          )}

          {selectedFile && !isProcessing && !results && (
            <div className="text-center space-y-6">
              <div className="glass-card p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-2">Ready for Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  File: {selectedFile.name}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={startAnalysis}
                    className="flex-1 px-6 py-3 medical-gradient text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-200"
                  >
                    Start Analysis
                  </button>
                  <button
                    onClick={resetAnalysis}
                    className="px-6 py-3 glass-card text-foreground rounded-xl font-semibold hover:bg-white/10 transition-colors duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          <ProcessingAnimation isVisible={isProcessing} />

          {results && (
            <div id="results">
              <ResultsPanel 
                isVisible={!!results} 
                result={results} 
                imageUrl={imageUrl}
              />
              <div className="text-center mt-8">
                <button
                  onClick={resetAnalysis}
                  className="px-8 py-3 glass-card text-foreground rounded-xl font-semibold hover:bg-white/10 transition-colors duration-200"
                >
                  Analyze Another Scan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DetectionSection;
