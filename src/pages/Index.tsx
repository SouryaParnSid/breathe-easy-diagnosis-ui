
import React from 'react';
import ParticleBackground from '../components/ParticleBackground';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import DetectionSection from '../components/DetectionSection';
import StatisticsCards from '../components/StatisticsCards';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ParticleBackground />
      <Navigation />
      
      <main>
        <HeroSection />
        <DetectionSection />
        <StatisticsCards />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
