import { useEffect, useState, useCallback } from 'react'
import { getUsers, updateUser, deleteUser } from '../../services/adminApi'
import { X } from 'lucide-react'

function UserDetailModal({ user, onClose }) {
  const rows = [
    ['Full Name',       user.name],
    ['Email',          user.email],
    ['Role',           user.role || '—'],
    ['Phone',          user.phone || '—'],
    ['Business Phone', user.business_phone || '—'],
    ['Company',        user.company_name || '—'],
    ['Status',         user.status || '—'],
    ['Registered',     user.created_at ? new Date(user.created_at).toLocaleString() : '—'],
    ['Last Updated',   user.updated_at ? new Date(user.updated_at).toLocaleString() : '—'],
  ]
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:'20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px', width:'100%', maxWidth:'480px', padding:'28px', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:'16px', right:'16px', background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><X size={20}/></button>
        {/* Avatar + name */}
        <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'24px', paddingBottom:'20px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', fontWeight:700, color:'#fff', flexShrink:0 }}>
            {(user.name || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color:'#fff', fontWeight:700, fontSize:'18px' }}>{user.name}</div>
            <div style={{ color:'#94a3b8', fontSize:'13px' }}>{user.email}</div>
            <span style={{ marginTop:'6px', display:'inline-block', background: user.status==='approved' ? 'rgba(16,185,129,0.15)' : user.status==='frozen' ? 'rgba(56,189,248,0.15)' : 'rgba(239,68,68,0.15)', color: user.status==='approved' ? '#10b981' : user.status==='frozen' ? '#38bdf8' : '#ef4444', fontSize:'11px', fontWeight:700, padding:'2px 10px', borderRadius:'10px', letterSpacing:'0.4px', textTransform:'uppercase' }}>{user.status || 'unknown'}</span>
          </div>
        </div>
        {/* Detail rows */}
        <div style={{ display:'grid', gap:'12px' }}>
          {rows.map(([label, val]) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
              <span style={{ color:'#94a3b8', fontSize:'12px', fontWeight:600, flexShrink:0 }}>{label}</span>
              <span style={{ color:'#fff', fontSize:'13px', textAlign:'right', wordBreak:'break-all' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Badge({ status }) {
  const badgeClass = status === 'approved' ? 'admin-badge-success' : status === 'rejected' ? 'admin-badge-danger' : status === 'frozen' ? 'admin-badge-info' : 'admin-badge-warning';
  return (
    <span className={`admin-badge ${badgeClass}`}>
      {status}
    </span>
  )
}

function UserRow({ user, onAction, onView }) {
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
      style={{ padding: '4px 8px', fontSize: '11px', color: type === 'success' ? '#10b981' : type === 'danger' ? '#ef4444' : type === 'warning' ? '#f59e0b' : type === 'info' ? '#38bdf8' : '#3b82f6', border: '1px solid rgba(255,255,255,0.1)' }}>
      {label}
    </button>
  )

  return (
    <tr onClick={onView} style={{ cursor:'pointer' }}>
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
      <td onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {user.status !== 'approved'  && btn('✓ Approve', (e) => { e.stopPropagation(); act('approved') }, 'success')}
          {user.status !== 'rejected'  && btn('✗ Reject',  (e) => { e.stopPropagation(); act('rejected') }, 'danger')}
          {user.status === 'approved'  && btn('❄️ Freeze', (e) => { e.stopPropagation(); act('frozen') }, 'info')}
          {btn('🗑 Delete', (e) => { e.stopPropagation(); del() }, 'danger')}
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
  const [selected, setSelected] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page }
      if (filter !== 'all') params.status = filter
      if (search) params.search = search
      const res = await getUsers(params)
      // Exclude admin-role accounts from the customer management view
      const nonAdmins = (res.data || []).filter(u => u.role !== 'admin')
      setUsers(nonAdmins)
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
      {selected && <UserDetailModal user={selected} onClose={() => setSelected(null)} />}
      <h2 style={{ marginBottom: '20px' }}>👥 User Management</h2>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
        {pill('All', 'all')}
        {pill('✓ Approved', 'approved')}
        {pill('❄️ Frozen', 'frozen')}
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
              {users.map(u => <UserRow key={u.id} user={u} onAction={load} onView={() => setSelected(u)} />)}
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
