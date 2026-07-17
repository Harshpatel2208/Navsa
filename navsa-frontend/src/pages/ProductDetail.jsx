import Barcode from 'react-barcode'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { colors, fonts } from '../theme'
import { useCart } from '../context/CartContext'
import { useShipping } from '../context/ShippingContext'
import {
  getContainers,
  getCountries,
  getPorts,
} from '../services/shippingService'
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
      value:
        digits.length < 12
          ? digits.padStart(12, '0')
          : digits,
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
      value:
        digits.length < 13
          ? digits.padStart(13, '0')
          : digits,
    }
  }

  return null
}

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

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

export default function ProductDetail() {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [layerQty, setLayerQty] = useState(0)
  const [palletQty, setPalletQty] = useState(0)
  const [barcodeTab, setBarcodeTab] = useState('ean')
  const [justAdded, setJustAdded] = useState(false)

  const [showShippingModal, setShowShippingModal] = useState(false)

  const [containers, setContainers] = useState([])
  const [countries, setCountries] = useState([])
  const [ports, setPorts] = useState([])

  const [containerId, setContainerId] = useState('')
  const [countryId, setCountryId] = useState('')
  const [portId, setPortId] = useState('')

  const [shippingLoading, setShippingLoading] = useState(false)
  const [shippingError, setShippingError] = useState('')

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
        setError(fetchError.message)
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

        setContainers(
          Array.isArray(containerData) ? containerData : []
        )

        setCountries(
          Array.isArray(countryData) ? countryData : []
        )
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

  const popupIsCollection =
    isCollectionContainer(selectedPopupContainer)

  useEffect(() => {
    async function loadCountryPorts() {
      setPorts([])
      setPortId('')

      if (!countryId || popupIsCollection) return

      try {
        const portData = await getPorts(countryId)

        setPorts(
          Array.isArray(portData) ? portData : []
        )
      } catch (loadError) {
        console.error(loadError)
        setShippingError(
          'Ports could not be loaded for this country.'
        )
      }
    }

    loadCountryPorts()
  }, [countryId, popupIsCollection])

  useEffect(() => {
    if (!showShippingModal) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [showShippingModal])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '18px',
        }}
      >
        <div
          className="navsa-spinner"
          style={{
            width: '32px',
            height: '32px',
            border: `3px solid ${colors.hairline}`,
            borderTopColor: '#293681',
            borderRadius: '50%',
          }}
        />

        <p
          style={{
            fontFamily: fonts.mono,
            color: colors.inkMuted,
            fontSize: '13px',
            letterSpacing: '0.5px',
          }}
        >
          LOADING PRODUCT…
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '40px' }}>
          📦
        </div>

        <p
          style={{
            fontFamily: fonts.body,
            color: '#B3261E',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          {error}
        </p>

        <Link
          to="/shop"
          style={{
            color: '#293681',
            fontWeight: 700,
            fontFamily: fonts.mono,
            fontSize: '13px',
          }}
        >
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
    Number(layerQty || 0) *
      Number(product.layer_quantity || 0) +
    Number(palletQty || 0) *
      Number(product.pallet_quantity || 0)

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

  const currentContainer = shipping?.container

  const currentContainerIsDry =
    String(currentContainer?.container_type || '')
      .toLowerCase() === 'dry'

  const requiresReefer =
    hasShipping &&
    !isCollection &&
    currentContainerIsDry &&
    (
      productStorageType === 'Frozen' ||
      productStorageType === 'Chilled'
    )

  const basketHasFrozen = basketItems.some(
    item => getStorageType(item) === 'Frozen'
  )

  const basketHasAmbientOrChilled = basketItems.some(item => {
    const type = getStorageType(item)

    return type === 'Ambient' || type === 'Chilled'
  })

  const frozenMixBlocked =
    (
      productStorageType === 'Frozen' &&
      basketHasAmbientOrChilled
    ) ||
    (
      (
        productStorageType === 'Ambient' ||
        productStorageType === 'Chilled'
      ) &&
      basketHasFrozen
    )

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

  function performAddToBasket() {
    if (totalCases <= 0) {
      alert(
        'Please select at least one Layer or Pallet before adding to basket.'
      )
      return false
    }

    if (frozenMixBlocked) {
      alert(
        'Frozen items cannot be mixed with Ambient or Chilled items in the same basket.'
      )
      return false
    }

    if (requiresReefer) {
      alert(
        `${productStorageType} items require a Reefer container. Please change your shipping option first.`
      )
      return false
    }

    const added = addToBasket(product, {
      layerQty,
      palletQty,
    })

    if (!added) {
      alert(
        'Please select at least one Layer or Pallet before adding to basket.'
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
    /*
     * Shipping is mandatory before adding.
     */
    if (!hasShipping) {
      setShowShippingModal(true)
      return
    }

    performAddToBasket()
  }

  function handleContainerChange(event) {
    setContainerId(event.target.value)
    setCountryId('')
    setPortId('')
    setPorts([])
    setShippingError('')
  }

  function saveShippingAndContinue() {
    if (!selectedPopupContainer) {
      alert('Please select a container or collection method.')
      return
    }

    if (
      !popupIsCollection &&
      (!selectedPopupCountry || !selectedPopupPort)
    ) {
      alert('Please select a country and destination port.')
      return
    }

    const selectedContainerIsDry =
      String(
        selectedPopupContainer.container_type || ''
      ).toLowerCase() === 'dry'

    if (
      !popupIsCollection &&
      selectedContainerIsDry &&
      (
        productStorageType === 'Frozen' ||
        productStorageType === 'Chilled'
      )
    ) {
      alert(
        `${productStorageType} items require a Reefer container. Please select a 20 ft Reefer or 40 ft Reefer container.`
      )
      return
    }

    if (frozenMixBlocked) {
      alert(
        'Frozen items cannot be mixed with Ambient or Chilled items in the same basket.'
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

    /*
     * On Product Detail, quantity is already selected on the page.
     * Therefore, add automatically after valid shipping is saved.
     */
    const added = addToBasket(product, {
      layerQty,
      palletQty,
    })

    if (!added) {
      alert(
        'Shipping option saved. Now select at least one Layer or Pallet and click Add to Basket.'
      )
      return
    }

    setLayerQty(0)
    setPalletQty(0)
    setJustAdded(true)

    window.setTimeout(() => {
      setJustAdded(false)
    }, 2200)
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
          {' › '}
          <Link to="/shop">Shop</Link>

          {product.category?.category_name && (
            <>
              {' › '}
              <Link to={makeCategoryUrl(product)}>
                {product.category.category_name}
              </Link>
            </>
          )}

          {' › '}
          {product.description}
        </div>

        <div className="product-grid">
          <div>
            <div className="product-image-card">
              {product.web_image ? (
                <img
                  src={`/products/${product.web_image}`}
                  alt={product.description}
                />
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#9ca3af',
                    fontWeight: 900,
                  }}
                >
                  <div
                    style={{
                      fontSize: '46px',
                      marginBottom: '12px',
                    }}
                  >
                    📦
                  </div>

                  NO IMAGE ON FILE
                </div>
              )}
            </div>

            <div className="product-barcode-card">
              <div className="barcode-title">
                Barcode
              </div>

              <div className="barcode-tabs">
                <button
                  type="button"
                  className={
                    barcodeTab === 'ean' ? 'active' : ''
                  }
                  onClick={() => setBarcodeTab('ean')}
                >
                  EAN
                </button>

                {caseBarcode && (
                  <button
                    type="button"
                    className={
                      barcodeTab === 'case' ? 'active' : ''
                    }
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

            <h1 className="product-title">
              {product.description}
            </h1>

            <div className="product-price">
              {money(product.price)}
            </div>

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
                label="Storage Type"
                value={productStorageType}
              />

              <DetailRow
                label="Units per Case"
                value={unitsPerCase}
              />

              <DetailRow
                label="Unit Weight"
                value={`${Number(
                  product.weight || 0
                ).toFixed(3)} kg`}
              />

              <DetailRow
                label="Unit Volume"
                value={`${Number(
                  product.volume || 0
                ).toFixed(6)} m³`}
              />

              <DetailRow
                label="Best before date (indicative)"
                value={formatDate(product.bbd)}
              />
            </div>

            <div className="quantity-card">
              <div className="quantity-title">
                Quantity Options
              </div>

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
                  setLayerQty(current =>
                    Math.max(0, current - 1)
                  )
                }
                onPlus={() =>
                  setLayerQty(current => current + 1)
                }
                disabled={
                  Number(product.layer_quantity || 0) <= 0
                }
              />

              <QtyRow
                label="Pallet"
                desc={`${Number(
                  product.pallet_quantity || 0
                )} Cases per Pallet`}
                qty={palletQty}
                onMinus={() =>
                  setPalletQty(current =>
                    Math.max(0, current - 1)
                  )
                }
                onPlus={() =>
                  setPalletQty(current => current + 1)
                }
                disabled={
                  Number(product.pallet_quantity || 0) <= 0
                }
              />

              <div className="total-strip">
                {totalCases} total cases
                {' · '}
                {money(
                  totalCases *
                  Number(product.price || 0)
                )}
              </div>

              <div className="calculation-strip">
                <div>
                  Total Weight
                  <br />
                  {selectedWeight.toFixed(3)} kg
                </div>

                <div>
                  Total CBM
                  <br />
                  {selectedVolume.toFixed(6)} m³
                </div>
              </div>
            </div>

            {!hasShipping && (
              <div className="shipping-required-notice">
                <strong>
                  Shipping selection is required.
                </strong>

                Choose a container or Collection / Ex Works,
                country and destination port before this product
                can be added to the basket.
              </div>
            )}

            {requiresReefer && (
              <div className="reefer-warning">
                <strong>
                  {productStorageType} items require a Reefer
                  container.
                </strong>

                <br />

                Dry containers can only be used for Ambient
                products.

                <br />

                <Link to="/#shipping-selector">
                  Change shipping option
                </Link>
              </div>
            )}

            {frozenMixBlocked && (
              <div className="mix-warning">
                <strong>
                  Frozen items cannot be mixed with Ambient or
                  Chilled items.
                </strong>

                <br />

                Remove the incompatible products from your basket
                before continuing.

                <br />

                <Link to="/basket">
                  Go to basket
                </Link>
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

        <div className="product-metrics">
          <div className="product-metric-card">
            <strong>Case Weight</strong>
            <span>{caseWeight.toFixed(3)} kg</span>
          </div>

          <div className="product-metric-card">
            <strong>CBM (per case)</strong>
            <span>
              {Number(product.volume || 0).toFixed(6)} m³
            </span>
          </div>

          <div className="product-metric-card">
            <strong>Language</strong>
            <span>English</span>
          </div>
        </div>

        <Link
          to={
            product.category
              ? makeCategoryUrl(product)
              : '/shop'
          }
          className="back-link"
        >
          ← Back to{' '}
          {product.category?.category_name || 'Shop'}
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
              Shipping preferences must be selected before
              products can be added to the basket.
            </p>

            <div className="pd-shipping-note">
              <strong>Important:</strong> Frozen and chilled
              products require a Reefer container. Frozen products
              cannot be mixed with Ambient or Chilled products in
              the same order.
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
                        <label htmlFor="pd-country">
                          Country
                        </label>

                        <select
                          id="pd-country"
                          value={countryId}
                          onChange={event => {
                            setCountryId(event.target.value)
                            setShippingError('')
                          }}
                        >
                          <option value="">
                            Select country...
                          </option>

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

                {selectedPopupContainer &&
                  popupIsCollection && (
                    <div className="pd-container-info">
                      <strong>
                        Collection / Ex Works selected.
                      </strong>

                      {' '}
                      You will arrange collection. No container
                      capacity checks apply. Minimum order £5,000.
                    </div>
                  )}

                {selectedPopupContainer &&
                  !popupIsCollection && (
                    <div className="pd-container-info">
                      <strong>
                        {selectedPopupContainer.container_name}
                      </strong>

                      {' · '}
                      Volume{' '}
                      {Number(
                        selectedPopupContainer.volume_m3 || 0
                      ).toLocaleString()} m³

                      {' · '}
                      Payload{' '}
                      {Number(
                        selectedPopupContainer.payload_weight_kg ||
                        0
                      ).toLocaleString()} kg
                    </div>
                  )}

                <button
                  type="button"
                  className="pd-start-order"
                  onClick={saveShippingAndContinue}
                  disabled={
                    !selectedPopupContainer ||
                    (
                      !popupIsCollection &&
                      (
                        !selectedPopupCountry ||
                        !selectedPopupPort
                      )
                    )
                  }
                >
                  Start Order →
                </button>
              </>
            )}
          </section>
        </div>
      )}
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
          <Link to={linkTo}>
            {value}
          </Link>
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
      <span className="qty-label">
        {label}
      </span>

      <span className="qty-desc">
        {desc}
      </span>

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

      <span className="qty-x">
        ×
      </span>
    </div>
  )
}