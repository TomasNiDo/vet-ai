import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 py-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 FurSure. All rights reserved.</p>
        <div className="mt-4">
          <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          {' | '}
          <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}

