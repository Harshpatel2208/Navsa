import Barcode from 'react-barcode'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { colors, fonts, radius, shadow } from '../theme'
import { useCart } from '../context/CartContext'

const styleTag = `
@keyframes navsa-spin {
  to { transform: rotate(360deg); }
}
@keyframes navsa-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.navsa-spinner {
  animation: navsa-spin 0.8s linear infinite;
}
.navsa-fade {
  animation: navsa-fade-in 0.4s ease both;
}
.navsa-tab-btn {
  transition: background 0.18s ease, color 0.18s ease;
}
.navsa-qty-btn {
  transition: background 0.15s ease, border-color 0.15s ease;
}
.navsa-qty-btn:hover {
  background: var(--color-navy) !important;
  color: #fff !important;
  border-color: var(--color-navy) !important;
}
.navsa-basket-btn {
  transition: background 0.2s ease, transform 0.15s ease;
}
.navsa-basket-btn:hover {
  background: var(--color-accent) !important;
  transform: translateY(-1px);
}
.navsa-wishlist-btn {
  transition: background 0.2s ease, color 0.2s ease;
}
.navsa-wishlist-btn:hover {
  background: var(--color-navy) !important;
  color: #fff !important;
}
.navsa-product-img {
  transition: transform 0.4s ease;
}
.navsa-img-frame:hover .navsa-product-img {
  transform: scale(1.06);
}
`

// --- GS1 barcode helpers -----------------------------------------------
// JsBarcode (used by react-barcode) computes the check digit itself:
// EAN13 accepts 12 OR 13 digits, ITF14 accepts 13 OR 14 digits. Our ERP
// export sometimes strips a leading zero, so we only pad up to the
// minimum length the library needs — never past a value that already
// includes its own check digit.

function normalizeEan(raw) {
  const digits = String(raw || '').replace(/\D/g, '')
  if (!digits) return null

  if (digits.length === 7 || digits.length === 8) {
    return { value: digits, format: 'EAN8' }
  }

  if (digits.length >= 9 && digits.length <= 13) {
    const value = digits.length < 12 ? digits.padStart(12, '0') : digits
    return { value, format: 'EAN13' }
  }

  return null
}

