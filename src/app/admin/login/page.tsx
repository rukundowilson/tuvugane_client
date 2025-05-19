"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';
import Nav from '../../components/Nav';

interface AdminLoginResponse {
  super_admin_id?: number;
  admin_id?: number;
  name: string;
  email: string;
  phone?: string;
  token: string;
  agency_id?: number;
  agency_name?: string;
  role?: string;
}

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loginType, setLoginType] = useState<'super-admin' | 'agency-admin'>('agency-admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let adminData: AdminLoginResponse;
      
      // Log credentials being sent (for debugging only, remove in production)
      console.log('Login attempt:', { 
        type: loginType, 
        email: formData.email,
        passwordLength: formData.password.length 
      });
      
      // Determine which endpoint to call based on login type
      if (loginType === 'super-admin') {
        adminData = await apiService.post<AdminLoginResponse>('/super-admin/login', {
          email: formData.email,
          password: formData.password
        });
        
        // Store admin data and token in localStorage
        localStorage.setItem('adminData', JSON.stringify(adminData));
        localStorage.setItem('adminToken', adminData.token);
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('isAgencyAdminLoggedIn', 'false');
        localStorage.setItem('adminType', 'super-admin');
        
        // Show success message
        setSuccess('Login successful! Redirecting to dashboard...');
        
        // Redirect to super admin dashboard after a short delay
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1000);
      } else {
        // Agency admin login
        adminData = await apiService.post<AdminLoginResponse>('/admins/login', {
          email: formData.email,
          password: formData.password
        });
        
        // Store admin data and token in localStorage
        localStorage.setItem('adminData', JSON.stringify(adminData));
        localStorage.setItem('agencyAdminToken', adminData.token);
        localStorage.setItem('isAgencyAdminLoggedIn', 'true');
        localStorage.setItem('isAdminLoggedIn', 'false');
        localStorage.setItem('adminType', 'agency-admin');
        localStorage.setItem('agencyId', adminData.agency_id?.toString() || '');
        localStorage.setItem('agencyName', adminData.agency_name || '');
        
        // Show success message
        setSuccess('Login successful! Redirecting to dashboard...');
        
        // Redirect to agency admin dashboard after a short delay
        setTimeout(() => {
          router.push('/admin/agency/dashboard');
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200 animate-fade-in">
          <div className="text-center">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 shadow-md mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {loginType === 'super-admin' ? 'Super Admin Portal' : 'Agency Admin Portal'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your administrative dashboard
            </p>
          </div>
          
          {/* Login type selector */}
          <div className="mt-6 flex bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginType('agency-admin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                loginType === 'agency-admin'
                  ? 'bg-white text-indigo-700 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Agency Admin
            </button>
            
            <button
              type="button"
              onClick={() => setLoginType('super-admin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                loginType === 'super-admin'
                  ? 'bg-white text-indigo-700 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Super Admin
            </button>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="peer block w-full px-3 py-2.5 rounded-md border-2 border-gray-300 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-indigo-300 pl-10"
                  placeholder=" "
                />
                <label 
                  htmlFor="email" 
                  className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
                >
                  Email address
                </label>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
              </div>
              
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="peer block w-full px-3 py-2.5 rounded-md border-2 border-gray-300 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 bg-white hover:border-indigo-300 pl-10"
                  placeholder=" "
                />
                <label 
                  htmlFor="password" 
                  className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
                >
                  Password
                </label>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div>
                <Link href="/admin/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-sm animate-fade-in">
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
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md shadow-sm animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 shadow-md"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-indigo-200 group-hover:text-indigo-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Sign in as {loginType === 'super-admin' ? 'Super Admin' : 'Agency Admin'}
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            {loginType === 'super-admin' ? (
              <Link href="/admin/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Register as Super Admin
              </Link>
            ) : (
              <span className="text-sm text-gray-600">
                Need help? Contact your system administrator
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;