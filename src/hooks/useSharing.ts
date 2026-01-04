'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, Share, SharedConversation, CreateShareRequest } from '@/lib/api'
import { toast } from 'sonner'

export function useSharing(conversationId?: string) {
  const queryClient = useQueryClient()

  // Fetch shares for a conversation
  // Note: Only the owner can list shares, shared users will get 403
  const {
    data: shares = [],
    isLoading: isLoadingShares,
    error: sharesError,
    refetch: refetchShares,
  } = useQuery({
    queryKey: ['shares', conversationId],
    queryFn: async () => {
      try {
        return await api.getShares(conversationId!)
      } catch (error: unknown) {
        // Silently fail for 403 (shared users can't list shares)
        if (error instanceof Error && error.message.includes('403')) {
          return []
        }
        throw error
      }
    },
    enabled: !!conversationId,
    retry: false, // Don't retry on 403
  })

  // Create a new share
  const createShare = useMutation({
    mutationFn: (data: CreateShareRequest) =>
      api.createShare(conversationId!, data),
    onSuccess: (share) => {
      queryClient.invalidateQueries({ queryKey: ['shares', conversationId] })
      if (share.share_link) {
        toast.success('Share link created!')
      } else if (share.shared_with_email) {
        toast.success(`Invitation sent to ${share.shared_with_email}`)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create share')
    },
  })

  // Update share permission
  const updateShare = useMutation({
    mutationFn: ({ shareId, permission }: { shareId: string; permission: 'view' | 'comment' | 'edit' }) =>
      api.updateShare(conversationId!, shareId, permission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shares', conversationId] })
      toast.success('Permission updated')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update permission')
    },
  })

  // Revoke a share
  const revokeShare = useMutation({
    mutationFn: (shareId: string) => api.revokeShare(conversationId!, shareId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shares', conversationId] })
      toast.success('Access revoked')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to revoke access')
    },
  })

  return {
    shares,
    isLoadingShares,
    sharesError,
    refetchShares,
    createShare,
    updateShare,
    revokeShare,
  }
}

export function useSharedWithMe() {
  const queryClient = useQueryClient()

  // Fetch conversations shared with the user
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['shared-with-me'],
    queryFn: api.getSharedWithMe,
  })

  const shared = data?.shared || []
  const pending = data?.pending || []

  // Accept an invitation
  const acceptInvitation = useMutation({
    mutationFn: (shareId: string) => api.acceptShare(shareId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-with-me'] })
      toast.success('Invitation accepted!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to accept invitation')
    },
  })

  // Decline an invitation
  const declineInvitation = useMutation({
    mutationFn: (shareId: string) => api.declineShare(shareId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-with-me'] })
      toast.success('Invitation declined')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to decline invitation')
    },
  })

  return {
    shared,
    pending,
    isLoading,
    error,
    refetch,
    acceptInvitation,
    declineInvitation,
  }
}

export function useShareByToken(token: string) {
  return useQuery({
    queryKey: ['share-token', token],
    queryFn: () => api.getShareByToken(token),
    enabled: !!token,
    retry: false,
  })
}
