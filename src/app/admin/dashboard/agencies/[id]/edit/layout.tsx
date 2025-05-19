import React from 'react';

export default function EditAgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex-1 overflow-y-auto">
      {children}
    </section>
  );
} 