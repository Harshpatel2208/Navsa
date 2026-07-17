import {
  getProducts, toggleWeb, toggleOffer, toggleBestOffer, toggleNewArrival, updateStock,
  softDeleteProduct, hardDeleteProduct, restoreProduct, updateProduct, createProduct
} from '../../services/adminApi'
import { getBrands, getCategories } from '../../services/adminApi'
import { Plus, Edit2, Trash2, Filter, EyeOff, RotateCcw } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react'

const BLANK_PRODUCT = {
  description: '',
  reference: '',
  barcode_ean: '',
  price: '',
  live_for_web: 1,
  stock_quantity: 0,
  brand_id: null,
  category_id: null
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

const ALL_TABS = ['General', 'Images', 'Variants (eg Sizes)', 'Advanced', 'Related', 'SEO', 'Extra']

const EXTRA_FIELDS = [
  { key: 'outer_case_quantity', label: 'ORDER QTY ALLOWED',            type: 'text' },
  { key: 'price_list',          label: 'PriceList',                    type: 'text' },
  { key: 'inner_case_quantity', label: 'Units per Case',               type: 'number' },
  { key: 'barcode_case',        label: 'Barcode Case',                 type: 'text' },
  { key: 'layer_quantity',      label: 'Layer Quantity',               type: 'number' },
  { key: 'pallet_quantity',     label: 'Pallet Quantity',              type: 'number' },
  { key: 'weight',              label: 'Unit Weight',                  type: 'number' },
  { key: 'volume',              label: 'Unit Volume',                  type: 'number' },
  { key: 'bbd',                 label: 'Best before date (indicative)',type: 'text' },
  { key: 'from_date',           label: 'Promotion starting FromDate',  type: 'date' },
  { key: 'to_date',             label: 'Promotion finish ToDate',      type: 'date' },
  { key: 'comm_code',           label: 'Comm Code',                    type: 'text' },
  { key: 'intra_country',       label: 'Intra Country',                type: 'text' },
  { key: 'shelf_life',          label: 'Shelf Life in Days',           type: 'number' },
]

const ADVANCED_FIELDS = [
  { key: 'cost',               label: 'Cost (\u00a3)',           type: 'number' },
  { key: 'cost_from_date',     label: 'Cost From Date',     type: 'date' },
  { key: 'cost_to_date',       label: 'Cost To Date',       type: 'date' },
  { key: 'vat_code',           label: 'VAT Code',           type: 'text' },
  { key: 'storage_type',       label: 'Storage Type',       type: 'select', options: ['Ambient','Frozen','Chilled'] },
  { key: 'supplier_reference', label: 'Supplier Reference', type: 'text' },
  { key: 'obsolete',           label: 'Obsolete',           type: 'text' },
  { key: 'group_desc',         label: 'Group Description',  type: 'text' },
  { key: 'qty_desc',           label: 'Qty Description',    type: 'text' },
  { key: 'units_of',           label: 'Units Of',           type: 'text' },
]

const SEO_FIELDS = [
  { key: 'web_short_description', label: 'Meta Title',       type: 'text' },
  { key: 'web_long_description',  label: 'Meta Description', type: 'textarea' },
]

function EditProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({ ...product })
  const [tab, setTab]   = useState('General')
  const [busy, setBusy] = useState(false)
  const [allBrands,     setAllBrands]     = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [catSearch,     setCatSearch]     = useState('')
  const [showCatDrop,   setShowCatDrop]   = useState(false)

  // selected categories: array of {id, name, type: 'brand'|'category'}
  const [selCats, setSelCats] = useState(() => {
    const arr = []
    if (product.brand)    arr.push({ id: `b_${product.brand_id}`,    name: product.brand.brand_name,       type: 'brand' })
    if (product.category) arr.push({ id: `c_${product.category_id}`, name: product.category.category_name, type: 'category' })
    return arr
  })

  useEffect(() => {
    getBrands().then(d => setAllBrands(d || [])).catch(() => {})
    getCategories().then(d => setAllCategories(d || [])).catch(() => {})
  }, [])

  const addCat = (item) => {
    if (!selCats.find(s => s.id === item.id)) {
      const next = [...selCats, item]
      setSelCats(next)
      // update form: set brand_id / category_id to first of each type
      const brand = next.find(s => s.type === 'brand')
      const cat   = next.find(s => s.type === 'category')
      setForm(f => ({ ...f, brand_id: brand ? parseInt(brand.id.slice(2)) : f.brand_id, category_id: cat ? parseInt(cat.id.slice(2)) : f.category_id }))
    }
    setCatSearch('')
    setShowCatDrop(false)
  }

  const removeCat = (id) => {
    const next = selCats.filter(s => s.id !== id)
    setSelCats(next)
    const brand = next.find(s => s.type === 'brand')
    const cat   = next.find(s => s.type === 'category')
    setForm(f => ({ ...f, brand_id: brand ? parseInt(brand.id.slice(2)) : null, category_id: cat ? parseInt(cat.id.slice(2)) : null }))
  }

  const catOptions = [
    ...allBrands.map(b => ({ id: `b_${b.id}`, name: `- ${b.brand_name}`, type: 'brand' })),
    ...allCategories.map(c => ({ id: `c_${c.id}`, name: `-- ${c.category_name}`, type: 'category' })),
  ].filter(o => o.name.toLowerCase().includes(catSearch.toLowerCase()) && !selCats.find(s => s.id === o.id))

  const hc = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const generateSKU = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    hc('reference', code)
  }

  const generateBarcode = () => {
    let sku = form.reference
    if (!sku) {
      sku = Math.floor(100000 + Math.random() * 900000).toString()
      hc('reference', sku)
    }
    const numericSku = sku.replace(/\D/g, '')
    const paddedSku = numericSku.padStart(9, '0').slice(-9)
    const code12 = '200' + paddedSku
    let sum = 0
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(code12[i])
      sum += i % 2 === 0 ? digit : digit * 3
    }
    const checkDigit = (10 - (sum % 10)) % 10
    const barcode = code12 + checkDigit
    hc('barcode_ean', barcode)
  }

  const save = async (closeAfter) => {
    setBusy(true)
    try {
      if (product && product.id) {
        await updateProduct(product.id, form)
      } else {
        await createProduct(form)
      }
      onSaved()
      if (closeAfter) onClose()
    } catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const inp    = { width:'100%', padding:'7px 10px', border:'1px solid #ccc', borderRadius:'4px', fontSize:'14px', boxSizing:'border-box', background:'#fff', color:'#333', outline:'none' }
  const btnSm  = { background:'#f5f5f5', color:'#333', border:'1px solid #ccc', borderRadius:'4px', padding:'6px 12px', cursor:'pointer', fontSize:'13px', whiteSpace:'nowrap' }
  const btnOrg = { background:'#f97316', color:'#fff', border:'none', borderRadius:'4px', padding:'8px 18px', cursor:'pointer', fontSize:'14px', fontWeight:600, display:'flex', alignItems:'center', gap:'6px' }
  const btnGh  = { background:'transparent', color:'#555', border:'1px solid #ccc', borderRadius:'4px', padding:'8px 18px', cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', gap:'6px' }

  const Row = ({ label, required, children }) => (
    <tr>
      <td style={{ width:'210px', verticalAlign:'top', paddingRight:'14px', paddingTop:'10px', textAlign:'right', fontSize:'13px', color:'#555', whiteSpace:'nowrap' }}>
        {required && <span style={{ color:'#999', fontSize:'11px', marginRight:'4px' }}>(REQUIRED)</span>}{label}
      </td>
      <td style={{ paddingBottom:'12px', paddingTop:'4px' }}>{children}</td>
    </tr>
  )

  const renderGeneral = () => (
    <table style={{ width:'100%', borderCollapse:'collapse' }}><tbody>
      <Row label="Product name" required>
        <div style={{ display:'flex', gap:'8px' }}>
          <input value={form.description || ''} onChange={e => hc('description', e.target.value)} style={{ ...inp, flex:1 }} />
          <button style={btnSm}>Improve with AI</button>
        </div>
      </Row>
      <Row label="Categories" required>
        <div style={{ position:'relative' }}>
          <div
            onClick={() => setShowCatDrop(v => !v)}
            style={{ border:'1px solid #ccc', borderRadius:'4px', padding:'6px 8px', display:'flex', flexWrap:'wrap', gap:'6px', minHeight:'38px', background:'#fff', cursor:'text' }}
          >
            {selCats.map(s => (
              <span key={s.id} style={{ background:'#dbeafe', color:'#1d4ed8', borderRadius:'4px', padding:'2px 8px', fontSize:'13px', display:'flex', alignItems:'center', gap:'4px' }}>
                {s.name}
                <span onClick={e => { e.stopPropagation(); removeCat(s.id) }} style={{ cursor:'pointer', fontWeight:'bold', marginLeft:'2px' }}>×</span>
              </span>
            ))}
            <input
              value={catSearch}
              onChange={e => { setCatSearch(e.target.value); setShowCatDrop(true) }}
              onClick={e => { e.stopPropagation(); setShowCatDrop(true) }}
              placeholder={selCats.length === 0 ? 'Search brand or category...' : ''}
              style={{ border:'none', outline:'none', fontSize:'13px', minWidth:'120px', flex:1, color:'#333', background:'transparent' }}
            />
          </div>
          {showCatDrop && catOptions.length > 0 && (
            <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#fff', border:'1px solid #ccc', borderRadius:'4px', zIndex:10, maxHeight:'200px', overflowY:'auto', boxShadow:'0 4px 12px rgba(0,0,0,.15)' }}>
              {catOptions.slice(0, 30).map(o => (
                <div key={o.id} onClick={() => addCat(o)}
                  style={{ padding:'8px 12px', cursor:'pointer', fontSize:'13px', color:'#333' }}
                  onMouseEnter={e => e.target.style.background='#f0f4ff'}
                  onMouseLeave={e => e.target.style.background='transparent'}
                >
                  {o.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </Row>
      <Row label="SKU / Product Code" required>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <input value={form.reference || ''} onChange={e => hc('reference', e.target.value)} placeholder="e.g. 467357" style={{ ...inp, maxWidth:'200px' }} />
          <button type="button" onClick={generateSKU} style={btnSm}>Generate SKU</button>
        </div>
      </Row>
      <Row label="Barcode (EAN-13)">
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <input value={form.barcode_ean || ''} onChange={e => hc('barcode_ean', e.target.value)} placeholder="13-digit EAN barcode" style={{ ...inp, maxWidth:'200px' }} />
          <button type="button" onClick={generateBarcode} style={btnSm}>Add barcode</button>
        </div>
      </Row>
      <Row label="Price (£)" required>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <input type="number" step="0.01" value={form.price || ''} onChange={e => hc('price', e.target.value)} style={{ ...inp, maxWidth:'140px' }} />
          <span style={{ color:'#1d4ed8', fontSize:'13px', cursor:'pointer' }}>(Advanced pricing info)</span>
        </div>
      </Row>
      <Row label="Live?">
        <div style={{ display:'flex', gap:'20px', paddingTop:'8px' }}>
          <label style={{ display:'flex', alignItems:'center', gap:'6px', cursor:'pointer', fontSize:'14px', color:'#333' }}>
            <input type="radio" name={`live_${product.id}`} checked={!!form.live_for_web} onChange={() => hc('live_for_web', 1)} /> Yes
          </label>
          <label style={{ display:'flex', alignItems:'center', gap:'6px', cursor:'pointer', fontSize:'14px', color:'#333' }}>
            <input type="radio" name={`live_${product.id}`} checked={!form.live_for_web} onChange={() => hc('live_for_web', 0)} /> No
          </label>
        </div>
      </Row>
      <tr><td colSpan={2} style={{ paddingBottom:'12px' }}>
        <div style={{ display:'flex', gap:'8px', marginBottom:'8px' }}>
          <button style={btnSm}>Generate Product Description with AI</button>
          <button style={btnSm}>Improve with AI</button>
        </div>
        <div style={{ border:'1px solid #ccc', borderRadius:'4px', overflow:'hidden' }}>
          <div style={{ background:'#f5f5f5', borderBottom:'1px solid #ccc', padding:'6px 10px', display:'flex', gap:'6px', flexWrap:'wrap' }}>
            {['</>','f','B','I','list','img','link','A'].map((ic, i) => (
              <button key={i} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'13px', color:'#555', padding:'2px 5px', fontWeight:'bold' }}>{ic}</button>
            ))}
          </div>
          <textarea rows={5} value={form.web_long_description || ''} onChange={e => hc('web_long_description', e.target.value)}
            style={{ width:'100%', border:'none', outline:'none', padding:'10px', fontSize:'14px', resize:'vertical', fontFamily:'inherit', boxSizing:'border-box', color:'#333', display:'block' }} />
        </div>
      </td></tr>
    </tbody></table>
  )

  const renderFieldList = (fields) => (
    <table style={{ width:'100%', borderCollapse:'collapse' }}><tbody>
      {fields.map(f => (
        <Row key={f.key + f.label} label={f.label}>
          {f.type === 'textarea' ? (
            <textarea rows={3} value={form[f.key] || ''} onChange={e => hc(f.key, e.target.value)} style={{ ...inp, resize:'vertical' }} />
          ) : f.type === 'select' ? (
            <select value={form[f.key] || ''} onChange={e => hc(f.key, e.target.value)} style={inp}>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input type={f.type || 'text'} value={form[f.key] || ''} onChange={e => hc(f.key, e.target.value)}
              style={{ ...inp, maxWidth: f.type === 'number' ? '200px' : '100%' }} />
          )}
        </Row>
      ))}
    </tbody></table>
  )

  const renderTab = () => {
    if (tab === 'General')  return renderGeneral()
    if (tab === 'Advanced') return renderFieldList(ADVANCED_FIELDS)
    if (tab === 'Extra')    return renderFieldList(EXTRA_FIELDS)
    if (tab === 'SEO')      return renderFieldList(SEO_FIELDS)
    return <div style={{ padding:'40px', textAlign:'center', color:'#999' }}>Coming soon...</div>
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, overflowY:'auto', padding:'20px' }}>
      <div style={{ background:'#fff', borderRadius:'8px', width:'100%', maxWidth:'860px', boxShadow:'0 8px 40px rgba(0,0,0,.35)', display:'flex', flexDirection:'column', maxHeight:'92vh', color:'#333' }}>
        <div style={{ padding:'18px 24px 0', borderBottom:'1px solid #e5e7eb', position:'relative' }}>
          <button onClick={onClose} style={{ position:'absolute', right:'16px', top:'16px', background:'none', border:'none', fontSize:'22px', cursor:'pointer', color:'#666', lineHeight:1 }}>x</button>
          <h3 style={{ margin:0, marginBottom:'14px', fontSize:'20px', fontWeight:700, color:'#111' }}>Edit a product</h3>
          <div style={{ display:'flex', overflowX:'auto' }}>
            {ALL_TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding:'8px 16px', background:'transparent', border:'none',
                borderBottom: t === tab ? '2px solid #1d4ed8' : '2px solid transparent',
                color: t === tab ? '#1d4ed8' : '#555', cursor:'pointer', fontSize:'13px',
                fontWeight: t === tab ? 600 : 400, whiteSpace:'nowrap'
              }}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
          {renderTab()}
        </div>
        <div style={{ padding:'14px 24px', borderTop:'1px solid #e5e7eb', display:'flex', gap:'10px', justifyContent:'flex-end', background:'#fafafa', borderRadius:'0 0 8px 8px' }}>
          <button onClick={onClose} style={btnGh}>Cancel</button>
          <button onClick={() => save(true)} disabled={busy} style={btnOrg}>
            {busy ? 'Saving...' : 'Save changes & close'}
          </button>
          <button onClick={() => save(false)} disabled={busy} style={{ ...btnOrg, background:'#ea580c' }}>
            {busy ? 'Saving...' : 'Save changes'}
          </button>
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
  const [editModal, setEditModal]   = useState(null)

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

  const doToggleBestOffer = async (id) => {
    try { await toggleBestOffer(id); load() } catch (e) { alert(e.message) }
  }

  const doToggleNewArrival = async (id) => {
    try { await toggleNewArrival(id); load() } catch (e) { alert(e.message) }
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
      {editModal  && <EditProductModal product={editModal} onClose={() => setEditModal(null)} onSaved={load} />}

      <div className="admin-flex-between mb-6">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Products Management</h1>
          <p style={{ color: '#94a3b8' }}>Manage your catalog and inventory</p>
        </div>
        <button onClick={() => setEditModal(BLANK_PRODUCT)} className="admin-btn admin-btn-primary">
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
                  {['Ref', 'Description', 'Brand', 'Category', 'Stock', 'Web', 'Offer', 'Best Offer', 'New', 'Actions'].map(h => (
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
                       <label className="admin-switch">
                        <input type="checkbox" checked={!!p.is_best_offer} onChange={() => !p.deleted && doToggleBestOffer(p.id)} />
                        <span className="admin-slider"></span>
                      </label>
                    </td>
                    <td>
                       <label className="admin-switch">
                        <input type="checkbox" checked={!!p.is_new_arrival} onChange={() => !p.deleted && doToggleNewArrival(p.id)} />
                        <span className="admin-slider"></span>
                      </label>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!p.deleted && (
                          <button onClick={() => setEditModal(p)} className="admin-btn admin-btn-ghost" style={{ padding: '0.5rem', color: '#3b82f6' }} title="Edit product">
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
