
import React from 'react';
import { Heart, Shield, Zap, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fadeIn">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 medical-gradient rounded-full flex items-center justify-center floating-animation">
                <Heart className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center pulse-glow">
                <Zap className="h-4 w-4 text-background" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text">AI-Powered</span>
            <br />
            <span className="text-foreground">Pneumonia Detection</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Advanced deep learning technology to analyze CT scans and detect pneumonia with 
            professional-grade accuracy in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => document.getElementById('detection')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 medical-gradient text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2 group"
            >
              Start Analysis
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 glass-card text-foreground rounded-xl font-semibold hover:bg-white/10 transition-colors duration-200">
              Learn More
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: "99.2% Accuracy", desc: "State-of-the-art AI model" },
              { icon: Zap, title: "Instant Results", desc: "Analysis in under 5 seconds" },
              { icon: Heart, title: "Medical Grade", desc: "Trusted by professionals" }
            ].map((feature, index) => (
              <div key={index} className="glass-card p-6 text-center hover:bg-white/10 transition-colors duration-300">
                <feature.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
