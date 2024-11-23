'use client';

import { useEffect } from 'react';
import { Navbar } from './navbar';
import { initFirebase } from '@/lib/firebase';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Firebase when the component mounts
    initFirebase();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
    </>
  );
} 