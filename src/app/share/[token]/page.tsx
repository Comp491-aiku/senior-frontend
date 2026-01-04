'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Loader2,
  AlertCircle,
  LogIn,
  UserPlus,
  Plane,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useShareByToken } from '@/hooks/useSharing'

export default function ShareLinkPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const { user, loading: authLoading } = useAuth()
  const { data: shareData, isLoading: shareLoading, error } = useShareByToken(token)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    // If user is authenticated and has access, redirect to the conversation
    if (!authLoading && !shareLoading && shareData && user && shareData.can_access) {
      setRedirecting(true)
      router.push(`/chat/${shareData.conversation_id}`)
    }
  }, [authLoading, shareLoading, shareData, user, router])

  const isLoading = authLoading || shareLoading

  // Show loading state
  if (isLoading || redirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            {redirecting ? 'Redirecting to trip...' : 'Loading shared trip...'}
          </p>
        </motion.div>
      </div>
    )
  }

  // Show error state
  if (error || !shareData) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 h-16 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-zinc-300" />
              </div>
              <span className="text-xl font-bold">AIKU</span>
            </Link>
          </div>
        </header>

        <main className="pt-24 pb-12 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <Card className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Link Not Found</h1>
              <p className="text-muted-foreground mb-6">
                This share link is invalid, has expired, or has been revoked by the owner.
              </p>
              <div className="flex flex-col gap-3">
                <Button asChild>
                  <Link href="/">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Go to Homepage
                  </Link>
                </Button>
                {!user && (
                  <Button variant="outline" asChild>
                    <Link href="/auth/login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    )
  }

  // User is not authenticated - show sign in options
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 h-16 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-zinc-300" />
              </div>
              <span className="text-xl font-bold">AIKU</span>
            </Link>
          </div>
        </header>

        <main className="pt-24 pb-12 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plane className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Trip Shared With You</h1>
                <p className="text-lg font-medium text-primary">{shareData.title || 'Travel Plan'}</p>
                <p className="text-muted-foreground mt-2">
                  Sign in to view this shared trip and collaborate with friends.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">
                    You have <span className="font-medium">{shareData.permission}</span> access to this trip
                  </span>
                </div>

                <div className="grid gap-3">
                  <Button asChild size="lg" className="w-full">
                    <Link href={`/auth/login?redirect=/share/${token}`}>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg" className="w-full">
                    <Link href={`/auth/register?redirect=/share/${token}`}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  By signing in, you&apos;ll be able to view and collaborate on this trip.
                </p>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    )
  }

  // User is authenticated but can_access is false (shouldn't normally happen)
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-zinc-300" />
            </div>
            <span className="text-xl font-bold">AIKU</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-12 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Access Pending</h1>
            <p className="text-muted-foreground mb-6">
              {shareData.message || 'You may need to accept an invitation to view this trip.'}
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/shared">
                  View My Invitations
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
