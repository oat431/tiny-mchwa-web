import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTodolist } from '../hooks/useTodolists'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks'
import { TaskItem } from '../components/TaskItem'
import { StatusBadge } from '../components/StatusBadge'
import type { CreateTaskRequest, Task, UpdateTaskRequest } from '../types/api'
import { usePageTitle } from '../hooks/usePageTitle'
import type { CreateTaskRequest, Task, Todolist, UpdateTaskRequest } from '../types/api'

export function TodolistDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [todolist, setTodolist] = useState<Todolist | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [form, setForm] = useState<CreateTaskRequest & UpdateTaskRequest>({ title: '', description: '', status: 'pending' })

  const { data: todolist, isLoading: todoLoading, error: todoError } = useTodolist(id!)
  const { data: tasksData, isLoading: tasksLoading } = useTasks(id!)
  const createMutation = useCreateTask(id!)
  const updateMutation = useUpdateTask(id!)
  const deleteMutation = useDeleteTask(id!)
  usePageTitle(todolist?.title ?? 'Todolist')

  const load = async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const [tl, { data }] = await Promise.all([getTodolist(id), listTasks(id)])
      setTodolist(tl)
      setTasks(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load todolist')
    } finally {
      setLoading(false)
    }
  }

  const tasks = tasksData?.data ?? []
  const loading = todoLoading || tasksLoading

  const handleCreate = () => {
    if (!form.title) return
    createMutation.mutate({ title: form.title, description: form.description }, {
      onSuccess: () => { setShowModal(false); setForm({ title: '', description: '', status: 'pending' }) },
      onError: (e) => alert(e.message),
    })
  const handleCreate = async () => {
    if (!id || !form.title) return
    try {
      await createTask(id, { title: form.title, description: form.description })
      setShowModal(false)
      setForm({ title: '', description: '', status: 'pending' })
      load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to create task')
    }
  }

  const handleUpdate = () => {
    if (!editTask || !form.title) return
    updateMutation.mutate({ id: editTask.id, body: { title: form.title, description: form.description, status: form.status } }, {
      onSuccess: () => setEditTask(null),
      onError: (e) => alert(e.message),
    })
    try {
      await updateTask(editTask.id, { title: form.title, description: form.description, status: form.status })
      setEditTask(null)
      load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update task')
    }
  }

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    updateMutation.mutate({ id: taskId, body: { title: task.title, description: task.description ?? '', status } }, {
      onError: (e) => alert(e.message),
    })
    try {
      await updateTask(taskId, { title: task.title, description: task.description ?? '', status })
      load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update task status')
    }
  }

  const handleDeleteTask = (taskId: string) => {
    if (!confirm('Delete this task?')) return
    deleteMutation.mutate(taskId, { onError: (e) => alert(e.message) })
    try {
      await deleteTask(taskId)
      load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete task')
    }
  }

  const openEdit = (task: Task) => {
    setForm({ title: task.title, description: task.description ?? '', status: task.status })
    setEditTask(task)
  }

  if (loading) {
    return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>
  }

  if (todoError) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <button className="btn btn-ghost mb-4" onClick={() => navigate('/')}>← Back</button>
        <div className="alert alert-error"><span>{todoError.message}</span></div>
  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <button className="btn btn-ghost mb-4" onClick={() => navigate('/')}>← Back</button>
        <div className="alert alert-error">
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost" onClick={load}>Retry</button>
        </div>
      </div>
    )
  }

  if (!todolist) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <button className="btn btn-ghost mb-4" onClick={() => navigate('/')}>← Back</button>
        <div className="text-center py-12">Todolist not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <button className="btn btn-ghost mb-4" onClick={() => navigate('/')}>← Back</button>

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{todolist.title}</h1>
          <StatusBadge status={todolist.status} />
        </div>
        {todolist.description && <p className="text-base-content/70 mt-1">{todolist.description}</p>}
        <div className="text-sm text-base-content/50 mt-1">{todolist.sourceService}</div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Tasks ({tasks.length})</h2>
        <button className="btn btn-primary btn-sm" onClick={() => { setForm({ title: '', description: '', status: 'pending' }); setShowModal(true) }}>
          + New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-base-content/50">No tasks yet</div>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={openEdit}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {(showModal || editTask) && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{editTask ? 'Edit Task' : 'New Task'}</h3>
            <div className="flex flex-col gap-3 mt-4">
              <input className="input input-bordered w-full" placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <textarea className="textarea textarea-bordered w-full" placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              {editTask && (
                <select className="select select-bordered w-full" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Task['status'] }))}>
                  <option value="pending">Pending</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              )}
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => { setShowModal(false); setEditTask(null) }}>Cancel</button>
              <button className="btn btn-primary" onClick={editTask ? handleUpdate : handleCreate}>
                {editTask ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}
