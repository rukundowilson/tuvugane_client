"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';

interface Category {
  category_id: number;
  name: string;
}

interface Agency {
  agency_id: number;
  name: string;
}

// Define a type for the possible API responses
type ApiResponse = {
  [key: string]: any;
};

const NewComplaint: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    location: '',
    category_id: '',
    agency_id: '',
    is_anonymous: false,
    photo_url: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          router.push('/login');
          return;
        }

        // Load user data from localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }

        // Setup default fallback data in case API fails
        let categoriesData: Category[] = [];
        let agenciesData: Agency[] = [];

        // Fetch categories
        try {
          const response = await apiService.get<ApiResponse>('/categories', token);
          console.log('Categories response:', response);
          
          if (response) {
            if (Array.isArray(response)) {
              categoriesData = response as Category[];
            } else if ((response as ApiResponse).categories && Array.isArray((response as ApiResponse).categories)) {
              categoriesData = (response as ApiResponse).categories as Category[];
            } else if ((response as ApiResponse).data && Array.isArray((response as ApiResponse).data)) {
              categoriesData = (response as ApiResponse).data as Category[];
            } else {
              console.error('Unexpected categories format:', response);
              // Try to extract categories if it's some custom format
              const anyResponse = response as any;
              if (anyResponse && typeof anyResponse === 'object') {
                // Look for any array property that might contain categories
                const possibleArrays = Object.values(anyResponse).filter(val => Array.isArray(val));
                if (possibleArrays.length > 0) {
                  // Use the first array found
                  categoriesData = possibleArrays[0] as Category[];
                  console.log('Found potential categories array:', categoriesData);
                }
              }
            }
          }
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }

        // Fetch agencies
        try {
          const response = await apiService.get<ApiResponse>('/agencies', token);
          console.log('Agencies response:', response);
          
          if (response) {
            if (Array.isArray(response)) {
              agenciesData = response as Agency[];
            } else if ((response as ApiResponse).agencies && Array.isArray((response as ApiResponse).agencies)) {
              agenciesData = (response as ApiResponse).agencies as Agency[];
            } else if ((response as ApiResponse).data && Array.isArray((response as ApiResponse).data)) {
              agenciesData = (response as ApiResponse).data as Agency[];
            } else {
              console.error('Unexpected agencies format:', response);
              // Try to extract agencies if it's some custom format
              const anyResponse = response as any;
              if (anyResponse && typeof anyResponse === 'object') {
                // Look for any array property that might contain agencies
                const possibleArrays = Object.values(anyResponse).filter(val => Array.isArray(val));
                if (possibleArrays.length > 0) {
                  // Use the first array found
                  agenciesData = possibleArrays[0] as Agency[];
                  console.log('Found potential agencies array:', agenciesData);
                }
              }
            }
          }
        } catch (error) {
          console.error('Failed to fetch agencies:', error);
        }

        // Set the data regardless of success or failure
        setCategories(categoriesData);
        setAgencies(agenciesData);
      } catch (err: any) {
        setError(err.message || 'Failed to load required data');
        console.error('Main error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        router.push('/login');
        return;
      }

      // Prepare data for submission
      const payload = {
        ...formData,
        user_id: userData?.user_id,
        category_id: parseInt(formData.category_id),
        agency_id: parseInt(formData.agency_id),
        is_anonymous: formData.is_anonymous ? true : false
      };

      // Submit the complaint
      await apiService.post('/tickets', payload, token);
      
      // Redirect to dashboard on success
      router.push('/citizen/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to submit complaint');
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit New Complaint</h1>
          
          {error && (
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
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Kigali, Nyarugenge District"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  required
                  value={formData.category_id}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select a category</option>
                  {categories && categories.length > 0 ? (
                    categories.map(category => (
                      <option key={category.category_id || Math.random()} value={category.category_id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No categories available</option>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="agency_id" className="block text-sm font-medium text-gray-700">
                  Agency <span className="text-red-500">*</span>
                </label>
                <select
                  id="agency_id"
                  name="agency_id"
                  required
                  value={formData.agency_id}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select an agency</option>
                  {agencies && agencies.length > 0 ? (
                    agencies.map(agency => (
                      <option key={agency.agency_id || Math.random()} value={agency.agency_id}>
                        {agency.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No agencies available</option>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="photo_url" className="block text-sm font-medium text-gray-700">
                Photo URL (Optional)
              </label>
              <input
                type="text"
                id="photo_url"
                name="photo_url"
                value={formData.photo_url}
                onChange={handleChange}
                placeholder="URL to an image related to your complaint"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">Enter a URL to an image if you have one (for a production app, we would allow file uploads)</p>
            </div>

            <div className="flex items-center">
              <input
                id="is_anonymous"
                name="is_anonymous"
                type="checkbox"
                checked={formData.is_anonymous}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_anonymous" className="ml-2 block text-sm text-gray-700">
                Submit complaint anonymously
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/citizen/dashboard')}
                className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
              >
                {submitLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Submit Complaint
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewComplaint; 