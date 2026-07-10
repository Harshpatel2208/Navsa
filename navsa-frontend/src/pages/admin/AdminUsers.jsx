import { useEffect, useState, useCallback } from 'react'
import { getUsers, updateUser, deleteUser } from '../../services/adminApi'

const STATUS_COLORS = {
  pending:  { bg: '#451a03', color: '#fbbf24', border: '#92400e' },
  approved: { bg: '#052e16', color: '#4ade80', border: '#166534' },
  rejected: { bg: '#450a0a', color: '#f87171', border: '#991b1b' },
}

function Badge({ status }) {
  const c = STATUS_COLORS[status] || { bg: '#1a2744', color: '#7ea8c4', border: '#2a3f6f' }
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: '20px', padding: '3px 12px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
    }}>{status}</span>
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

  const btn = (label, action, color) => (
    <button onClick={action} disabled={busy}
      style={{ background: color, border: 'none', borderRadius: '8px', color: '#fff', cursor: busy ? 'not-allowed' : 'pointer',
               fontSize: '11px', fontWeight: 700, padding: '5px 12px', opacity: busy ? .5 : 1, transition: 'opacity .2s' }}>
      {label}
    </button>
  )

  return (
    <tr style={{ borderBottom: '1px solid #1a2744' }}>
      <td style={{ padding: '14px 12px' }}>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{user.name}</div>
        <div style={{ color: '#7ea8c4', fontSize: '12px' }}>{user.email}</div>
      </td>
      <td style={{ padding: '14px 12px', color: '#cbd5e1', fontSize: '13px' }}>{user.company_name || '—'}</td>
      <td style={{ padding: '14px 12px', color: '#cbd5e1', fontSize: '13px' }}>{user.phone || '—'}</td>
      <td style={{ padding: '14px 12px' }}><Badge status={user.status || 'approved'} /></td>
      <td style={{ padding: '14px 12px', color: '#7ea8c4', fontSize: '12px' }}>
        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
      </td>
      <td style={{ padding: '14px 12px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {user.status !== 'approved'  && btn('✓ Approve', () => act('approved'), '#16a34a')}
          {user.status !== 'rejected'  && btn('✗ Reject',  () => act('rejected'), '#dc2626')}
          {user.status !== 'pending'   && btn('⏳ Pending', () => act('pending'),  '#d97706')}
          {btn('🗑 Delete', del, '#7f1d1d')}
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
    <button onClick={() => { setFilter(val); setPage(1) }} style={{
      background: filter === val ? '#c9a84c' : '#1a2744',
      color: filter === val ? '#0a1128' : '#7ea8c4',
      border: `1px solid ${filter === val ? '#c9a84c' : '#2a3f6f'}`,
      borderRadius: '20px', padding: '6px 16px', fontSize: '12px', fontWeight: 700,
      cursor: 'pointer', transition: 'all .2s',
    }}>{label}</button>
  )

  return (
    <div>
      <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '22px', fontWeight: 700 }}>👥 User Management</h2>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
        {pill('All', 'all')}
        {pill('⏳ Pending', 'pending')}
        {pill('✓ Approved', 'approved')}
        {pill('✗ Rejected', 'rejected')}
        <input
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search name, email, company…"
          style={{ marginLeft: 'auto', background: '#1a2744', border: '1px solid #2a3f6f', borderRadius: '10px',
                   color: '#fff', padding: '8px 14px', fontSize: '13px', width: '240px', outline: 'none' }} />
      </div>

      {/* Table */}
      <div style={{ background: '#0f1e36', borderRadius: '16px', border: '1px solid #1a2744', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ color: '#7ea8c4', padding: '40px', textAlign: 'center' }}>Loading users…</div>
        ) : users.length === 0 ? (
          <div style={{ color: '#7ea8c4', padding: '40px', textAlign: 'center' }}>No users found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a2744' }}>
                {['User', 'Company', 'Phone', 'Status', 'Registered', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px', textAlign: 'left', color: '#7ea8c4', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
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
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center', color: '#7ea8c4', fontSize: '13px' }}>
        <span>Page {meta.current_page} of {meta.last_page} ({meta.total} users)</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page <= 1}
            style={{ background: '#1a2744', border: '1px solid #2a3f6f', borderRadius: '8px', color: '#fff', padding: '6px 14px', cursor: page<=1?'not-allowed':'pointer', opacity: page<=1?.5:1 }}>← Prev</button>
          <button onClick={() => setPage(p => Math.min(meta.last_page, p+1))} disabled={page >= meta.last_page}
            style={{ background: '#1a2744', border: '1px solid #2a3f6f', borderRadius: '8px', color: '#fff', padding: '6px 14px', cursor: page>=meta.last_page?'not-allowed':'pointer', opacity: page>=meta.last_page?.5:1 }}>Next →</button>
        </div>
      </div>
    </div>
  )
}
