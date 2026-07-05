import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTodolist, deleteTodolist, listTodolists, updateTodolist } from '../api/client'
import { TodolistCard } from '../components/TodolistCard'
import { usePageTitle } from '../hooks/usePageTitle'
import type { CreateTodolistRequest, Todolist } from '../types/api'

export function TodolistsPage() {
  const navigate = useNavigate()
  usePageTitle('Todolists')

  const [todolists, setTodolists] = useState<Todolist[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Todolist | null>(null)
  const [form, setForm] = useState<CreateTodolistRequest>({ title: '', description: '', sourceService: 'todolist' })

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, meta } = await listTodolists(page)
      setTodolists(data)
      setTotalPages(meta?.totalPages ?? 1)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load todolists')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page])

  const handleCreate = async () => {
    if (!form.title) return
    try {
      await createTodolist(form)
      setShowModal(false)
      setForm({ title: '', description: '', sourceService: 'todolist' })
      load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to create todolist')
    }
  }

  const handleUpdate = async () => {
    if (!editItem || !form.title) return
    try {
      await updateTodolist(editItem.id, { title: form.title, description: form.description })
      setEditItem(null)
      load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update todolist')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this todolist?')) return
    try {
      await deleteTodolist(id)
      load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete todolist')
    }
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

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost" onClick={load}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>
      ) : todolists.length === 0 ? (
        <div className="text-center py-12 text-base-content/50">No todolists yet. Create one!</div>
      ) : (
        <div className="flex flex-col gap-3">
          {todolists.map(tl => (
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
          <button className="join-item btn btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>«</button>
          <button className="join-item btn btn-sm">Page {page}</button>
          <button className="join-item btn btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>»</button>
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
