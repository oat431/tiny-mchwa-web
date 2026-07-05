export interface Todolist {
  id: string
  title: string
  description: string | null
  status: 'pending' | 'inprogress' | 'done'
  createdAt: string
  updatedAt: string
  ownedBy: string
  sourceService: string
}

export interface Task {
  id: string
  todolistId: string
  title: string
  description: string | null
  status: 'pending' | 'inprogress' | 'done'
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface APIResponse<T> {
  data: T
  error: { code: number; message: string; details?: string[] } | null
  meta: PaginationMeta | null
}

export interface CreateTodolistRequest {
  title: string
  description?: string
  sourceService: string
}

export interface UpdateTodolistRequest {
  title: string
  description?: string
}

export interface CreateTaskRequest {
  title: string
  description?: string
}

export interface UpdateTaskRequest {
  title: string
  description?: string
  status: 'pending' | 'inprogress' | 'done'
}
