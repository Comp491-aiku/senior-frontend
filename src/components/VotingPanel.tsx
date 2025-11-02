'use client'

/**
 * Voting panel for trip alternatives
 */
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Users,
  Crown,
  CheckCircle2,
} from 'lucide-react'

interface Vote {
  userId: string
  userName: string
  vote: 1 | -1 | 0
  timestamp: Date
}

interface VotingOption {
  id: string
  name: string
  description: string
  price: number
  votes: Vote[]
}

interface VotingPanelProps {
  tripId: string
  itemType: 'flight' | 'accommodation' | 'activity'
  options: VotingOption[]
  onVote: (optionId: string, vote: 1 | -1 | 0) => void
}

export function VotingPanel({ tripId, itemType, options, onVote }: VotingPanelProps) {
  const [myVotes, setMyVotes] = useState<Record<string, 1 | -1 | 0>>({})

  const handleVote = (optionId: string, vote: 1 | -1 | 0) => {
    const currentVote = myVotes[optionId] || 0

    // Toggle vote: if same vote, remove it; otherwise apply new vote
    const newVote = currentVote === vote ? 0 : vote

    setMyVotes({ ...myVotes, [optionId]: newVote })
    onVote(optionId, newVote)
  }

  const calculateScore = (votes: Vote[]) => {
    return votes.reduce((sum, v) => sum + v.vote, 0)
  }

  const getPercentage = (votes: Vote[]) => {
    const totalVotes = options.reduce((sum, opt) => sum + opt.votes.length, 0)
    return totalVotes > 0 ? (votes.length / totalVotes) * 100 : 0
  }

  const sortedOptions = [...options].sort(
    (a, b) => calculateScore(b.votes) - calculateScore(a.votes)
  )

  const winner = sortedOptions[0]

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Group Voting</h3>
        <Badge variant="secondary" className="ml-auto">
          {options.reduce((sum, opt) => sum + opt.votes.length, 0)} votes
        </Badge>
      </div>

      <div className="space-y-4">
        {sortedOptions.map((option, index) => {
          const score = calculateScore(option.votes)
          const upvotes = option.votes.filter((v) => v.vote === 1).length
          const downvotes = option.votes.filter((v) => v.vote === -1).length
          const percentage = getPercentage(option.votes)
          const myVote = myVotes[option.id] || 0
          const isWinner = index === 0 && score > 0

          return (
            <Card
              key={option.id}
              className={`p-4 transition-all ${
                isWinner ? 'border-2 border-primary bg-primary/5' : ''
              }`}
            >
              {/* Winner Badge */}
              {isWinner && (
                <Badge className="mb-3 gap-1">
                  <Crown className="h-3 w-3" />
                  Most Popular
                </Badge>
              )}

              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{option.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                  <div className="text-lg font-bold text-primary">${option.price}</div>
                </div>

                {/* Vote Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant={myVote === 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleVote(option.id, 1)}
                    className="gap-1"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    {upvotes > 0 && <span>{upvotes}</span>}
                  </Button>

                  <Button
                    variant={myVote === -1 ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => handleVote(option.id, -1)}
                    className="gap-1"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    {downvotes > 0 && <span>{downvotes}</span>}
                  </Button>
                </div>
              </div>

              {/* Vote Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {option.votes.length} {option.votes.length === 1 ? 'vote' : 'votes'}
                  </span>
                  <span className="font-medium">
                    Score: {score > 0 ? '+' : ''}
                    {score}
                  </span>
                </div>

                <Progress value={percentage} className="h-2" />

                {/* Voters */}
                {option.votes.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    {option.votes.slice(0, 3).map((vote, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs gap-1">
                        {vote.vote === 1 ? (
                          <ThumbsUp className="h-2 w-2" />
                        ) : (
                          <ThumbsDown className="h-2 w-2" />
                        )}
                        {vote.userName}
                      </Badge>
                    ))}
                    {option.votes.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{option.votes.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">
            {winner && calculateScore(winner.votes) > 0 ? (
              <>
                <strong>{winner.name}</strong> is leading with {calculateScore(winner.votes)}{' '}
                points
              </>
            ) : (
              'Vote for your preferred option!'
            )}
          </span>
        </div>
      </div>
    </Card>
  )
}
