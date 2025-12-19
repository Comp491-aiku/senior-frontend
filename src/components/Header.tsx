'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Plane, LogOut, User, Sparkles, ArrowRight, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 shadow-lg border-border/50'
          : 'bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 border-border/30'
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Plane className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            AIKU
          </span>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-xs font-medium text-primary"
          >
            AI-Powered
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {[
            { href: '/#how-it-works', label: 'How It Works' },
            { href: '/features', label: 'Features' },
            { href: '/about', label: 'About' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-all hover:text-primary relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <Link
                href="/trip"
                className="hidden lg:inline-block text-sm font-medium transition-colors hover:text-primary"
              >
                My Trips
              </Link>
              <div className="flex items-center gap-3">
                <span className="hidden lg:flex text-sm text-muted-foreground items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                  <User className="h-4 w-4" />
                  {user?.name}
                </span>
                <Link href="/trip/plan">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20">
                      <Sparkles className="h-4 w-4" />
                      <span className="hidden sm:inline">Plan Trip</span>
                      <span className="sm:hidden">Plan</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Button variant="outline" size="sm" onClick={logout} className="hidden sm:flex">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hidden md:inline-block">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/trip/plan">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={scrolled ? { y: [-2, 0, -2] } : {}}
                  transition={scrolled ? { duration: 2, repeat: Infinity } : {}}
                >
                  <Button
                    size="sm"
                    className={`gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all ${
                      scrolled ? 'shadow-xl shadow-primary/30 scale-105' : 'shadow-lg shadow-primary/20'
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">Start Planning</span>
                    <span className="sm:hidden">Plan</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border/50 overflow-hidden"
          >
            <nav className="container py-4 space-y-3">
              {[
                { href: '/#how-it-works', label: 'How It Works' },
                { href: '/features', label: 'Features' },
                { href: '/about', label: 'About' },
                ...(isAuthenticated ? [{ href: '/trip', label: 'My Trips' }] : []),
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm font-medium transition-colors hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
