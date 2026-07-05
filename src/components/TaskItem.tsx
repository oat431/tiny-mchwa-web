import type { Task } from '../types/api'
import { StatusBadge } from './StatusBadge'

export function TaskItem({ task, onStatusChange, onEdit, onDelete }: {
  task: Task
  onStatusChange: (id: string, status: Task['status']) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}) {
  const nextStatus: Record<string, Task['status']> = {
    pending: 'inprogress',
    inprogress: 'done',
    done: 'pending',
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg border border-base-300">
      <button
        className="btn btn-sm btn-circle"
        onClick={() => onStatusChange(task.id, nextStatus[task.status])}
        title={`Click to change to ${nextStatus[task.status]}`}
      >
        {task.status === 'done' ? '✓' : task.status === 'inprogress' ? '◐' : '○'}
      </button>
      <div className="flex-1">
        <span className={task.status === 'done' ? 'line-through opacity-50' : ''}>{task.title}</span>
        {task.description && <span className="text-sm text-base-content/50 ml-2">— {task.description}</span>}
      </div>
      <StatusBadge status={task.status} />
      <button className="btn btn-sm btn-ghost" onClick={() => onEdit(task)}>Edit</button>
      <button className="btn btn-sm btn-error btn-ghost" onClick={() => onDelete(task.id)}>✕</button>
    </div>
  )
}
