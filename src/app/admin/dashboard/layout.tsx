"use client";
import React from 'react';
import AdminAuthGuard from '../components/AdminAuthGuard';
import SuperAdminSidebar from '../components/SuperAdminSidebar';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard adminType="super-admin">
      <SuperAdminSidebar>
        {children}
      </SuperAdminSidebar>
    </AdminAuthGuard>
  );
} 