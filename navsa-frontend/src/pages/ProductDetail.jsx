import Barcode from 'react-barcode'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { colors, fonts } from '../theme'
import { useCart } from '../context/CartContext'
import { useShipping } from '../context/ShippingContext'

const styleTag = `
@keyframes navsa-spin { to { transform: rotate(360deg); } }
@keyframes navsa-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.navsa-spinner { animation: navsa-spin 0.8s linear infinite; }
.navsa-fade { animation: navsa-fade-in 0.4s ease both; }

.product-page-wrap {
  width: 100%;
  background: #f8f4ed;
  font-family: Arial, sans-serif;
}
.product-main {
  max-width: 1500px;
  margin: 0 auto;
  padding: 34px 5vw 55px;
}
.product-breadcrumb {
  margin-bottom: 24px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
}
.product-breadcrumb a {
  color: #082b53;
  text-decoration: none;
  font-weight: 900;
}
.product-grid {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 42px;
  align-items: start;
}
.product-image-card,
.product-info-card,
.product-barcode-card,
.product-metric-card {
  background: #fff;
  border: 1px solid #d9dee7;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(8, 43, 83, 0.08);
}
.product-image-card {
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  position: sticky;
  top: 18px;
}
.product-image-card img {
  max-width: 88%;
  max-height: 470px;
  object-fit: contain;
}
.product-info-card {
  padding: 28px;
}
.product-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.product-tag {
  display: inline-block;
  padding: 9px 15px;
  border-radius: 4px;
  border: 2px solid #082b53;
  color: #082b53;
  background: #fff;
  text-decoration: none;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  transition: 0.2s ease;
}
.product-tag:hover {
  background: #082b53;
  color: #fff;
  transform: translateY(-1px);
}
.product-tag.category {
  background: #082b53;
  color: #fff;
}
.product-tag.category:hover {
  background: #f58220;
  border-color: #f58220;
}
.product-title {
  margin: 0 0 10px;
  color: #082b53;
  font-size: clamp(26px, 3vw, 42px);
  line-height: 1.14;
  font-weight: 900;
}
.product-price {
  color: #1f7a4d;
  font-size: 34px;
  font-weight: 900;
  margin: 14px 0 6px;
}
.product-subtitle {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 800;
}
.product-detail-table {
  margin-top: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}
.product-detail-row {
  display: grid;
  grid-template-columns: 190px 1fr;
  gap: 16px;
  border-bottom: 1px solid #e5e7eb;
  padding: 13px 16px;
  font-size: 14px;
}
.product-detail-row:last-child {
  border-bottom: none;
}
.product-detail-row span:first-child {
  color: #6b7280;
  font-weight: 800;
}
.product-detail-row span:last-child,
.product-detail-row a {
  color: #082b53;
  font-weight: 900;
}
.product-detail-row a {
  text-decoration: none;
}
.product-detail-row a:hover {
  color: #f58220;
}
.product-barcode-card {
  margin-top: 18px;
  padding: 18px;
}
.barcode-title {
  color: #082b53;
  font-weight: 900;
  margin-bottom: 10px;
}
.barcode-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.barcode-tabs button {
  border: 1px solid #082b53;
  background: #fff;
  color: #082b53;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 900;
  cursor: pointer;
}
.barcode-tabs button.active {
  background: #082b53;
  color: #fff;
}
.barcode-box {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.quantity-card {
  margin-top: 20px;
  background: #fff;
  border: 1px solid #d9dee7;
  border-radius: 16px;
  padding: 22px;
}
.quantity-title {
  color: #082b53;
  font-size: 18px;
  font-weight: 900;
  margin-bottom: 14px;
}
.qty-row {
  display: grid;
  grid-template-columns: 90px 1fr auto auto;
  gap: 12px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
}
.qty-row.disabled {
  opacity: 0.45;
}
.qty-label {
  color: #082b53;
  font-weight: 900;
}
.qty-desc {
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
}
.qty-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
.qty-controls button {
  width: 30px;
  height: 30px;
  border: 1px solid #cbd5e1;
  background: #fff;
  border-radius: 7px;
  font-weight: 900;
  cursor: pointer;
}
.qty-controls button:disabled {
  cursor: not-allowed;
}
.qty-controls span {
  min-width: 28px;
  text-align: center;
  font-weight: 900;
}
.qty-x {
  color: #6b7280;
  font-weight: 900;
}
.total-strip {
  margin-top: 16px;
  padding: 14px;
  background: #082b53;
  color: #fff;
  border-radius: 10px;
  text-align: center;
  font-weight: 900;
}
.calculation-strip {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.calculation-strip div {
  background: #f5faff;
  border: 1px solid #d9e8f8;
  border-radius: 12px;
  padding: 13px;
  color: #082b53;
  font-weight: 900;
}
.reefer-warning {
  margin-top: 18px;
  padding: 16px 18px;
  background: #fef2f2;
  border: 1px solid #ef4444;
  color: #7f1d1d;
  border-radius: 12px;
  line-height: 1.6;
}
.reefer-warning a {
  display: inline-block;
  margin-top: 10px;
  color: #082b53;
  font-weight: 900;
}
.mix-warning {
  margin-top: 18px;
  padding: 16px 18px;
  background: #fff7ed;
  border: 1px solid #f59e0b;
  color: #92400e;
  border-radius: 12px;
  line-height: 1.6;
}
.mix-warning a {
  display: inline-block;
  margin-top: 10px;
  color: #082b53;
  font-weight: 900;
}
.product-action-btn {
  width: 100%;
  margin-top: 16px;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background: #f58220;
  color: #fff;
  font-weight: 900;
  cursor: pointer;
  font-size: 15px;
}
.product-action-btn.added {
  background: #1f7a4d;
}
.product-action-btn.disabled {
  background: #e5a0a0;
  cursor: not-allowed;
}
.wishlist-btn {
  width: 100%;
  margin-top: 12px;
  padding: 14px;
  border-radius: 12px;
  border: 2px solid #082b53;
  background: #fff;
  color: #082b53;
  font-weight: 900;
  cursor: pointer;
}
.wishlist-btn.active {
  background: #082b53;
  color: #fff;
}
.product-metrics {
  margin-top: 26px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.product-metric-card {
  padding: 20px;
  min-height: 105px;
}
.product-metric-card strong {
  display: block;
  color: #082b53;
  font-size: 15px;
  margin-bottom: 12px;
}
.product-metric-card span {
  color: #27364a;
  font-weight: 800;
}
.back-link {
  display: inline-block;
  margin-top: 32px;
  color: #082b53;
  text-decoration: none;
  font-weight: 900;
}
@media (max-width: 950px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
  .product-image-card {
    position: static;
  }
  .product-metrics {
    grid-template-columns: 1fr;
  }
  .qty-row,
  .product-detail-row {
    grid-template-columns: 1fr;
  }
}
`

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

