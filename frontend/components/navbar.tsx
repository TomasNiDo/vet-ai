'use client';

import Link from 'next/link';
import { useLayout } from '@/contexts/layout-context';
import { Button } from './ui/button';
import { getAuth, signOut } from 'firebase/auth';

export function Navbar() {
  const { isNavbarFixed } = useLayout();
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className={`w-full ${
      isNavbarFixed ? 'fixed top-0 z-50' : 'relative'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            Vet AI
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/chat">
              <Button variant="ghost">Chat</Button>
            </Link>
            <Link href="/pets">
              <Button variant="ghost">My Pets</Button>
            </Link>
            {auth.currentUser && (
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

