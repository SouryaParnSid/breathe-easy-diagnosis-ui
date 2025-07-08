
import React, { useState } from 'react';
import FileUpload from './FileUpload';
import ProcessingAnimation from './ProcessingAnimation';
import ResultsPanel from './ResultsPanel';

const DetectionSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResults(null);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const startAnalysis = () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock results - in a real app, this would come from your AI backend
      const mockResults = {
        probability: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40) + 10,
        confidence: Math.floor(Math.random() * 15) + 85,
        diagnosis: Math.random() > 0.3 ? 'normal' : 'pneumonia'
      };
      
      setResults(mockResults);
      setIsProcessing(false);
    }, 5000);
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
