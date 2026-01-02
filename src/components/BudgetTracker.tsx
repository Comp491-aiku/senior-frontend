'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface BudgetTrackerProps {
  totalBudget: number
  spentBudget: number
  currency: string
}

export function BudgetTracker({ totalBudget, spentBudget, currency }: BudgetTrackerProps) {
  const percentage = (spentBudget / totalBudget) * 100
  const remaining = totalBudget - spentBudget

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Tracker</CardTitle>
        <CardDescription>
          Track your spending throughout your trip
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Spent</span>
            <span className="font-medium">
              {currency} {spentBudget.toFixed(2)} / {totalBudget.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all ${
                percentage > 90 ? 'bg-zinc-400' : percentage > 70 ? 'bg-zinc-500' : 'bg-zinc-600'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className={`text-2xl font-bold ${remaining < 0 ? 'text-destructive' : ''}`}>
              {currency} {Math.abs(remaining).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Used</p>
            <p className="text-2xl font-bold">{percentage.toFixed(1)}%</p>
          </div>
        </div>

        {remaining < 0 && (
          <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-sm text-destructive font-medium">
              Over budget by {currency} {Math.abs(remaining).toFixed(2)}
            </p>
          </div>
        )}

        {percentage > 90 && remaining >= 0 && (
          <div className="p-3 bg-zinc-800/50 border border-zinc-600 rounded-lg">
            <p className="text-sm text-zinc-300 font-medium">
              You&apos;re close to your budget limit!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
