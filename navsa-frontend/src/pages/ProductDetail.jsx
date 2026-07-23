import Barcode from 'react-barcode'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useShipping } from '../context/ShippingContext'
import { useCurrency } from '../utils/currency'
import {
  getContainers,
  getCountries,
  getPorts,
} from '../services/shippingService'
import NoticeModal from '../components/NoticeModal'
import './ProductDetail.css'


function normalizeEan(raw) {
  const digits = String(raw || '').replace(/\D/g, '')

  if (!digits) return null

  if (digits.length === 7 || digits.length === 8) {
    return {
      value: digits,
      format: 'EAN8',
    }
  }

  if (digits.length >= 9 && digits.length <= 13) {
    return {
      value: digits.length < 12 ? digits.padStart(12, '0') : digits,
      format: 'EAN13',
    }
  }

  return null
}

function normalizeCase(raw) {
  const digits = String(raw || '').replace(/\D/g, '')

  if (!digits) return null

  if (digits.length >= 8 && digits.length <= 14) {
    return {
      value: digits.length < 13 ? digits.padStart(13, '0') : digits,
    }
  }

  return null
}

function makeBrandUrl(product) {
  const brandName = product?.brand?.brand_name
  return brandName ? `/shop?brand=${encodeURIComponent(brandName)}` : '/shop'
}

function makeCategoryUrl(product) {
  const categoryName = product?.category?.category_name
  return categoryName
    ? `/shop?category=${encodeURIComponent(categoryName)}`
    : '/shop'
}

function getStorageType(product) {
  const type = String(product?.storage_type || 'Ambient')
    .trim()
    .toLowerCase()

  if (type === 'frozen') return 'Frozen'
  if (type === 'chilled') return 'Chilled'

  return 'Ambient'
}

function isCollectionContainer(container) {
  return Boolean(
    container?.container_name
      ?.toLowerCase()
      .includes('collection / ex works')
  )
}