function formatDate(d) {
  if (!d) return '—'
  const date = new Date(d)
  if (isNaN(date.getTime())) return d

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function money(value) {
  return `£${Number(value || 0).toFixed(2)}`
}

function makeBrandUrl(product) {
  const brandName = product?.brand?.brand_name
  if (!brandName) return '/shop'
  return `/shop?brand=${encodeURIComponent(brandName)}`
}

function makeCategoryUrl(product) {
  const categoryName = product?.category?.category_name
  if (!categoryName) return '/shop'
  return `/shop?category=${encodeURIComponent(categoryName)}`
}

function getStorageType(product) {
  return product?.storage_type || 'Ambient'
}

export default function ProductDetail() {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [layerQty, setLayerQty] = useState(0)
  const [palletQty, setPalletQty] = useState(0)
  const [barcodeTab, setBarcodeTab] = useState('ean')
  const [justAdded, setJustAdded] = useState(false)

  const {
    basketItems,
    addToBasket,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useCart()

  const { shipping, isCollection } = useShipping()

  useEffect(() => {
    setLoading(true)

    fetch(`/api/products/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Product not found')
        return r.json()
      })
      .then(d => {
        setProduct(d)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px' }}>
        <div
          className="navsa-spinner"
          style={{
            width: '32px',
            height: '32px',
            border: `3px solid ${colors.hairline}`,
            borderTopColor: '#082b53',
            borderRadius: '50%',
          }}
        />
        <p style={{ fontFamily: fonts.mono, color: colors.inkMuted, fontSize: '13px', letterSpacing: '0.5px' }}>
          LOADING PRODUCT…
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '40px' }}>📦</div>
        <p style={{ fontFamily: fonts.body, color: '#B3261E', fontSize: '16px', fontWeight: 600 }}>{error}</p>
        <Link to="/shop" style={{ color: '#082b53', fontWeight: 700, fontFamily: fonts.mono, fontSize: '13px' }}>
          ← BACK TO SHOP
        </Link>
      </div>
    )
  }

  if (!product) return null

  const eanBarcode = normalizeEan(product.barcode_ean)
  const caseBarcode = normalizeCase(product.barcode_case)

  const unitsPerCase = Number(product.units_of || product.inner_case_quantity || 1)

  const totalCases =
    Number(layerQty || 0) * Number(product.layer_quantity || 0) +
    Number(palletQty || 0) * Number(product.pallet_quantity || 0)

  const selectedWeight = Number(product.weight || 0) * unitsPerCase * totalCases
  const selectedVolume = Number(product.volume || 0) * totalCases
  const caseWeight = Number(product.weight || 0) * unitsPerCase

  const productStorageType = getStorageType(product)

  const selectedContainer = shipping?.container
  const isDryContainer = selectedContainer?.container_type === 'Dry'

  const requiresReefer =
    !isCollection &&
    isDryContainer &&
    (productStorageType === 'Frozen' || productStorageType === 'Chilled')

  const basketHasFrozen = basketItems.some(
    item => getStorageType(item) === 'Frozen'
  )

  const basketHasAmbientOrChilled = basketItems.some(item => {
    const type = getStorageType(item)
    return type === 'Ambient' || type === 'Chilled'
  })

  const frozenMixBlocked =
    (productStorageType === 'Frozen' && basketHasAmbientOrChilled) ||
    ((productStorageType === 'Ambient' || productStorageType === 'Chilled') && basketHasFrozen)

  const addBlocked = requiresReefer || frozenMixBlocked

  function handleAddToBasket() {
    if (!product) return

    if (requiresReefer) {
      alert(`${productStorageType} items require a Reefer container. Please change your shipping option first.`)
      return
    }

    if (frozenMixBlocked) {
      alert('Frozen items cannot be mixed with Ambient or Chilled items in the same basket. Please remove the existing incompatible items first.')
      return
    }

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

  function handleWishlistToggle() {
    if (!product) return

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="product-page-wrap">
      <style>{styleTag}</style>

      <div className="product-main navsa-fade">
        <div className="product-breadcrumb">
          <Link to="/">Home</Link> › <Link to="/shop">Shop</Link>
          {product.category?.category_name && (
            <>
              {' '}› <Link to={makeCategoryUrl(product)}>{product.category.category_name}</Link>
            </>
          )}
          {' '}› {product.description}
        </div>

        <div className="product-grid">
          <div>
            <div className="product-image-card">
              {product.web_image ? (
                <img src={`/products/${product.web_image}`} alt={product.description} />
              ) : (
                <div style={{ textAlign: 'center', color: '#9ca3af', fontWeight: 900 }}>
                  <div style={{ fontSize: '46px', marginBottom: '12px' }}>📦</div>
                  NO IMAGE ON FILE
                </div>
              )}
            </div>

            <div className="product-barcode-card">
              <div className="barcode-title">Barcode</div>

              <div className="barcode-tabs">
                <button
                  type="button"
                  className={barcodeTab === 'ean' ? 'active' : ''}
                  onClick={() => setBarcodeTab('ean')}
                >
                  EAN
                </button>

                {caseBarcode && (
                  <button
                    type="button"
                    className={barcodeTab === 'case' ? 'active' : ''}
                    onClick={() => setBarcodeTab('case')}
                  >
                    Case ITF-14
                  </button>
                )}
              </div>

              <div className="barcode-box">
                {barcodeTab === 'ean' && (
                  eanBarcode ? (
                    <Barcode
                      value={eanBarcode.value}
                      format={eanBarcode.format}
                      width={2}
                      height={70}
                      fontSize={14}
                      margin={8}
                      displayValue
                    />
                  ) : (
                    <span>No EAN on file</span>
                  )
                )}

                {barcodeTab === 'case' && (
                  caseBarcode ? (
                    <Barcode
                      value={caseBarcode.value}
                      format="ITF14"
                      width={2}
                      height={70}
                      fontSize={14}
                      margin={8}
                      displayValue
                    />
                  ) : (
                    <span>No case barcode on file</span>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="product-info-card">
            <div className="product-tags">
              {product.brand?.brand_name && (
                <Link to={makeBrandUrl(product)} className="product-tag">
                  {product.brand.brand_name}
                </Link>
              )}

              {product.category?.category_name && (
                <Link to={makeCategoryUrl(product)} className="product-tag category">
                  {product.category.category_name}
                </Link>
              )}
            </div>

            <h1 className="product-title">{product.description}</h1>

            <div className="product-price">{money(product.price)}</div>

            <div className="product-subtitle">Per case, ex warehouse</div>

            <div className="product-detail-table">
              <DetailRow label="Navsa Product Code" value={product.reference} />

              <DetailRow
                label="Brand"
                value={product.brand?.brand_name}
                linkTo={product.brand?.brand_name ? makeBrandUrl(product) : null}
              />

              <DetailRow label="Description" value={product.description} />
              <DetailRow label="Units per Case" value={unitsPerCase} />
              <DetailRow label="Unit Weight" value={`${Number(product.weight || 0).toFixed(3)} kg`} />
              <DetailRow label="Unit Volume" value={`${Number(product.volume || 0).toFixed(4)} m³`} />
              <DetailRow label="Best before date (indicative)" value={formatDate(product.bbd)} />
            </div>

            <div className="quantity-card">
              <div className="quantity-title">Quantity Options</div>

              <QtyRow
                label="Case"
                desc={`${unitsPerCase} Units per Case`}
                qty={0}
                disabled
              />

              <QtyRow
                label="Layer"
                desc={`${Number(product.layer_quantity || 0)} Cases per Layer`}
                qty={layerQty}
                onMinus={() => setLayerQty(q => Math.max(0, q - 1))}
                onPlus={() => setLayerQty(q => q + 1)}
                disabled={!product.layer_quantity}
              />

              <QtyRow
                label="Pallet"
                desc={`${Number(product.pallet_quantity || 0)} Cases per Pallet`}
                qty={palletQty}
                onMinus={() => setPalletQty(q => Math.max(0, q - 1))}
                onPlus={() => setPalletQty(q => q + 1)}
                disabled={!product.pallet_quantity}
              />

              <div className="total-strip">
                {totalCases} total cases
              </div>

              <div className="calculation-strip">
                <div>
                  Total Weight<br />
                  {selectedWeight.toFixed(3)} kg
                </div>

                <div>
                  Total CBM<br />
                  {selectedVolume.toFixed(6)} m³
                </div>
              </div>
            </div>

            {requiresReefer && (
              <div className="reefer-warning">
                <strong>{productStorageType} items require a Reefer container.</strong>
                <br />
                Dry containers can only be used for Ambient products.
                Please change your shipping option before adding this product.
                <br />
                <Link to="/#shipping-selector">Change shipping option</Link>
              </div>
            )}

            {frozenMixBlocked && (
              <div className="mix-warning">
                <strong>Frozen items cannot be mixed with Ambient or Chilled items.</strong>
                <br />
                Please remove the existing incompatible items from your basket before adding this product.
                <br />
                <Link to="/basket">Go to basket</Link>
              </div>
            )}

            <button
              type="button"
              disabled={addBlocked}
              onClick={handleAddToBasket}
              className={`product-action-btn ${justAdded ? 'added' : ''} ${addBlocked ? 'disabled' : ''}`}
            >
              {requiresReefer
                ? `${productStorageType} requires Reefer container`
                : frozenMixBlocked
                  ? 'Cannot mix Frozen with Ambient/Chilled'
                  : justAdded
                    ? '✓ Added to Basket'
                    : 'Add to Basket'}
            </button>

            <button
              type="button"
              onClick={handleWishlistToggle}
              className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
            >
              {isInWishlist(product.id) ? '♥ Remove from Wishlist' : '♥ Add to Wishlist'}
            </button>
          </div>
        </div>

        <div className="product-metrics">
          <div className="product-metric-card">
            <strong>Case Weight</strong>
            <span>{caseWeight.toFixed(3)} kg</span>
          </div>

          <div className="product-metric-card">
            <strong>CBM (per case)</strong>
            <span>{Number(product.volume || 0).toFixed(6)} m³</span>
          </div>

          <div className="product-metric-card">
            <strong>Language</strong>
            <span>English</span>
          </div>
        </div>

        <Link
          to={product.category ? makeCategoryUrl(product) : '/shop'}
          className="back-link"
        >
          ← Back to {product.category?.category_name || 'Shop'}
        </Link>
      </div>
    </div>
  )
}

function DetailRow({ label, value, linkTo }) {
  if (value === null || value === undefined || value === '') return null

  return (
    <div className="product-detail-row">
      <span>{label}</span>
      <span>
        {linkTo ? (
          <Link to={linkTo}>{value}</Link>
        ) : (
          value
        )}
      </span>
    </div>
  )
}

function QtyRow({ label, desc, qty, onMinus, onPlus, disabled = false }) {
  return (
    <div className={`qty-row ${disabled ? 'disabled' : ''}`}>
      <span className="qty-label">{label}</span>
      <span className="qty-desc">{desc}</span>

      <div className="qty-controls">
        <button type="button" disabled={disabled} onClick={onMinus}>-</button>
        <span>{qty}</span>
        <button type="button" disabled={disabled} onClick={onPlus}>+</button>
      </div>

      <span className="qty-x">x</span>
    </div>
  )
}
