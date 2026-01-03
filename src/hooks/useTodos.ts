'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, Todo, TodoStats, CreateTodoRequest, UpdateTodoRequest, TodoStatus, TodoPriority } from '@/lib/api'
import { toast } from 'sonner'

interface UseTodosOptions {
  status?: TodoStatus
  priority?: TodoPriority
  assigned_to?: string
}

export function useTodos(conversationId: string, options?: UseTodosOptions) {
  const queryClient = useQueryClient()
  const queryKey = ['todos', conversationId, options]

  // Fetch todos
  const {
    data,
    isLoading: isLoadingTodos,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => api.getTodos(conversationId, options),
    enabled: !!conversationId,
  })

  const todos = data?.todos || []
  const stats = data?.stats || { total: 0, pending: 0, in_progress: 0, completed: 0, cancelled: 0 }

  // Create todo mutation
  const createTodo = useMutation({
    mutationFn: (data: CreateTodoRequest) => api.createTodo(conversationId, data),
    onSuccess: (newTodo) => {
      queryClient.setQueryData(queryKey, (old: { todos: Todo[]; stats: TodoStats } | undefined) => {
        if (!old) return { todos: [newTodo], stats: { ...stats, total: 1, pending: 1 } }
        return {
          todos: [...old.todos, newTodo],
          stats: {
            ...old.stats,
            total: old.stats.total + 1,
            pending: old.stats.pending + 1,
          },
        }
      })
      toast.success('Todo created')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create todo')
    },
  })

  // Update todo mutation
  const updateTodo = useMutation({
    mutationFn: ({ todoId, data }: { todoId: string; data: UpdateTodoRequest }) =>
      api.updateTodo(conversationId, todoId, data),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(queryKey, (old: { todos: Todo[]; stats: TodoStats } | undefined) => {
        if (!old) return old
        return {
          ...old,
          todos: old.todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)),
        }
      })
      // Refetch to get accurate stats
      refetch()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update todo')
    },
  })

  // Delete todo mutation
  const deleteTodo = useMutation({
    mutationFn: (todoId: string) => api.deleteTodo(conversationId, todoId),
    onSuccess: (_, todoId) => {
      queryClient.setQueryData(queryKey, (old: { todos: Todo[]; stats: TodoStats } | undefined) => {
        if (!old) return old
        const deletedTodo = old.todos.find((t) => t.id === todoId)
        const newStats = { ...old.stats, total: old.stats.total - 1 }
        if (deletedTodo) {
          const statusKey = deletedTodo.status as keyof TodoStats
          if (typeof newStats[statusKey] === 'number') {
            (newStats[statusKey] as number)--
          }
        }
        return {
          todos: old.todos.filter((t) => t.id !== todoId),
          stats: newStats,
        }
      })
      toast.success('Todo deleted')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete todo')
    },
  })

  // Toggle todo mutation
  const toggleTodo = useMutation({
    mutationFn: (todoId: string) => api.toggleTodo(conversationId, todoId),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(queryKey, (old: { todos: Todo[]; stats: TodoStats } | undefined) => {
        if (!old) return old
        return {
          ...old,
          todos: old.todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)),
        }
      })
      // Refetch to get accurate stats
      refetch()
      toast.success(updatedTodo.status === 'completed' ? 'Todo completed!' : 'Todo uncompleted')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to toggle todo')
    },
  })

  // Reorder todos mutation
  const reorderTodos = useMutation({
    mutationFn: (todoIds: string[]) => api.reorderTodos(conversationId, todoIds),
    onMutate: async (todoIds) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old: { todos: Todo[]; stats: TodoStats } | undefined) => {
        if (!old) return old
        const reorderedTodos = todoIds
          .map((id, index) => {
            const todo = old.todos.find((t) => t.id === id)
            return todo ? { ...todo, position: index } : null
          })
          .filter((t): t is Todo => t !== null)
        return { ...old, todos: reorderedTodos }
      })

      return { previous }
    },
    onError: (error: Error, _, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
      toast.error(error.message || 'Failed to reorder todos')
    },
  })

  return {
    todos,
    stats,
    isLoadingTodos,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reorderTodos,
    refetch,
  }
}

// Hook for getting todo stats only
export function useTodoStats(conversationId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['todoStats', conversationId],
    queryFn: () => api.getTodoStats(conversationId),
    enabled: !!conversationId,
  })

  return {
    stats: data || { total: 0, pending: 0, in_progress: 0, completed: 0, cancelled: 0 },
    isLoading,
  }
}