function calculateIndicativeBbd(shelfLifeDays) {
  const days = Number(shelfLifeDays || 0)

  if (!Number.isFinite(days) || days <= 0) {
    return 'Not available'
  }

  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + days)

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ProductDetail() {
  const { id } = useParams()
  const { formatPrice: money } = useCurrency()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [layerQty, setLayerQty] = useState(0)
  const [palletQty, setPalletQty] = useState(0)
  const [barcodeTab, setBarcodeTab] = useState('ean')
  const [justAdded, setJustAdded] = useState(false)

  const [showShippingModal, setShowShippingModal] = useState(false)
  const [showImagePreview, setShowImagePreview] = useState(false)

  const [containers, setContainers] = useState([])
  const [countries, setCountries] = useState([])
  const [ports, setPorts] = useState([])

  const [containerId, setContainerId] = useState('')
  const [countryId, setCountryId] = useState('')
  const [portId, setPortId] = useState('')

  const [shippingLoading, setShippingLoading] = useState(false)
  const [shippingError, setShippingError] = useState('')

  const [notice, setNotice] = useState({
    open: false,
    title: '',
    message: '',
    type: 'warning',
  })

  const {
    basketItems,
    addToBasket,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useCart()

  const {
    shipping,
    hasShipping,
    isCollection,
    setShippingOption,
  } = useShipping()

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(`/api/products/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Product not found')
        }

        return response.json()
      })
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch(fetchError => {
        setError(fetchError.message || 'Unable to load product')
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (!showShippingModal) return

    async function loadShippingData() {
      setShippingLoading(true)
      setShippingError('')

      try {
        const [containerData, countryData] = await Promise.all([
          getContainers(),
          getCountries(),
        ])

        setContainers(Array.isArray(containerData) ? containerData : [])
        setCountries(Array.isArray(countryData) ? countryData : [])
      } catch (loadError) {
        console.error(loadError)
        setShippingError(
          'Shipping options could not be loaded. Please try again.'
        )
      } finally {
        setShippingLoading(false)
      }
    }

    loadShippingData()
  }, [showShippingModal])

  const selectedPopupContainer = containers.find(
    container => String(container.id) === String(containerId)
  )

  const selectedPopupCountry = countries.find(
    country => String(country.id) === String(countryId)
  )

  const selectedPopupPort = ports.find(
    port => String(port.id) === String(portId)
  )

  const popupIsCollection = isCollectionContainer(selectedPopupContainer)

  useEffect(() => {
    async function loadCountryPorts() {
      setPorts([])
      setPortId('')

      if (!countryId || popupIsCollection) return

      try {
        const portData = await getPorts(countryId)
        setPorts(Array.isArray(portData) ? portData : [])
      } catch (loadError) {
        console.error(loadError)
        setShippingError('Ports could not be loaded for this country.')
      }
    }

    loadCountryPorts()
  }, [countryId, popupIsCollection])

  useEffect(() => {
    const shouldLock =
      showShippingModal ||
      showImagePreview ||
      notice.open

    document.body.style.overflow = shouldLock ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [showShippingModal, showImagePreview, notice.open])

  function showNotice(title, message, type = 'warning') {
    setNotice({
      open: true,
      title,
      message,
      type,
    })
  }

  function closeNotice() {
    setNotice(current => ({
      ...current,
      open: false,
    }))
  }

  if (loading) {
    return (
      <div className="pd-state">
        <div className="pd-spinner" />
        <p>LOADING PRODUCT…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pd-state pd-state-error">
        <div className="pd-state-icon">📦</div>
        <p>{error}</p>

        <Link to="/shop" className="pd-state-link">
          ← BACK TO SHOP
        </Link>
      </div>
    )
  }

  if (!product) return null

  const eanBarcode = normalizeEan(product.barcode_ean)
  const caseBarcode = normalizeCase(product.barcode_case)

  const unitsPerCase = Number(
    product.units_of ||
      product.inner_case_quantity ||
      product.case_size ||
      1
  )

  const totalCases =
    Number(layerQty || 0) * Number(product.layer_quantity || 0) +
    Number(palletQty || 0) * Number(product.pallet_quantity || 0)

  const selectedWeight =
    Number(product.weight || 0) *
    unitsPerCase *
    totalCases

  const selectedVolume =
    Number(product.volume || 0) *
    totalCases

  const caseWeight =
    Number(product.weight || 0) *
    unitsPerCase

  const productStorageType = getStorageType(product)
  const productImage = product.web_image
    ? `/products/${product.web_image}`
    : ''

  const currentContainer = shipping?.container

  const currentContainerIsDry =
    String(currentContainer?.container_type || '').toLowerCase() === 'dry'

  const requiresReefer =
    hasShipping &&
    !isCollection &&
    currentContainerIsDry &&
    (productStorageType === 'Frozen' ||
      productStorageType === 'Chilled')

  const basketHasFrozen = basketItems.some(
    item => getStorageType(item) === 'Frozen'
  )

  const basketHasAmbientOrChilled = basketItems.some(item => {
    const type = getStorageType(item)
    return type === 'Ambient' || type === 'Chilled'
  })

  const frozenMixBlocked =
    (productStorageType === 'Frozen' && basketHasAmbientOrChilled) ||
    ((productStorageType === 'Ambient' ||
      productStorageType === 'Chilled') &&
      basketHasFrozen)

  function resetShippingForm() {
    setContainerId('')
    setCountryId('')
    setPortId('')
    setPorts([])
    setShippingError('')
  }

  function closeShippingModal() {
    setShowShippingModal(false)
    resetShippingForm()
  }

  function handleContainerChange(event) {
    setContainerId(event.target.value)
    setCountryId('')
    setPortId('')
    setPorts([])
    setShippingError('')
  }

  function performAddToBasket() {
    if (totalCases <= 0) {
      showNotice(
        'Select Quantity',
        'Please select at least one Layer or Pallet before adding this product to the basket.',
        'warning'
      )
      return false
    }

    if (frozenMixBlocked) {
      showNotice(
        'Products Cannot Be Mixed',
        'Frozen items cannot be mixed with Ambient or Chilled items in the same basket.',
        'error'
      )
      return false
    }

    if (requiresReefer) {
      showNotice(
        'Reefer Container Required',
        `${productStorageType} items require a Reefer container. Please change your shipping option first.`,
        'warning'
      )
      return false
    }

    const added = addToBasket(product, {
      layerQty,
      palletQty,
    })

    if (!added) {
      showNotice(
        'Unable to Add Product',
        'Please select at least one Layer or Pallet.',
        'error'
      )
      return false
    }

    setLayerQty(0)
    setPalletQty(0)
    setJustAdded(true)

    window.setTimeout(() => {
      setJustAdded(false)
    }, 2200)

    return true
  }

  function handleAddToBasket() {
    if (!hasShipping) {
      setShowShippingModal(true)
      return
    }

    performAddToBasket()
  }

  function saveShippingAndContinue() {
    if (!selectedPopupContainer) {
      showNotice(
        'Select a Shipping Method',
        'Please select a container or Collection / Ex Works method.',
        'warning'
      )
      return
    }

    if (
      !popupIsCollection &&
      (!selectedPopupCountry || !selectedPopupPort)
    ) {
      showNotice(
        'Destination Required',
        'Please select both the delivery country and destination port.',
        'warning'
      )
      return
    }

    const selectedContainerIsDry =
      String(
        selectedPopupContainer.container_type || ''
      ).toLowerCase() === 'dry'

    if (
      !popupIsCollection &&
      selectedContainerIsDry &&
      (productStorageType === 'Frozen' ||
        productStorageType === 'Chilled')
    ) {
      showNotice(
        'Reefer Container Required',
        `${productStorageType} products cannot be transported in a Dry container. Please select a Reefer container.`,
        'warning'
      )
      return
    }

    if (frozenMixBlocked) {
      showNotice(
        'Products Cannot Be Mixed',
        'Frozen items cannot be mixed with Ambient or Chilled items in the same basket.',
        'error'
      )
      return
    }

    setShippingOption({
      container: selectedPopupContainer,

      country: popupIsCollection
        ? {
            id: null,
            country_name: 'Collection / Ex Works',
            zone_id: null,
          }
        : selectedPopupCountry,

      port: popupIsCollection
        ? {
            id: null,
            port_name: 'Warehouse Collection',
          }
        : selectedPopupPort,
    })

    setShowShippingModal(false)
    resetShippingForm()

    if (totalCases <= 0) {
      showNotice(
        'Shipping Option Saved',
        'Shipping has been saved. Now select at least one Layer or Pallet and click Add to Basket.',
        'success'
      )
      return
    }

    performAddToBasket()
  }

  function handleWishlistToggle() {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="product-page-wrap">

      <div className="product-main navsa-fade">
        <div className="product-breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/shop">Shop</Link>

          {product.category?.category_name && (
            <>
              <span>›</span>
              <Link to={makeCategoryUrl(product)}>
                {product.category.category_name}
              </Link>
            </>
          )}

          <span>›</span>
          <span>{product.description}</span>
        </div>

        <div className="product-grid">
          <div className="product-left-column">
            <div className="product-image-card">
              <button
                type="button"
                className={`product-image-wishlist ${
                  isInWishlist(product.id) ? 'active' : ''
                }`}
                onClick={handleWishlistToggle}
                aria-label={
                  isInWishlist(product.id)
                    ? 'Remove from wishlist'
                    : 'Add to wishlist'
                }
                title={
                  isInWishlist(product.id)
                    ? 'Remove from wishlist'
                    : 'Add to wishlist'
                }
              >
                {isInWishlist(product.id) ? '♥' : '♡'}
              </button>

              <button
                type="button"
                className="product-image-button"
                onClick={() => {
                  if (productImage) {
                    setShowImagePreview(true)
                  }
                }}
                aria-label="View larger product image"
              >
                {productImage ? (
                  <img
                    src={productImage}
                    alt={product.description}
                    className="product-main-image"
                  />
                ) : (
                  <div className="product-no-image">
                    <span>📦</span>
                    <strong>NO IMAGE ON FILE</strong>
                  </div>
                )}
              </button>

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

              <div
                className="barcode-panel"
                key={barcodeTab}
              >
                <div className="barcode-number">
                  <strong>
                    {barcodeTab === 'ean' ? 'EAN:' : 'Case ITF-14:'}
                  </strong>
                  <span>
                    {barcodeTab === 'ean'
                      ? String(product.barcode_ean || '').replace(/\D/g, '') || 'Not available'
                      : String(product.barcode_case || '').replace(/\D/g, '') || 'Not available'}
                  </span>
                </div>

                <div className="barcode-box">
                  {barcodeTab === 'ean' &&
                    (eanBarcode ? (
                      <Barcode
                        value={eanBarcode.value}
                        format={eanBarcode.format}
                        width={2}
                        height={70}
                        fontSize={14}
                        margin={8}
                        displayValue={false}
                      />
                    ) : (
                      <span>No EAN on file</span>
                    ))}

                  {barcodeTab === 'case' &&
                    (caseBarcode ? (
                      <Barcode
                        value={caseBarcode.value}
                        format="ITF14"
                        width={2}
                        height={70}
                        fontSize={14}
                        margin={8}
                        displayValue={false}
                      />
                    ) : (
                      <span>No case barcode on file</span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="product-info-card">
            <div className="product-info-topline">
              <div className="product-tags">
                {product.brand?.brand_name && (
                  <Link
                    to={makeBrandUrl(product)}
                    className="product-tag"
                  >
                    {product.brand.brand_name}
                  </Link>
                )}

                {product.category?.category_name && (
                  <Link
                    to={makeCategoryUrl(product)}
                    className="product-tag category"
                  >
                    {product.category.category_name}
                  </Link>
                )}
              </div>

              <span
                className={`product-storage-badge product-storage-${productStorageType.toLowerCase()}`}
                aria-label={`Storage type: ${productStorageType}`}
              >
                {productStorageType}
              </span>
            </div>

            <h1 className="product-title">{product.description}</h1>

            <div className="product-price">{money(product.price)}</div>

            <div className="product-subtitle">
              Per case, ex warehouse
            </div>

            <div className="product-detail-table">
              <DetailRow
                label="Navsa Product Code"
                value={product.reference}
              />

              <DetailRow
                label="Brand"
                value={product.brand?.brand_name}
                linkTo={
                  product.brand?.brand_name
                    ? makeBrandUrl(product)
                    : null
                }
              />

              <DetailRow
                label="Description"
                value={product.description}
              />

              <DetailRow
                label="Units per Case"
                value={unitsPerCase}
              />

              <DetailRow
                label="Unit Weight"
                value={`${Number(product.weight || 0).toFixed(3)} kg`}
              />

              <DetailRow
                label="Unit Volume"
                value={`${Number(product.volume || 0).toFixed(6)} m³`}
              />

              <DetailRow
                label="Best Before Date (Indicative)"
                value={calculateIndicativeBbd(product.shelf_life)}
              />
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
                desc={`${Number(
                  product.layer_quantity || 0
                )} Cases per Layer`}
                qty={layerQty}
                onMinus={() =>
                  setLayerQty(current => Math.max(0, current - 1))
                }
                onPlus={() =>
                  setLayerQty(current => current + 1)
                }
                disabled={Number(product.layer_quantity || 0) <= 0}
              />

              <QtyRow
                label="Pallet"
                desc={`${Number(
                  product.pallet_quantity || 0
                )} Cases per Pallet`}
                qty={palletQty}
                onMinus={() =>
                  setPalletQty(current => Math.max(0, current - 1))
                }
                onPlus={() =>
                  setPalletQty(current => current + 1)
                }
                disabled={Number(product.pallet_quantity || 0) <= 0}
              />

              <div className="total-strip">
                <span>
                  <strong>{totalCases}</strong> total cases
                </span>

                <span>
                  <strong>
                    {money(
                      totalCases * Number(product.price || 0)
                    )}
                  </strong>
                </span>
              </div>

              <div className="calculation-strip">
                <div>
                  <span>Total Weight</span>
                  <strong>{selectedWeight.toFixed(3)} kg</strong>
                </div>

                <div>
                  <span>Total CBM</span>
                  <strong>{selectedVolume.toFixed(6)} m³</strong>
                </div>
              </div>
            </div>

            {!hasShipping && (
              <div className="shipping-required-notice">
                <strong>Shipping selection is required.</strong>
                <span>
                  Choose a container or Collection / Ex Works,
                  country and destination port before this product
                  can be added to the basket.
                </span>
              </div>
            )}

            {requiresReefer && (
              <div className="reefer-warning">
                <strong>
                  {productStorageType} items require a Reefer container.
                </strong>
                <span>
                  Dry containers can only be used for Ambient products.
                </span>
                <Link to="/#shipping-selector">
                  Change shipping option
                </Link>
              </div>
            )}

            {frozenMixBlocked && (
              <div className="mix-warning">
                <strong>
                  Frozen items cannot be mixed with Ambient or Chilled items.
                </strong>
                <span>
                  Remove the incompatible products from your basket before continuing.
                </span>
                <Link to="/basket">Go to basket</Link>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddToBasket}
              disabled={
                hasShipping &&
                (requiresReefer || frozenMixBlocked)
              }
              className={`product-action-btn ${
                justAdded ? 'added' : ''
              } ${
                hasShipping &&
                (requiresReefer || frozenMixBlocked)
                  ? 'disabled'
                  : ''
              }`}
            >
              {!hasShipping
                ? 'Choose Shipping & Add to Basket'
                : requiresReefer
                  ? `${productStorageType} requires Reefer`
                  : frozenMixBlocked
                    ? 'Cannot Mix Frozen with Ambient/Chilled'
                    : justAdded
                      ? '✓ Added to Basket'
                      : totalCases > 0
                        ? `Add ${totalCases} Cases to Basket`
                        : 'Select Quantity'}
            </button>

            <button
              type="button"
              onClick={handleWishlistToggle}
              className={`wishlist-btn ${
                isInWishlist(product.id) ? 'active' : ''
              }`}
            >
              {isInWishlist(product.id)
                ? '♥ Remove from Wishlist'
                : '♡ Add to Wishlist'}
            </button>
          </div>
        </div>

        <section
          className="product-metrics"
          aria-label="Additional product information"
        >
          <div className="product-metric-card">
            <span className="product-metric-icon" aria-hidden="true">⚖</span>
            <div>
              <strong>Case Weight</strong>
              <span>{caseWeight.toFixed(3)} kg</span>
            </div>
          </div>

          <div className="product-metric-card">
            <span className="product-metric-icon" aria-hidden="true">◎</span>
            <div>
              <strong>Tariff Code</strong>
              <span>{product.comm_code || 'Not available'}</span>
            </div>
          </div>

          <div className="product-metric-card">
            <span className="product-metric-icon" aria-hidden="true">◇</span>
            <div>
              <strong>CBM (per case)</strong>
              <span>
                {Number(product.volume || 0).toFixed(6)} m³
              </span>
            </div>
          </div>

          <div className="product-metric-card product-metric-card-wide">
            <span className="product-metric-icon" aria-hidden="true">⌖</span>
            <div>
              <strong>Country of Origin</strong>
              <span>{product.intra_country || 'Not available'}</span>
            </div>
          </div>

          <div className="product-metric-card product-metric-card-wide">
            <span className="product-metric-icon" aria-hidden="true">◎</span>
            <div>
              <strong>Language</strong>
              <span>English</span>
            </div>
          </div>
        </section>

        <Link
          to={
            product.category
              ? makeCategoryUrl(product)
              : '/shop'
          }
          className="back-link"
        >
          ← Back to {product.category?.category_name || 'Shop'}
        </Link>
      </div>

      {showShippingModal && (
        <div
          className="pd-modal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              closeShippingModal()
            }
          }}
        >
          <section
            className="pd-shipping-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pd-shipping-heading"
          >
            <button
              type="button"
              className="pd-modal-close"
              onClick={closeShippingModal}
              aria-label="Close shipping options"
            >
              ×
            </button>

            <h2 id="pd-shipping-heading">
              Choose Your Shipping Option
            </h2>

            <p>
              Shipping preferences must be selected before products can be
              added to the basket.
            </p>

            <div className="pd-shipping-note">
              <strong>Important:</strong> Frozen and chilled products require
              a Reefer container. Frozen products cannot be mixed with Ambient
              or Chilled products in the same order.
            </div>

            {shippingError && (
              <div className="pd-shipping-error">
                {shippingError}
              </div>
            )}

            {shippingLoading ? (
              <div className="pd-shipping-loading">
                Loading shipping options…
              </div>
            ) : (
              <>
                <div
                  className={`pd-shipping-grid ${
                    popupIsCollection ? 'collection' : ''
                  }`}
                >
                  <div className="pd-shipping-field">
                    <label htmlFor="pd-container">
                      Container / Method
                    </label>

                    <select
                      id="pd-container"
                      value={containerId}
                      onChange={handleContainerChange}
                    >
                      <option value="">
                        Select container or collection...
                      </option>

                      {containers.map(container => (
                        <option
                          key={container.id}
                          value={container.id}
                        >
                          {container.container_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {!popupIsCollection && (
                    <>
                      <div className="pd-shipping-field">
                        <label htmlFor="pd-country">Country</label>

                        <select
                          id="pd-country"
                          value={countryId}
                          onChange={event => {
                            setCountryId(event.target.value)
                            setShippingError('')
                          }}
                        >
                          <option value="">Select country...</option>

                          {countries.map(country => (
                            <option
                              key={country.id}
                              value={country.id}
                            >
                              {country.country_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="pd-shipping-field">
                        <label htmlFor="pd-port">
                          Destination Port
                        </label>

                        <select
                          id="pd-port"
                          value={portId}
                          onChange={event =>
                            setPortId(event.target.value)
                          }
                          disabled={!countryId}
                        >
                          <option value="">
                            {countryId
                              ? 'Select port...'
                              : 'Select country first'}
                          </option>

                          {ports.map(port => (
                            <option
                              key={port.id}
                              value={port.id}
                            >
                              {port.port_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>

                {selectedPopupContainer && popupIsCollection && (
                  <div className="pd-container-info">
                    <strong>Collection / Ex Works selected.</strong>{' '}
                    You will arrange collection. No container capacity checks
                    apply. Minimum order £5,000.
                  </div>
                )}

                {selectedPopupContainer && !popupIsCollection && (
                  <div className="pd-container-info">
                    <strong>
                      {selectedPopupContainer.container_name}
                    </strong>
                    {' · '}
                    Volume{' '}
                    {Number(
                      selectedPopupContainer.volume_m3 || 0
                    ).toLocaleString()}{' '}
                    m³
                    {' · '}
                    Payload{' '}
                    {Number(
                      selectedPopupContainer.payload_weight_kg || 0
                    ).toLocaleString()}{' '}
                    kg
                  </div>
                )}

                <button
                  type="button"
                  className="pd-start-order"
                  onClick={saveShippingAndContinue}
                  disabled={
                    !selectedPopupContainer ||
                    (!popupIsCollection &&
                      (!selectedPopupCountry ||
                        !selectedPopupPort))
                  }
                >
                  Start Order →
                </button>
              </>
            )}
          </section>
        </div>
      )}

      {showImagePreview && productImage && (
        <div
          className="product-image-preview-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setShowImagePreview(false)
            }
          }}
        >
          <section
            className="product-image-preview"
            role="dialog"
            aria-modal="true"
            aria-label="Large product image"
          >
            <button
              type="button"
              className="product-image-preview-close"
              onClick={() => setShowImagePreview(false)}
              aria-label="Close image preview"
            >
              ×
            </button>

            <img
              src={productImage}
              alt={product.description}
            />
          </section>
        </div>
      )}

      <NoticeModal
        open={notice.open}
        title={notice.title}
        message={notice.message}
        type={notice.type}
        onClose={closeNotice}
      />
    </div>
  )
}

function DetailRow({ label, value, linkTo }) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null
  }

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

function QtyRow({
  label,
  desc,
  qty,
  onMinus,
  onPlus,
  disabled = false,
}) {
  return (
    <div className={`qty-row ${disabled ? 'disabled' : ''}`}>
      <div className="qty-copy">
        <span className="qty-label">{label}</span>
        <span className="qty-desc">{desc}</span>
      </div>

      <div className="qty-controls">
        <button
          type="button"
          disabled={disabled || qty <= 0}
          onClick={onMinus}
        >
          −
        </button>

        <span>{qty}</span>

        <button
          type="button"
          disabled={disabled}
          onClick={onPlus}
        >
          +
        </button>
      </div>

      <span className="qty-x">×</span>
    </div>
  )
}