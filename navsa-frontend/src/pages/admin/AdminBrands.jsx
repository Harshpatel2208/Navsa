import { useEffect, useState, useCallback } from 'react'
import { getBrands, createBrand, updateBrand, softDeleteBrand, hardDeleteBrand } from '../../services/adminApi'
import { Plus, Edit2, Trash2, EyeOff } from 'lucide-react';

function BrandRow({ brand, onRefresh }) {
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
    <tr>
      <td>
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
      <td>
        <div style={{ display: 'flex', gap: '6px' }}>
          {!editing && (
            <button onClick={() => setEditing(true)} className="admin-btn admin-btn-ghost" style={{ padding: '0.5rem', color: '#3b82f6' }}>
              <Edit2 size={16} />
            </button>
          )}
          <label className="admin-switch" style={{ alignSelf: 'center', margin: '0 8px' }}>
            <input type="checkbox" checked={!!brand.status} onChange={toggleStatus} disabled={busy} />
            <span className="admin-slider"></span>
          </label>
          <button onClick={doSoft} disabled={busy} className="admin-btn admin-btn-ghost" style={{ padding: '0.5rem', color: '#f59e0b' }}>
            <EyeOff size={16} />
          </button>
          <button onClick={doHard} disabled={busy} className="admin-btn admin-btn-ghost" style={{ padding: '0.5rem', color: '#ef4444' }}>
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
              {brands.map(b => <BrandRow key={b.id} brand={b} onRefresh={load} />)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
