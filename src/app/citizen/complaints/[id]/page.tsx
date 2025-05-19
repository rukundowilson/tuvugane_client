"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { apiService } from '@/services/api';

interface TicketResponse {
  response_id: number;
  ticket_id: number;
  admin_id: number;
  message: string;
  created_at: string;
  admin_name: string;
  admin_email: string;
}

interface Ticket {
  ticket_id: number;
  subject: string;
  description: string;
  location: string;
  photo_url: string | null;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
  category_name: string;
  category_id: number;
  assigned_agency_name?: string | null;
  agency_id?: number | null;
}

const ComplaintDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ticketId = params.id as string;

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('userToken');
        
        if (!token) {
          router.push('/login');
          return;
        }
        
        // Fetch ticket details
        const ticketData = await apiService.get<Ticket>(`/tickets/${ticketId}`, token);
        setTicket(ticketData);
        
        // Fetch responses
        const responsesData = await apiService.get<TicketResponse[]>(`/tickets/${ticketId}/responses`, token);
        setResponses(responsesData);
      } catch (err: any) {
        console.error('Error fetching ticket details:', err);
        
        if (err.message && err.message.includes('401')) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          router.push('/login');
        } else if (err.message && err.message.includes('404')) {
          setError('Complaint not found');
        } else {
          setError(err.message || 'Failed to load complaint details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId, router]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading complaint details...</p>
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
        <div className="mt-6">
          <Link href="/citizen/complaints" className="text-primary-600 hover:text-primary-500">
            &larr; Back to complaints
          </Link>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/citizen/complaints" className="text-primary-600 hover:text-primary-500">
            &larr; Back to complaints
          </Link>
        </div>
        
        {/* Complaint Header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Complaint #{ticket.ticket_id}</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{ticket.subject}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">{ticket.description}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{ticket.location}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{ticket.category_name}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Assigned to</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {ticket.assigned_agency_name || 'Not yet assigned'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Submitted on</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(ticket.created_at).toLocaleString()}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Last updated</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(ticket.updated_at).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Responses Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Responses</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {responses.length === 0 
                ? 'No responses yet. Check back later for updates from the agency.' 
                : `${responses.length} response${responses.length === 1 ? '' : 's'} from the agency.`}
            </p>
          </div>
          
          {responses.length > 0 ? (
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <ul className="space-y-8">
                {responses.map((response) => (
                  <li key={response.response_id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{response.admin_name}</p>
                        <p className="text-xs text-gray-500">{response.admin_email}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(response.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <p className="whitespace-pre-line">{response.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="border-t border-gray-200 px-4 py-10 sm:px-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              <p className="mt-2 text-sm text-gray-500">No responses yet</p>
              <p className="text-xs text-gray-400">The agency will respond to your complaint soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailPage; 