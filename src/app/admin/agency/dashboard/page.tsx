"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminAuthGuard from '../../components/AdminAuthGuard';
import { apiService } from '@/services/api';

interface AgencyAdmin {
  admin_id: number;
  name: string;
  email: string;
  agency_id: number;
  agency_name: string;
  created_at: string;
}

interface Complaint {
  ticket_id: number;
  subject: string;
  status: string;
  created_at: string;
  user_name: string;
  category_name?: string;
}

const AgencyAdminDashboard: React.FC = () => {
  const router = useRouter();
  const [adminData, setAdminData] = useState<AgencyAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get admin data from localStorage
        const storedAdminData = localStorage.getItem('adminData');
        
        if (storedAdminData) {
          const parsedData = JSON.parse(storedAdminData);
          setAdminData(parsedData);
          
          // After setting admin data, fetch recent complaints
          fetchRecentComplaints(parsedData.agency_id);
        } else {
          // If not found, try to fetch from API
          const token = localStorage.getItem('agencyAdminToken');
          
          if (!token) {
            throw new Error('Authentication token not found');
          }
          
          console.log('Agency admin token:', token);
          
          try {
            const response = await apiService.get<AgencyAdmin>('/admins/profile', token);
            console.log('Admin profile response:', response);
            setAdminData(response);
            localStorage.setItem('adminData', JSON.stringify(response));
            
            // After fetching admin data, fetch recent complaints
            fetchRecentComplaints(response.agency_id);
          } catch (error) {
            console.error('Error fetching admin profile:', error);
            throw error;
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch admin data:', err);
        setError(err.message || 'Failed to load admin data');
        
        // Redirect to login if authentication fails
        if (err.status === 401) {
          localStorage.removeItem('agencyAdminToken');
          localStorage.removeItem('isAgencyAdminLoggedIn');
          localStorage.removeItem('adminType');
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentComplaints = async (agencyId: number) => {
      if (!agencyId) {
        console.error('Cannot fetch complaints: Agency ID is missing');
        return;
      }
      
      try {
        setComplaintsLoading(true);
        const token = localStorage.getItem('agencyAdminToken');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const complaints = await apiService.get<Complaint[]>(`/tickets/agency/${agencyId}`, token);
        // Get only the 5 most recent complaints
        setRecentComplaints(complaints.slice(0, 5));
      } catch (err: any) {
        console.error('Failed to fetch recent complaints:', err);
      } finally {
        setComplaintsLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  const handleLogout = () => {
    // Clear admin-related data from localStorage
    localStorage.removeItem('adminData');
    localStorage.removeItem('agencyAdminToken');
    localStorage.removeItem('isAgencyAdminLoggedIn');
    localStorage.removeItem('adminType');
    localStorage.removeItem('agencyId');
    localStorage.removeItem('agencyName');
    
    // Redirect to login page
    router.push('/admin/login');
  };

  return (
    <AdminAuthGuard adminType="agency-admin">
      <div className="min-h-screen bg-gray-100">
        <main className="py-10">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-700">Loading dashboard...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
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
              <div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Agency Admin Dashboard
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Welcome back, {adminData?.name}!
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Full name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {adminData?.name}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Email address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {adminData?.email}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Agency
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {adminData?.agency_name}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Admin ID
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {adminData?.admin_id}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Account created
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {new Date(adminData?.created_at || '').toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                {/* Recent Complaints Section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Recent Complaints
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Latest complaints assigned to your agency
                    </p>
                  </div>
                  <div className="border-t border-gray-200">
                    {complaintsLoading ? (
                      <div className="text-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading complaints...</p>
                      </div>
                    ) : recentComplaints.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {recentComplaints.map((complaint) => (
                              <tr key={complaint.ticket_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{complaint.ticket_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.subject}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.category_name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                      complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                                      complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                                      'bg-red-100 text-red-800'}`}>
                                    {complaint.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(complaint.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <button
                                    onClick={() => router.push(`/admin/agency/complaints?id=${complaint.ticket_id}`)}
                                    className="text-primary-600 hover:text-primary-900"
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="px-6 py-4 text-center text-sm text-gray-500">
                        No recent complaints found
                      </div>
                    )}
                    {recentComplaints.length > 0 && (
                      <div className="px-6 py-4 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => router.push('/admin/agency/complaints')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                        >
                          View All Complaints
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900">Manage Agency Settings</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your agency's profile, services, and configurations.
                      </p>
                      <button
                        type="button"
                        onClick={() => router.push('/admin/agency/settings')}
                        className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Go to Settings
                      </button>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900">View Complaints</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage complaints assigned to your agency.
                      </p>
                      <button
                        type="button"
                        onClick={() => router.push('/admin/agency/complaints')}
                        className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        View Complaints
                      </button>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900">Reports & Analytics</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        View and download reports for your agency's performance.
                      </p>
                      <button
                        type="button"
                        onClick={() => router.push('/admin/agency/reports')}
                        className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        View Reports
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AdminAuthGuard>
  );
};

export default AgencyAdminDashboard; 