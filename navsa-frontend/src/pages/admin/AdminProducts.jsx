import { useEffect, useState, useCallback } from 'react'
import {
  getProducts, toggleWeb, toggleOffer, updateStock,
  softDeleteProduct, hardDeleteProduct, restoreProduct
} from '../../services/adminApi'

const inp = {
  background: '#1a2744', border: '1px solid #2a3f6f', borderRadius: '8px',
  color: '#fff', padding: '6px 10px', fontSize: '12px', outline: 'none',
}

function StockModal({ product, onClose, onSaved }) {
  const [stock, setStock]   = useState(product.stock_quantity ?? 0)
  const [price, setPrice]   = useState(product.price ?? '')
  const [list,  setList]    = useState(product.price_list ?? '')
  const [busy,  setBusy]    = useState(false)

  const save = async () => {
    setBusy(true)
    try {
      await updateStock(product.id, parseInt(stock), price || undefined, list || undefined)
      onSaved()
      onClose()
    } catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'#0f1e36', border:'1px solid #2a3f6f', borderRadius:'20px', padding:'32px', width:'360px' }}>
        <h3 style={{ color:'#fff', marginBottom:'20px', fontSize:'18px' }}>Edit Stock & Price</h3>
        <div style={{ color:'#7ea8c4', fontSize:'12px', marginBottom:'16px' }}>
          {product.reference} — {product.description?.slice(0,50)}
        </div>
        {[
          { label:'Stock Quantity', val:stock, set:setStock, type:'number' },
          { label:'Sell Price (£)',  val:price, set:setPrice, type:'number' },
          { label:'List Price (£)',  val:list,  set:setList,  type:'number' },
        ].map(({ label, val, set, type }) => (
          <div key={label} style={{ marginBottom:'14px' }}>
            <label style={{ color:'#7ea8c4', fontSize:'11px', display:'block', marginBottom:'4px', fontWeight:600 }}>{label}</label>
            <input type={type} value={val} onChange={e => set(e.target.value)} style={{ ...inp, width:'100%' }} />
          </div>
        ))}
        <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
          <button onClick={save} disabled={busy} style={{ flex:1, background:'#c9a84c', border:'none', borderRadius:'10px', color:'#0a1128', fontWeight:700, padding:'10px', cursor:'pointer' }}>
            {busy ? 'Saving…' : '💾 Save'}
          </button>
          <button onClick={onClose} style={{ flex:1, background:'#1a2744', border:'1px solid #2a3f6f', borderRadius:'10px', color:'#fff', fontWeight:600, padding:'10px', cursor:'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function OfferModal({ product, onClose, onSaved }) {
  const [label, setLabel] = useState(product.offer_label || '')
  const [busy, setBusy]   = useState(false)
  const save = async () => {
    setBusy(true)
    try {
      await toggleOffer(product.id, label)
      onSaved(); onClose()
    } catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'#0f1e36', border:'1px solid #2a3f6f', borderRadius:'20px', padding:'32px', width:'340px' }}>
        <h3 style={{ color:'#fff', marginBottom:'16px' }}>Set Offer Label</h3>
        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. 20% OFF, FLASH DEAL…"
          style={{ ...inp, width:'100%', marginBottom:'16px' }} />
        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={save} disabled={busy} style={{ flex:1, background:'#c9a84c', border:'none', borderRadius:'10px', color:'#0a1128', fontWeight:700, padding:'10px', cursor:'pointer' }}>
            {busy ? '…' : '✓ Enable Offer'}
          </button>
          <button onClick={onClose} style={{ flex:1, background:'#1a2744', border:'1px solid #2a3f6f', borderRadius:'10px', color:'#fff', fontWeight:600, padding:'10px', cursor:'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function Toggle({ on, onClick, label }) {
  return (
    <button onClick={onClick} title={label} style={{
      background: on ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.15)',
      border: `1px solid ${on ? '#16a34a' : '#dc2626'}`,
      color: on ? '#4ade80' : '#f87171',
      borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700,
      cursor: 'pointer', whiteSpace: 'nowrap',
    }}>{on ? '● ON' : '○ OFF'}</button>
  )
}

export default function AdminProducts() {
  const [data,    setData]    = useState({ data: [], last_page: 1, total: 0 })
  const [page,    setPage]    = useState(1)
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState({})
  const [loading, setLoading] = useState(true)
  const [stockModal, setStockModal] = useState(null)
  const [offerModal, setOfferModal] = useState(null)
  const [brands, setBrands]     = useState([])
  const [categories, setCategories] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, per_page: 20, ...filter }
      if (search) params.search = search
      const res = await getProducts(params)
      setData(res)
      // collect unique brands & categories from results
      const br = {}, ct = {}
      res.data?.forEach(p => {
        if (p.brand) br[p.brand.id] = p.brand.brand_name
        if (p.category) ct[p.category.id] = p.category.category_name
      })
      if (Object.keys(br).length) setBrands(Object.entries(br).map(([id,n]) => ({ id, brand_name: n })))
      if (Object.keys(ct).length) setCategories(Object.entries(ct).map(([id,n]) => ({ id, category_name: n })))
    } catch (e) { alert(e.message) }
    finally { setLoading(false) }
  }, [page, search, filter])

  useEffect(() => { load() }, [load])

  const doToggleWeb = async (id) => {
    try { await toggleWeb(id); load() } catch (e) { alert(e.message) }
  }

  const doToggleOffer = async (product) => {
    if (product.is_offer) {
      try { await toggleOffer(product.id); load() } catch (e) { alert(e.message) }
    } else {
      setOfferModal(product)
    }
  }

  const doSoftDelete = async (id) => {
    if (!confirm('Move this product to trash? It will be hidden from the shop.')) return
    try { await softDeleteProduct(id); load() } catch (e) { alert(e.message) }
  }

  const doRestore = async (id) => {
    try { await restoreProduct(id); load() } catch (e) { alert(e.message) }
  }

  const doHardDelete = async (id) => {
    if (!confirm('⚠ PERMANENTLY delete this product? This cannot be undone!')) return
    try { await hardDeleteProduct(id); load() } catch (e) { alert(e.message) }
  }

  const sel = (val, onChange, opts, placeholder) => (
    <select value={val} onChange={e => onChange(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
      <option value="">{placeholder}</option>
      {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )

  const stockColor = (qty) => {
    if (qty === 0) return '#ef4444'
    if (qty <= 5)  return '#f97316'
    return '#4ade80'
  }

  return (
    <div>
      {stockModal && <StockModal product={stockModal} onClose={() => setStockModal(null)} onSaved={load} />}
      {offerModal && <OfferModal product={offerModal} onClose={() => setOfferModal(null)} onSaved={load} />}

      <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '22px', fontWeight: 700 }}>📦 Product Management</h2>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search description, reference, barcode…"
          style={{ ...inp, flex: '1', minWidth: '200px' }} />
        {sel(filter.is_offer  || '', v => { setFilter(f=>({...f, is_offer: v})); setPage(1) },
          [{ value:'1', label:'Offer Only' },{ value:'0', label:'Non-Offer' }], 'All — Offers')}
        {sel(filter.live_for_web || '', v => { setFilter(f=>({...f, live_for_web: v})); setPage(1) },
          [{ value:'1', label:'Live Only' },{ value:'0', label:'Hidden Only' }], 'All — Visibility')}
        {filter.low_stock
          ? <button onClick={() => { setFilter(f=>({...f, low_stock:undefined})); setPage(1) }}
              style={{ ...inp, color:'#f97316', cursor:'pointer' }}>⚠ Low Stock ✕</button>
          : <button onClick={() => { setFilter(f=>({...f, low_stock:1})); setPage(1) }}
              style={{ ...inp, cursor:'pointer' }}>⚠ Low Stock</button>
        }
        <button onClick={() => { setFilter(f=>({...f, show_deleted: f.show_deleted ? undefined : 1})); setPage(1) }}
          style={{ ...inp, cursor:'pointer', color: filter.show_deleted ? '#c9a84c' : '#7ea8c4' }}>
          {filter.show_deleted ? '🗑 Showing Deleted' : '🗑 Show Deleted'}
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#0f1e36', borderRadius: '16px', border: '1px solid #1a2744', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ color: '#7ea8c4', padding: '40px', textAlign: 'center' }}>Loading products…</div>
        ) : data.data?.length === 0 ? (
          <div style={{ color: '#7ea8c4', padding: '40px', textAlign: 'center' }}>No products found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '860px' }}>
            <thead>
              <tr style={{ background: '#1a2744' }}>
                {['Ref', 'Description', 'Brand', 'Category', 'Stock', 'Price', 'Web', 'Offer', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 10px', textAlign: 'left', color: '#7ea8c4', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data?.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #1a2744', opacity: p.deleted ? .5 : 1 }}>
                  <td style={{ padding: '12px 10px', color: '#7ea8c4', fontSize: '12px', whiteSpace: 'nowrap' }}>{p.reference}</td>
                  <td style={{ padding: '12px 10px', color: '#fff', fontSize: '13px', maxWidth: '220px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>
                    {p.is_offer && p.offer_label && (
                      <span style={{ background: '#c9a84c', color: '#0a1128', borderRadius: '4px', fontSize: '10px', fontWeight: 700, padding: '1px 6px', marginTop: '2px', display: 'inline-block' }}>{p.offer_label}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 10px', color: '#cbd5e1', fontSize: '12px', whiteSpace: 'nowrap' }}>{p.brand?.brand_name || '—'}</td>
                  <td style={{ padding: '12px 10px', color: '#cbd5e1', fontSize: '12px', whiteSpace: 'nowrap' }}>{p.category?.category_name || '—'}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                    <span style={{ color: stockColor(p.stock_quantity ?? 0), fontWeight: 700, fontSize: '14px' }}>{p.stock_quantity ?? 0}</span>
                  </td>
                  <td style={{ padding: '12px 10px', color: '#c9a84c', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {p.price ? `£${Number(p.price).toFixed(2)}` : '—'}
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <Toggle on={!!p.live_for_web} onClick={() => !p.deleted && doToggleWeb(p.id)} label="Toggle web visibility" />
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <Toggle on={!!p.is_offer} onClick={() => !p.deleted && doToggleOffer(p)} label="Toggle offer" />
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {!p.deleted && (
                        <button onClick={() => setStockModal(p)}
                          style={{ background:'#1e3a5f', border:'1px solid #2a4f7f', borderRadius:'6px', color:'#7ea8c4', cursor:'pointer', fontSize:'11px', padding:'4px 8px' }}>
                          ✏ Edit
                        </button>
                      )}
                      {!p.deleted
                        ? <button onClick={() => doSoftDelete(p.id)}
                            style={{ background:'#451a03', border:'1px solid #78350f', borderRadius:'6px', color:'#fbbf24', cursor:'pointer', fontSize:'11px', padding:'4px 8px' }}>
                            🗑 Hide
                          </button>
                        : <button onClick={() => doRestore(p.id)}
                            style={{ background:'#052e16', border:'1px solid #166534', borderRadius:'6px', color:'#4ade80', cursor:'pointer', fontSize:'11px', padding:'4px 8px' }}>
                            ↩ Restore
                          </button>
                      }
                      <button onClick={() => doHardDelete(p.id)}
                        style={{ background:'#450a0a', border:'1px solid #991b1b', borderRadius:'6px', color:'#f87171', cursor:'pointer', fontSize:'11px', padding:'4px 8px' }}>
                        💥
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center', color: '#7ea8c4', fontSize: '13px' }}>
        <span>{data.total} products — Page {data.current_page} of {data.last_page}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page <= 1}
            style={{ background:'#1a2744', border:'1px solid #2a3f6f', borderRadius:'8px', color:'#fff', padding:'6px 14px', cursor:page<=1?'not-allowed':'pointer', opacity:page<=1?.5:1 }}>← Prev</button>
          <button onClick={() => setPage(p => Math.min(data.last_page, p+1))} disabled={page >= data.last_page}
            style={{ background:'#1a2744', border:'1px solid #2a3f6f', borderRadius:'8px', color:'#fff', padding:'6px 14px', cursor:page>=data.last_page?'not-allowed':'pointer', opacity:page>=data.last_page?.5:1 }}>Next →</button>
        </div>
      </div>
    </div>
  )
}
