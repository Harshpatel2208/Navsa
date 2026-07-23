import { useEffect, useState, useCallback } from 'react'
import {
  getProducts,
  toggleOffer,
  toggleBestOffer,
  toggleNewArrival,
  updateProduct,
  clearAllOffers,
  getPdfs
} from '../../services/adminApi'
import {
  Tag,
  Trash2,
  Edit2,
  Plus,
  Search,
  X,
  Zap,
  Sparkles,
  Flame,
  Calendar,
  FileText,
  CheckCircle,
  ExternalLink
} from 'lucide-react'

function AddOfferModal({ onClose, onAdded, initialType = 'offer' }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState(initialType)

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
      const res = await getProducts(
        query.trim() ? { search: query, per_page: 50 } : { per_page: 50 }
      )
      setResults(res.data || [])
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (product) => {
    try {
      if (selectedType === 'offer') {
        if (!product.is_offer) await toggleOffer(product.id)
      } else if (selectedType === 'new_arrival') {
        if (!product.is_new_arrival) await toggleNewArrival(product.id)
      } else if (selectedType === 'best_offer') {
        if (!product.is_best_offer) await toggleBestOffer(product.id)
      }
      onAdded()
      onClose()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '650px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: '24px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} color="#3b82f6" /> Add Product to Offers
          </h2>
          <button onClick={onClose} className="admin-btn admin-btn-ghost" style={{ padding: '4px' }}><X size={20}/></button>
        </div>

        {/* Category selector for new offer */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => setSelectedType('offer')}
            style={{
              flex: 1, padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              border: selectedType === 'offer' ? '1px solid #eab308' : '1px solid rgba(255,255,255,0.1)',
              background: selectedType === 'offer' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255,255,255,0.03)',
              color: selectedType === 'offer' ? '#fde047' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            <Zap size={14} /> Daily Offer
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('new_arrival')}
            style={{
              flex: 1, padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              border: selectedType === 'new_arrival' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
              background: selectedType === 'new_arrival' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.03)',
              color: selectedType === 'new_arrival' ? '#60a5fa' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            <Sparkles size={14} /> New Arrival
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('best_offer')}
            style={{
              flex: 1, padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              border: selectedType === 'best_offer' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
              background: selectedType === 'best_offer' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.03)',
              color: selectedType === 'best_offer' ? '#f87171' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            <Flame size={14} /> Best Offer
          </button>
        </div>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              autoFocus
              type="text" 
              placeholder="Search products by name, reference, brand..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="admin-input-field" 
              style={{ width: '100%', padding: '8px 10px 8px 34px' }}
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ background: '#3b82f6', color: '#fff' }} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {results.map(p => {
            const isTagged = 
              (selectedType === 'offer' && p.is_offer) ||
              (selectedType === 'new_arrival' && p.is_new_arrival) ||
              (selectedType === 'best_offer' && p.is_best_offer);

            return (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>{p.description}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {p.reference} · {p.brand?.brand_name || 'Generic'} · £{Number(p.price || 0).toFixed(2)}
                  </div>
                </div>
                <button 
                  onClick={() => handleAdd(p)}
                  className="admin-btn admin-btn-primary"
                  style={{
                    padding: '6px 14px', fontSize: '12px',
                    background: isTagged ? '#334155' : '#3b82f6',
                    color: '#fff'
                  }}
                  disabled={isTagged}
                >
                  {isTagged ? 'Already Added' : '+ Add'}
                </button>
              </div>
            )
          })}
          {results.length === 0 && query && !loading && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No products found matching “{query}”.</div>
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

  const handleToggleOffer = async () => {
    setBusy(true)
    try { await toggleOffer(product.id); onRefresh() }
    catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const handleToggleNewArrival = async () => {
    setBusy(true)
    try { await toggleNewArrival(product.id); onRefresh() }
    catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const handleToggleBestOffer = async () => {
    setBusy(true)
    try { await toggleBestOffer(product.id); onRefresh() }
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
    <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '4px', lineHeight: 1.3 }}>
            {product.description?.slice(0, 65)}{product.description?.length > 65 ? '…' : ''}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>
            SKU: {product.reference} · {product.brand?.brand_name || 'No Brand'}
          </div>
        </div>
        {product.web_image && (
          <img
            src={`/products/${product.web_image}`}
            alt=""
            style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '4px', background: '#fff', padding: '2px' }}
          />
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '13px' }}>
        <span style={{ color: '#60a5fa', fontWeight: 700, fontSize: '15px' }}>
          {product.price ? `£${Number(product.price).toFixed(2)}` : 'No price'}
        </span>
        <span className={`admin-badge ${stockClass(product.stock_quantity ?? 0)}`}>
          Stock: {product.stock_quantity ?? 0}
        </span>
      </div>

      {/* Offer Type Toggles */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        <button
          type="button"
          onClick={handleToggleOffer}
          disabled={busy}
          style={{
            padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            border: product.is_offer ? '1px solid #eab308' : '1px solid rgba(255,255,255,0.15)',
            background: product.is_offer ? 'rgba(234, 179, 8, 0.2)' : 'transparent',
            color: product.is_offer ? '#fde047' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px'
          }}
        >
          <Zap size={12} /> {product.is_offer ? 'Daily Offer ✓' : '+ Daily Offer'}
        </button>

        <button
          type="button"
          onClick={handleToggleNewArrival}
          disabled={busy}
          style={{
            padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            border: product.is_new_arrival ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.15)',
            background: product.is_new_arrival ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
            color: product.is_new_arrival ? '#60a5fa' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px'
          }}
        >
          <Sparkles size={12} /> {product.is_new_arrival ? 'New Arrival ✓' : '+ New Arrival'}
        </button>

        <button
          type="button"
          onClick={handleToggleBestOffer}
          disabled={busy}
          style={{
            padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            border: product.is_best_offer ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.15)',
            background: product.is_best_offer ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
            color: product.is_best_offer ? '#f87171' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px'
          }}
        >
          <Flame size={12} /> {product.is_best_offer ? 'Best Offer ✓' : '+ Best Offer'}
        </button>
      </div>

      {/* Label editor */}
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
        {editLabel ? (
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g. Save 15%, Flash Deal..."
              className="admin-input-field"
              style={{ flex: 1, padding: '4px 8px', fontSize: '12px' }}
            />
            <button onClick={saveLabel} disabled={busy} className="admin-btn admin-btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }}>Save</button>
            <button onClick={() => setEditLabel(false)} className="admin-btn admin-btn-ghost" style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>✕</button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: product.offer_label ? '#fde047' : '#94a3b8', fontSize: '12px', fontStyle: product.offer_label ? 'normal' : 'italic' }}>
              Tag Label: {product.offer_label || 'None set'}
            </span>
            <button onClick={() => setEditLabel(true)} className="admin-btn admin-btn-ghost" style={{ color: '#3b82f6', fontSize: '12px', padding: '2px 6px' }}>
              <Edit2 size={12} style={{ marginRight: '4px' }} />Edit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function MonthlyPromotionsView() {
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPdfs() {
      try {
        const res = await getPdfs()
        setPdfs(Array.isArray(res) ? res : res.data || [])
      } catch (err) {
        console.error('Error loading promotion PDFs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPdfs()
  }, [])

  const defaultPromotions = [
    { title: 'NAVSA P10', validity: '08/06/2026 to 19/07/2026', pdf: '/deals/deal1.pdf', badge: 'LATEST' },
    { title: 'NAVSA P11', validity: '29/06/2026 to 09/08/2026', pdf: '/deals/deal2.pdf', badge: 'NEW' },
    { title: 'NAVSA Christmas 2026', validity: 'Seasonal Specials', pdf: '/deals/deal3.pdf', badge: 'CHRISTMAS' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#93c5fd' }}>
        <strong style={{ color: '#fff', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} /> Monthly Promotion Brochures
        </strong>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#cbd5e1' }}>
          Customers can view and download these monthly PDF promotional catalogues from the homepage and header.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {defaultPromotions.map((promo, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="admin-badge admin-badge-primary" style={{ background: '#3b82f6', color: '#fff' }}>
                {promo.badge}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={14} /> PDF Catalogue
              </span>
            </div>

            <h3 style={{ color: '#fff', fontSize: '16px', margin: 0 }}>{promo.title}</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Valid: {promo.validity}</p>

            <a
              href={promo.pdf}
              target="_blank"
              rel="noreferrer"
              className="admin-btn admin-btn-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: 'auto', border: '1px solid rgba(255,255,255,0.2)', color: '#60a5fa' }}
            >
              <ExternalLink size={16} /> Open Catalogue
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminOffers() {
  const [activeTab, setActiveTab] = useState('all') // 'all', 'daily', 'new', 'best', 'monthly'
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [lastPage, setLastPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)

  const load = useCallback(async () => {
    if (activeTab === 'monthly') return;

    setLoading(true)
    try {
      const params = { per_page: 24, page }
      if (activeTab === 'daily') params.is_offer = 1
      else if (activeTab === 'new') params.is_new_arrival = 1
      else if (activeTab === 'best') params.is_best_offer = 1
      else {
        // 'all' tab: fetch offer products
        params.is_offer = 1
      }

      const res = await getProducts(params)
      setProducts(res.data || [])
      setTotal(res.total || 0)
      setLastPage(res.last_page || 1)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }, [page, activeTab])

  useEffect(() => {
    setPage(1)
  }, [activeTab])

  useEffect(() => {
    load()
  }, [load])

  const clearAll = async () => {
    if (!confirm(`Remove ALL offers from all ${total} offer products? This will clear labels too.`)) return
    try {
      await clearAllOffers()
      load()
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="admin-flex-between mb-6">
        <div>
          <h1 style={{ marginBottom: '0.25rem', color: '#fff', fontSize: '24px', fontWeight: 800 }}>
            Offers & Promotions
          </h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            Manage Daily Offers, New Arrivals, Best Offers, and Monthly Promotions
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="admin-btn admin-btn-primary"
            style={{ background: '#3b82f6', color: '#fff', padding: '10px 18px', fontWeight: 600 }}
          >
            <Plus size={18} style={{ marginRight: '6px' }} /> Add Offer Product
          </button>
          {total > 0 && activeTab !== 'monthly' && (
            <button
              onClick={clearAll}
              className="admin-btn admin-btn-ghost"
              style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              <Trash2 size={18} style={{ marginRight: '6px' }} /> Clear Offers
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex', gap: '10px', marginBottom: '24px', paddingBottom: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)', overflowX: 'auto'
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          style={{
            padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 700,
            border: activeTab === 'all' ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
            background: activeTab === 'all' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.03)',
            color: activeTab === 'all' ? '#60a5fa' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
          }}
        >
          <Tag size={16} /> All Active Offers
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('daily')}
          style={{
            padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 700,
            border: activeTab === 'daily' ? '1px solid #eab308' : '1px solid rgba(255, 255, 255, 0.1)',
            background: activeTab === 'daily' ? 'rgba(234, 179, 8, 0.25)' : 'rgba(255, 255, 255, 0.03)',
            color: activeTab === 'daily' ? '#fde047' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
          }}
        >
          <Zap size={16} /> Daily Offers
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('new')}
          style={{
            padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 700,
            border: activeTab === 'new' ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
            background: activeTab === 'new' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.03)',
            color: activeTab === 'new' ? '#60a5fa' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
          }}
        >
          <Sparkles size={16} /> New Arrivals
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('best')}
          style={{
            padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 700,
            border: activeTab === 'best' ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
            background: activeTab === 'best' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.03)',
            color: activeTab === 'best' ? '#f87171' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
          }}
        >
          <Flame size={16} /> Best Offers
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('monthly')}
          style={{
            padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 700,
            border: activeTab === 'monthly' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
            background: activeTab === 'monthly' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.03)',
            color: activeTab === 'monthly' ? '#34d399' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
          }}
        >
          <Calendar size={16} /> Monthly Promotions
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'monthly' ? (
        <MonthlyPromotionsView />
      ) : loading ? (
        <div style={{ color: '#94a3b8', padding: '60px', textAlign: 'center' }}>Loading products…</div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px', color: '#94a3b8' }}>
            <Tag size={48} />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            No Active Products Found in this Category
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>
            Search and add products to showcase them under this offer section.
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="admin-btn admin-btn-primary"
            style={{ background: '#3b82f6', color: '#fff', margin: '0 auto' }}
          >
            <Plus size={16} style={{ marginRight: '6px' }} /> Add Offer Product
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {products.map(p => (
            <OfferCard key={p.id} product={p} onRefresh={load} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {activeTab !== 'monthly' && lastPage > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="admin-btn admin-btn-ghost"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            ← Prev
          </button>
          <span style={{ color: '#94a3b8', padding: '6px', fontSize: '13px' }}>
            Page {page} of {lastPage}
          </span>
          <button
            onClick={() => setPage(p => Math.min(lastPage, p + 1))}
            disabled={page >= lastPage}
            className="admin-btn admin-btn-ghost"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Next →
          </button>
        </div>
      )}

      {showAddModal && (
        <AddOfferModal
          onClose={() => setShowAddModal(false)}
          onAdded={load}
          initialType={
            activeTab === 'new'
              ? 'new_arrival'
              : activeTab === 'best'
              ? 'best_offer'
              : 'offer'
          }
        />
      )}
    </div>
  )
}
