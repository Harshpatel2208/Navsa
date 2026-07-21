import { useEffect, useState, useCallback } from 'react'
import { getBrands, createBrand, updateBrand, softDeleteBrand, hardDeleteBrand } from '../../services/adminApi'
import { Plus, Edit2, Trash2, EyeOff, X } from 'lucide-react';

function BrandDetailModal({ brand, onClose }) {
  const rows = [
    ['ID',          brand.id],
    ['Brand Name',  brand.brand_name],
    ['Status',      brand.status ? 'Active' : 'Disabled'],
    ['Products',    brand.products_count ?? 0],
    ['Created',     brand.created_at ? new Date(brand.created_at).toLocaleString() : '—'],
    ['Last Updated',brand.updated_at ? new Date(brand.updated_at).toLocaleString() : '—'],
  ]
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:'20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px', width:'100%', maxWidth:'420px', padding:'28px', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:'16px', right:'16px', background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><X size={20}/></button>
        <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'24px', paddingBottom:'20px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width:'50px', height:'50px', borderRadius:'12px', background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>🏷️</div>
          <div>
            <div style={{ color:'#fff', fontWeight:700, fontSize:'18px' }}>{brand.brand_name}</div>
            <span style={{ marginTop:'4px', display:'inline-block', background: brand.status ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: brand.status ? '#10b981' : '#ef4444', fontSize:'11px', fontWeight:700, padding:'2px 10px', borderRadius:'10px' }}>{brand.status ? 'ACTIVE' : 'DISABLED'}</span>
          </div>
        </div>
        <div style={{ display:'grid', gap:'12px' }}>
          {rows.map(([label, val]) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
              <span style={{ color:'#94a3b8', fontSize:'12px', fontWeight:600, flexShrink:0 }}>{label}</span>
              <span style={{ color:'#fff', fontSize:'13px', textAlign:'right' }}>{String(val)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BrandRow({ brand, onRefresh, onView }) {
  const [editing, setEditing] = useState(false)
  const [name, setName]       = useState(brand.brand_name)
  const [busy, setBusy]       = useState(false)

  const save = async () => {
    if (!name.trim()) return
    setBusy(true)
    try { await updateBrand(brand.id, { brand_name: name.trim(), status: brand.status }); setEditing(false); onRefresh() }
    catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const toggleStatus = async () => {
    setBusy(true)
    try { await updateBrand(brand.id, { brand_name: brand.brand_name, status: brand.status ? 0 : 1 }); onRefresh() }
    catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const doSoft = async () => {
    if (!confirm('Disable and soft-delete this brand?')) return
    setBusy(true)
    try { await softDeleteBrand(brand.id); onRefresh() }
    catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const doHard = async () => {
    if (!confirm('⚠ PERMANENTLY delete this brand? Products may lose their brand assignment!')) return
    setBusy(true)
    try { await hardDeleteBrand(brand.id); onRefresh() }
    catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  return (
    <tr onClick={onView} style={{ cursor:'pointer' }}>
      <td onClick={e => e.stopPropagation()}>
        {editing ? (
          <div style={{ display: 'flex', gap: '6px' }}>
            <input value={name} onChange={e => setName(e.target.value)} className="admin-input-field" style={{ width: '180px' }}
              onKeyDown={e => e.key === 'Enter' && save()} autoFocus />
            <button onClick={save} disabled={busy} className="admin-btn admin-btn-primary" style={{ padding: '6px 12px' }}>✓</button>
            <button onClick={() => setEditing(false)} className="admin-btn admin-btn-ghost" style={{ padding: '6px 10px', border: '1px solid rgba(255,255,255,0.1)' }}>✕</button>
          </div>
        ) : (
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{brand.brand_name}</div>
        )}
      </td>
      <td style={{ color: '#94a3b8', fontWeight: 600 }}>
        {brand.products_count ?? 0}
      </td>
      <td>
        <span className={`admin-badge ${brand.status ? 'admin-badge-success' : 'admin-badge-warning'}`}>
          {brand.status ? 'Active' : 'Disabled'}
        </span>
      </td>
      <td onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {!editing && (
            <button onClick={(e) => { e.stopPropagation(); setEditing(true) }} className="admin-btn admin-btn-ghost" style={{ padding: '0.5rem', color: '#3b82f6' }}>
              <Edit2 size={16} />
            </button>
          )}
          <label className="admin-switch" style={{ alignSelf: 'center', margin: '0 8px' }}>
            <input type="checkbox" checked={!!brand.status} onChange={toggleStatus} disabled={busy} />
            <span className="admin-slider"></span>
          </label>
          <button onClick={(e) => { e.stopPropagation(); doSoft() }} disabled={busy} className="admin-btn admin-btn-ghost" style={{ padding: '0.5rem', color: '#f59e0b' }}>
            <EyeOff size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); doHard() }} disabled={busy} className="admin-btn admin-btn-ghost" style={{ padding: '0.5rem', color: '#ef4444' }}>
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminBrands() {
  const [brands, setBrands]   = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [adding, setAdding]   = useState(false)
  const [selected, setSelected] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try { const res = await getBrands(); setBrands(res) }
    catch (e) { alert(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const addBrand = async () => {
    if (!newName.trim()) return
    setAdding(true)
    try { await createBrand(newName.trim()); setNewName(''); load() }
    catch (e) { alert(e.message) }
    finally { setAdding(false) }
  }

  return (
    <div>
      {selected && <BrandDetailModal brand={selected} onClose={() => setSelected(null)} />}
      <div className="admin-flex-between mb-6">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Brands</h1>
          <p style={{ color: '#94a3b8' }}>Manage product brands</p>
        </div>
      </div>

      {/* Add brand */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New brand name…"
          onKeyDown={e => e.key === 'Enter' && addBrand()}
          className="admin-input-field" style={{ flex: 1 }} />
        <button onClick={addBrand} disabled={adding || !newName.trim()} className="admin-btn admin-btn-primary" style={{ whiteSpace: 'nowrap' }}>
          {adding ? '…' : <><Plus size={18} style={{ marginRight: '6px' }} /> Add Brand</>}
        </button>
      </div>

      {/* Table */}
      <div className="glass-panel admin-table-container">
        {loading ? (
          <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>Loading brands…</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {['Brand Name', 'Products', 'Status', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brands.map(b => <BrandRow key={b.id} brand={b} onRefresh={load} onView={() => setSelected(b)} />)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
