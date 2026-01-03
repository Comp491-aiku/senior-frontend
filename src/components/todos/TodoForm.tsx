'use client'

import { useState } from 'react'
import { Plus, X, Flag, Calendar, Tag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { CreateTodoRequest, TodoPriority, TodoCategory } from '@/lib/api'

interface TodoFormProps {
  onSubmit: (data: CreateTodoRequest) => void
  onCancel?: () => void
  isSubmitting?: boolean
  initialData?: Partial<CreateTodoRequest>
  mode?: 'create' | 'edit'
  compact?: boolean
}

const priorityOptions: { value: TodoPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-blue-400' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { value: 'high', label: 'High', color: 'text-red-400' },
]

const categoryOptions: { value: TodoCategory; label: string }[] = [
  { value: 'booking', label: 'Booking' },
  { value: 'packing', label: 'Packing' },
  { value: 'research', label: 'Research' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'activity', label: 'Activity' },
  { value: 'other', label: 'Other' },
]

export function TodoForm({
  onSubmit,
  onCancel,
  isSubmitting,
  initialData,
  mode = 'create',
  compact = false,
}: TodoFormProps) {
  const [isExpanded, setIsExpanded] = useState(mode === 'edit' || !compact)
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [priority, setPriority] = useState<TodoPriority>(initialData?.priority || 'medium')
  const [category, setCategory] = useState<TodoCategory | ''>(initialData?.category || '')
  const [dueDate, setDueDate] = useState(initialData?.due_date || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category: category || undefined,
      due_date: dueDate || undefined,
    })

    if (mode === 'create') {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setCategory('')
      setDueDate('')
      if (compact) setIsExpanded(false)
    }
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
    setCategory('')
    setDueDate('')
    setIsExpanded(false)
    onCancel?.()
  }

  // Compact mode - just show input until focused
  if (compact && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center gap-2 p-3 rounded-lg border border-dashed border-zinc-700 hover:border-zinc-600 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm">Add a todo</span>
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Title */}
      <div className="flex gap-2">
        <Input
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
          autoFocus={compact}
        />
        {compact && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCancel}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Description */}
      <Textarea
        placeholder="Add a description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="min-h-[60px] resize-none"
        rows={2}
      />

      {/* Options row */}
      <div className="flex flex-wrap gap-2">
        {/* Priority */}
        <Select value={priority} onValueChange={(v) => setPriority(v as TodoPriority)}>
          <SelectTrigger className="w-[120px] h-8">
            <Flag className={cn('w-3.5 h-3.5 mr-1', priorityOptions.find(p => p.value === priority)?.color)} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className={option.color}>{option.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category */}
        <Select value={category} onValueChange={(v) => setCategory(v as TodoCategory)}>
          <SelectTrigger className="w-[140px] h-8">
            <Tag className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Due date */}
        <div className="relative">
          <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-[140px] h-8 pl-8 text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {(mode === 'edit' || compact) && (
          <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" disabled={!title.trim() || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              {mode === 'edit' ? 'Saving...' : 'Adding...'}
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              {mode === 'edit' ? 'Save' : 'Add Todo'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
