'use client'

/**
 * Share trip with friends modal
 * Now integrated with backend sharing API
 */
import { useState, useEffect } from 'react'
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
  Link2,
  Trash2,
  Loader2,
} from 'lucide-react'
import { useSharing } from '@/hooks/useSharing'
import { Share } from '@/lib/api'

interface ShareTripModalProps {
  isOpen: boolean
  onClose: () => void
  tripId: string
  tripName: string
}

type Permission = 'view' | 'comment' | 'edit'

export function ShareTripModal({ isOpen, onClose, tripId, tripName }: ShareTripModalProps) {
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState<Permission>('view')
  const [copied, setCopied] = useState(false)
  const [showLinkSection, setShowLinkSection] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)

  const {
    shares,
    isLoadingShares,
    createShare,
    revokeShare,
    updateShare,
  } = useSharing(tripId)

  // Check if there's already a link share
  useEffect(() => {
    const linkShare = shares.find(s => s.share_link)
    if (linkShare?.share_link) {
      setGeneratedLink(linkShare.share_link)
      setShowLinkSection(true)
    }
  }, [shares])

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleGenerateLink = async () => {
    try {
      const result = await createShare.mutateAsync({
        permission,
        create_link: true,
      })
      if (result.share_link) {
        setGeneratedLink(result.share_link)
        setShowLinkSection(true)
        navigator.clipboard.writeText(result.share_link)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      // Error handled by hook
    }
  }

  const handleShareByEmail = async () => {
    if (!email) return
    try {
      await createShare.mutateAsync({
        permission,
        email,
      })
      setEmail('')
    } catch (error) {
      // Error handled by hook
    }
  }

  const handleRevoke = async (shareId: string) => {
    try {
      await revokeShare.mutateAsync(shareId)
      // If we revoked the link share, clear it
      const revokedShare = shares.find(s => s.id === shareId)
      if (revokedShare?.share_link) {
        setGeneratedLink(null)
        setShowLinkSection(false)
      }
    } catch (error) {
      // Error handled by hook
    }
  }

  const permissionIcons = {
    view: Eye,
    comment: Mail,
    edit: Edit,
  }

  const permissionDescriptions = {
    view: 'Can view the trip',
    comment: 'Can view and comment',
    edit: 'Can view, comment, and edit',
  }

  // Filter to email shares only (not link shares)
  const emailShares = shares.filter(s => s.shared_with_email && !s.share_link)

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
          className="w-full max-w-2xl bg-background border-2 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="p-6 border-b bg-zinc-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-700 flex items-center justify-center shadow-lg shadow-black/20 transform hover:scale-105 transition-transform">
                  <Share2 className="h-7 w-7 text-zinc-300" />
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
            {/* Share Link Section */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground/90">Share Link</Label>
              {showLinkSection && generatedLink ? (
                <div className="flex gap-3">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="flex-1 bg-zinc-800/30 backdrop-blur-sm border-zinc-700/50 font-mono text-sm"
                  />
                  <Button
                    onClick={handleCopyLink}
                    className="shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-zinc-700 hover:bg-zinc-600"
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
              ) : (
                <Button
                  onClick={handleGenerateLink}
                  disabled={createShare.isPending}
                  variant="outline"
                  className="w-full h-12 border-dashed border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50"
                >
                  {createShare.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Link2 className="h-4 w-4 mr-2" />
                  )}
                  Generate Shareable Link
                </Button>
              )}
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
                    onKeyPress={(e) => e.key === 'Enter' && handleShareByEmail()}
                    className="flex-1 h-12 bg-zinc-800/30 backdrop-blur-sm border-zinc-700/50"
                  />
                  <Button
                    onClick={handleShareByEmail}
                    disabled={!email || createShare.isPending}
                    className="h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {createShare.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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

                {/* Permission Selector */}
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
                              ? 'shadow-lg hover:shadow-xl bg-zinc-700 scale-105'
                              : 'hover:border-zinc-600 hover:bg-zinc-800/50'
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

            {/* Shared Users List */}
            {isLoadingShares ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : emailShares.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                    <Users className="h-5 w-5 text-zinc-400" />
                  </div>
                  <Label className="text-sm font-semibold text-foreground/90">
                    Shared with ({emailShares.length})
                  </Label>
                </div>
                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2">
                  {emailShares.map((share, idx) => {
                    const PermIcon = permissionIcons[share.permission]
                    return (
                      <div
                        key={share.id}
                        className="group flex items-center justify-between p-4 bg-zinc-800/30 backdrop-blur-sm rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-all hover:shadow-lg animate-in fade-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                            {share.shared_user?.avatar_url ? (
                              <img
                                src={share.shared_user.avatar_url}
                                alt=""
                                className="w-full h-full rounded-xl object-cover"
                              />
                            ) : (
                              <Mail className="h-5 w-5 text-zinc-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">
                              {share.shared_user?.name || share.shared_with_email}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {share.accepted ? permissionDescriptions[share.permission] : 'Invitation pending'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={`gap-1.5 px-3 py-1.5 ${
                              share.accepted
                                ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            }`}
                          >
                            <PermIcon className="h-3.5 w-3.5" />
                            {share.accepted ? share.permission : 'pending'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleRevoke(share.id)}
                            disabled={revokeShare.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {/* Permission Explanations */}
            <div className="p-5 bg-zinc-800/30 border border-zinc-700/50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-zinc-400" />
                <p className="text-sm font-semibold text-foreground">Permission Levels</p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2.5">
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <Eye className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div>
                    <strong className="text-foreground">View:</strong> Can see the trip details and results
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div>
                    <strong className="text-foreground">Comment:</strong> Can view and leave comments
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <Edit className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div>
                    <strong className="text-foreground">Edit:</strong> Can modify todos and trip details
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-zinc-900/30 flex justify-end">
            <Button
              onClick={onClose}
              className="px-8 h-11 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-zinc-700 hover:bg-zinc-600"
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
