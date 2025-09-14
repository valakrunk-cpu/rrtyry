import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import ParticleBackground from './components/ParticleBackground';
import Header from './components/Header';
import MainInterface from './components/MainInterface';
import './styles/animations.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [systemReady, setSystemReady] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    const readyTimer = setTimeout(() => {
      setSystemReady(true);
    }, 3500);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(readyTimer);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full min-h-screen bg-black text-white relative">
      <ParticleBackground />
      
      <div className="relative z-10 w-full min-h-screen">
        <Header />
        <MainInterface systemReady={systemReady} />
      </div>
    </div>
  );
}

export default App;