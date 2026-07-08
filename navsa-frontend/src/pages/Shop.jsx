import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { colors, fonts } from '../theme'

const styleTag = `
@keyframes navsa-shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
@keyframes navsa-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.navsa-card {
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  animation: navsa-fade-in 0.4s ease both;
}
.navsa-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 28px rgba(8, 43, 83, 0.14);
  border-color: var(--color-navy) !important;
}
.navsa-card:hover .navsa-view-btn {
  background: var(--color-accent) !important;
}
.navsa-card img {
  transition: transform 0.35s ease;
}
.navsa-card:hover img {
  transform: scale(1.05);
}
.navsa-skeleton {
  background: linear-gradient(90deg, #EFEDE6 0%, #F7F5F0 50%, #EFEDE6 100%);
  background-size: 800px 100%;
  animation: navsa-shimmer 1.4s infinite linear;
}
.navsa-page-btn {
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}
.navsa-page-btn:hover:not(:disabled) {
  background: var(--color-navy) !important;
  color: #fff !important;
  border-color: var(--color-navy) !important;
}
`

function Shop() {
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get('category') || ''

  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const brandFilter = searchParams.get("brand")

  const loadProducts = async (page = 1) => {
    setLoading(true)

    try {
      let url = `/api/products?page=${page}`

      if (categoryFilter) {
        url += `&category=${encodeURIComponent(categoryFilter)}`
      }

      if (brandFilter) {
        url += `&brand=${encodeURIComponent(brandFilter)}`
      }

      if (search) {
        url += `&search=${encodeURIComponent(search)}`
      }

      const response = await fetch(url)
      const data = await response.json()

      setProducts(data.data)
      setTotal(data.total)
      setCurrentPage(data.current_page)
      setLastPage(data.last_page)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSearch('')
    loadProducts(1)
  }, [categoryFilter, brandFilter])

  const formatDate = (d) => {
    if (!d) return '—'
    const date = new Date(d)
    if (isNaN(date.getTime())) return d
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div style={{ width: '100%', background: colors.paper, fontFamily: fonts.body }}>
      <style>{styleTag}</style>

      {categoryFilter && (
        <div style={{
          width: '100%', background: colors.navy, padding: '14px 6vw',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `3px solid ${colors.accent}`
        }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px', fontFamily: fonts.mono, letterSpacing: '1px' }}>
            ▣ CATEGORY MANIFEST — {categoryFilter.toUpperCase()}
          </span>
          <Link to="/shop" style={{ color: colors.accent, fontSize: '13px', textDecoration: 'none', fontWeight: 700, fontFamily: fonts.mono }}>
            ✕ CLEAR
          </Link>
        </div>
      )}

      <div style={{
        width: '100%', background: colors.navy, padding: '22px 6vw',
        display: 'flex', justifyContent: 'center', gap: '0'
      }}>
        <input
          type="text"
          placeholder="Search by product, brand or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && loadProducts(1)}
          style={{
            padding: '13px 18px', width: '440px', border: 'none',
            fontFamily: fonts.body, fontSize: '14px', borderRadius: '2px 0 0 2px'
          }}
        />
        <button
          onClick={() => loadProducts(1)}
          style={{
            background: colors.accent, color: '#fff', border: 'none', padding: '13px 28px',
            fontWeight: 700, cursor: 'pointer', borderRadius: '0 2px 2px 0',
            fontFamily: fonts.mono, fontSize: '13px', letterSpacing: '0.5px'
          }}
        >
          SEARCH
        </button>
      </div>

      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '34px 6vw' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '28px', paddingBottom: '14px', borderBottom: `1px solid ${colors.hairline}`
        }}>
          <p style={{ fontFamily: fonts.mono, fontSize: '12px', color: colors.inkMuted, letterSpacing: '0.5px', margin: 0 }}>
            SHOWING <strong style={{ color: colors.navy }}>{products.length}</strong> OF <strong style={{ color: colors.navy }}>{total}</strong> PRODUCTS
            {categoryFilter && ` · "${categoryFilter.toUpperCase()}"`}
            {brandFilter && ` · BRAND: "${brandFilter.toUpperCase()}"`}
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '22px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ background: '#fff', border: `1px solid ${colors.hairline}` }}>
                <div className="navsa-skeleton" style={{ width: '100%', height: '190px' }} />
                <div style={{ padding: '18px' }}>
                  <div className="navsa-skeleton" style={{ height: '16px', width: '80%', marginBottom: '10px', borderRadius: '2px' }} />
                  <div className="navsa-skeleton" style={{ height: '16px', width: '55%', marginBottom: '18px', borderRadius: '2px' }} />
                  <div className="navsa-skeleton" style={{ height: '24px', width: '40%', borderRadius: '2px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: colors.inkMuted }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ color: colors.navy, fontFamily: fonts.display, marginBottom: '6px' }}>No products found</h3>
            <p style={{ fontFamily: fonts.mono, fontSize: '13px' }}>Try a different category or search term.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '22px' }}>
            {products.map((product, idx) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="navsa-card"
                style={{
                  background: '#fff', border: `1px solid ${colors.hairline}`,
                  position: 'relative', display: 'flex', flexDirection: 'column',
                  animationDelay: `${Math.min(idx, 8) * 0.04}s`,
                  textDecoration: 'none', cursor: 'pointer'
                }}
              >
                {/* Category stamp */}
                {product.category?.category_name && (
                  <div style={{
                    position: 'absolute', top: '10px', left: '10px', zIndex: 2,
                    background: 'rgba(41,54,129,0.92)', color: '#fff',
                    fontFamily: fonts.mono, fontSize: '10px', fontWeight: 700,
                    padding: '4px 9px', letterSpacing: '0.5px', borderRadius: '2px',
                    textTransform: 'uppercase'
                  }}>
                    {product.category.category_name}
                  </div>
                )}

                <div style={{
                  width: '100%', height: '190px', background: '#EFEDE6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {product.web_image ? (
                    <img
                      src={`/products/${product.web_image}`}
                      alt={product.description}
                      style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = '<span style="color:#A7AAB2;font-family:JetBrains Mono,monospace;font-size:11px;letter-spacing:0.5px">NO IMAGE ON FILE</span>'
                      }}
                    />
                  ) : (
                    <span style={{ color: '#A7AAB2', fontFamily: fonts.mono, fontSize: '11px', letterSpacing: '0.5px' }}>NO IMAGE ON FILE</span>
                  )}
                </div>

                {/* Perforated tear-line */}
                <div style={{
                  height: '1px',
                  backgroundImage: `repeating-linear-gradient(to right, ${colors.hairline} 0, ${colors.hairline} 5px, transparent 5px, transparent 10px)`
                }} />

                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{
                    fontFamily: fonts.mono, fontSize: '10px', color: colors.accent,
                    fontWeight: 700, letterSpacing: '0.8px', marginBottom: '6px'
                  }}>
                    {product.brand?.brand_name || 'UNBRANDED'}
                  </span>

                  <h3 style={{
                    fontFamily: fonts.display, fontSize: '15px', color: colors.navy,
                    minHeight: '44px', margin: '0 0 12px', lineHeight: '1.35'
                  }}>
                    {product.description}
                  </h3>

                  <div style={{ fontSize: '26px', fontWeight: 700, color: '#1F7A4D', marginBottom: '14px', fontFamily: fonts.display }}>
                    £{product.price}
                  </div>

                  <div style={{
                    background: colors.paper, border: `1px solid ${colors.hairline}`,
                    borderRadius: '2px', padding: '10px 12px', marginBottom: '16px',
                    fontFamily: fonts.mono, fontSize: '11px', color: colors.inkMuted,
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 10px', lineHeight: '1.5'
                  }}>
                    <div>CODE <strong style={{ color: colors.navy }}>{product.reference}</strong></div>
                    <div>UNITS <strong style={{ color: colors.navy }}>{product.inner_case_quantity}</strong></div>
                    <div>WT <strong style={{ color: colors.navy }}>{product.weight}kg</strong></div>
                    <div>VOL <strong style={{ color: colors.navy }}>{product.volume}m³</strong></div>
                    <div style={{ gridColumn: '1 / -1' }}>EAN <strong style={{ color: colors.navy }}>{product.barcode_ean}</strong></div>
                    <div style={{ gridColumn: '1 / -1' }}>BBD <strong style={{ color: colors.navy }}>{formatDate(product.bbd)}</strong> · {product.intra_country}</div>
                  </div>

                  <div
                    className="navsa-view-btn"
                    style={{
                      width: '100%', background: colors.navy, color: '#fff',
                      border: 'none', padding: '12px', fontWeight: 700, cursor: 'pointer',
                      fontFamily: fonts.mono, fontSize: '12px', letterSpacing: '0.5px',
                      transition: 'background 0.2s ease', textAlign: 'center',
                      marginTop: 'auto', boxSizing: 'border-box'
                    }}
                  >
                    VIEW DETAILS →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && products.length > 0 && (
          <div style={{ marginTop: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontFamily: fonts.mono, fontSize: '13px' }}>
            <button
              className="navsa-page-btn"
              onClick={() => loadProducts(currentPage - 1)}
              disabled={currentPage <= 1}
              style={{
                padding: '10px 18px', border: `1px solid ${colors.hairline}`, background: '#fff',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', opacity: currentPage <= 1 ? 0.4 : 1,
                fontFamily: fonts.mono, fontSize: '12px', fontWeight: 700
              }}
            >
              ← PREV
            </button>
            <span style={{
              color: '#fff', background: colors.navy, fontWeight: 700, padding: '10px 18px'
            }}>
              PAGE {currentPage} / {lastPage}
            </span>
            <button
              className="navsa-page-btn"
              onClick={() => loadProducts(currentPage + 1)}
              disabled={currentPage >= lastPage}
              style={{
                padding: '10px 18px', border: `1px solid ${colors.hairline}`, background: '#fff',
                cursor: currentPage >= lastPage ? 'not-allowed' : 'pointer', opacity: currentPage >= lastPage ? 0.4 : 1,
                fontFamily: fonts.mono, fontSize: '12px', fontWeight: 700
              }}
            >
              NEXT →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Shop
