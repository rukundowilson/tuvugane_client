"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiService } from '@/services/api';

interface VerifyEmailProps {
  params: Promise<{
    token: string;
  }>;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const { token } = resolvedParams;
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await apiService.get(`/super-admin/verify/${token}`);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message || 'Verification failed. The token may be invalid or expired.');
        console.error(err);
      } finally {
        setVerifying(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {success ? 'Email Verified!' : 'Verification Failed'}
          </h2>
          
          {success ? (
            <div className="mt-8 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Your email has been verified successfully. You can now log in to your account.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error || 'Verification failed. Please try again or contact support.'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Link href="/admin/login" className="font-medium text-primary-600 hover:text-primary-500">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 