'use client'

import { useEffect, useState, useCallback } from 'react'
import { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthResult {
  error: AuthError | null
}

interface SignInResult extends AuthResult {
  user?: User | null
  session?: Session | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabase()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setSession(data.session)
        setUser(data.session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, newSession: Session | null) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { user: data.user, session: data.session, error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }, [supabase])

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }, [supabase])

  const signUp = useCallback(async (email: string, password: string, name?: string): Promise<SignInResult> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      })
      return { user: data.user, session: data.session, error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }, [supabase])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.push('/')
    }
    return { error }
  }, [supabase, router])

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut,
  }
}
