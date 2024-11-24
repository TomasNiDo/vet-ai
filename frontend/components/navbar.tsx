'use client';

import Link from 'next/link';
import { useLayout } from '@/contexts/layout-context';
import { Button } from './ui/button';
import { getAuth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { PawPrint } from 'lucide-react';

export function Navbar() {
  const { isNavbarFixed } = useLayout();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className={`w-full ${
      isNavbarFixed ? 'bg-blue-50 fixed top-0 z-50' : 'relative'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center text-xl font-bold">
            <PawPrint className="inline-block mr-2" size={24} /> FurSure
          </Link>
          
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse h-10 w-20 bg-gray-200 rounded" />
            ) : user ? (
              <>
                <Link href="/chat">
                  <Button variant="ghost">Chat</Button>
                </Link>
                <Link href="/pets">
                  <Button variant="ghost">My Pets</Button>
                </Link>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="default">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

