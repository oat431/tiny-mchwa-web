import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/client'
import type { CreateTaskRequest, UpdateTaskRequest } from '../types/api'

export function useTasks(todolistId: string) {
  return useQuery({
    queryKey: ['tasks', todolistId],
    queryFn: () => api.listTasks(todolistId),
    enabled: !!todolistId,
  })
}

export function useCreateTask(todolistId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateTaskRequest) => api.createTask(todolistId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', todolistId] })
      qc.invalidateQueries({ queryKey: ['todolists'] })
      qc.invalidateQueries({ queryKey: ['todolist', todolistId] })
    },
  })
}

export function useUpdateTask(todolistId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateTaskRequest }) => api.updateTask(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', todolistId] })
      qc.invalidateQueries({ queryKey: ['todolists'] })
      qc.invalidateQueries({ queryKey: ['todolist', todolistId] })
    },
  })
}

export function useDeleteTask(todolistId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteTask(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', todolistId] })
      qc.invalidateQueries({ queryKey: ['todolists'] })
      qc.invalidateQueries({ queryKey: ['todolist', todolistId] })
    },
  })
}
