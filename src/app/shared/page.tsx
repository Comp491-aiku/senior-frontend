'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Settings,
  LogOut,
  Search,
  Loader2,
  Calendar,
  Users,
  Eye,
  Edit,
  Mail,
  Check,
  X,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { useSharedWithMe } from '@/hooks/useSharing'
import { formatDistanceToNow } from 'date-fns'

const permissionIcons = {
  view: Eye,
  comment: Mail,
  edit: Edit,
}

const permissionLabels = {
  view: 'View only',
  comment: 'Can comment',
  edit: 'Can edit',
}

export default function SharedTripsPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const { shared, pending, isLoading, acceptInvitation, declineInvitation } = useSharedWithMe()

  // Combine shared and pending for total list
  const allShares = [...shared, ...pending]

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleAccept = async (shareId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await acceptInvitation.mutateAsync(shareId)
    } catch (error) {
      // Error handled by hook
    }
  }

  const handleDecline = async (shareId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await declineInvitation.mutateAsync(shareId)
    } catch (error) {
      // Error handled by hook
    }
  }

  // Filter by search query
  const filteredShared = shared.filter((sc) =>
    sc.conversation.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredPending = pending.filter((sc) =>
    sc.conversation.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredConversations = [...filteredShared, ...filteredPending]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-zinc-300" />
              </div>
              <span className="text-xl font-bold">AIKU</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-200 text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{user?.user_metadata?.name || 'User'}</p>
                  <p className="text-muted-foreground text-xs truncate">{user?.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                <Users className="w-5 h-5 text-zinc-300" />
              </div>
              <h1 className="text-3xl font-bold">Shared with Me</h1>
            </div>
            <p className="text-muted-foreground">
              Trips that friends have shared with you
            </p>
          </div>

          {/* Search */}
          {allShares.length > 0 && (
            <div className="mb-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search shared trips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : allShares.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No shared trips yet</h3>
              <p className="text-muted-foreground mb-4">
                When friends share their trip plans with you, they&apos;ll appear here
              </p>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Card>
          ) : filteredConversations.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No shared trips match your search</p>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Pending Invitations */}
              {filteredPending.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      {filteredPending.length}
                    </Badge>
                    Pending Invitations
                  </h2>
                  <div className="grid gap-3">
                    <AnimatePresence>
                      {filteredPending.map((item, index) => {
                        const PermIcon = permissionIcons[item.permission]
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                                    <Users className="w-5 h-5 text-yellow-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium truncate">
                                      {item.conversation.title || 'Trip Invitation'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      Shared by {item.owner.name || item.owner.email}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                      <Badge variant="outline" className="gap-1">
                                        <PermIcon className="w-3 h-3" />
                                        {permissionLabels[item.permission]}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    onClick={(e) => handleAccept(item.id, e)}
                                    disabled={acceptInvitation.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {acceptInvitation.isPending ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <>
                                        <Check className="w-4 h-4 mr-1" />
                                        Accept
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => handleDecline(item.id, e)}
                                    disabled={declineInvitation.isPending}
                                    className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                                  >
                                    {declineInvitation.isPending ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <>
                                        <X className="w-4 h-4 mr-1" />
                                        Decline
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Accepted Shares */}
              {filteredShared.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Shared Trips</h2>
                  <div className="grid gap-3">
                    <AnimatePresence>
                      {filteredShared.map((item, index) => {
                        const PermIcon = permissionIcons[item.permission]
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link href={`/chat/${item.conversation.id}`}>
                              <Card className="p-4 hover:bg-muted/50 transition-colors group">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center flex-shrink-0">
                                      <Users className="w-5 h-5 text-zinc-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-medium truncate">
                                        {item.conversation.title || 'Shared Trip'}
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        Shared by {item.owner.name || item.owner.email}
                                      </p>
                                      <div className="flex items-center gap-3 mt-2">
                                        <Badge variant="secondary" className="gap-1">
                                          <PermIcon className="w-3 h-3" />
                                          {permissionLabels[item.permission]}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
