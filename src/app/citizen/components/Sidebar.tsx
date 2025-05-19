"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ClipboardDocumentListIcon,
  UserCircleIcon, 
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const pathname = usePathname();

  // Load user data from localStorage on client side
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error('Failed to parse user data', error);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/citizen/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Submit Complaint',
      href: '/citizen/dashboard/new-complaint',
      icon: DocumentTextIcon,
    },
    {
      name: 'My Complaints',
      href: '/citizen/dashboard/complaints',
      icon: ClipboardDocumentListIcon,
    },
    {
      name: 'Profile',
      href: '/citizen/dashboard/profile',
      icon: UserCircleIcon,
    },
    {
      name: 'Statistics',
      href: '/citizen/dashboard/statistics',
      icon: ChartBarIcon,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/citizen/dashboard' && pathname === '/citizen/dashboard') {
      return true;
    }
    return pathname?.startsWith(path) && path !== '/citizen/dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-10">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <span className="text-xl font-bold text-primary-600">Tuvugane</span>
          </div>
          
          {userData && (
            <div className="px-4 py-3 mb-6 bg-gray-50 border-t border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-bold text-lg">
                    {userData.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">{userData.name}</p>
                  <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                </div>
              </div>
            </div>
          )}
          
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-200
                  ${isActive(item.href) 
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <item.icon 
                  className={`
                    mr-4 flex-shrink-0 h-6 w-6 transition-colors duration-200
                    ${isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon 
                className="mr-4 flex-shrink-0 h-6 w-6 text-red-400 group-hover:text-red-500" 
                aria-hidden="true"
              />
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-primary-600">Tuvugane</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md inline-flex items-center justify-center text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <span className="sr-only">Open menu</span>
            {isMobileMenuOpen ? (
              <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
              {userData && (
                <div className="px-4 py-3 mb-6 bg-gray-50 border-t border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-bold text-lg">
                        {userData.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">{userData.name}</p>
                      <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-200
                      ${isActive(item.href) 
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon 
                      className={`
                        mr-4 flex-shrink-0 h-6 w-6 transition-colors duration-200
                        ${isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                      `}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon 
                    className="mr-4 flex-shrink-0 h-6 w-6 text-red-400 group-hover:text-red-500" 
                    aria-hidden="true"
                  />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="mt-0 md:mt-0">
            {/* On mobile, add padding to account for the fixed header */}
            <div className="md:py-0 py-16">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar; 