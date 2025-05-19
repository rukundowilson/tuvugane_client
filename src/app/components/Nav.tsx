"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const adminDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('userToken');
    const loginStatus = !!token;
    setIsLoggedIn(loginStatus);
    
    if (loginStatus) {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error('Failed to parse user data', err);
      }
    }

    // Close admin dropdown when path changes
    setAdminDropdownOpen(false);
  }, [pathname]); // Re-check when pathname changes

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setAdminDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleAdminDropdown = () => {
    setAdminDropdownOpen(!adminDropdownOpen);
  };
  
  // Check if the current path is active
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <nav className="bg-white py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo and Brand */}
        <Link href="/">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span className="text-xl font-bold text-gray-800">Tuvugane</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Main Navigation Links - always visible */}
          <Link 
            href="/" 
            className={`${isActive('/') ? 'text-primary-600 font-medium' : 'text-gray-600'} hover:text-primary-600 transition`}
          >
            Home
          </Link>
          <Link 
            href="/track-complaint" 
            className={`${isActive('/track-complaint') ? 'text-primary-600 font-medium' : 'text-gray-600'} hover:text-primary-600 transition`}
          >
            Track Complaint
          </Link>
          
          {/* User-specific Navigation */}
          {isLoggedIn ? (
            <>
              <Link 
                href="/citizen/dashboard" 
                className={`${isActive('/citizen/dashboard') ? 'text-primary-600 font-medium' : 'text-gray-600'} hover:text-primary-600 transition`}
              >
                Dashboard
              </Link>
              <Link 
                href="/citizen/complaints" 
                className={`${isActive('/citizen/complaints') ? 'text-primary-600 font-medium' : 'text-gray-600'} hover:text-primary-600 transition`}
              >
                My Complaints
              </Link>
              <div className="flex items-center space-x-4 border-l pl-4 border-gray-200">
                <div className="text-sm text-gray-700">
                  {user?.name && <span>Hi, {user.name.split(' ')[0]}</span>}
                </div>
                <LogoutButton className="text-gray-600 hover:text-primary-600 transition" />
              </div>
              <Link 
                href="/citizen/dashboard/new-complaint" 
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Submit Complaint
              </Link>
            </>
          ) : (
            <>
              <div className="relative" ref={adminDropdownRef}>
                <button 
                  onClick={toggleAdminDropdown}
                  className="text-gray-600 hover:text-primary-600 transition flex items-center focus:outline-none"
                  aria-expanded={adminDropdownOpen}
                  aria-haspopup="true"
                >
                  Admin
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${adminDropdownOpen ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {adminDropdownOpen && (
                  <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 right-0 animate-fade-in">
                    <Link 
                      href="/admin/login" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      Staff login portal
                    </Link>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Link href="/login" className={`${isActive('/login') ? 'text-primary-600 font-medium' : 'text-gray-600'} hover:text-primary-600 transition`}>
                  Login
                </Link>
                <Link href="/register" className={`${isActive('/register') ? 'text-primary-600 font-medium' : 'text-gray-600'} hover:text-primary-600 transition`}>
                  Register
                </Link>
              </div>
              <Link href="/submit-anonymous" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition">
                Submit Anonymously
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleMobileMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden px-4 py-3 bg-gray-50 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <Link 
          href="/" 
          className={`block py-2 ${isActive('/') ? 'text-primary-600 font-medium' : 'text-gray-600'} hover:text-primary-600`}
        >
          Home
        </Link>
        <Link 
          href="/track-complaint" 
          className={`block py-2 ${isActive('/track-complaint') ? 'text-primary-600 font-medium' : 'text-gray-600'} hover:text-primary-600`}
        >
          Track Complaint
        </Link>
        
        {isLoggedIn ? (
          <>
            <Link 
              href="/citizen/dashboard" 
              className={`block py-2 ${isActive('/citizen/dashboard') ? 'text-primary-600 font-medium' : 'text-gray-600'} hover:text-primary-600`}
            >
              Dashboard
            </Link>
            <Link 
              href="/citizen/complaints" 
              className={`block py-2 ${isActive('/citizen/complaints') ? 'text-primary-600 font-medium' : 'text-gray-600'} hover:text-primary-600`}
            >
              My Complaints
            </Link>
            <Link 
              href="/citizen/dashboard/new-complaint" 
              className={`block py-2 ${isActive('/citizen/dashboard/new-complaint') ? 'text-primary-600 font-medium' : 'text-gray-600'} hover:text-primary-600`}
            >
              Submit Complaint
            </Link>
            <div className="py-2 border-t border-gray-200 mt-2">
              <div className="text-sm text-gray-700 mb-2">
                {user?.name && <span>Hi, {user.name.split(' ')[0]}</span>}
              </div>
              <LogoutButton className="text-gray-600 hover:text-primary-600 w-full text-left" />
            </div>
          </>
        ) : (
          <>
            <div className="py-2 border-b border-gray-200">
              <div className="font-medium text-gray-800 mb-1">Admin Access</div>
              <Link href="/admin/login" className="block py-1 pl-3 text-gray-600 hover:text-primary-600">
                Staff Login Portal
              </Link>
            </div>
            <Link 
              href="/login" 
              className={`block py-2 ${isActive('/login') ? 'text-primary-600 font-medium' : 'text-gray-600'} hover:text-primary-600`}
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className={`block py-2 ${isActive('/register') ? 'text-primary-600 font-medium' : 'text-gray-600'} hover:text-primary-600`}
            >
              Register
            </Link>
            <Link 
              href="/submit-anonymous" 
              className={`block py-2 ${isActive('/submit-anonymous') ? 'text-primary-600 font-medium' : 'text-gray-600'} hover:text-primary-600`}
            >
              Submit Anonymously
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}