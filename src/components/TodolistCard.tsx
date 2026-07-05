import type { Todolist } from '../types/api'
import { StatusBadge } from './StatusBadge'

export function TodolistCard({ todolist, onEdit, onDelete, onViewTasks }: {
  todolist: Todolist
  onEdit: (tl: Todolist) => void
  onDelete: (id: string) => void
  onViewTasks: (id: string) => void
}) {
  return (
    <div className="card bg-base-100 shadow-md border border-base-300">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title">{todolist.title}</h2>
          <StatusBadge status={todolist.status} />
        </div>
        {todolist.description && <p className="text-base-content/70">{todolist.description}</p>}
        <div className="text-sm text-base-content/50">
          {todolist.sourceService} · {new Date(todolist.createdAt).toLocaleDateString()}
        </div>
        <div className="card-actions justify-end mt-2">
          <button className="btn btn-sm btn-ghost" onClick={() => onViewTasks(todolist.id)}>Tasks</button>
          <button className="btn btn-sm btn-outline" onClick={() => onEdit(todolist)}>Edit</button>
          <button className="btn btn-sm btn-error btn-outline" onClick={() => onDelete(todolist.id)}>Delete</button>
        </div>
      </div>
    </div>
  )
}
