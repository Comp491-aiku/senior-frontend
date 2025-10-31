'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plane } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Plane className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">AIKU</span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link
            href="/trip"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            My Trips
          </Link>
          <Link
            href="/explore"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Explore
          </Link>
          <Link href="/trip/create">
            <Button>Plan New Trip</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
