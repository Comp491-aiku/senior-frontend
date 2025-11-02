'use client'

/**
 * Comments panel for trip items
 */
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  User,
  Clock,
  Reply,
} from 'lucide-react'

interface Comment {
  id: string
  user: {
    name: string
    avatar?: string
  }
  content: string
  timestamp: Date
  votes: number
  replies?: Comment[]
}

interface CommentsPanelProps {
  tripId: string
  itemId?: string
  itemType?: 'flight' | 'accommodation' | 'activity'
}

export function CommentsPanel({ tripId, itemId, itemType }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: { name: 'Sarah Johnson' },
      content: 'This hotel looks great! Has anyone stayed here before?',
      timestamp: new Date(Date.now() - 3600000),
      votes: 5,
      replies: [
        {
          id: '1-1',
          user: { name: 'Mike Chen' },
          content: 'Yes! The breakfast was amazing and the location is perfect for sightseeing.',
          timestamp: new Date(Date.now() - 1800000),
          votes: 3,
        },
      ],
    },
    {
      id: '2',
      user: { name: 'Alex Kumar' },
      content: 'I prefer the alternative with the pool. Its worth the extra $50.',
      timestamp: new Date(Date.now() - 7200000),
      votes: 2,
    },
  ])

  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      user: { name: 'You' },
      content: newComment,
      timestamp: new Date(),
      votes: 0,
    }

    setComments([comment, ...comments])
    setNewComment('')
  }

  const handleVote = (commentId: string, delta: number) => {
    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, votes: c.votes + delta } : c
      )
    )
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Add Comment */}
      <div className="mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            className="flex-1"
          />
          <Button onClick={handleAddComment} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            {/* Comment */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.user.name}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-2 ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 gap-1"
                    onClick={() => handleVote(comment.id, 1)}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    {comment.votes > 0 && <span className="text-xs">{comment.votes}</span>}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 gap-1"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    <Reply className="h-3 w-3" />
                    <span className="text-xs">Reply</span>
                  </Button>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 ml-6 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>

                        <div className="flex-1">
                          <div className="bg-muted/50 rounded-lg p-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-xs">{reply.user.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(reply.timestamp)}
                              </span>
                            </div>
                            <p className="text-xs">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </Card>
  )
}
