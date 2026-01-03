'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  Circle,
  Trash2,
  Calendar,
  User,
  Flag,
  MoreVertical,
  Edit2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Todo, TodoPriority, TodoStatus } from '@/lib/api'
import { format, isPast, isToday } from 'date-fns'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onUpdate: (id: string, data: Partial<Todo>) => void
  onDelete: (id: string) => void
  onEdit?: (todo: Todo) => void
  isToggling?: boolean
  isDeleting?: boolean
}

const priorityColors: Record<TodoPriority, string> = {
  low: 'text-blue-400 bg-blue-500/10',
  medium: 'text-yellow-400 bg-yellow-500/10',
  high: 'text-red-400 bg-red-500/10',
}

const priorityIcons: Record<TodoPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const statusColors: Record<TodoStatus, string> = {
  pending: 'border-zinc-600',
  in_progress: 'border-blue-500 bg-blue-500/20',
  completed: 'border-green-500 bg-green-500',
  cancelled: 'border-zinc-700 bg-zinc-700',
}

const categoryLabels: Record<string, string> = {
  booking: 'Booking',
  packing: 'Packing',
  research: 'Research',
  transportation: 'Transport',
  accommodation: 'Stay',
  activity: 'Activity',
  other: 'Other',
}

export function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
  onEdit,
  isToggling,
  isDeleting,
}: TodoItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isCompleted = todo.status === 'completed'
  const isCancelled = todo.status === 'cancelled'

  const dueDateColor = () => {
    if (!todo.due_date || isCompleted || isCancelled) return 'text-muted-foreground'
    const date = new Date(todo.due_date)
    if (isPast(date) && !isToday(date)) return 'text-red-400'
    if (isToday(date)) return 'text-yellow-400'
    return 'text-muted-foreground'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        'group flex items-start gap-3 p-3 rounded-lg border transition-all',
        isCompleted || isCancelled
          ? 'bg-zinc-800/30 border-zinc-800'
          : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        disabled={isToggling || isCancelled}
        className={cn(
          'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5',
          statusColors[todo.status],
          !isCompleted && !isCancelled && 'hover:border-green-500 hover:bg-green-500/20'
        )}
      >
        {isToggling ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : isCompleted ? (
          <Check className="w-3 h-3 text-white" />
        ) : null}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              'text-sm font-medium leading-tight',
              (isCompleted || isCancelled) && 'line-through text-muted-foreground'
            )}
          >
            {todo.title}
          </h4>

          {/* Actions */}
          <div
            className={cn(
              'flex items-center gap-1 transition-opacity',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(todo)}>
                    <Edit2 className="w-3.5 h-3.5 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onUpdate(todo.id, { priority: 'low' })}
                  disabled={todo.priority === 'low'}
                >
                  <Flag className="w-3.5 h-3.5 mr-2 text-blue-400" />
                  Low Priority
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpdate(todo.id, { priority: 'medium' })}
                  disabled={todo.priority === 'medium'}
                >
                  <Flag className="w-3.5 h-3.5 mr-2 text-yellow-400" />
                  Medium Priority
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpdate(todo.id, { priority: 'high' })}
                  disabled={todo.priority === 'high'}
                >
                  <Flag className="w-3.5 h-3.5 mr-2 text-red-400" />
                  High Priority
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(todo.id)}
                  disabled={isDeleting}
                  className="text-destructive focus:text-destructive"
                >
                  {isDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                  )}
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Description */}
        {todo.description && (
          <p
            className={cn(
              'text-xs text-muted-foreground mt-1 line-clamp-2',
              (isCompleted || isCancelled) && 'line-through'
            )}
          >
            {todo.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {/* Priority */}
          <Badge
            variant="outline"
            className={cn('text-[10px] px-1.5 py-0 h-5', priorityColors[todo.priority])}
          >
            <Flag className="w-2.5 h-2.5 mr-1" />
            {priorityIcons[todo.priority]}
          </Badge>

          {/* Category */}
          {todo.category && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
              {categoryLabels[todo.category] || todo.category}
            </Badge>
          )}

          {/* Due date */}
          {todo.due_date && (
            <span className={cn('flex items-center gap-1 text-[10px]', dueDateColor())}>
              <Calendar className="w-2.5 h-2.5" />
              {format(new Date(todo.due_date), 'MMM d')}
            </span>
          )}

          {/* Assignee */}
          {todo.assignee && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <User className="w-2.5 h-2.5" />
              {todo.assignee.name || todo.assignee.email?.split('@')[0]}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
