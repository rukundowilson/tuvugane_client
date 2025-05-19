"use client"

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '../components/LogoutButton';

interface User {
  name: string;
  email: string;
}

const CitizenLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  
  // Links for the sidebar navigation
  const navLinks = [
    { name: 'Dashboard', href: '/citizen/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'My Complaints', href: '/citizen/complaints', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'New Complaint', href: '/citizen/dashboard/new-complaint', icon: 'M12 4v16m8-8H4' },
    { name: 'Profile', href: '/citizen/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  // Check if the page is active
  const isActivePage = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Get user data from localStorage
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error parsing user data', error);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-800">Tuvugane</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/citizen/dashboard/new-complaint"
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                New Complaint
              </Link>
              
              {user && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    {user.name ? user.name.split(' ')[0] : 'User'}
                  </span>
                  <LogoutButton className="text-gray-600 hover:text-primary-600 transition" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0 bg-white shadow rounded-lg mb-6 md:mb-0 md:mr-6">
            <nav className="p-4">
              <ul>
                {navLinks.map((link) => (
                  <li key={link.name} className="mb-2">
                    <Link
                      href={link.href}
                      className={`flex items-center p-2 rounded-md ${
                        isActivePage(link.href)
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      } transition-colors`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`mr-3 h-5 w-5 ${
                          isActivePage(link.href) ? 'text-primary-500' : 'text-gray-500'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={link.icon}
                        />
                      </svg>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Help & Resources
                </h3>
                <ul className="mt-2">
                  <li>
                    <Link 
                      href="/help" 
                      className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      FAQ & Help
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/track-complaint" 
                      className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Track Public Complaint
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white shadow rounded-lg">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenLayout; 