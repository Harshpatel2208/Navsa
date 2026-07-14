import { useEffect, useState, useCallback } from 'react'
import { getProducts, toggleOffer } from '../../services/adminApi'
import { Tag, Trash2, Edit2 } from 'lucide-react';

function OfferCard({ product, onRefresh }) {
  const [busy, setBusy] = useState(false)
  const [label, setLabel] = useState(product.offer_label || '')
  const [editLabel, setEditLabel] = useState(false)

  const removeOffer = async () => {
    setBusy(true)
    try { await toggleOffer(product.id); onRefresh() }
    catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const saveLabel = async () => {
    setBusy(true)
    try {
      const BASE = import.meta.env.VITE_API_URL || '/api'
      await fetch(`${BASE}/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': 'navsa2024' },
        body: JSON.stringify({ offer_label: label }),
      })
      setEditLabel(false)
      onRefresh()
    } catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const stockClass = (qty) => {
    if (qty === 0) return 'admin-badge-danger'
    if (qty <= 5)  return 'admin-badge-warning'
    return 'admin-badge-success'
  }

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid #c9a84c' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
            {product.description?.slice(0, 60)}{product.description?.length > 60 ? '…' : ''}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>{product.reference} · {product.brand?.brand_name || '—'}</div>
        </div>
        <span className="admin-badge admin-badge-warning" style={{ whiteSpace: 'nowrap', marginLeft: '10px', background: '#c9a84c', color: '#0a1128' }}>
          <Tag size={12} style={{ marginRight: '4px' }}/> OFFER
        </span>
      </div>

      <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
        <span style={{ color: '#c9a84c', fontWeight: 700 }}>
          {product.price ? `£${Number(product.price).toFixed(2)}` : 'No price'}
        </span>
        <span className={`admin-badge ${stockClass(product.stock_quantity ?? 0)}`}>
          Stock: {product.stock_quantity ?? 0}
        </span>
      </div>

      {/* Label editor */}
      <div>
        {editLabel ? (
          <div style={{ display: 'flex', gap: '6px' }}>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Offer label…"
              className="admin-input-field" style={{ flex: 1, padding: '6px 10px' }} />
            <button onClick={saveLabel} disabled={busy} className="admin-btn admin-btn-primary" style={{ padding: '6px 12px' }}>Save</button>
            <button onClick={() => setEditLabel(false)} className="admin-btn admin-btn-ghost" style={{ padding: '6px 10px', border: '1px solid rgba(255,255,255,0.1)' }}>✕</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ color: '#c9a84c', fontSize: '13px', fontStyle: product.offer_label ? 'normal' : 'italic' }}>
              {product.offer_label || 'No label set'}
            </span>
            <button onClick={() => setEditLabel(true)} className="admin-btn admin-btn-ghost" style={{ color: '#3b82f6', fontSize: '12px', padding: '2px 6px' }}><Edit2 size={12} style={{marginRight:'4px'}}/>Edit</button>
          </div>
        )}
      </div>

      <button onClick={removeOffer} disabled={busy} className="admin-btn admin-btn-ghost" style={{ marginTop: 'auto', border: '1px solid #991b1b', color: '#ef4444' }}>
        {busy ? 'Removing…' : <><Trash2 size={16} style={{marginRight:'6px'}}/> Remove Offer</>}
      </button>
    </div>
  )
}

export default function AdminOffers() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(1)
  const [total, setTotal]       = useState(0)
  const [lastPage, setLastPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getProducts({ is_offer: 1, per_page: 24, page })
      setProducts(res.data || [])
      setTotal(res.total || 0)
      setLastPage(res.last_page || 1)
    } catch (e) { alert(e.message) }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { load() }, [load])

  const clearAll = async () => {
    if (!confirm(`Remove ALL offers from all ${total} offer products? This will clear labels too.`)) return
    try {
      for (const p of products) {
        await toggleOffer(p.id)
      }
      load()
    } catch (e) { alert(e.message) }
  }

  return (
    <div>
      <div className="admin-flex-between mb-6">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Daily Offers</h1>
          <p style={{ color: '#94a3b8' }}>{total} products currently on offer</p>
        </div>
        {total > 0 && (
          <button onClick={clearAll} className="admin-btn admin-btn-ghost" style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <Trash2 size={18} style={{ marginRight: '6px' }}/> Clear All Offers
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>Loading offers…</div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px', color: '#94a3b8' }}>
             <Tag size={48} />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>No Active Offers</div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>Go to <b>Products</b> and toggle the offer switch on any product.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
          {products.map(p => <OfferCard key={p.id} product={p} onRefresh={load} />)}
        </div>
      )}

      {lastPage > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'center', alignItems: 'center' }}>
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page<=1} className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>← Prev</button>
          <span style={{ color:'#94a3b8', padding:'6px', fontSize: '13px' }}>Page {page} / {lastPage}</span>
          <button onClick={() => setPage(p => Math.min(lastPage, p+1))} disabled={page>=lastPage} className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Next →</button>
        </div>
      )}
    </div>
  )
}
