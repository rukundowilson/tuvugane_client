"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import AdminLogoutButton from '../components/AdminLogoutButton';

interface AdminData {
  super_admin_id: number;
  name: string;
  email: string;
  phone?: string;
  created_at?: string;
}

const AdminDashboard: React.FC = () => {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const profileData = await apiService.get<AdminData>('/super-admin/profile', token);
        setAdmin(profileData);
      } catch (err: any) {
        setError(err.message || 'Failed to load admin profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome to the administration panel</p>
            </div>
            <div className="mt-4 md:mt-0">
              <AdminLogoutButton className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition" />
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
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
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
            </div>
            
            <div className="p-6">
              {admin && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="mt-1 text-sm text-gray-900">{admin.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-sm text-gray-900">{admin.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="mt-1 text-sm text-gray-900">{admin.phone || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Created</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/admin/dashboard/users" className="text-primary-600 hover:text-primary-800">
                  Manage Users
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard/complaints" className="text-primary-600 hover:text-primary-800">
                  View Complaints
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard/institutions" className="text-primary-600 hover:text-primary-800">
                  Manage Institutions
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard/agencies" className="text-primary-600 hover:text-primary-800">
                  Manage Agencies
                </Link>
              </li>
              <li>
                <Link href="/admin/superadmin/categories" className="text-primary-600 hover:text-primary-800">
                  Manage Categories
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard/settings" className="text-primary-600 hover:text-primary-800">
                  System Settings
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">--</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Complaints</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">--</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Complaints</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <p className="text-gray-500 text-sm">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 