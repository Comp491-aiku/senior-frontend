'use client'

import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  )
}

export function PageLoadingState() {
  return (
    <div className="container min-h-[60vh] flex items-center justify-center">
      <LoadingState />
    </div>
  )
}
