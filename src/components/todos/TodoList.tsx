'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  Loader2,
  ListTodo,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useTodos } from '@/hooks/useTodos'
import { TodoItem } from './TodoItem'
import { TodoForm } from './TodoForm'
import { Todo, TodoStatus, UpdateTodoRequest, CreateTodoRequest } from '@/lib/api'

interface TodoListProps {
  conversationId: string
  maxHeight?: string
  embedded?: boolean // When true, removes internal ScrollArea (for use in sidebar)
}

type FilterType = 'all' | 'active' | 'completed'

export function TodoList({ conversationId, maxHeight = '400px', embedded = false }: TodoListProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const {
    todos,
    stats,
    isLoadingTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  } = useTodos(conversationId)

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return todo.status !== 'completed' && todo.status !== 'cancelled'
    if (filter === 'completed') return todo.status === 'completed'
    return true
  })

  // Sort: incomplete first (by position), then completed
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1
    if (a.status !== 'completed' && b.status === 'completed') return -1
    return a.position - b.position
  })

  const handleCreateTodo = (data: CreateTodoRequest) => {
    createTodo.mutate(data)
  }

  const handleUpdateTodo = (todoId: string, data: Partial<UpdateTodoRequest>) => {
    updateTodo.mutate({ todoId, data })
    if (editingTodo?.id === todoId) {
      setEditingTodo(null)
    }
  }

  const handleDeleteTodo = (todoId: string) => {
    deleteTodo.mutate(todoId)
  }

  const handleToggleTodo = (todoId: string) => {
    toggleTodo.mutate(todoId)
  }

  if (isLoadingTodos) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ListTodo className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {stats.completed}/{stats.total} completed
          </span>
        </div>

        {/* Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              {filter === 'all' ? 'All' : filter === 'active' ? 'Active' : 'Completed'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter Todos</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilter('all')}>
              <Circle className="w-3.5 h-3.5 mr-2" />
              All ({stats.total})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('active')}>
              <Circle className="w-3.5 h-3.5 mr-2 text-yellow-400" />
              Active ({stats.pending + stats.in_progress})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('completed')}>
              <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-green-400" />
              Completed ({stats.completed})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Progress bar */}
      {stats.total > 0 && (
        <div className="mb-4">
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.completed / stats.total) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Todo list */}
      {embedded ? (
        <div className="flex-1 space-y-2">
          <AnimatePresence mode="popLayout">
            {sortedTodos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
                  <ListTodo className="w-6 h-6 text-zinc-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {filter === 'completed'
                    ? 'No completed todos yet'
                    : filter === 'active'
                    ? 'All todos are completed!'
                    : 'No todos yet. Add one below!'}
                </p>
              </motion.div>
            ) : (
              sortedTodos.map((todo) => (
                <div key={todo.id}>
                  {editingTodo?.id === todo.id ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg border border-zinc-600 bg-zinc-800/80"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Editing todo</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => setEditingTodo(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                      <TodoForm
                        mode="edit"
                        initialData={editingTodo}
                        onSubmit={(data) => handleUpdateTodo(editingTodo.id, data)}
                        onCancel={() => setEditingTodo(null)}
                        isSubmitting={updateTodo.isPending}
                      />
                    </motion.div>
                  ) : (
                    <TodoItem
                      todo={todo}
                      onToggle={handleToggleTodo}
                      onUpdate={handleUpdateTodo}
                      onDelete={handleDeleteTodo}
                      onEdit={setEditingTodo}
                      isToggling={toggleTodo.isPending}
                      isDeleting={deleteTodo.isPending}
                    />
                  )}
                </div>
              ))
            )}
          </AnimatePresence>
        </div>
      ) : (
        <ScrollArea className="flex-1" style={{ maxHeight }}>
          <div className="space-y-2 pr-2">
            <AnimatePresence mode="popLayout">
              {sortedTodos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
                    <ListTodo className="w-6 h-6 text-zinc-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {filter === 'completed'
                      ? 'No completed todos yet'
                      : filter === 'active'
                      ? 'All todos are completed!'
                      : 'No todos yet. Add one below!'}
                  </p>
                </motion.div>
              ) : (
                sortedTodos.map((todo) => (
                  <div key={todo.id}>
                    {editingTodo?.id === todo.id ? (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg border border-zinc-600 bg-zinc-800/80"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">Editing todo</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => setEditingTodo(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                        <TodoForm
                          mode="edit"
                          initialData={editingTodo}
                          onSubmit={(data) => handleUpdateTodo(editingTodo.id, data)}
                          onCancel={() => setEditingTodo(null)}
                          isSubmitting={updateTodo.isPending}
                        />
                      </motion.div>
                    ) : (
                      <TodoItem
                        todo={todo}
                        onToggle={handleToggleTodo}
                        onUpdate={handleUpdateTodo}
                        onDelete={handleDeleteTodo}
                        onEdit={setEditingTodo}
                        isToggling={toggleTodo.isPending}
                        isDeleting={deleteTodo.isPending}
                      />
                    )}
                  </div>
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}

      {/* Add todo form - always show create form since editing is inline */}
      <div className="mt-4 pt-4 border-t border-zinc-800">
        <TodoForm
          compact
          onSubmit={handleCreateTodo}
          isSubmitting={createTodo.isPending}
        />
      </div>
    </div>
  )
}
