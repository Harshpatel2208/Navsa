import { useEffect, useState, useCallback } from 'react'
import { getProducts, toggleOffer, updateStock } from '../../services/adminApi'

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
      // Update just the label via the stock endpoint won't work — use updateProduct approach via toggleOffer
      // Re-enable offer with new label (it's already on offer, so toggle off then on won't work — we need PATCH stock-like)
      // Instead we just call toggle once to get a chance to pass label — but it's already on. 
      // Best path: patch directly via fetch
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

  const stockColor = (qty) => {
    if (qty === 0) return '#ef4444'
    if (qty <= 5)  return '#f97316'
    return '#4ade80'
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg,#1a1a00,#1a2744)',
      border: '1px solid #c9a84c',
      borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
            {product.description?.slice(0, 60)}{product.description?.length > 60 ? '…' : ''}
          </div>
          <div style={{ color: '#7ea8c4', fontSize: '12px' }}>{product.reference} · {product.brand?.brand_name || '—'}</div>
        </div>
        <span style={{ background: '#c9a84c', color: '#0a1128', borderRadius: '20px', fontSize: '11px', fontWeight: 800, padding: '4px 12px', whiteSpace: 'nowrap', marginLeft: '10px' }}>
          🏷 OFFER
        </span>
      </div>

      <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
        <span style={{ color: '#c9a84c', fontWeight: 700 }}>
          {product.price ? `£${Number(product.price).toFixed(2)}` : 'No price'}
        </span>
        <span style={{ color: stockColor(product.stock_quantity ?? 0), fontWeight: 600 }}>
          Stock: {product.stock_quantity ?? 0}
        </span>
      </div>

      {/* Label editor */}
      <div>
        {editLabel ? (
          <div style={{ display: 'flex', gap: '6px' }}>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Offer label…"
              style={{ flex: 1, background: '#0f1e36', border: '1px solid #c9a84c', borderRadius: '8px', color: '#fff', padding: '6px 10px', fontSize: '12px', outline: 'none' }} />
            <button onClick={saveLabel} disabled={busy} style={{ background: '#c9a84c', border: 'none', borderRadius: '8px', color: '#0a1128', fontWeight: 700, padding: '6px 12px', cursor: 'pointer' }}>Save</button>
            <button onClick={() => setEditLabel(false)} style={{ background: '#1a2744', border: '1px solid #2a3f6f', borderRadius: '8px', color: '#fff', padding: '6px 10px', cursor: 'pointer' }}>✕</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ color: '#f0d080', fontSize: '13px', fontStyle: product.offer_label ? 'normal' : 'italic' }}>
              {product.offer_label || 'No label set'}
            </span>
            <button onClick={() => setEditLabel(true)} style={{ background: 'transparent', border: 'none', color: '#7ea8c4', cursor: 'pointer', fontSize: '12px' }}>✏ Edit</button>
          </div>
        )}
      </div>

      <button onClick={removeOffer} disabled={busy} style={{
        background: '#450a0a', border: '1px solid #991b1b', borderRadius: '10px',
        color: '#f87171', cursor: busy ? 'not-allowed' : 'pointer', fontWeight: 700, padding: '8px',
        fontSize: '13px', opacity: busy ? .5 : 1, transition: 'all .2s',
      }}>
        {busy ? 'Removing…' : '✗ Remove Offer'}
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
      // Toggle off all in batch — do them sequentially to avoid server overload
      for (const p of products) {
        await toggleOffer(p.id)
      }
      load()
    } catch (e) { alert(e.message) }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700 }}>🏷️ Daily Offers</h2>
          <p style={{ color: '#7ea8c4', fontSize: '13px', marginTop: '4px' }}>{total} products currently on offer</p>
        </div>
        {total > 0 && (
          <button onClick={clearAll} style={{
            background: '#450a0a', border: '1px solid #991b1b', borderRadius: '12px',
            color: '#f87171', cursor: 'pointer', fontWeight: 700, padding: '10px 20px', fontSize: '13px',
          }}>
            🗑 Clear All Offers
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ color: '#7ea8c4', padding: '40px', textAlign: 'center' }}>Loading offers…</div>
      ) : products.length === 0 ? (
        <div style={{ color: '#7ea8c4', padding: '60px', textAlign: 'center', background: '#0f1e36', borderRadius: '16px', border: '1px solid #1a2744' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏷️</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>No Active Offers</div>
          <div style={{ fontSize: '14px' }}>Go to <b>Products</b> and toggle the offer switch on any product.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
          {products.map(p => <OfferCard key={p.id} product={p} onRefresh={load} />)}
        </div>
      )}

      {lastPage > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'center' }}>
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page<=1}
            style={{ background:'#1a2744', border:'1px solid #2a3f6f', borderRadius:'8px', color:'#fff', padding:'6px 14px', cursor:'pointer' }}>← Prev</button>
          <span style={{ color:'#7ea8c4', padding:'6px' }}>Page {page} / {lastPage}</span>
          <button onClick={() => setPage(p => Math.min(lastPage, p+1))} disabled={page>=lastPage}
            style={{ background:'#1a2744', border:'1px solid #2a3f6f', borderRadius:'8px', color:'#fff', padding:'6px 14px', cursor:'pointer' }}>Next →</button>
        </div>
      )}
    </div>
  )
}
