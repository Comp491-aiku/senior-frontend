'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Plane, LogOut, User, Sparkles, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      scrolled
        ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-md'
        : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
    }`}>
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <Plane className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-bold text-xl">AIKU</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/#how-it-works"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            How It Works
          </Link>
          <Link
            href="/features"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/trip"
                className="hidden md:inline-block text-sm font-medium transition-colors hover:text-primary"
              >
                My Trips
              </Link>
              <div className="flex items-center gap-2">
                <span className="hidden md:flex text-sm text-muted-foreground items-center gap-2">
                  <User className="h-4 w-4" />
                  {user?.name}
                </span>
                <Link href="/trip/plan">
                  <Button size="sm" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Plan Trip
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hidden md:inline-block">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/trip/plan">
                <Button size="sm" className={`gap-2 transition-all ${
                  scrolled ? 'shadow-lg scale-105' : ''
                }`}>
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Start Planning</span>
                  <span className="sm:hidden">Plan</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
