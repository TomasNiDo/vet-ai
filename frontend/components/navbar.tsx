import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Stethoscope } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="bg-transparent absolute top-0 left-0 right-0 z-10 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <Stethoscope className="h-6 w-6" />
          VetAI
        </Link>
        <div className="space-x-4">
          <Button variant="outline" asChild>
            <Link href="/register">Register</Link>
          </Button>
          <Button asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

