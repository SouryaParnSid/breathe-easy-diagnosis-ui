
import React, { useState, useEffect } from 'react';
import { Brain, Eye, CheckCircle, Loader } from 'lucide-react';

const ProcessingAnimation = ({ isVisible }: { isVisible: boolean }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Eye, title: "Image Analysis", desc: "Scanning CT image data..." },
    { icon: Brain, title: "AI Processing", desc: "Deep learning analysis..." },
    { icon: CheckCircle, title: "Results Ready", desc: "Analysis complete!" }
  ];

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      setCurrentStep(0);
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 2;
          
          if (newProgress >= 33 && currentStep === 0) {
            setCurrentStep(1);
          } else if (newProgress >= 66 && currentStep === 1) {
            setCurrentStep(2);
          }
          
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isVisible, currentStep]);

  if (!isVisible) return null;

  return (
    <div className="glass-card p-8 animate-fadeIn">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Analyzing Your CT Scan</h3>
        <p className="text-muted-foreground">Our AI is processing your image...</p>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                isActive ? 'bg-primary/10 border border-primary/30' : 
                isCompleted ? 'bg-green-500/10 border border-green-500/30' : 
                'bg-muted/20'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isActive ? 'bg-primary text-background animate-pulse' :
                isCompleted ? 'bg-green-500 text-white' :
                'bg-muted text-muted-foreground'
              }`}>
                {isActive && index < 2 ? (
                  <Loader className="h-6 w-6 animate-spin" />
                ) : (
                  <Icon className="h-6 w-6" />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-semibold ${isActive ? 'text-primary' : isCompleted ? 'text-green-400' : 'text-muted-foreground'}`}>
                  {step.title}
                </h4>
                <p className={`text-sm ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-sm mb-2">
          <span>Processing Progress</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2">
          <div 
            className="medical-gradient h-2 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProcessingAnimation;
