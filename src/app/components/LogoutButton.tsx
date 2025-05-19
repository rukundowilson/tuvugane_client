"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    localStorage.removeItem('isLoggedIn');
    
    // Force a page reload to update the navigation state
    window.location.href = '/';
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

export default LogoutButton; 