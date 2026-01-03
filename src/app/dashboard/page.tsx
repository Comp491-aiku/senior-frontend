'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Search,
  Loader2,
  Plane,
  Calendar,
  Trash2,
  MoreVertical,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { api, Conversation } from '@/lib/api'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

export default function DashboardPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const data = await api.getConversations()
      // Ensure we always have an array
      setConversations(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load conversations:', error)
      toast.error('Failed to load conversations')
      setConversations([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    // Navigate to new chat - conversation will be created when first message is sent
    router.push('/chat/new')
  }

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await api.deleteConversation(id)
      setConversations(conversations.filter(c => c.id !== id))
      toast.success('Conversation deleted')
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      toast.error('Failed to delete conversation')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const filteredConversations = conversations.filter(c =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-zinc-300" />
            </div>
            <span className="text-xl font-bold">AIKU</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleNewChat}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              New Trip
            </Button>

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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-muted-foreground">
              Ready to plan your next adventure?
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card
              className="p-6 bg-zinc-800/30 border-zinc-700/50 cursor-pointer hover:border-zinc-600 transition-colors"
              onClick={handleNewChat}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-700 flex items-center justify-center">
                    <Plane className="w-6 h-6 text-zinc-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Start a New Trip</h2>
                    <p className="text-muted-foreground text-sm">
                      Tell me where you want to go
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>

            <Link href="/shared">
              <Card className="p-6 bg-zinc-800/30 border-zinc-700/50 cursor-pointer hover:border-zinc-600 transition-colors h-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-700 flex items-center justify-center">
                      <Users className="w-6 h-6 text-zinc-300" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Shared with Me</h2>
                      <p className="text-muted-foreground text-sm">
                        View trips friends have shared
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            </Link>
          </div>

          {/* Conversations Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Conversations</h2>
              {conversations.length > 0 && (
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-9"
                  />
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : conversations.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your first trip planning conversation with AIKU
                </p>
                <Button onClick={handleNewChat}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Trip
                </Button>
              </Card>
            ) : filteredConversations.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No conversations match your search</p>
              </Card>
            ) : (
              <div className="grid gap-3">
                <AnimatePresence>
                  {filteredConversations.map((conversation, index) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={`/chat/${conversation.id}`}>
                        <Card className="p-4 hover:bg-muted/50 transition-colors group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="w-5 h-5 text-zinc-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">
                                  {conversation.title || 'New Conversation'}
                                </h3>
                                {conversation.summary && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    {conversation.summary}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => handleDeleteConversation(conversation.id, e as unknown as React.MouseEvent)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
