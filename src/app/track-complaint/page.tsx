"use client"
import React, { useState } from 'react';
import { apiService } from '@/services/api';
import { ArrowPathIcon, ClipboardDocumentIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Nav from '../components/Nav';

interface TicketResponse {
  response_id: number;
  ticket_id: number;
  admin_id: number;
  admin_name?: string;
  message: string;
  created_at: string;
}

interface Ticket {
  ticket_id: number;
  subject: string;
  description: string;
  category_name?: string;
  location: string;
  photo_url?: string;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
  responses: TicketResponse[];
}

const TrackComplaintPage: React.FC = () => {
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const handleTrackComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketId.trim()) {
      setError('Please enter a complaint ID');
      return;
    }
    
    setLoading(true);
    setError('');
    setTicket(null);
    
    try {
      // Get ticket details using the public endpoint
      const ticketData = await apiService.get<Ticket>(`/tickets/public/${ticketId.trim()}`);
      
      if (!ticketData) {
        throw new Error('Complaint not found');
      }
      
      // Get ticket responses using the public endpoint
      const responsesData = await apiService.get<TicketResponse[]>(`/tickets/public/${ticketId.trim()}/responses`);
      
      setTicket({
        ...ticketData,
        responses: responsesData || []
      });
      
    } catch (err: unknown) {
      console.error('Error fetching ticket:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve complaint information';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim() || !ticket) {
      return;
    }
    
    setIsSubmittingFeedback(true);
    
    try {
      // Use the public endpoint for submitting feedback
      await apiService.post(`/tickets/public/${ticket.ticket_id}/feedback`, { message: feedback.trim() });
      setFeedbackSubmitted(true);
      setFeedback('');
    } catch (err: unknown) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ticketId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Assigned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Track Your Complaint</h1>
            <p className="mt-2 text-lg text-gray-600">
              Enter your complaint ID to check the status and receive updates
            </p>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleTrackComplaint} className="space-y-4">
                <div>
                  <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700">
                    Complaint ID
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="ticketId"
                      id="ticketId"
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your complaint ID"
                    />
                    {ticketId && (
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ClipboardDocumentIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Searching...
                      </>
                    ) : (
                      'Track Complaint'
                    )}
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircleIcon className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {ticket && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Complaint #{ticket.ticket_id}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Submitted on {formatDate(ticket.created_at)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Subject</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{ticket.subject}</dd>
                  </div>
                  <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p className="whitespace-pre-line">{ticket.description}</p>
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{ticket.category_name || 'Not specified'}</dd>
                  </div>
                  <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{ticket.location || 'Not specified'}</dd>
                  </div>
                  {ticket.photo_url && (
                    <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Photo</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <a href={ticket.photo_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                          View photo
                        </a>
                      </dd>
                    </div>
                  )}
                  
                  <div className="bg-white px-4 py-5 sm:px-6 border-t border-gray-200">
                    <div className="flex flex-col space-y-4">
                      <h4 className="text-md font-medium text-gray-900">Updates & Responses</h4>
                      
                      {ticket.responses.length === 0 ? (
                        <p className="text-sm text-gray-500">No updates yet. Check back later.</p>
                      ) : (
                        <div className="flow-root">
                          <ul className="-mb-8">
                            {ticket.responses.map((response, responseIdx) => (
                              <li key={response.response_id}>
                                <div className="relative pb-8">
                                  {responseIdx !== ticket.responses.length - 1 ? (
                                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                  ) : null}
                                  <div className="relative flex items-start space-x-3">
                                    <div className="relative">
                                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                        <span className="text-sm font-medium text-white">
                                          {response.admin_name ? response.admin_name.charAt(0) : 'A'}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div>
                                        <div className="text-sm">
                                          <span className="font-medium text-gray-900">
                                            {response.admin_name || 'Staff Member'}
                                          </span>
                                        </div>
                                        <p className="mt-0.5 text-sm text-gray-500">
                                          {formatDate(response.created_at)}
                                        </p>
                                      </div>
                                      <div className="mt-2 text-sm text-gray-700">
                                        <p className="whitespace-pre-line">{response.message}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-5 sm:p-6 border-t border-gray-200">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Provide Feedback</h4>
                    
                    {feedbackSubmitted ? (
                      <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <CheckCircleIcon className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">
                              Thank you for your feedback!
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitFeedback} className="space-y-4">
                        <div>
                          <label htmlFor="feedback" className="sr-only">
                            Your feedback
                          </label>
                          <textarea
                            id="feedback"
                            name="feedback"
                            rows={3}
                            className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                            placeholder="Share your thoughts about the handling of your complaint..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isSubmittingFeedback || !feedback.trim()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {isSubmittingFeedback ? (
                              <>
                                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                Submitting...
                              </>
                            ) : (
                              'Submit Feedback'
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrackComplaintPage; 