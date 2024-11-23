'use client';

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Stethoscope } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'

export function Navbar() {
  const { user, loading } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="bg-transparent absolute top-0 left-0 right-0 z-10 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <Stethoscope className="h-6 w-6" />
          VetAI
        </Link>
        <div className="space-x-4">
          {!loading && (
            user ? (
              <>
                <Button variant="outline" asChild>
                  <Link href="/chat">Chat</Link>
                </Button>
                <Button onClick={handleSignOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/register">Register</Link>
                </Button>
                <Button asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  )
}

