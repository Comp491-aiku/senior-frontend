'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

const destinations = [
  { name: 'Tokyo', image: '/tokyo.avif' },
  { name: 'Paris', image: '/paris.avif' },
  { name: 'Bali', image: '/bali.avif' },
  { name: 'New York', image: '/newyork.avif' },
]

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % destinations.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fafafa]/80 backdrop-blur-md border-b border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              aiku
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-sm text-[#737373] hover:text-[#171717] transition-colors">
                Features
              </Link>
              <Link href="/about" className="text-sm text-[#737373] hover:text-[#171717] transition-colors">
                About
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              {!loading && (
                isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button className="bg-[#171717] text-white hover:bg-[#262626] text-sm h-9 px-4">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="ghost" className="text-sm text-[#737373] hover:text-[#171717] h-9 px-4">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button className="bg-[#171717] text-white hover:bg-[#262626] text-sm h-9 px-4">
                        Get started
                      </Button>
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero Text */}
          <div className="max-w-3xl">
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[#171717]">
              Travel planning,{' '}
              <span className="text-[#a3a3a3]">reimagined</span>
            </h1>
            <p className="mt-6 text-lg text-[#737373] max-w-xl leading-relaxed">
              Tell us where you want to go. We&apos;ll handle flights, hotels, and everything in between.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link href={isAuthenticated ? '/dashboard' : '/auth/register'}>
                <Button className="bg-[#171717] text-white hover:bg-[#262626] h-12 px-6 text-sm font-medium gap-2 group">
                  Start planning
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="ghost" className="text-[#737373] hover:text-[#171717] h-12 px-6 text-sm">
                  Learn more
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Grid */}
          <div className="mt-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {destinations.map((dest, i) => (
                <div
                  key={dest.name}
                  className={`relative aspect-[4/5] rounded-2xl overflow-hidden transition-all duration-700 ${
                    i === activeIndex ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                >
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-white text-sm font-medium">{dest.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-32">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  title: 'Instant search',
                  description: 'Find flights and hotels across hundreds of providers in seconds.'
                },
                {
                  title: 'Smart suggestions',
                  description: 'Get personalized recommendations based on your preferences.'
                },
                {
                  title: 'One place',
                  description: 'Manage your entire trip—bookings, itinerary, and more.'
                }
              ].map((feature) => (
                <div key={feature.title}>
                  <h3 className="text-base font-medium text-[#171717]">{feature.title}</h3>
                  <p className="mt-2 text-sm text-[#737373] leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-32 py-16 border-t border-[#e5e5e5]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Ready to go?</h2>
                <p className="mt-2 text-[#737373]">Start planning your next trip today.</p>
              </div>
              <Link href={isAuthenticated ? '/dashboard' : '/auth/register'}>
                <Button className="bg-[#171717] text-white hover:bg-[#262626] h-12 px-6 text-sm font-medium gap-2 group">
                  Get started free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5] py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sm text-[#a3a3a3]">aiku</span>
            <p className="text-sm text-[#a3a3a3]">© 2026</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