function normalizeCase(raw) {
  const digits = String(raw || '').replace(/\D/g, '')
  if (!digits) return null

  if (digits.length >= 8 && digits.length <= 14) {
    const value = digits.length < 13 ? digits.padStart(13, '0') : digits
    return { value }
  }

  return null
}
// -------------------------------------------------------------------------

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [layerQty, setLayerQty] = useState(0)
  const [palletQty, setPalletQty] = useState(0)
  const [barcodeTab, setBarcodeTab] = useState('ean')
  const [justAdded, setJustAdded] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const { addToBasket, addToWishlist, removeFromWishlist, isInWishlist } = useCart()

  useEffect(() => {
    setLoading(true)
    setRelatedProducts([])
    fetch(`/api/products/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Product not found')
        return r.json()
      })
      .then(d => {
        setProduct(d)
        setLoading(false)
        // Fetch related products by brand
        if (d.brand?.brand_name) {
          fetch(`/api/products?brand=${encodeURIComponent(d.brand.brand_name)}&per_page=12`)
            .then(r => r.json())
            .then(rd => {
              setRelatedProducts((rd.data || []).filter(p => String(p.id) !== String(id)))
            })
            .catch(() => {})
        } else if (d.category?.category_name) {
          fetch(`/api/products?category=${encodeURIComponent(d.category.category_name)}&per_page=12`)
            .then(r => r.json())
            .then(rd => {
              setRelatedProducts((rd.data || []).filter(p => String(p.id) !== String(id)))
            })
            .catch(() => {})
        }
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [id])

  const formatDate = (d) => {
    if (!d) return '—'
    const date = new Date(d)
    if (isNaN(date.getTime())) return d
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  // Case is not orderable — only Layer and Pallet count toward total
  const totalCases = (layerQty * (product?.layer_quantity || 0)) + (palletQty * (product?.pallet_quantity || 0))

  const handleAddToBasket = () => {
    if (!product) return
    const added = addToBasket(product, { layerQty, palletQty })
    if (!added) {
      alert('Please select at least one Layer or Pallet before adding to basket.')
      return
    }
    setLayerQty(0)
    setPalletQty(0)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  const handleWishlistToggle = () => {
    if (!product) return
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px' }}>
      <div className="navsa-spinner" style={{
        width: '32px', height: '32px', border: `3px solid ${colors.hairline}`,
        borderTopColor: colors.navy, borderRadius: '50%'
      }} />
      <p style={{ fontFamily: fonts.mono, color: colors.inkMuted, fontSize: '13px', letterSpacing: '0.5px' }}>LOADING PRODUCT…</p>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '40px' }}>📦</div>
      <p style={{ fontFamily: fonts.body, color: '#B3261E', fontSize: '16px', fontWeight: 600 }}>{error}</p>
      <Link to="/shop" style={{ color: colors.navy, fontWeight: 700, fontFamily: fonts.mono, fontSize: '13px' }}>← BACK TO SHOP</Link>
    </div>
  )

  if (!product) return null

  const eanBarcode = normalizeEan(product.barcode_ean)
  const caseBarcode = normalizeCase(product.barcode_case)

  return (
    <div style={{ width: '100%', background: colors.paper, fontFamily: fonts.body }}>
      <style>{styleTag}</style>

      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${colors.hairline}`, padding: '14px 6vw' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', fontFamily: fonts.mono, fontSize: '12px', color: colors.inkMuted }}>
          <Link to="/" style={{ color: colors.inkMuted, textDecoration: 'none' }}>Home</Link>
          {' › '}
          <Link to="/shop" style={{ color: colors.inkMuted, textDecoration: 'none' }}>Shop</Link>
          {product.category && (
            <>
              {' › '}
              <Link
                to={`/shop?category=${encodeURIComponent(product.category.category_name)}`}
                style={{ color: colors.inkMuted, textDecoration: 'none' }}
              >
                {product.category.category_name}
              </Link>
            </>
          )}
          {' › '}
          <span style={{ color: colors.navy }}>{product.description}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="navsa-fade" style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 6vw' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'start' }}>

          {/* Left — image + barcodes */}
          <div>
            <div className="navsa-img-frame" style={{
              background: '#fff', border: `1px solid rgba(149, 204, 221, 0.6)`, boxShadow: shadow.soft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '420px', borderRadius: radius.lg, overflow: 'hidden', position: 'relative'
            }}>
              {product.category?.category_name && (
                <div style={{
                  position: 'absolute', top: '14px', left: '14px', zIndex: 2,
                  background: 'rgba(41,54,129,0.92)', color: '#fff',
                  fontFamily: fonts.mono, fontSize: '11px', fontWeight: 700,
                  padding: '5px 12px', letterSpacing: '0.5px', borderRadius: radius.pill,
                  textTransform: 'uppercase'
                }}>
                  {product.category.category_name}
                </div>
              )}
              {product.web_image ? (
                <img
                  className="navsa-product-img"
                  src={`/products/${product.web_image}`}
                  alt={product.description}
                  style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = `
                      <div style="text-align:center;color:#A7AAB2;font-family:JetBrains Mono,monospace;font-size:13px">
                        <div style="font-size:48px;margin-bottom:12px">📦</div>
                        NO IMAGE ON FILE
                      </div>`
                  }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#A7AAB2', fontFamily: fonts.mono, fontSize: '13px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
                  NO IMAGE ON FILE
                </div>
              )}
            </div>

            {/* Barcode section */}
            <div style={{
              background: '#fff', border: `1px solid ${colors.hairline}`,
              marginTop: '20px', borderRadius: '4px', overflow: 'hidden'
            }}>
              <div style={{
                padding: '18px 20px 10px', fontFamily: fonts.mono, fontSize: '12px',
                color: colors.inkMuted, fontWeight: 700, letterSpacing: '1px'
              }}>
                ▤ BARCODES
              </div>

              <div style={{ display: 'flex', borderBottom: `1px solid ${colors.hairline}`, padding: '0 20px', gap: '10px' }}>
                <button
                  className="navsa-tab-btn"
                  onClick={() => setBarcodeTab('ean')}
                  style={{
                    background: barcodeTab === 'ean' ? colors.navy : '#f5f6f8',
                    color: barcodeTab === 'ean' ? '#fff' : '#666',
                    border: 'none', padding: '9px 18px', fontSize: '12px', fontWeight: 700,
                    fontFamily: fonts.mono, cursor: 'pointer', borderRadius: '4px 4px 0 0'
                  }}
                >
                  EAN
                </button>

                {caseBarcode && (
                  <button
                    className="navsa-tab-btn"
                    onClick={() => setBarcodeTab('case')}
                    style={{
                      background: barcodeTab === 'case' ? colors.navy : '#f5f6f8',
                      color: barcodeTab === 'case' ? '#fff' : '#666',
                      border: 'none', padding: '9px 18px', fontSize: '12px', fontWeight: 700,
                      fontFamily: fonts.mono, cursor: 'pointer', borderRadius: '4px 4px 0 0'
                    }}
                  >
                    CASE ITF-14
                  </button>
                )}
              </div>

              <div style={{
                padding: '35px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                alignItems: 'center', background: '#fff', minHeight: '180px'
              }}>
                {barcodeTab === 'ean' && (
                  eanBarcode ? (
                    <Barcode
                      value={eanBarcode.value}
                      format={eanBarcode.format}
                      width={2}
                      height={90}
                      fontSize={16}
                      margin={10}
                      displayValue={true}
                    />
                  ) : (
                    <span style={{ color: '#A7AAB2', fontFamily: 'monospace', fontSize: '13px' }}>
                      {product.barcode_ean ? 'Barcode unavailable' : 'No EAN on file'}
                    </span>
                  )
                )}

                {barcodeTab === 'case' && (
                  caseBarcode ? (
                    <Barcode
                      value={caseBarcode.value}
                      format="ITF14"
                      width={2}
                      height={90}
                      fontSize={16}
                      margin={10}
                      displayValue={true}
                    />
                  ) : (
                    <span style={{ color: '#A7AAB2', fontFamily: 'monospace', fontSize: '13px' }}>
                      {product.barcode_case ? 'Barcode unavailable' : 'No case barcode on file'}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right — product info */}
          <div style={{ position: 'sticky', top: '20px' }}>

            {/* Brand + Category badges */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {product.brand && (
                <span style={{
                  background: '#fff', color: colors.navy, fontFamily: fonts.mono, fontSize: '11px',
                  padding: '5px 12px', fontWeight: 700, border: '1px solid #082b53',
                  borderRadius: '2px', letterSpacing: '0.5px'
                }}>
                  {product.brand.brand_name}
                </span>
              )}
              {product.category && (
                <span style={{
                  background: colors.navy, color: '#fff', fontFamily: fonts.mono, fontSize: '11px',
                  padding: '5px 12px', fontWeight: 700, borderRadius: '2px', letterSpacing: '0.5px'
                }}>
                  {product.category.category_name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: 'clamp(20px, 2.5vw, 28px)', margin: '0 0 10px', lineHeight: '1.3' }}>
              {product.description}
            </h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '16px 0' }}>
              <span style={{ fontSize: '38px', fontWeight: 700, color: '#1F7A4D', fontFamily: fonts.display }}>
                £{product.price}
              </span>
              <span style={{ fontFamily: fonts.mono, fontSize: '12px', color: colors.inkMuted }}>PER CASE, EX WAREHOUSE</span>
            </div>

            {/* Key specs table */}
            <div style={{ background: '#fff', border: `1px solid ${colors.hairline}`, marginBottom: '24px', borderRadius: '2px', overflow: 'hidden' }}>
              {[
                ['Navsa Product Code', product.reference],
                ['Brand', product.brand?.brand_name],
                ['Description', product.description],
                ['Units per Case', product.inner_case_quantity],
                ['Unit Weight', product.weight ? `${product.weight} kg` : null],
                ['Unit Volume', product.volume ? `${product.volume} m³` : null],
                ['Best Before Date (indicative)', formatDate(product.bbd)],
                ['Country of Origin', product.intra_country],
                ['Comm Code', product.comm_code],
                ['VAT Code', product.vat_code],
                ['Shelf Life (days)', product.shelf_life],
              ].map(([label, value], i) => value ? (
                <div key={label} style={{
                  display: 'grid', gridTemplateColumns: '180px 1fr',
                  borderBottom: `1px solid ${colors.hairline}`,
                  padding: '11px 16px', fontSize: '14px',
                  background: i % 2 === 0 ? '#fff' : '#FAF9F6'
                }}>
                  <span style={{ color: colors.inkMuted, fontWeight: 500, fontFamily: fonts.mono, fontSize: '12px' }}>{label}</span>
                  <span style={{ color: colors.navy, fontWeight: 600 }}>{value}</span>
                </div>
              ) : null)}
            </div>

            {/* Quantity Options */}
            <div style={{ background: '#fff', border: `1px solid ${colors.hairline}`, padding: '20px', marginBottom: '20px', borderRadius: '2px' }}>
              <div style={{ fontFamily: fonts.mono, fontSize: '12px', color: colors.inkMuted, marginBottom: '16px', fontWeight: 700, letterSpacing: '0.5px' }}>
                ▤ QUANTITY OPTIONS
              </div>

              {/* Case — info only, NOT orderable (greyed out) */}
              <div style={{
                display: 'grid', gridTemplateColumns: '80px 1fr auto',
                alignItems: 'center', gap: '12px', marginBottom: '12px',
                padding: '10px 0', borderBottom: `1px solid ${colors.hairline}`,
                opacity: 0.4
              }}>
                <span style={{ fontWeight: 700, color: colors.navy, fontSize: '14px' }}>Case</span>
                <span style={{ color: colors.inkMuted, fontSize: '13px' }}>
                  {product.inner_case_quantity} Units per Case
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button disabled style={{ width: '32px', height: '32px', border: `1px solid ${colors.hairline}`, background: '#f5f5f5', cursor: 'not-allowed', fontWeight: 700, fontSize: '16px', borderRadius: '50%', color: '#ccc' }}>−</button>
                  <span style={{ width: '32px', textAlign: 'center', fontWeight: 700, fontFamily: fonts.mono, color: '#ccc' }}>0</span>
                  <button disabled style={{ width: '32px', height: '32px', border: `1px solid ${colors.hairline}`, background: '#f5f5f5', cursor: 'not-allowed', fontWeight: 700, fontSize: '16px', borderRadius: '50%', color: '#ccc' }}>+</button>
                </div>
              </div>

              {/* Layer — orderable if value exists */}
              {product.layer_quantity ? (
                <div style={{
                  display: 'grid', gridTemplateColumns: '80px 1fr auto',
                  alignItems: 'center', gap: '12px', marginBottom: '12px',
                  padding: '10px 0', borderBottom: `1px solid ${colors.hairline}`
                }}>
                  <span style={{ fontWeight: 700, color: colors.navy, fontSize: '14px' }}>Layer</span>
                  <span style={{ color: colors.inkMuted, fontSize: '13px' }}>
                    {product.layer_quantity} Cases per Layer
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      className="navsa-qty-btn"
                      onClick={() => setLayerQty(q => Math.max(0, q - 1))}
                      style={{ width: '32px', height: '32px', border: `1px solid ${colors.hairline}`, background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '16px', borderRadius: '50%' }}
                    >−</button>
                    <span style={{ width: '32px', textAlign: 'center', fontWeight: 700, fontFamily: fonts.mono }}>{layerQty}</span>
                    <button
                      className="navsa-qty-btn"
                      onClick={() => setLayerQty(q => q + 1)}
                      style={{ width: '32px', height: '32px', border: `1px solid ${colors.hairline}`, background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '16px', borderRadius: '50%' }}
                    >+</button>
                  </div>
                </div>
              ) : null}

              {/* Pallet — orderable if value exists */}
              {product.pallet_quantity ? (
                <div style={{
                  display: 'grid', gridTemplateColumns: '80px 1fr auto',
                  alignItems: 'center', gap: '12px', marginBottom: '12px',
                  padding: '10px 0', borderBottom: `1px solid ${colors.hairline}`
                }}>
                  <span style={{ fontWeight: 700, color: colors.navy, fontSize: '14px' }}>Pallet</span>
                  <span style={{ color: colors.inkMuted, fontSize: '13px' }}>
                    {product.pallet_quantity} Cases per Pallet
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      className="navsa-qty-btn"
                      onClick={() => setPalletQty(q => Math.max(0, q - 1))}
                      style={{ width: '32px', height: '32px', border: `1px solid ${colors.hairline}`, background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '16px', borderRadius: '50%' }}
                    >−</button>
                    <span style={{ width: '32px', textAlign: 'center', fontWeight: 700, fontFamily: fonts.mono }}>{palletQty}</span>
                    <button
                      className="navsa-qty-btn"
                      onClick={() => setPalletQty(q => q + 1)}
                      style={{ width: '32px', height: '32px', border: `1px solid ${colors.hairline}`, background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '16px', borderRadius: '50%' }}
                    >+</button>
                  </div>
                </div>
              ) : null}

              {/* Total cases counter */}
              <div style={{
                marginTop: '14px', fontFamily: fonts.mono, fontSize: '13px', color: '#fff',
                fontWeight: 700, background: colors.navy, padding: '10px 14px', borderRadius: '2px',
                textAlign: 'center', letterSpacing: '0.5px'
              }}>
                {totalCases} TOTAL CASES SELECTED
              </div>
            </div>

            {/* Add to Basket */}
            <button
              className="navsa-basket-btn"
              onClick={handleAddToBasket}
              style={{
                width: '100%', padding: '16px', background: justAdded ? '#1F7A4D' : '#f58220', color: '#fff',
                border: 'none', fontWeight: 700, fontSize: '16px', cursor: 'pointer', marginBottom: '12px',
                borderRadius: '2px', fontFamily: fonts.body, transition: 'background 0.2s ease'
              }}
            >
              {justAdded ? '✓ Added to Basket' : 'Add to Basket'}
            </button>

            <button
              className="navsa-wishlist-btn"
              onClick={handleWishlistToggle}
              style={{
                width: '100%', padding: '14px',
                background: isInWishlist(product.id) ? colors.navy : 'transparent',
                color: isInWishlist(product.id) ? '#fff' : colors.navy,
                border: '2px solid #082b53', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                borderRadius: '2px'
              }}
            >
              {isInWishlist(product.id) ? '♥ Remove from Wishlist' : '♥ Add to Wishlist'}
            </button>
          </div>
        </div>

        {/* Bottom — extra details */}
        <div style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

          <div style={{ background: '#fff', border: `1px solid ${colors.hairline}`, padding: '24px', borderRadius: '2px' }}>
            <h3 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '16px', marginBottom: '16px' }}>
              📦 Case & Pallet Information
            </h3>
            {[
              ['Cases per Layer', product.layer_quantity],
              ['Cases per Pallet', product.pallet_quantity],
              ['Outer Case Qty', product.outer_case_quantity],
              ['Case Volume (m³)', product.volume],
            ].map(([label, value]) => value ? (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.hairline}`, fontSize: '14px' }}>
                <span style={{ color: colors.inkMuted }}>{label}</span>
                <span style={{ fontWeight: 600, color: colors.navy }}>{value}</span>
              </div>
            ) : null)}
          </div>

          <div style={{ background: '#fff', border: `1px solid ${colors.hairline}`, padding: '24px', borderRadius: '2px' }}>
            <h3 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '16px', marginBottom: '16px' }}>
              🌍 Trade & Customs
            </h3>
            {[
              ['Commodity Code', product.comm_code],
              ['Country of Origin', product.intra_country],
              ['Intra Type', product.intra_type],
              ['Supplier Reference', product.supplier_reference],
            ].map(([label, value]) => value ? (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.hairline}`, fontSize: '14px' }}>
                <span style={{ color: colors.inkMuted }}>{label}</span>
                <span style={{ fontWeight: 600, color: colors.navy }}>{value}</span>
              </div>
            ) : null)}
          </div>

          {product.web_long_description && (
            <div style={{ background: '#fff', border: `1px solid ${colors.hairline}`, padding: '24px', borderRadius: '2px' }}>
              <h3 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '16px', marginBottom: '12px' }}>
                📝 Product Description
              </h3>
              <p style={{ color: colors.inkMuted, fontSize: '14px', lineHeight: '1.7' }}>
                {product.web_long_description}
              </p>
            </div>
          )}
        </div>

        {/* Back link */}
        <div style={{ marginTop: '40px' }}>
          <Link
            to={product.category ? `/shop?category=${encodeURIComponent(product.category.category_name)}` : '/shop'}
            style={{ color: colors.navy, fontFamily: fonts.mono, fontSize: '13px', textDecoration: 'none', fontWeight: 700 }}
          >
            ← Back to {product.category?.category_name || 'Shop'}
          </Link>
        </div>
      </div>

      {/* Related Products Strip */}
      {relatedProducts.length > 0 && (
        <div style={{ width: '100%', padding: '50px 6vw', borderTop: `1px solid ${colors.hairline}`, background: '#fff' }}>
          <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '22px', marginBottom: '6px' }}>
              More from {product.brand?.brand_name || product.category?.category_name || 'This Range'}
            </h2>
            <p style={{ color: colors.inkMuted, fontSize: '13px', marginBottom: '26px', fontFamily: fonts.mono }}>You may also be interested in these products</p>
            <div style={{ display: 'flex', gap: '18px', overflowX: 'auto', paddingBottom: '8px' }}>
              {relatedProducts.slice(0, 10).map(p => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  style={{
                    minWidth: '200px', maxWidth: '200px', background: colors.paper,
                    border: `1px solid ${colors.hairline}`, flex: '0 0 auto',
                    textDecoration: 'none', display: 'block',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(8,43,83,0.10)' }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ width: '100%', height: '140px', background: '#EFEDE6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {p.web_image ? (
                      <img
                        src={`/products/${p.web_image}`}
                        alt={p.description}
                        style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }}
                        onError={e => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="color:#A7AAB2;font-size:10px;font-family:JetBrains Mono,monospace">NO IMAGE</span>' }}
                      />
                    ) : (
                      <span style={{ color: '#A7AAB2', fontFamily: fonts.mono, fontSize: '10px' }}>NO IMAGE</span>
                    )}
                  </div>
                  <div style={{ padding: '12px' }}>
                    <span style={{ fontFamily: fonts.mono, fontSize: '10px', color: colors.accent, fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      {p.brand?.brand_name?.toUpperCase() || 'UNBRANDED'}
                    </span>
                    <h4 style={{ fontFamily: fonts.body, fontSize: '12px', color: colors.navy, fontWeight: 600, margin: '0 0 6px', minHeight: '32px', lineHeight: '1.4' }}>
                      {p.description}
                    </h4>
                    {p.price && (
                      <div style={{ fontFamily: fonts.display, fontSize: '16px', fontWeight: 700, color: '#1F7A4D' }}>£{p.price}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <Link
                to={product.brand?.brand_name ? `/shop?brand=${encodeURIComponent(product.brand.brand_name)}` : '/shop'}
                style={{ fontFamily: fonts.mono, fontSize: '12px', color: colors.navy, textDecoration: 'none', fontWeight: 700, border: `1px solid ${colors.navy}`, padding: '8px 18px', display: 'inline-block' }}
              >
                VIEW ALL →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
