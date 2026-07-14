import { useEffect, useState, useCallback } from 'react'
import { getUsers, updateUser, deleteUser } from '../../services/adminApi'

function Badge({ status }) {
  const badgeClass = status === 'approved' ? 'admin-badge-success' : status === 'rejected' ? 'admin-badge-danger' : 'admin-badge-warning';
  return (
    <span className={`admin-badge ${badgeClass}`}>
      {status}
    </span>
  )
}

function UserRow({ user, onAction }) {
  const [busy, setBusy] = useState(false)

  const act = async (status) => {
    setBusy(true)
    try {
      await updateUser(user.id, { status })
      onAction()
    } catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const del = async () => {
    if (!confirm(`Permanently delete user "${user.name}"? This cannot be undone.`)) return
    setBusy(true)
    try {
      await deleteUser(user.id)
      onAction()
    } catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const btn = (label, action, type) => (
    <button onClick={action} disabled={busy} className="admin-btn admin-btn-ghost"
      style={{ padding: '4px 8px', fontSize: '11px', color: type === 'success' ? '#10b981' : type === 'danger' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6', border: '1px solid rgba(255,255,255,0.1)' }}>
      {label}
    </button>
  )

  return (
    <tr>
      <td>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{user.name}</div>
        <div style={{ color: '#94a3b8', fontSize: '12px' }}>{user.email}</div>
      </td>
      <td>{user.company_name || '—'}</td>
      <td>{user.phone || '—'}</td>
      <td><Badge status={user.status || 'approved'} /></td>
      <td>
        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
      </td>
      <td>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {user.status !== 'approved'  && btn('✓ Approve', () => act('approved'), 'success')}
          {user.status !== 'rejected'  && btn('✗ Reject',  () => act('rejected'), 'danger')}
          {user.status !== 'pending'   && btn('⏳ Pending', () => act('pending'),  'warning')}
          {btn('🗑 Delete', del, 'danger')}
        </div>
      </td>
    </tr>
  )
}

export default function AdminUsers() {
  const [users, setUsers]   = useState([])
  const [meta, setMeta]     = useState({})
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage]     = useState(1)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page }
      if (filter !== 'all') params.status = filter
      if (search) params.search = search
      const res = await getUsers(params)
      setUsers(res.data)
      setMeta({ current_page: res.current_page, last_page: res.last_page, total: res.total })
    } catch (e) { alert(e.message) }
    finally { setLoading(false) }
  }, [filter, search, page])

  useEffect(() => { load() }, [load])

  const pill = (label, val) => (
    <button onClick={() => { setFilter(val); setPage(1) }} className="admin-btn admin-btn-ghost" style={{
      background: filter === val ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      color: filter === val ? '#3b82f6' : '#94a3b8',
      border: `1px solid ${filter === val ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
    }}>{label}</button>
  )

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>👥 User Management</h2>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
        {pill('All', 'all')}
        {pill('⏳ Pending', 'pending')}
        {pill('✓ Approved', 'approved')}
        {pill('✗ Rejected', 'rejected')}
        <input
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search name, email, company…"
          className="admin-input-field"
          style={{ marginLeft: 'auto', width: '240px' }} />
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '1.5rem' }}>
        {loading ? (
          <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>Loading users…</div>
        ) : users.length === 0 ? (
          <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>No users found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {['User', 'Company', 'Phone', 'Status', 'Registered', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => <UserRow key={u.id} user={u} onAction={load} />)}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center', color: '#94a3b8', fontSize: '13px' }}>
        <span>Page {meta.current_page} of {meta.last_page} ({meta.total} users)</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page <= 1} className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>← Prev</button>
          <button onClick={() => setPage(p => Math.min(meta.last_page, p+1))} disabled={page >= meta.last_page} className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Next →</button>
        </div>
      </div>
    </div>
  )
}
