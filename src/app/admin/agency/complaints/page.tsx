"use client";
import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useRouter } from 'next/navigation';
import AdminAuthGuard from '../../components/AdminAuthGuard';

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
  description: string;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';
  created_at: string;
  user_name?: string;
  is_anonymous: boolean;
  location?: string;
  category_name?: string;
  photo_url?: string;
}

interface TicketResponse {
  response_id: number;
  ticket_id: number;
  admin_id: number;
  message: string;
  created_at: string;
  admin_name: string;
  admin_email: string;
}

const AgencyComplaintsPage: React.FC = () => {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [newResponse, setNewResponse] = useState('');
  const [sendingResponse, setSendingResponse] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        // Get admin data from localStorage
        const storedAdminData = localStorage.getItem('adminData');
        
        if (storedAdminData) {
          const parsedData = JSON.parse(storedAdminData);
          
          // Get token
          const token = localStorage.getItem('agencyAdminToken');
          if (!token) throw new Error('Authentication token not found');
          
          // Fetch complaints for this agency
          const agencyId = parsedData.agency_id;
          if (!agencyId) throw new Error('Agency ID not found');
          
          console.log('Fetching complaints for agency ID:', agencyId);
          const complaintsData = await apiService.get<Complaint[]>(`/tickets/agency/${agencyId}`, token);
          
          console.log('Fetched complaints:', complaintsData);
          if (Array.isArray(complaintsData)) {
            setComplaints(complaintsData);
          }
        } else {
          // If not found, try to fetch from API
          const token = localStorage.getItem('agencyAdminToken');
          
          if (!token) {
            throw new Error('Authentication token not found');
          }
          
          try {
            const response = await apiService.get<AgencyAdmin>('/admins/profile', token);
            console.log('Admin profile response:', response);
            localStorage.setItem('adminData', JSON.stringify(response));
            
            // After fetching admin data, fetch complaints
            const agencyId = response.agency_id;
            if (!agencyId) throw new Error('Agency ID not found');
            
            console.log('Fetching complaints for agency ID:', agencyId);
            const complaintsData = await apiService.get<Complaint[]>(`/tickets/agency/${agencyId}`, token);
            
            console.log('Fetched complaints:', complaintsData);
            if (Array.isArray(complaintsData)) {
              setComplaints(complaintsData);
            }
          } catch (error) {
            console.error('Error fetching admin profile:', error);
            throw error;
          }
        }
      } catch (err: any) {
        console.error('Error fetching complaints:', err);
        setError(err.message || 'Failed to load complaints');
        
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

    fetchComplaints();
  }, [router]);

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    
    try {
      const token = localStorage.getItem('agencyAdminToken');
      if (!token) throw new Error('Authentication token not found');
      
      // Update ticket status
      await apiService.put(`/tickets/${ticketId}/status`, { status: newStatus }, token);
      
      // Update local state
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint.ticket_id === ticketId 
            ? { ...complaint, status: newStatus as 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected' } 
            : complaint
        )
      );
      
      setUpdateSuccess(`Status updated to ${newStatus} successfully`);
      
      // Close modal after success
      setTimeout(() => {
        setSelectedComplaint(null);
        setUpdateStatus('');
        setUpdateSuccess(null);
      }, 2000);
    } catch (err: any) {
      console.error('Error updating status:', err);
      setUpdateError(err.message || 'Failed to update status');
    } finally {
      setUpdateLoading(false);
    }
  };

  const fetchResponses = async (ticketId: number) => {
    try {
      const token = localStorage.getItem('agencyAdminToken');
      if (!token) throw new Error('Authentication token not found');
      
      const responsesData = await apiService.get<TicketResponse[]>(`/tickets/${ticketId}/responses`, token);
      setResponses(responsesData);
    } catch (err: any) {
      console.error('Error fetching responses:', err);
    }
  };

  const handleSendResponse = async () => {
    if (!selectedComplaint || !newResponse.trim()) return;
    
    setSendingResponse(true);
    setResponseError(null);
    
    try {
      const token = localStorage.getItem('agencyAdminToken');
      if (!token) throw new Error('Authentication token not found');
      
      await apiService.post(
        `/tickets/${selectedComplaint.ticket_id}/responses`,
        { message: newResponse },
        token
      );
      
      // Refresh responses
      await fetchResponses(selectedComplaint.ticket_id);
      
      // Clear input
      setNewResponse('');
    } catch (err: any) {
      console.error('Error sending response:', err);
      setResponseError(err.message || 'Failed to send response');
    } finally {
      setSendingResponse(false);
    }
  };

  const openComplaintDetails = async (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setUpdateStatus(complaint.status);
    await fetchResponses(complaint.ticket_id);
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (statusFilter === 'all') return true;
    return complaint.status === statusFilter as 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen -mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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
      </div>
    );
  }

  return (
    <AdminAuthGuard adminType="agency-admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Complaints Management</h1>
            <p className="text-gray-600 mt-1">
              Review and manage citizen complaints assigned to your agency
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <label htmlFor="status-filter" className="sr-only">Filter by status</label>
            <select
              id="status-filter"
              name="status-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint) => (
                    <tr key={complaint.ticket_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{complaint.ticket_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.location || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.category_name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            complaint.status === 'Assigned' ? 'bg-purple-100 text-purple-800' :
                            complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                            complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(complaint.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => openComplaintDetails(complaint)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No complaints found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Complaint Details Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Very subtle backdrop blur without darkening */}
            <div className="fixed inset-0 backdrop-blur-[2px] bg-transparent transition-all"></div>
            
            {/* Modal positioning */}
            <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
              {/* Modal container with animation */}
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl animate-modal-appear">
                {/* Modal Header */}
                <div className="bg-white px-6 py-4 border-b flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800" id="modal-title">
                    Complaint #{selectedComplaint.ticket_id}
                  </h3>
                  <button 
                    onClick={() => setSelectedComplaint(null)} 
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Modal Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto bg-white">
                  {/* Complaint Information */}
                  <div className="space-y-5">
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1">Subject</h4>
                          <p className="text-gray-800">{selectedComplaint.subject}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1">Status</h4>
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${selectedComplaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300' : 
                              selectedComplaint.status === 'Assigned' ? 'bg-purple-100 text-purple-800 ring-1 ring-purple-300' :
                              selectedComplaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-300' : 
                              selectedComplaint.status === 'Resolved' ? 'bg-green-100 text-green-800 ring-1 ring-green-300' : 
                              'bg-red-100 text-red-800 ring-1 ring-red-300'}`}>
                            {selectedComplaint.status}
                          </span>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1">Submitted By</h4>
                          <p className="text-gray-800">{selectedComplaint.is_anonymous ? 'Anonymous' : selectedComplaint.user_name || 'Citizen'}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1">Date Submitted</h4>
                          <p className="text-gray-800">{new Date(selectedComplaint.created_at).toLocaleString()}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1">Location</h4>
                          <p className="text-gray-800">{selectedComplaint.location || 'N/A'}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1">Category</h4>
                          <p className="text-gray-800">{selectedComplaint.category_name || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Description</h4>
                        <p className="bg-white p-4 border rounded-md mt-1 whitespace-pre-line text-gray-800 shadow-inner">{selectedComplaint.description}</p>
                      </div>
                    </div>
                    
                    {/* Status Update */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-3">Update Status</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <select
                          id="status-update"
                          name="status-update"
                          className="block w-full sm:max-w-[200px] py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          value={updateStatus}
                          onChange={(e) => setUpdateStatus(e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        
                        <button
                          type="button"
                          onClick={() => handleStatusChange(selectedComplaint.ticket_id, updateStatus)}
                          disabled={updateLoading}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                        >
                          {updateLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Updating...
                            </>
                          ) : 'Update Status'}
                        </button>
                      </div>
                      
                      {updateSuccess && (
                        <div className="mt-3 text-sm text-green-600 bg-green-50 p-2 rounded-md border border-green-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {updateSuccess}
                        </div>
                      )}
                      
                      {updateError && (
                        <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          {updateError}
                        </div>
                      )}
                    </div>
                    
                    {/* Responses Section */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-3">Responses</h4>
                      
                      <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-1">
                        {responses.length === 0 ? (
                          <div className="text-gray-500 italic text-center py-4 bg-white rounded-md border border-gray-200">
                            No responses yet
                          </div>
                        ) : (
                          responses.map((response) => (
                            <div key={response.response_id} className="bg-white p-4 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-800">{response.admin_name}</p>
                                  <p className="text-sm text-gray-500">{response.admin_email}</p>
                                </div>
                                <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {new Date(response.created_at).toLocaleString()}
                                </p>
                              </div>
                              <p className="mt-2 text-gray-700 border-t pt-2">{response.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Add Response</h4>
                        <textarea
                          id="response-text"
                          name="response-text"
                          rows={3}
                          className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          value={newResponse}
                          onChange={(e) => setNewResponse(e.target.value)}
                          placeholder="Type your response here..."
                        />
                        
                        {responseError && (
                          <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {responseError}
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={handleSendResponse}
                          disabled={sendingResponse || !newResponse.trim()}
                          className="mt-3 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                        >
                          {sendingResponse ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </>
                          ) : 'Send Response'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    onClick={() => setSelectedComplaint(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminAuthGuard>
  );
};

export default AgencyComplaintsPage; 