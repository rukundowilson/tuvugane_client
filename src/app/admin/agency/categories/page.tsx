"use client"
import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { usePathname } from 'next/navigation';

interface Category {
  category_id: number;
  name: string;
  mapping_id?: number;
}

interface AgencyAdmin {
  admin_id: number;
  name: string;
  agency_id: number;
  agency_name?: string;
}

const AgencyCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mappedCategories, setMappedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminData, setAdminData] = useState<AgencyAdmin | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isMappingCategory, setIsMappingCategory] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [agencyId, setAgencyId] = useState<number | null>(null);
  const [manualAgencyId, setManualAgencyId] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        console.log('Attempting to determine agency ID...');
        
        // Try to get agency ID from URL path (i.e., /admin/agency/:agencyId/...)
        const urlAgencyIdMatch = pathname?.match(/\/admin\/agency\/(\d+)/);
        if (urlAgencyIdMatch && urlAgencyIdMatch[1]) {
          const urlAgencyId = parseInt(urlAgencyIdMatch[1], 10);
          if (!isNaN(urlAgencyId)) {
            console.log('Found agency ID from URL path:', urlAgencyId);
            setAgencyId(urlAgencyId);
            return urlAgencyId;
          }
        }
        
        // Get token from any possible localStorage key
        const token = localStorage.getItem('adminToken') || 
                      localStorage.getItem('agencyAdminToken') || 
                      localStorage.getItem('agencyToken') ||
                      localStorage.getItem('userToken');
                      
        if (!token) {
          console.log('No authentication token found');
          throw new Error('Authentication token not found');
        }
        
        console.log('Found authentication token');
        
        // Check all possible localStorage keys for admin data
        const storageKeys = [
          'agencyAdminData',
          'adminData',
          'userData',
          'agencyData'
        ];
        
        for (const key of storageKeys) {
          const storedData = localStorage.getItem(key);
          if (storedData) {
            try {
              console.log(`Checking ${key} for agency ID...`);
              const data = JSON.parse(storedData);
              
              // Look for agency_id in various possible property names
              const possibleAgencyId = data.agency_id || data.agencyId || 
                                       (data.agency && data.agency.id) || 
                                       (data.agency && data.agency.agency_id);
                                       
              if (possibleAgencyId && typeof possibleAgencyId === 'number') {
                console.log(`Found agency ID (${possibleAgencyId}) in ${key}`);
                setAdminData(data);
                setAgencyId(possibleAgencyId);
                return possibleAgencyId;
              }
            } catch (err) {
              console.error(`Failed to parse ${key}:`, err);
            }
          }
        }
        
        // Try API calls to find the agency ID
        console.log('Trying API calls to find agency ID...');
        
        // Try agency admin profile endpoint
        try {
          const profileData = await apiService.get<AgencyAdmin>('/admins/profile', token);
          if (profileData && profileData.agency_id) {
            console.log('Found agency ID from admin profile:', profileData.agency_id);
            setAgencyId(profileData.agency_id);
            setAdminData(profileData);
            return profileData.agency_id;
          }
        } catch (profileErr) {
          console.error('Error fetching admin profile:', profileErr);
        }
        
        // Show manual input as last resort
        console.log('Could not determine agency ID automatically');
        setShowManualInput(true);
        throw new Error('Could not determine agency ID automatically. Please enter it manually.');
      } catch (err: any) {
        console.error('Error determining agency ID:', err);
        setError(err.message || 'Failed to load admin data');
        setShowManualInput(true);
        return null;
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedAgencyId = await fetchAdminData();
        
        if (!fetchedAgencyId && !showManualInput) {
          throw new Error('Failed to determine agency ID');
        }
        
        // If we need manual input, stop here and wait for user input
        if (showManualInput && !fetchedAgencyId) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('adminToken') || 
                      localStorage.getItem('agencyAdminToken') || 
                      localStorage.getItem('agencyToken') || 
                      localStorage.getItem('userToken');
                      
        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Fetch all categories
        const allCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>('/categories', token);
        
        // Fetch categories mapped to this agency
        const mappedCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>(`/categories/agency/${fetchedAgencyId}`, token);
        
        // Get all categories
        const allCategories = allCategoriesResponse.data || [];
        
        // Get mapped categories
        const agencyCategories = mappedCategoriesResponse.data || [];
        
        // Set state
        setCategories(allCategories);
        setMappedCategories(agencyCategories);
      } catch (err: any) {
        setError(err.message || 'Failed to load categories');
        console.error('Error loading categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathname]);
  
  const handleManualAgencyIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualAgencyId.trim()) {
      setError('Agency ID is required');
      return;
    }
    
    const parsedId = parseInt(manualAgencyId, 10);
    if (isNaN(parsedId)) {
      setError('Please enter a valid number for Agency ID');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Set the agency ID and continue with data fetching
      setAgencyId(parsedId);
      
      const token = localStorage.getItem('adminToken') || 
                   localStorage.getItem('agencyAdminToken') || 
                   localStorage.getItem('agencyToken') || 
                   localStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Fetch all categories
      const allCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>('/categories', token);
      
      // Fetch categories mapped to this agency
      const mappedCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>(`/categories/agency/${parsedId}`, token);
      
      // Get all categories
      const allCategories = allCategoriesResponse.data || [];
      
      // Get mapped categories
      const agencyCategories = mappedCategoriesResponse.data || [];
      
      // Set state
      setCategories(allCategories);
      setMappedCategories(agencyCategories);
      
      // Hide the manual input form
      setShowManualInput(false);
      
      // Save the agency ID to localStorage for future use
      try {
        localStorage.setItem('lastUsedAgencyId', parsedId.toString());
        setSuccessMessage('Agency ID verified and categories loaded successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (e) {
        console.error('Failed to save agency ID to localStorage:', e);
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to load categories with provided Agency ID');
      console.error('Error with manual agency ID:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMapCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId || !agencyId) return;

    try {
      setIsMappingCategory(true);
      setError('');
      
      const token = localStorage.getItem('adminToken') || 
                   localStorage.getItem('agencyAdminToken') || 
                   localStorage.getItem('agencyToken') || 
                   localStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Map the category to the agency
      await apiService.post('/categories/map', {
        category_id: parseInt(selectedCategoryId),
        agency_id: agencyId
      }, token);

      // Refresh the mapped categories
      const mappedCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>(`/categories/agency/${agencyId}`, token);
      setMappedCategories(mappedCategoriesResponse.data || []);
      
      // Reset selection
      setSelectedCategoryId('');
      
      // Show success message
      const selectedCategory = categories.find(c => c.category_id === parseInt(selectedCategoryId));
      setSuccessMessage(`Category "${selectedCategory?.name}" added to your agency successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to map category to agency');
      console.error('Error mapping category:', err);
    } finally {
      setIsMappingCategory(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !agencyId) return;

    try {
      setIsCreatingCategory(true);
      setError('');
      
      const token = localStorage.getItem('adminToken') || 
                   localStorage.getItem('agencyAdminToken') || 
                   localStorage.getItem('agencyToken') || 
                   localStorage.getItem('userToken');
                   
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // First create the category
      const response = await apiService.post<{ success: boolean; data: Category }>('/categories', {
        name: newCategoryName.trim()
      }, token);

      if (response && response.data && response.data.category_id) {
        // Then map it to the agency
        await apiService.post('/categories/map', {
          category_id: response.data.category_id,
          agency_id: agencyId
        }, token);

        // Refresh categories
        const allCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>('/categories', token);
        setCategories(allCategoriesResponse.data || []);

        // Refresh mapped categories
        const mappedCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>(`/categories/agency/${agencyId}`, token);
        setMappedCategories(mappedCategoriesResponse.data || []);
        
        // Show success message
        setSuccessMessage(`Category "${newCategoryName}" created and added to your agency`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
      
      // Reset form
      setNewCategoryName('');
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
      console.error('Error creating category:', err);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleUnmapCategory = async (mappingId: number, categoryName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${categoryName}" from your agency?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken') || 
                   localStorage.getItem('agencyAdminToken') || 
                   localStorage.getItem('agencyToken') || 
                   localStorage.getItem('userToken');
                   
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Delete the mapping
      await apiService.delete(`/categories/map/${mappingId}`, token);

      // Refresh the mapped categories
      if (agencyId) {
        const mappedCategoriesResponse = await apiService.get<{ success: boolean; data: Category[] }>(`/categories/agency/${agencyId}`, token);
        setMappedCategories(mappedCategoriesResponse.data || []);
        
        // Show success message
        setSuccessMessage(`Category "${categoryName}" removed from your agency`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove category mapping');
      console.error('Error removing category mapping:', err);
    }
  };

  // Filter out categories that are already mapped
  const unmappedCategories = categories.filter(
    cat => !mappedCategories.some(mapCat => mapCat.category_id === cat.category_id)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen -mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }
  
  if (showManualInput && !agencyId) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Agency ID Required</h1>
          
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-sm animate-fade-in">
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
          
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <p className="text-gray-600 mb-4">
              We couldn't automatically determine your Agency ID. Please enter it manually to continue.
            </p>
            <form onSubmit={handleManualAgencyIdSubmit}>
              <div className="mb-4">
                <label htmlFor="agencyId" className="block text-sm font-medium text-gray-700 mb-1">
                  Agency ID
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="agencyId"
                    value={manualAgencyId}
                    onChange={(e) => setManualAgencyId(e.target.value)}
                    className="peer mt-1 block w-full px-3 py-2.5 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:text-sm transition-all duration-200 bg-white hover:border-indigo-300 pl-8"
                    placeholder=" "
                    required
                  />
                  <label 
                    htmlFor="agencyId" 
                    className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-8 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
                  >
                    Enter your Agency ID
                  </label>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Continue
              </button>
            </form>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              If you don't know your Agency ID, please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-1">Create and manage categories for your agency</p>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-sm animate-fade-in">
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
      
      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-md shadow-sm animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {agencyId && (
        <div className="mb-6 bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md shadow-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-indigo-700 font-medium">Managing categories for Agency ID: {agencyId}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column: Create and Map categories */}
        <div className="space-y-8">
          {/* Create new category card */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-white bg-opacity-90">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create New Category
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="categoryName"
                      name="categoryName"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="peer block w-full px-3 py-2.5 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:text-sm transition-all duration-200 bg-white hover:border-indigo-300 pl-8"
                      placeholder=" "
                      required
                    />
                    <label 
                      htmlFor="categoryName" 
                      className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-8 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
                    >
                      Enter category name
                    </label>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isCreatingCategory || !newCategoryName.trim()}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    {isCreatingCategory ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Category
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Map existing category card */}
          {unmappedCategories.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200 bg-white bg-opacity-90">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  Add Existing Category
                </h3>
              </div>
              <div className="p-6">
                <form onSubmit={handleMapCategory} className="space-y-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Category
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="peer block w-full px-3 py-2.5 rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:text-sm transition-all duration-200 bg-white hover:border-indigo-300 pl-8 appearance-none"
                        required
                      >
                        <option value="" disabled>Select a category</option>
                        {unmappedCategories.map((category) => (
                          <option key={category.category_id} value={category.category_id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <label 
                        htmlFor="category" 
                        className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-8 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
                      >
                        {!selectedCategoryId && "Select a category"}
                      </label>
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isMappingCategory || !selectedCategoryId}
                      className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                      {isMappingCategory ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          Add to Agency
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        
        {/* Right column: Existing agency categories */}
        <div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Agency Categories
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Categories your agency is responsible for handling
                </p>
              </div>
              <div className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm font-medium">
                {mappedCategories.length} {mappedCategories.length === 1 ? 'Category' : 'Categories'}
              </div>
            </div>
            
            {mappedCategories.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-gray-500 mb-2">No categories have been assigned to your agency yet</p>
                <p className="text-sm text-gray-400">Create a new category or add an existing one to get started</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 max-h-[550px] overflow-y-auto">
                {mappedCategories.map((category) => (
                  <li key={category.category_id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </div>
                      <button
                        onClick={() => category.mapping_id && handleUnmapCategory(category.mapping_id, category.name)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyCategories; 