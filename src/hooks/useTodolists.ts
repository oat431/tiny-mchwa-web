import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/client'
import type { CreateTodolistRequest, UpdateTodolistRequest } from '../types/api'

export function useTodolists(page: number) {
  return useQuery({
    queryKey: ['todolists', page],
    queryFn: () => api.listTodolists(page),
    staleTime: 30_000,
  })
}

export function useTodolist(id: string) {
  return useQuery({
    queryKey: ['todolist', id],
    queryFn: () => api.getTodolist(id),
    enabled: !!id,
  })
}

export function useCreateTodolist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateTodolistRequest) => api.createTodolist(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['todolists'] }),
  })
}

export function useUpdateTodolist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateTodolistRequest }) => api.updateTodolist(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['todolists'] })
      qc.invalidateQueries({ queryKey: ['todolist', id] })
    },
  })
}

export function useDeleteTodolist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteTodolist(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['todolists'] }),
  })
}
