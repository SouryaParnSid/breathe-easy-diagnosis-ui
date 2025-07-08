
import React from 'react';
import { TrendingUp, Users, Clock, Target } from 'lucide-react';

const StatisticsCards = () => {
  const stats = [
    { 
      icon: Target, 
      title: "Accuracy Rate", 
      value: "99.2%", 
      change: "+0.3%", 
      desc: "Model accuracy on test dataset" 
    },
    { 
      icon: Users, 
      title: "Scans Analyzed", 
      value: "250K+", 
      change: "+12%", 
      desc: "Total CT scans processed" 
    },
    { 
      icon: Clock, 
      title: "Avg Response Time", 
      value: "2.4s", 
      change: "-0.2s", 
      desc: "Average analysis duration" 
    },
    { 
      icon: TrendingUp, 
      title: "Success Rate", 
      value: "98.7%", 
      change: "+1.2%", 
      desc: "Successful diagnoses rate" 
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by <span className="gradient-text">Healthcare Professionals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI model has been trained on thousands of CT scans and validated by medical experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="glass-card p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 animate-slideInLeft"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 medical-gradient rounded-full flex items-center justify-center mx-auto mb-4 floating-animation">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-primary mb-1">{stat.value}</h3>
                
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-sm font-medium">{stat.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground">{stat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatisticsCards;
