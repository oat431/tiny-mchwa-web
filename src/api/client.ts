import type { APIResponse, CreateTodolistRequest, CreateTaskRequest, PaginationMeta, Task, Todolist, UpdateTodolistRequest, UpdateTaskRequest } from '../types/api'

const BASE = '/api/v1'

async function request<T>(url: string, options?: RequestInit): Promise<APIResponse<T>> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`)
  return data
}

// --- Todolists ---

export async function listTodolists(page = 1, perPage = 20): Promise<{ data: Todolist[]; meta: PaginationMeta }> {
  const res = await request<Todolist[]>(`${BASE}/todolists?page=${page}&perPage=${perPage}`)
  return { data: res.data, meta: res.meta! }
}

export async function getTodolist(id: string): Promise<Todolist> {
  const res = await request<Todolist>(`${BASE}/todolists/${id}`)
  return res.data
}

export async function createTodolist(body: CreateTodolistRequest): Promise<Todolist> {
  const res = await request<Todolist>(`${BASE}/todolists`, { method: 'POST', body: JSON.stringify(body) })
  return res.data
}

export async function updateTodolist(id: string, body: UpdateTodolistRequest): Promise<Todolist> {
  const res = await request<Todolist>(`${BASE}/todolists/${id}`, { method: 'PUT', body: JSON.stringify(body) })
  return res.data
}

export async function deleteTodolist(id: string): Promise<void> {
  await fetch(`${BASE}/todolists/${id}`, { method: 'DELETE' })
}

// --- Tasks ---

export async function listTasks(todolistId: string, page = 1, perPage = 20): Promise<{ data: Task[]; meta: PaginationMeta }> {
  const res = await request<Task[]>(`${BASE}/todolists/${todolistId}/tasks?page=${page}&perPage=${perPage}`)
  return { data: res.data, meta: res.meta! }
}

export async function createTask(todolistId: string, body: CreateTaskRequest): Promise<Task> {
  const res = await request<Task>(`${BASE}/todolists/${todolistId}/tasks`, { method: 'POST', body: JSON.stringify(body) })
  return res.data
}

export async function updateTask(id: string, body: UpdateTaskRequest): Promise<Task> {
  const res = await request<Task>(`${BASE}/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) })
  return res.data
}

export async function deleteTask(id: string): Promise<void> {
  await fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' })
}
