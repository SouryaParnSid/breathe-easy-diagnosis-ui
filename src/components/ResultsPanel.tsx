
import React from 'react';
import { AlertTriangle, CheckCircle, Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ResultsPanelProps {
  isVisible: boolean;
  result: {
    probability: number;
    confidence: number;
    diagnosis: 'normal' | 'pneumonia';
  } | null;
  imageUrl?: string;
}

const ResultsPanel = ({ isVisible, result, imageUrl }: ResultsPanelProps) => {
  if (!isVisible || !result) return null;

  const isPneumonia = result.diagnosis === 'pneumonia';

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="glass-card p-8">
        <div className="text-center mb-6">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            isPneumonia ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
          }`}>
            {isPneumonia ? (
              <AlertTriangle className="h-10 w-10" />
            ) : (
              <CheckCircle className="h-10 w-10" />
            )}
          </div>
          
          <h3 className="text-3xl font-bold mb-2">
            {isPneumonia ? 'Pneumonia Detected' : 'No Pneumonia Detected'}
          </h3>
          
          <p className="text-muted-foreground">
            AI analysis complete with {result.confidence}% confidence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-muted/20 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Pneumonia Probability</span>
                <span className="text-xl font-bold text-primary">{result.probability}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    isPneumonia ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-green-500 to-green-400'
                  }`}
                  style={{ width: `${result.probability}%` }}
                />
              </div>
            </div>

            <div className="bg-muted/20 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Model Confidence</span>
                <span className="text-xl font-bold text-accent">{result.confidence}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-3">
                <div 
                  className="medical-gradient h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            <div className={`rounded-xl p-4 border ${
              isPneumonia ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'
            }`}>
              <h4 className="font-semibold mb-2">Recommendation</h4>
              <p className="text-sm">
                {isPneumonia 
                  ? 'Please consult with a healthcare professional for proper diagnosis and treatment.'
                  : 'No signs of pneumonia detected. Continue regular health monitoring.'
                }
              </p>
            </div>
          </div>

          {imageUrl && (
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Image Analysis
                </h4>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="aspect-square bg-muted/20 rounded-lg overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="CT Scan Analysis" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
