import React from 'react';
import { Shield, Zap, Database } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative z-20 bg-black/20 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wider">
                UDG V 5.0
              </h1>
              <p className="text-sm text-blue-400 font-medium">
                DECRYPTED ALL RESOURCES
              </p>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-green-400">
              <Database className="w-4 h-4" />
              <span className="text-sm font-medium">Database Online</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex items-center space-x-2 text-blue-400">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">System Active</span>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Version Badge */}
          <div className="hidden lg:block">
            <div className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full">
              <span className="text-xs font-mono text-purple-300">v5.0.1-STABLE</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;