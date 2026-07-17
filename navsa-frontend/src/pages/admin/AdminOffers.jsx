import { useEffect, useState, useCallback } from 'react'
import { getProducts, toggleOffer, updateProduct, clearAllOffers } from '../../services/adminApi'
import { Tag, Trash2, Edit2, Plus, Search, X } from 'lucide-react';

function AddOfferModal({ onClose, onAdded }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const loadInitial = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getProducts({ per_page: 50 })
      setResults(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    try {
      const res = await getProducts(query.trim() ? { search: query, per_page: 50 } : { per_page: 50 })
      setResults(res.data || [])
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (product) => {
    try {
      if (!product.is_offer) {
        await toggleOffer(product.id)
      }
      onAdded()
      onClose()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '24px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Add Offer</h2>
          <button onClick={onClose} className="admin-btn admin-btn-ghost" style={{ padding: '4px' }}><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              autoFocus
              type="text" 
              placeholder="Search products by name, reference..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="admin-input-field" 
              style={{ width: '100%', padding: '8px 10px 8px 34px' }}
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ background: '#c9a84c', color: '#0a1128' }} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {results.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{p.description}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{p.reference} · £{Number(p.price || 0).toFixed(2)}</div>
              </div>
              <button 
                onClick={() => handleAdd(p)}
                className="admin-btn admin-btn-primary"
                style={{ padding: '6px 12px', fontSize: '12px', background: p.is_offer ? '#334155' : '#3b82f6', color: '#fff' }}
                disabled={p.is_offer}
              >
                {p.is_offer ? 'Added' : 'Add Offer'}
              </button>
            </div>
          ))}
          {results.length === 0 && query && !loading && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No products found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

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
      await updateProduct(product.id, { offer_label: label })
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
  const [showAddModal, setShowAddModal] = useState(false)

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
      await clearAllOffers()
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowAddModal(true)} className="admin-btn admin-btn-primary" style={{ background: '#3b82f6', color: '#fff' }}>
            <Plus size={18} style={{ marginRight: '6px' }}/> Add Offer
          </button>
          {total > 0 && (
            <button onClick={clearAll} className="admin-btn admin-btn-ghost" style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <Trash2 size={18} style={{ marginRight: '6px' }}/> Clear All Offers
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>Loading offers…</div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px', color: '#94a3b8' }}>
             <Tag size={48} />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>No Active Offers</div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>Search and add products to showcase them as daily offers.</div>
          <button onClick={() => setShowAddModal(true)} className="admin-btn admin-btn-primary" style={{ background: '#3b82f6', color: '#fff', margin: '0 auto' }}>
            <Plus size={16} style={{ marginRight: '6px' }}/> Add Offer
          </button>
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

      {showAddModal && <AddOfferModal onClose={() => setShowAddModal(false)} onAdded={load} />}
    </div>
  )
}
