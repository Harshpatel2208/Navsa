import { useEffect, useState } from 'react'
import { getStats } from '../../services/adminApi'

const s = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '16px' },
  card: {
    background: 'linear-gradient(135deg,#1a2744,#0f1e36)',
    border: '1px solid #2a3f6f',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    transition: 'transform .2s,box-shadow .2s',
  },
  label: { color: '#7ea8c4', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' },
  value: { color: '#fff', fontSize: '36px', fontWeight: 800 },
  sub:   { color: '#c9a84c', fontSize: '13px', fontWeight: 500 },
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ ...s.card, borderColor: accent || '#2a3f6f' }}
         onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 30px rgba(0,0,0,.4)' }}
         onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}>
      <div style={s.label}>{label}</div>
      <div style={{ ...s.value, color: accent || '#fff' }}>{value ?? '—'}</div>
      {sub && <div style={s.sub}>{sub}</div>}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: '#7ea8c4', padding: '40px', textAlign: 'center' }}>Loading stats…</div>
  if (error)   return <div style={{ color: '#f87171', padding: '40px' }}>Error: {error}</div>

  return (
    <div>
      <h2 style={{ color: '#fff', marginBottom: '24px', fontSize: '22px', fontWeight: 700 }}>📊 Dashboard Overview</h2>

      <h3 style={{ color: '#7ea8c4', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '12px' }}>Products</h3>
      <div style={{ ...s.grid, marginBottom: '32px' }}>
        <StatCard label="Total Products"   value={stats.total_products}  />
        <StatCard label="Live on Web"      value={stats.live_products}   accent="#22c55e" sub="Visible to customers" />
        <StatCard label="Hidden"           value={stats.hidden_products} accent="#f59e0b" />
        <StatCard label="Active Offers"    value={stats.offer_products}  accent="#c9a84c" sub="Daily offer items" />
        <StatCard label="Low Stock (≤5)"   value={stats.low_stock}       accent="#f97316" sub="Need restocking" />
        <StatCard label="Out of Stock"     value={stats.out_of_stock}    accent="#ef4444" />
      </div>

      <h3 style={{ color: '#7ea8c4', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '12px' }}>Catalogue</h3>
      <div style={{ ...s.grid, marginBottom: '32px' }}>
        <StatCard label="Brands"     value={stats.total_brands} />
        <StatCard label="Categories" value={stats.total_categories} />
      </div>

      <h3 style={{ color: '#7ea8c4', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '12px' }}>Users</h3>
      <div style={s.grid}>
        <StatCard label="Total Users"    value={stats.total_users} />
        <StatCard label="Pending Approval" value={stats.pending_users}  accent="#f59e0b" sub="⚠ Awaiting review" />
        <StatCard label="Approved"       value={stats.approved_users}  accent="#22c55e" />
        <StatCard label="Rejected"       value={stats.rejected_users}  accent="#ef4444" />
      </div>
    </div>
  )
}
