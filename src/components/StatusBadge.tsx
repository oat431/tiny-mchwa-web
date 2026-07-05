export function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'done' ? 'badge-success' :
    status === 'inprogress' ? 'badge-warning' :
    'badge-info'
  return <span className={`badge ${cls}`}>{status}</span>
}
