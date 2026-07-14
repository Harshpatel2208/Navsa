import { useEffect, useState, useCallback } from 'react'
import { getCategories, createCategory, updateCategory, softDeleteCategory, hardDeleteCategory } from '../../services/adminApi'
import { Plus, Edit2, Trash2, EyeOff } from 'lucide-react';

function CategoryRow({ category, onRefresh }) {
  const [editing, setEditing] = useState(false)
  const [name, setName]       = useState(category.category_name)
  const [busy, setBusy]       = useState(false)

  const save = async () => {
    if (!name.trim()) return
    setBusy(true)
    try { await updateCategory(category.id, { category_name: name.trim(), status: category.status }); setEditing(false); onRefresh() }
    catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const toggleStatus = async () => {
    setBusy(true)
    try { await updateCategory(category.id, { category_name: category.category_name, status: category.status ? 0 : 1 }); onRefresh() }
    catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const doSoft = async () => {
    if (!confirm('Soft-delete this category? Products will lose category visibility.')) return
    setBusy(true)
    try { await softDeleteCategory(category.id); onRefresh() }
    catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const doHard = async () => {
    if (!confirm('⚠ PERMANENTLY delete this category? This cannot be undone!')) return
    setBusy(true)
    try { await hardDeleteCategory(category.id); onRefresh() }
    catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  return (
    <tr>
      <td>
        {editing ? (
          <div style={{ display: 'flex', gap: '6px' }}>
            <input value={name} onChange={e => setName(e.target.value)} className="admin-input-field" style={{ width: '200px' }}
              onKeyDown={e => e.key === 'Enter' && save()} autoFocus />
            <button onClick={save} disabled={busy} className="admin-btn admin-btn-primary" style={{ padding: '6px 12px' }}>✓</button>
            <button onClick={() => setEditing(false)} className="admin-btn admin-btn-ghost" style={{ padding: '6px 10px', border: '1px solid rgba(255,255,255,0.1)' }}>✕</button>
          </div>
        ) : (
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{category.category_name}</div>
        )}
      </td>
      <td style={{ color: '#94a3b8', fontWeight: 600 }}>
        {category.products_count ?? 0}
      </td>
      <td>
        <span className={`admin-badge ${category.status ? 'admin-badge-success' : 'admin-badge-warning'}`}>
          {category.status ? 'Active' : 'Disabled'}
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
            <input type="checkbox" checked={!!category.status} onChange={toggleStatus} disabled={busy} />
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

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [newName, setNewName]       = useState('')
  const [adding, setAdding]         = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { const res = await getCategories(); setCategories(res) }
    catch (e) { alert(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const addCategory = async () => {
    if (!newName.trim()) return
    setAdding(true)
    try { await createCategory(newName.trim()); setNewName(''); load() }
    catch (e) { alert(e.message) }
    finally { setAdding(false) }
  }

  return (
    <div>
      <div className="admin-flex-between mb-6">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Categories</h1>
          <p style={{ color: '#94a3b8' }}>Manage product categories</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New category name…"
          onKeyDown={e => e.key === 'Enter' && addCategory()}
          className="admin-input-field" style={{ flex: 1 }} />
        <button onClick={addCategory} disabled={adding || !newName.trim()} className="admin-btn admin-btn-primary" style={{ whiteSpace: 'nowrap' }}>
          {adding ? '…' : <><Plus size={18} style={{ marginRight: '6px' }} /> Add Category</>}
        </button>
      </div>

      <div className="glass-panel admin-table-container">
        {loading ? (
          <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>Loading categories…</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {['Category Name', 'Products', 'Status', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(c => <CategoryRow key={c.id} category={c} onRefresh={load} />)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
