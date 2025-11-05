'use client'

/**
 * Share trip with friends modal
 */
import { useState } from 'react'
// Dialog component removed - using custom overlay instead
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  X,
  Share2,
  Mail,
  Copy,
  Check,
  UserPlus,
  Eye,
  Edit,
  Shield,
  Users,
} from 'lucide-react'

interface ShareTripModalProps {
  isOpen: boolean
  onClose: () => void
  tripId: string
  tripName: string
}

type Permission = 'view' | 'comment' | 'edit' | 'admin'

interface SharedUser {
  email: string
  permission: Permission
}

export function ShareTripModal({ isOpen, onClose, tripId, tripName }: ShareTripModalProps) {
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState<Permission>('view')
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const shareLink = `https://aiku.app/trip/${tripId}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (!email) return

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSharedUsers([...sharedUsers, { email, permission }])
      setEmail('')
      setLoading(false)
    }, 500)
  }

  const permissionIcons = {
    view: Eye,
    comment: Mail,
    edit: Edit,
    admin: Shield,
  }

  const permissionDescriptions = {
    view: 'Can view the trip',
    comment: 'Can view and comment',
    edit: 'Can view, comment, and edit',
    admin: 'Full access',
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with animation */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        {/* Modal Card with scale animation */}
        <Card
          className="w-full max-w-2xl bg-gradient-to-br from-background via-background to-primary/5 border-2 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="p-6 border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 transform hover:scale-105 transition-transform">
                  <Share2 className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Share Trip
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">{tripName}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-all hover:rotate-90 duration-300"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Share Link with modern styling */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground/90">Share Link</Label>
              <div className="flex gap-3">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm border-primary/10 font-mono text-sm"
                />
                <Button
                  onClick={handleCopyLink}
                  className="shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-primary to-primary/80"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Add People with modern styling */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-foreground/90">Invite by Email</Label>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleShare()}
                    className="flex-1 h-12 bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm border-primary/10"
                  />
                  <Button
                    onClick={handleShare}
                    disabled={!email || loading}
                    className="h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-primary to-primary/80 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sharing...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Share
                      </>
                    )}
                  </Button>
                </div>

                {/* Permission Selector with modern styling */}
                <div>
                  <p className="text-xs text-muted-foreground mb-3 font-medium">Permission Level:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['view', 'comment', 'edit'] as Permission[]).map((perm) => {
                      const PermIcon = permissionIcons[perm]
                      return (
                        <Button
                          key={perm}
                          variant={permission === perm ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPermission(perm)}
                          className={`h-12 transition-all ${
                            permission === perm
                              ? 'shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-primary/80 scale-105'
                              : 'hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          <PermIcon className="h-4 w-4 mr-1.5" />
                          {perm.charAt(0).toUpperCase() + perm.slice(1)}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Shared Users List with modern styling */}
            {sharedUsers.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <Label className="text-sm font-semibold text-foreground/90">
                    Shared with ({sharedUsers.length})
                  </Label>
                </div>
                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2">
                  {sharedUsers.map((user, idx) => {
                    const PermIcon = permissionIcons[user.permission]
                    return (
                      <div
                        key={idx}
                        className="group flex items-center justify-between p-4 bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm rounded-xl border border-primary/5 hover:border-primary/20 transition-all hover:shadow-lg animate-in fade-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{user.email}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {permissionDescriptions[user.permission]}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="gap-1.5 bg-primary/10 text-primary border-primary/20 px-3 py-1.5"
                        >
                          <PermIcon className="h-3.5 w-3.5" />
                          {user.permission}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Permission Explanations with modern styling */}
            <div className="p-5 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/10 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Permission Levels</p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2.5">
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <strong className="text-foreground">View:</strong> Can see the trip details
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <strong className="text-foreground">Comment:</strong> Can view and leave comments
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Edit className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <strong className="text-foreground">Edit:</strong> Can modify trip details and vote
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer with modern button */}
          <div className="p-6 border-t bg-gradient-to-b from-background to-muted/20 flex justify-end">
            <Button
              onClick={onClose}
              className="px-8 h-11 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-primary to-primary/80"
            >
              <Check className="h-4 w-4 mr-2" />
              Done
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}
