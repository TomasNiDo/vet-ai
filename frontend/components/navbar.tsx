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
    <nav className={`${isNavbarFixed ? 'fixed' : 'relative'} w-full top-0 z-50 bg-background/80 backdrop-blur-sm`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary p-1.5 rounded">
            <PawPrint className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">FurSure AI</span>
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
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
              <Button variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-primary text-white hover:bg-primary/90">
                <Link href="/signup">Try FurSure AI</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

