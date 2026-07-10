import { useEffect, useState, useCallback } from 'react'
import { getCategories, createCategory, updateCategory, softDeleteCategory, hardDeleteCategory } from '../../services/adminApi'

const inp = {
  background: '#1a2744', border: '1px solid #2a3f6f', borderRadius: '8px',
  color: '#fff', padding: '8px 12px', fontSize: '13px', outline: 'none', width: '100%',
}

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
    <tr style={{ borderBottom: '1px solid #1a2744' }}>
      <td style={{ padding: '14px 12px' }}>
        {editing ? (
          <div style={{ display: 'flex', gap: '6px' }}>
            <input value={name} onChange={e => setName(e.target.value)} style={{ ...inp, width: '200px' }}
              onKeyDown={e => e.key === 'Enter' && save()} autoFocus />
            <button onClick={save} disabled={busy} style={{ background:'#c9a84c', border:'none', borderRadius:'8px', color:'#0a1128', fontWeight:700, padding:'6px 12px', cursor:'pointer' }}>✓</button>
            <button onClick={() => setEditing(false)} style={{ background:'#1a2744', border:'1px solid #2a3f6f', borderRadius:'8px', color:'#fff', padding:'6px 10px', cursor:'pointer' }}>✕</button>
          </div>
        ) : (
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{category.category_name}</div>
        )}
      </td>
      <td style={{ padding: '14px 12px', color: '#c9a84c', fontWeight: 700, textAlign: 'center' }}>
        {category.products_count ?? 0}
      </td>
      <td style={{ padding: '14px 12px' }}>
        <span style={{
          background: category.status ? '#052e16' : '#451a03',
          color: category.status ? '#4ade80' : '#fbbf24',
          border: `1px solid ${category.status ? '#166534' : '#92400e'}`,
          borderRadius: '20px', padding: '3px 12px', fontSize: '11px', fontWeight: 700,
        }}>{category.status ? 'Active' : 'Disabled'}</span>
      </td>
      <td style={{ padding: '14px 12px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{ background:'#1e3a5f', border:'1px solid #2a4f7f', borderRadius:'6px', color:'#7ea8c4', cursor:'pointer', fontSize:'11px', padding:'5px 10px' }}>✏ Edit</button>
          )}
          <button onClick={toggleStatus} disabled={busy} style={{ background: category.status ? '#451a03' : '#052e16', border:`1px solid ${category.status?'#78350f':'#166534'}`, borderRadius:'6px', color: category.status?'#fbbf24':'#4ade80', cursor:'pointer', fontSize:'11px', padding:'5px 10px' }}>
            {category.status ? 'Disable' : 'Enable'}
          </button>
          <button onClick={doSoft} disabled={busy} style={{ background:'#451a03', border:'1px solid #78350f', borderRadius:'6px', color:'#fbbf24', cursor:'pointer', fontSize:'11px', padding:'5px 10px' }}>🗑 Soft</button>
          <button onClick={doHard} disabled={busy} style={{ background:'#450a0a', border:'1px solid #991b1b', borderRadius:'6px', color:'#f87171', cursor:'pointer', fontSize:'11px', padding:'5px 10px' }}>💥</button>
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
      <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '22px', fontWeight: 700 }}>📂 Category Management</h2>

      <div style={{ background: '#0f1e36', border: '1px solid #1a2744', borderRadius: '16px', padding: '20px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New category name…"
          onKeyDown={e => e.key === 'Enter' && addCategory()}
          style={{ ...inp, flex: 1 }} />
        <button onClick={addCategory} disabled={adding || !newName.trim()} style={{
          background: '#c9a84c', border: 'none', borderRadius: '10px', color: '#0a1128',
          fontWeight: 700, padding: '10px 20px', cursor: 'pointer', whiteSpace: 'nowrap',
          opacity: adding || !newName.trim() ? .5 : 1,
        }}>
          {adding ? '…' : '+ Add Category'}
        </button>
      </div>

      <div style={{ background: '#0f1e36', borderRadius: '16px', border: '1px solid #1a2744', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ color: '#7ea8c4', padding: '40px', textAlign: 'center' }}>Loading categories…</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a2744' }}>
                {['Category Name', 'Products', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px', textAlign: 'left', color: '#7ea8c4', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
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
