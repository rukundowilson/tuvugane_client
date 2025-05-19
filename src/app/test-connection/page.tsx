"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '@/services/api';

interface ServerResponse {
  success: boolean;
  message: string;
  timestamp: string;
  serverInfo: {
    node: string;
    environment: string;
  };
}

export default function TestConnection() {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<ServerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.get<ServerResponse>('/test/ping');
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to server');
      console.error('Connection test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">API Connection Test</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : response && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{response.message}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 space-y-4">
          {response && (
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-500">Server Response:</h3>
              <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-100 rounded">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="flex justify-between">
            <button
              onClick={testConnection}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Test Again'}
            </button>
            
            <Link href="/" className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 