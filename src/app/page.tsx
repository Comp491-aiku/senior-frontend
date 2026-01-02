'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Plane,
  Hotel,
  MapPin,
  Sparkles,
  ArrowRight,
  Globe,
  Clock,
  CreditCard,
  MessageSquare,
  Zap,
  CheckCircle2,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

const features = [
  {
    icon: Plane,
    title: 'Smart Flights',
    description: 'Find the best flight deals with real-time price analysis.',
  },
  {
    icon: Hotel,
    title: 'Perfect Hotels',
    description: 'Discover accommodations that match your style and budget.',
  },
  {
    icon: MapPin,
    title: 'Local Activities',
    description: 'Explore curated tours and experiences at your destination.',
  },
  {
    icon: Globe,
    title: 'Weather Insights',
    description: 'Get accurate forecasts to plan the perfect time for your trip.',
  },
  {
    icon: CreditCard,
    title: 'Currency Exchange',
    description: 'Real-time exchange rates and budget calculations.',
  },
  {
    icon: Clock,
    title: 'Time Zones',
    description: 'Never miss a beat with automatic timezone conversions.',
  },
]

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-zinc-300" />
            </div>
            <span className="text-xl font-bold">AIKU</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {!loading && (
              isAuthenticated ? (
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-800/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 text-zinc-300 text-sm mb-6">
              <Zap className="w-4 h-4" />
              <span>Powered by Advanced AI</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Plan Your Perfect Trip
              <span className="block text-zinc-400">
                with AI Intelligence
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Just tell us where you want to go. Our AI agent handles everything –
              flights, hotels, activities, and more. Travel planning made effortless.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={isAuthenticated ? '/dashboard' : '/auth/register'}>
                <Button size="lg" className="text-lg px-8 h-14 gap-2">
                  Start Planning Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                <span>Free to plan</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-zinc-400 fill-zinc-400" />
                <span>4.9/5 rating</span>
              </div>
            </div>
          </motion.div>

          {/* Demo Chat Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
              <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-600" />
                  <div className="w-3 h-3 rounded-full bg-zinc-500" />
                  <div className="w-3 h-3 rounded-full bg-zinc-400" />
                </div>
                <span className="text-sm text-muted-foreground">AIKU Chat</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-xs font-medium">
                    You
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                    <p>I want to visit Paris for 5 days in March with my family</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-zinc-300" />
                  </div>
                  <div className="bg-zinc-800/50 rounded-2xl rounded-tl-none px-4 py-3 max-w-md">
                    <p className="mb-3">I&apos;d love to help you plan your Paris trip! Let me search for the best options...</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-background/50 rounded flex items-center gap-1">
                        <Plane className="w-3 h-3" /> Searching flights
                      </span>
                      <span className="px-2 py-1 bg-background/50 rounded flex items-center gap-1">
                        <Hotel className="w-3 h-3" /> Finding hotels
                      </span>
                      <span className="px-2 py-1 bg-background/50 rounded flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Curating activities
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need to Travel
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI agent has access to all the tools needed to plan your perfect trip.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:border-zinc-600 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center mb-4 group-hover:bg-zinc-700/50 transition-colors">
                    <feature.icon className="w-6 h-6 text-zinc-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How AIKU Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to your dream vacation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Tell Us Your Dream',
                description: 'Simply describe where you want to go, when, and what you like. Our AI understands natural language.',
                icon: MessageSquare,
              },
              {
                step: '02',
                title: 'AI Does the Work',
                description: 'Our agent searches thousands of options, compares prices, and finds the best matches for you.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Book & Go',
                description: 'Review the options, make your selections, and get ready for an amazing trip.',
                icon: Plane,
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-700 text-zinc-200 text-2xl font-bold mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-zinc-900/30 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Plan Your Next Adventure?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of travelers who plan their trips with AIKU.
            </p>
            <Link href={isAuthenticated ? '/dashboard' : '/auth/register'}>
              <Button size="lg" className="text-lg px-8 h-14 gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-zinc-300" />
              </div>
              <span className="text-xl font-bold">AIKU</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2026 AIKU. AI-Powered Travel Planning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
