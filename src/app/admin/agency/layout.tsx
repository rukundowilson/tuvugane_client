"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AgencyAdminSidebar from '../components/AgencyAdminSidebar';

export default function AgencyAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated as agency admin
    const isAgencyAdminLoggedIn = localStorage.getItem('isAgencyAdminLoggedIn') === 'true';
    const adminType = localStorage.getItem('adminType');
    
    if (!isAgencyAdminLoggedIn || adminType !== 'agency-admin') {
      router.push('/admin/login');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <AgencyAdminSidebar>{children}</AgencyAdminSidebar>;
} 