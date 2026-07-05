import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTodolists, useCreateTodolist, useUpdateTodolist, useDeleteTodolist } from '../hooks/useTodolists'
import { TodolistCard } from '../components/TodolistCard'
import type { CreateTodolistRequest, Todolist } from '../types/api'

export function TodolistsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const sourceService = searchParams.get('sourceService') ?? ''
  const title = searchParams.get('title') ?? ''

  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Todolist | null>(null)
  const [form, setForm] = useState<CreateTodolistRequest>({ title: '', description: '', sourceService: 'todolist' })
  const [filterTitle, setFilterTitle] = useState(title)
  const [filterSource, setFilterSource] = useState(sourceService)

  const { data, isLoading, error, refetch } = useTodolists(page)
  const createMutation = useCreateTodolist()
  const updateMutation = useUpdateTodolist()
  const deleteMutation = useDeleteTodolist()

  const todolists = data?.data ?? []
  const totalPages = data?.meta?.totalPages ?? 1

  // Client-side filters
  const filtered = todolists.filter(tl => {
    if (title && !tl.title.toLowerCase().includes(title.toLowerCase())) return false
    if (sourceService && tl.sourceService !== sourceService) return false
    return true
  })

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams)
    if (p <= 1) params.delete('page')
    else params.set('page', String(p))
    setSearchParams(params)
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (filterTitle) params.set('title', filterTitle)
    if (filterSource) params.set('sourceService', filterSource)
    params.set('page', '1')
    setSearchParams(params)
  }

  const clearFilters = () => {
    setFilterTitle('')
    setFilterSource('')
    setSearchParams({})
  }

  const handleCreate = () => {
    if (!form.title) return
    createMutation.mutate(form, {
      onSuccess: () => { setShowModal(false); setForm({ title: '', description: '', sourceService: 'todolist' }) },
      onError: (e) => alert(e.message),
    })
  }

  const handleUpdate = () => {
    if (!editItem || !form.title) return
    updateMutation.mutate({ id: editItem.id, body: { title: form.title, description: form.description } }, {
      onSuccess: () => setEditItem(null),
      onError: (e) => alert(e.message),
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this todolist?')) return
    deleteMutation.mutate(id, { onError: (e) => alert(e.message) })
  }

  const openEdit = (tl: Todolist) => {
    setForm({ title: tl.title, description: tl.description ?? '', sourceService: tl.sourceService })
    setEditItem(tl)
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🐜 tiny mchwa</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ title: '', description: '', sourceService: 'todolist' }); setShowModal(true) }}>
          + New Todolist
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input className="input input-bordered input-sm flex-1" placeholder="Filter by title..." value={filterTitle} onChange={e => setFilterTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyFilters()} />
        <input className="input input-bordered input-sm w-40" placeholder="Source service" value={filterSource} onChange={e => setFilterSource(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyFilters()} />
        <button className="btn btn-sm btn-primary" onClick={applyFilters}>Filter</button>
        {(title || sourceService) && <button className="btn btn-sm btn-ghost" onClick={clearFilters}>Clear</button>}
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error.message}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-base-content/50">
          {title || sourceService ? 'No todolists match your filters' : 'No todolists yet. Create one!'}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(tl => (
            <TodolistCard
              key={tl.id}
              todolist={tl}
              onEdit={openEdit}
              onDelete={handleDelete}
              onViewTasks={(id) => navigate(`/todolists/${id}`)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="join flex justify-center mt-6">
          <button className="join-item btn btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>«</button>
          <button className="join-item btn btn-sm">Page {page} of {totalPages}</button>
          <button className="join-item btn btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>»</button>
        </div>
      )}

      {(showModal || editItem) && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{editItem ? 'Edit Todolist' : 'New Todolist'}</h3>
            <div className="flex flex-col gap-3 mt-4">
              <input className="input input-bordered w-full" placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <textarea className="textarea textarea-bordered w-full" placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              {!editItem && (
                <input className="input input-bordered w-full" placeholder="Source service" value={form.sourceService} onChange={e => setForm(f => ({ ...f, sourceService: e.target.value }))} />
              )}
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => { setShowModal(false); setEditItem(null) }}>Cancel</button>
              <button className="btn btn-primary" onClick={editItem ? handleUpdate : handleCreate}>
                {editItem ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}
