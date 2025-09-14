import React, { useEffect, useState } from 'react';
import { Shield, Lock, Zap, Database, Server, Key } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Shield, text: "Initializing Security Protocols", delay: 500 },
    { icon: Database, text: "Connecting to UDG Database", delay: 800 },
    { icon: Server, text: "Establishing Server Connection", delay: 600 },
    { icon: Key, text: "Loading Decryption Keys", delay: 700 },
    { icon: Lock, text: "Verifying Access Permissions", delay: 500 },
    { icon: Zap, text: "System Ready", delay: 300 }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let stepTimeout: NodeJS.Timeout;
    
    const startProgress = () => {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 3;
        });
      }, 100);
    };

    const advanceStep = () => {
      if (currentStep < steps.length - 1) {
        stepTimeout = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          advanceStep();
        }, steps[currentStep].delay);
      }
    };

    startProgress();
    advanceStep();

    return () => {
      clearInterval(interval);
      clearTimeout(stepTimeout);
    };
  }, [currentStep]);

  const CurrentIcon = steps[currentStep]?.icon || Shield;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-pattern animate-pulse"></div>
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      <div className="text-center z-10 max-w-md mx-auto px-6">
        {/* Logo/Icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-spin-slow">
            <CurrentIcon className="w-12 h-12 text-white" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto border-2 border-blue-400 rounded-full animate-ping opacity-30"></div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2 tracking-wider">
          UDG V 5.0
        </h1>
        <p className="text-blue-400 text-lg mb-8 font-medium">
          DECRYPTED ALL RESOURCES
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-400">
            {Math.round(Math.min(progress, 100))}%
          </div>
        </div>

        {/* Current Step */}
        <div className="text-center">
          <p className="text-gray-300 text-sm mb-2">
            {steps[currentStep]?.text || "Loading..."}
          </p>
          <div className="flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Status indicators */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-xs">
          {steps.slice(0, 3).map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index <= currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={index}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-900/30 text-green-400' 
                    : isActive 
                    ? 'bg-blue-900/30 text-blue-400' 
                    : 'bg-gray-800/30 text-gray-600'
                }`}
              >
                <StepIcon className={`w-4 h-4 mb-1 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="text-center leading-tight">
                  {step.text.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;