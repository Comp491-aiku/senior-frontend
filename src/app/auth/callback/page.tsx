'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getSupabase } from '@/lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = getSupabase()

        // Check for error in URL params
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          setStatus('error')
          setErrorMessage(errorDescription || 'Authentication failed')
          return
        }

        // Get the session from the URL hash (for OAuth redirects)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          setStatus('error')
          setErrorMessage(sessionError.message)
          return
        }

        if (session) {
          setStatus('success')
          // Redirect to dashboard after a brief delay
          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
        } else {
          // Try to exchange the code for a session
          const code = searchParams.get('code')
          if (code) {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
            if (exchangeError) {
              setStatus('error')
              setErrorMessage(exchangeError.message)
              return
            }
            setStatus('success')
            setTimeout(() => {
              router.push('/dashboard')
            }, 1500)
          } else {
            setStatus('error')
            setErrorMessage('No authentication code found')
          }
        }
      } catch (err) {
        setStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred')
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md relative"
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-700 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-zinc-300" />
            </div>
          </div>

          {status === 'loading' && (
            <>
              <CardTitle className="text-2xl">Signing you in...</CardTitle>
              <CardDescription>Please wait while we complete the authentication</CardDescription>
            </>
          )}

          {status === 'success' && (
            <>
              <CardTitle className="text-2xl text-zinc-200">Welcome!</CardTitle>
              <CardDescription>Authentication successful. Redirecting...</CardDescription>
            </>
          )}

          {status === 'error' && (
            <>
              <CardTitle className="text-2xl text-destructive">Authentication Failed</CardTitle>
              <CardDescription>{errorMessage}</CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4">
          {status === 'loading' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-12 h-12 text-primary" />
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </motion.div>
          )}

          {status === 'error' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <XCircle className="w-16 h-16 text-destructive" />
              </motion.div>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => router.push('/auth/login')}>
                  Try Again
                </Button>
                <Button onClick={() => router.push('/')}>
                  Go Home
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function LoadingFallback() {
  return (
    <div className="w-full max-w-md relative">
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-700 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-zinc-300" />
            </div>
          </div>
          <CardTitle className="text-2xl">Signing you in...</CardTitle>
          <CardDescription>Please wait while we complete the authentication</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-transparent" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-800/30 rounded-full blur-3xl" />

      <Suspense fallback={<LoadingFallback />}>
        <AuthCallbackContent />
      </Suspense>
    </div>
  )
}
