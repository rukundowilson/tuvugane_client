"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

interface AdminLogoutButtonProps {
  className?: string;
}

const AdminLogoutButton: React.FC<AdminLogoutButtonProps> = ({ className }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdminLoggedIn');
    
    // Redirect to admin login page` 
    router.push('/admin/login');
  };

  return (
    <button
      onClick={handleLogout}
      className={className || "text-gray-600 hover:text-primary-600 transition"}
    >
      Logout
    </button>
  );
};

export default AdminLogoutButton; 