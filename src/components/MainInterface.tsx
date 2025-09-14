import React, { useState, useEffect } from 'react';
import { Key, Shield, Download, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface MainInterfaceProps {
  systemReady: boolean;
}

interface KeyValidationResult {
  isValid: boolean;
  message: string;
  keyData?: any;
}

const MainInterface: React.FC<MainInterfaceProps> = ({ systemReady }) => {
  const [keyInput, setKeyInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<KeyValidationResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const validateKey = async (key: string): Promise<KeyValidationResult> => {
    try {
      // Query the UDG keys table
      const { data, error } = await supabase
        .from('udg_keys')
        .select('*')
        .eq('key', key)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return {
          isValid: false,
          message: 'Invalid or inactive key. Please check your key and try again.'
        };
      }

      // Check if key has expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return {
          isValid: false,
          message: 'This key has expired. Please contact support for a new key.'
        };
      }

      // Check usage limits
      if (data.max_usage && data.usage_count >= data.max_usage) {
        return {
          isValid: false,
          message: 'This key has reached its usage limit. Please contact support.'
        };
      }

      // Update usage count
      await supabase
        .from('udg_keys')
        .update({ 
          usage_count: (data.usage_count || 0) + 1,
          last_used_at: new Date().toISOString()
        })
        .eq('id', data.id);

      return {
        isValid: true,
        message: 'Key validated successfully! Access granted.',
        keyData: data
      };
    } catch (error) {
      console.error('Validation error:', error);
      return {
        isValid: false,
        message: 'Validation failed. Please check your connection and try again.'
      };
    }
  };

  const handleKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyInput.trim()) {
      setValidationResult({
        isValid: false,
        message: 'Please enter a valid UDG key.'
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    // Simulate validation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = await validateKey(keyInput.trim());
    setValidationResult(result);
    setIsValidating(false);
  };

  const handleDownload = async () => {
    if (!validationResult?.isValid) return;

    setIsDownloading(true);
    
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real implementation, this would trigger the actual download
    alert('Download would start here. This is a demo version.');
    
    setIsDownloading(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Main Content */}
        <div className={`transition-all duration-1000 ${systemReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <Key className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Granted</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Enter your UDG V 5.0 decryption key to access all premium FiveM resources
            </p>
          </div>

          {/* Key Input Form */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
            <form onSubmit={handleKeySubmit} className="space-y-6">
              <div>
                <label htmlFor="key" className="block text-sm font-medium text-gray-300 mb-2">
                  UDG Decryption Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="key"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="UDG-XXXX-XXXX-XXXX"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={isValidating}
                  />
                  <Shield className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isValidating || !keyInput.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isValidating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Validating Key...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    <span>Validate Key</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Validation Result */}
          {validationResult && (
            <div className={`bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-6 mb-8 ${
              validationResult.isValid 
                ? 'border-green-500/50 bg-green-900/10' 
                : 'border-red-500/50 bg-red-900/10'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                {validationResult.isValid ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                <h3 className={`text-lg font-semibold ${
                  validationResult.isValid ? 'text-green-400' : 'text-red-400'
                }`}>
                  {validationResult.isValid ? 'Access Granted' : 'Access Denied'}
                </h3>
              </div>
              <p className="text-gray-300 mb-4">
                {validationResult.message}
              </p>

              {validationResult.isValid && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <span className="text-gray-400">Key Type:</span>
                      <span className="text-white ml-2 font-mono">
                        {validationResult.keyData?.notes || 'Premium Access'}
                      </span>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <span className="text-gray-400">Usage:</span>
                      <span className="text-white ml-2 font-mono">
                        {validationResult.keyData?.usage_count || 0}
                        {validationResult.keyData?.max_usage ? `/${validationResult.keyData.max_usage}` : '/∞'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Preparing Download...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download All Resources</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
              <Shield className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Secure Access</h3>
              <p className="text-gray-400 text-sm">
                All keys are validated through our secure database system
              </p>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
              <Download className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Instant Download</h3>
              <p className="text-gray-400 text-sm">
                Get immediate access to all decrypted FiveM resources
              </p>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Usage Tracking</h3>
              <p className="text-gray-400 text-sm">
                Key usage is monitored to prevent unauthorized access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainInterface;