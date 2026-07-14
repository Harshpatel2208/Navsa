import { useEffect, useState, useCallback } from 'react'
import {
  getProducts, toggleWeb, toggleOffer, updateStock,
  softDeleteProduct, hardDeleteProduct, restoreProduct
} from '../../services/adminApi'
import { Plus, Edit2, Trash2, Filter, EyeOff, RotateCcw } from 'lucide-react';

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
      <div className="glass-panel" style={{ padding:'32px', width:'360px', background: '#0f172a' }}>
        <h3 style={{ marginBottom:'20px', fontSize:'18px' }}>Edit Stock & Price</h3>
        <div style={{ color:'#94a3b8', fontSize:'12px', marginBottom:'16px' }}>
          {product.reference} — {product.description?.slice(0,50)}
        </div>
        {[
          { label:'Stock Quantity', val:stock, set:setStock, type:'number' },
          { label:'Sell Price (£)',  val:price, set:setPrice, type:'number' },
          { label:'List Price (£)',  val:list,  set:setList,  type:'number' },
        ].map(({ label, val, set, type }) => (
          <div key={label} className="admin-input-group">
            <label>{label}</label>
            <input type={type} className="admin-input-field" value={val} onChange={e => set(e.target.value)} />
          </div>
        ))}
        <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
          <button onClick={save} disabled={busy} className="admin-btn admin-btn-primary" style={{ flex:1 }}>
            {busy ? 'Saving…' : '💾 Save'}
          </button>
          <button onClick={onClose} className="admin-btn admin-btn-ghost" style={{ flex:1, border: '1px solid rgba(255,255,255,0.1)' }}>
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
      <div className="glass-panel" style={{ padding:'32px', width:'340px', background: '#0f172a' }}>
        <h3 style={{ marginBottom:'16px' }}>Set Offer Label</h3>
        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. 20% OFF, FLASH DEAL…"
          className="admin-input-field" style={{ width:'100%', marginBottom:'16px' }} />
        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={save} disabled={busy} className="admin-btn admin-btn-primary" style={{ flex:1 }}>
            {busy ? '…' : '✓ Enable Offer'}
          </button>
          <button onClick={onClose} className="admin-btn admin-btn-ghost" style={{ flex:1, border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
        </div>
      </div>
    </div>
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

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, per_page: 20, ...filter }
      if (search) params.search = search
      const res = await getProducts(params)
      setData(res)
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
    <select value={val} onChange={e => onChange(e.target.value)} className="admin-input-field" style={{ cursor: 'pointer', padding: '0.5rem' }}>
      <option value="">{placeholder}</option>
      {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )

  return (
    <div>
      {stockModal && <StockModal product={stockModal} onClose={() => setStockModal(null)} onSaved={load} />}
      {offerModal && <OfferModal product={offerModal} onClose={() => setOfferModal(null)} onSaved={load} />}

      <div className="admin-flex-between mb-6">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Products Management</h1>
          <p style={{ color: '#94a3b8' }}>Manage your catalog and inventory</p>
        </div>
        <button className="admin-btn admin-btn-primary">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search description, reference, barcode…"
            className="admin-input-field" style={{ flex: '1', minWidth: '200px' }} />
          {sel(filter.is_offer  || '', v => { setFilter(f=>({...f, is_offer: v})); setPage(1) },
            [{ value:'1', label:'Offer Only' },{ value:'0', label:'Non-Offer' }], 'All — Offers')}
          {sel(filter.live_for_web || '', v => { setFilter(f=>({...f, live_for_web: v})); setPage(1) },
            [{ value:'1', label:'Live Only' },{ value:'0', label:'Hidden Only' }], 'All — Visibility')}
          {filter.low_stock
            ? <button onClick={() => { setFilter(f=>({...f, low_stock:undefined})); setPage(1) }}
                className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#f59e0b' }}>⚠ Low Stock ✕</button>
            : <button onClick={() => { setFilter(f=>({...f, low_stock:1})); setPage(1) }}
                className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>⚠ Low Stock</button>
          }
          <button onClick={() => { setFilter(f=>({...f, show_deleted: f.show_deleted ? undefined : 1})); setPage(1) }}
            className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)', color: filter.show_deleted ? '#3b82f6' : '#94a3b8' }}>
            {filter.show_deleted ? '🗑 Showing Deleted' : '🗑 Show Deleted'}
          </button>
        </div>

        {/* Table */}
        <div className="admin-table-container">
          {loading ? (
            <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>Loading products…</div>
          ) : data.data?.length === 0 ? (
            <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>No products found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  {['Ref', 'Description', 'Brand', 'Category', 'Stock', 'Price', 'Web', 'Offer', 'Actions'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.data?.map(p => (
                  <tr key={p.id} style={{ opacity: p.deleted ? 0.5 : 1 }}>
                    <td style={{ color: '#94a3b8' }}>{p.reference}</td>
                    <td style={{ maxWidth: '220px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{p.description}</div>
                      {p.is_offer && p.offer_label && (
                        <span className="admin-badge admin-badge-warning" style={{ marginTop: '4px' }}>{p.offer_label}</span>
                      )}
                    </td>
                    <td>{p.brand?.brand_name || '—'}</td>
                    <td>{p.category?.category_name || '—'}</td>
                    <td>
                      <span className={`admin-badge ${p.stock_quantity > 50 ? 'admin-badge-success' : p.stock_quantity > 0 ? 'admin-badge-warning' : 'admin-badge-danger'}`}>
                        {p.stock_quantity ?? 0}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {p.price ? `£${Number(p.price).toFixed(2)}` : '—'}
                    </td>
                    <td>
                      <label className="admin-switch">
                        <input type="checkbox" checked={!!p.live_for_web} onChange={() => !p.deleted && doToggleWeb(p.id)} />
                        <span className="admin-slider"></span>
                      </label>
                    </td>
                    <td>
                       <label className="admin-switch">
                        <input type="checkbox" checked={!!p.is_offer} onChange={() => !p.deleted && doToggleOffer(p)} />
                        <span className="admin-slider"></span>
                      </label>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!p.deleted && (
                          <button onClick={() => setStockModal(p)} className="admin-btn admin-btn-ghost" style={{ padding: '0.5rem', color: '#3b82f6' }}>
                            <Edit2 size={16} />
                          </button>
                        )}
                        {!p.deleted
                          ? <button onClick={() => doSoftDelete(p.id)} className="admin-btn admin-btn-ghost" style={{ padding: '0.5rem', color: '#f59e0b' }}>
                              <EyeOff size={16} />
                            </button>
                          : <button onClick={() => doRestore(p.id)} className="admin-btn admin-btn-ghost" style={{ padding: '0.5rem', color: '#10b981' }}>
                              <RotateCcw size={16} />
                            </button>
                        }
                        <button onClick={() => doHardDelete(p.id)} className="admin-btn admin-btn-ghost" style={{ padding: '0.5rem', color: '#ef4444' }}>
                          <Trash2 size={16} />
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
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center', color: '#94a3b8', fontSize: '13px' }}>
          <span>{data.total} products — Page {data.current_page} of {data.last_page}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page <= 1} className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>← Prev</button>
            <button onClick={() => setPage(p => Math.min(data.last_page, p+1))} disabled={page >= data.last_page} className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
