import { useEffect, useState } from 'react'
import { getStats } from '../../services/adminApi'
import { Package, Tag, Users, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

function StatCard({ label, value, sub, accent, icon: Icon }) {
  return (
    <div className="glass-panel admin-stat-card" style={{ borderColor: accent ? accent : 'rgba(255,255,255,0.1)' }}>
      {Icon && (
        <div className="admin-stat-icon" style={{ background: accent ? `${accent}20` : 'rgba(59, 130, 246, 0.1)', color: accent || '#3b82f6' }}>
          <Icon size={24} />
        </div>
      )}
      <div className="admin-stat-value" style={{ color: accent || '#fff' }}>{value ?? '—'}</div>
      <div className="admin-stat-label">{label}</div>
      {sub && <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>{sub}</div>}
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

  if (loading) return <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>Loading stats…</div>
  if (error)   return <div style={{ color: '#ef4444', padding: '40px' }}>Error: {error}</div>

  return (
    <div>
      <div className="admin-flex-between mb-6">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Dashboard Overview</h1>
          <p style={{ color: '#94a3b8' }}>Welcome back, Admin</p>
        </div>
        <button onClick={() => window.print()} className="admin-btn admin-btn-primary">Print Report</button>
      </div>

      <h3 style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '12px' }}>Products</h3>
      <div className="admin-stats-grid">
        <StatCard label="Total Products"   value={stats.total_products}  icon={Package} />
        <StatCard label="Live on Web"      value={stats.live_products}   accent="#10b981" icon={CheckCircle} sub="Visible to customers" />
        <StatCard label="Hidden"           value={stats.hidden_products} accent="#f59e0b" icon={EyeOffPlaceholder} />
        <StatCard label="Active Offers"    value={stats.offer_products}  accent="#c9a84c" icon={Tag} sub="Daily offer items" />
        <StatCard label="Low Stock (≤5)"   value={stats.low_stock}       accent="#f59e0b" icon={AlertTriangle} sub="Need restocking" />
        <StatCard label="Out of Stock"     value={stats.out_of_stock}    accent="#ef4444" icon={XCircle} />
      </div>

      <h3 style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '12px' }}>Catalogue</h3>
      <div className="admin-stats-grid">
        <StatCard label="Brands"     value={stats.total_brands} icon={Tag} />
        <StatCard label="Categories" value={stats.total_categories} icon={Package} />
      </div>

      <h3 style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '12px' }}>Users</h3>
      <div className="admin-stats-grid">
        <StatCard label="Total Users"    value={stats.total_users} icon={Users} />
        <StatCard label="Pending Approval" value={stats.pending_users}  accent="#f59e0b" icon={AlertTriangle} sub="⚠ Awaiting review" />
        <StatCard label="Approved"       value={stats.approved_users}  accent="#10b981" icon={CheckCircle} />
        <StatCard label="Rejected"       value={stats.rejected_users}  accent="#ef4444" icon={XCircle} />
      </div>
    </div>
  )
}

function EyeOffPlaceholder({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );
}
