"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  adminType?: 'super-admin' | 'agency-admin' | 'any';
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children, adminType = 'any' }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check which type of admin is logged in
    const isSuperAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const isAgencyAdminLoggedIn = localStorage.getItem('isAgencyAdminLoggedIn') === 'true';
    const storedAdminType = localStorage.getItem('adminType');
    
    const superAdminToken = localStorage.getItem('adminToken');
    const agencyAdminToken = localStorage.getItem('agencyAdminToken');
    
    let hasAccess = false;
    
    if (adminType === 'any') {
      // Any admin type is allowed
      hasAccess = (isSuperAdminLoggedIn && !!superAdminToken) || 
                 (isAgencyAdminLoggedIn && !!agencyAdminToken);
    } else if (adminType === 'super-admin') {
      // Only super admin is allowed
      hasAccess = isSuperAdminLoggedIn && !!superAdminToken && storedAdminType === 'super-admin';
    } else if (adminType === 'agency-admin') {
      // Only agency admin is allowed
      hasAccess = isAgencyAdminLoggedIn && !!agencyAdminToken && storedAdminType === 'agency-admin';
    }
    
    if (!hasAccess) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router, adminType]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default AdminAuthGuard; 