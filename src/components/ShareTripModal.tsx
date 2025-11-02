'use client'

/**
 * Share trip with friends modal
 */
import { useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-background">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Share Trip</h2>
                  <p className="text-sm text-muted-foreground">{tripName}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Share Link */}
            <div>
              <Label className="mb-2 block">Share Link</Label>
              <div className="flex gap-2">
                <Input value={shareLink} readOnly className="flex-1" />
                <Button onClick={handleCopyLink} variant="outline">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied
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

            {/* Add People */}
            <div>
              <Label className="mb-2 block">Invite by Email</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleShare()}
                    className="flex-1"
                  />
                  <Button onClick={handleShare} disabled={!email || loading}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {loading ? 'Sharing...' : 'Share'}
                  </Button>
                </div>

                {/* Permission Selector */}
                <div className="flex gap-2">
                  {(['view', 'comment', 'edit'] as Permission[]).map((perm) => {
                    const PermIcon = permissionIcons[perm]
                    return (
                      <Button
                        key={perm}
                        variant={permission === perm ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPermission(perm)}
                        className="flex-1"
                      >
                        <PermIcon className="h-3 w-3 mr-1" />
                        {perm.charAt(0).toUpperCase() + perm.slice(1)}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Shared Users List */}
            {sharedUsers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4" />
                  <Label>Shared with ({sharedUsers.length})</Label>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {sharedUsers.map((user, idx) => {
                    const PermIcon = permissionIcons[user.permission]
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              {permissionDescriptions[user.permission]}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="gap-1">
                          <PermIcon className="h-3 w-3" />
                          {user.permission}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Permission Explanations */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs font-semibold mb-2">Permission Levels:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <Eye className="h-3 w-3" />
                  <strong>View:</strong> Can see the trip details
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <strong>Comment:</strong> Can view and leave comments
                </li>
                <li className="flex items-center gap-2">
                  <Edit className="h-3 w-3" />
                  <strong>Edit:</strong> Can modify trip details and vote
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t flex justify-end">
            <Button onClick={onClose}>Done</Button>
          </div>
        </Card>
      </div>
    </Dialog>
  )
}
