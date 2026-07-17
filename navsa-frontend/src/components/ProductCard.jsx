import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useShipping } from '../context/ShippingContext'
import {
  getContainers,
  getCountries,
  getPorts,
} from '../services/shippingService'
import './ProductCard.css'
import NoticeModal from './NoticeModal'
import './ProductCard.css'
import './ProductCardFinal.css'

function money(value) {
  return `£${Number(value || 0).toFixed(2)}`
}

function getImage(product) {
  return product?.web_image ? `/products/${product.web_image}` : ''
}

function getStorageType(product) {
  const type = String(product?.storage_type || 'Ambient')
    .trim()
    .toLowerCase()

  if (type === 'frozen') return 'Frozen'
  if (type === 'chilled') return 'Chilled'

  return 'Ambient'
}

function unitsPerCase(product) {
  return Number(
    product?.units_of ||
      product?.inner_case_quantity ||
      product?.case_size ||
      1
  )
}

function isCollectionContainer(container) {
  return Boolean(
    container?.container_name
      ?.toLowerCase()
      .includes('collection / ex works')
  )
}

function ProductCard({ product, badge }) {
  const navigate = useNavigate()

  const {
    addToBasket,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    basketItems,
  } = useCart()

  const {
    shipping,
    hasShipping,
    isCollection,
    setShippingOption,
  } = useShipping()

  const [showShippingModal, setShowShippingModal] = useState(false)
  const [showQtyModal, setShowQtyModal] = useState(false)

  const [containers, setContainers] = useState([])
  const [countries, setCountries] = useState([])
  const [ports, setPorts] = useState([])

  const [containerId, setContainerId] = useState('')
  const [countryId, setCountryId] = useState('')
  const [portId, setPortId] = useState('')

  const [shippingLoading, setShippingLoading] = useState(false)
  const [shippingError, setShippingError] = useState('')

  const [layerQty, setLayerQty] = useState(0)
  const [palletQty, setPalletQty] = useState(0)
  const [addedMessage, setAddedMessage] = useState(false)

  const [notice, setNotice] = useState({
    open: false,
    title: '',
    message: '',
    type: 'warning',
  })

  const selectedContainer = containers.find(
    container => String(container.id) === String(containerId)
  )

  const selectedCountry = countries.find(
    country => String(country.id) === String(countryId)
  )

  const selectedPort = ports.find(
    port => String(port.id) === String(portId)
  )

  const popupIsCollection = isCollectionContainer(selectedContainer)
  const productStorageType = getStorageType(product)

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

  const activeContainer = shipping?.container

  const activeContainerIsDry =
    String(activeContainer?.container_type || '').toLowerCase() === 'dry'

  const dryContainerBlocked =
    hasShipping &&
    !isCollection &&
    activeContainerIsDry &&
    (productStorageType === 'Frozen' ||
      productStorageType === 'Chilled')

  const totalCases =
    Number(layerQty || 0) *
      Number(product.layer_quantity || 0) +
    Number(palletQty || 0) *
      Number(product.pallet_quantity || 0)

  const totalWeight =
    Number(product.weight || 0) *
    unitsPerCase(product) *
    totalCases

  const totalVolume =
    Number(product.volume || 0) *
    totalCases

  const totalPrice =
    Number(product.price || 0) *
    totalCases

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
          Array.isArray(containerData)
            ? containerData
            : []
        )

        setCountries(
          Array.isArray(countryData)
            ? countryData
            : []
        )
      } catch (error) {
        console.error(error)

        setShippingError(
          'Shipping options could not be loaded. Please try again.'
        )
      } finally {
        setShippingLoading(false)
      }
    }

    loadShippingData()
  }, [showShippingModal])

  useEffect(() => {
    async function loadCountryPorts() {
      setPorts([])
      setPortId('')

      if (!countryId || popupIsCollection) return

      try {
        const portData = await getPorts(countryId)

        setPorts(
          Array.isArray(portData)
            ? portData
            : []
        )
      } catch (error) {
        console.error(error)

        setShippingError(
          'Ports could not be loaded for the selected country.'
        )
      }
    }

    loadCountryPorts()
  }, [countryId, popupIsCollection])

  useEffect(() => {
    if (!showShippingModal && !showQtyModal) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [showShippingModal, showQtyModal])

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

  function closeQtyModal() {
    setShowQtyModal(false)
    setLayerQty(0)
    setPalletQty(0)
  }

  function openProduct(event) {
    event?.stopPropagation()
    setShowQtyModal(false)
    navigate(`/product/${product.id}`)
  }

  function handleWishlist(event) {
    event.stopPropagation()

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  function handleAddClick(event) {
    event.stopPropagation()

    if (!hasShipping) {
      setShowShippingModal(true)
      return
    }

    if (frozenMixBlocked) {
      showNotice(
        'Products Cannot Be Mixed',
        'Frozen items cannot be mixed with Ambient or Chilled items in the same basket. Please remove the incompatible items before continuing.',
        'error'
      )
      return
    }

    if (dryContainerBlocked) {
      showNotice(
        'Reefer Container Required',
        `${productStorageType} items cannot be added to a Dry container. Please change your shipping option to a Reefer container before adding this product.`,
        'warning'
      )
      return
    }

    setShowQtyModal(true)
  }

  function handleContainerChange(event) {
    setContainerId(event.target.value)
    setCountryId('')
    setPortId('')
    setPorts([])
    setShippingError('')
  }

  function saveShipping() {
    if (!selectedContainer) {
      showNotice(
        'Select a Shipping Method',
        'Please select a container or Collection / Ex Works method.',
        'warning'
      )
      return
    }

    if (
      !popupIsCollection &&
      (!selectedCountry || !selectedPort)
    ) {
      showNotice(
        'Destination Required',
        'Please select both the delivery country and destination port.',
        'warning'
      )
      return
    }

    const chosenContainerIsDry =
      String(
        selectedContainer.container_type || ''
      ).toLowerCase() === 'dry'

    if (
      !popupIsCollection &&
      chosenContainerIsDry &&
      (productStorageType === 'Frozen' ||
        productStorageType === 'Chilled')
    ) {
      showNotice(
        'Reefer Container Required',
        `${productStorageType} products cannot be transported in a Dry container. Please select a 20 ft Reefer or 40 ft Reefer container.`,
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
      container: selectedContainer,

      country: popupIsCollection
        ? {
            id: null,
            country_name: 'Collection / Ex Works',
            zone_id: null,
          }
        : selectedCountry,

      port: popupIsCollection
        ? {
            id: null,
            port_name: 'Warehouse Collection',
          }
        : selectedPort,
    })

    setShowShippingModal(false)
    resetShippingForm()
    setShowQtyModal(true)
  }

  function addSelectedQty() {
    if (!hasShipping) {
      setShowQtyModal(false)
      setShowShippingModal(true)
      return
    }

    if (totalCases <= 0) {
      showNotice(
        'Select Quantity',
        'Please select at least one Layer or Pallet before adding this product to the basket.',
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

    if (dryContainerBlocked) {
      showNotice(
        'Reefer Container Required',
        `${productStorageType} products require a Reefer container. Please change your shipping option first.`,
        'warning'
      )
      return
    }

    const added = addToBasket(product, {
      layerQty,
      palletQty,
    })

    if (!added) {
      showNotice(
        'Select Quantity',
        'Please select at least one Layer or Pallet before adding this product to the basket.',
        'warning'
      )
      return
    }

    setLayerQty(0)
    setPalletQty(0)
    setShowQtyModal(false)
    setAddedMessage(true)

    window.setTimeout(() => {
      setAddedMessage(false)
    }, 2200)
  }

  return (
    <>
      <article className="product-card">
        <div
          className="product-card-click"
          onClick={openProduct}
          role="link"
          tabIndex={0}
          onKeyDown={event => {
            if (
              event.key === 'Enter' ||
              event.key === ' '
            ) {
              openProduct(event)
            }
          }}
        >
          {badge && (
            <span className="product-card-badge">
              {badge}
            </span>
          )}

          <div className="product-card-image">
            {getImage(product) ? (
              <img
                src={getImage(product)}
                alt={product.description}
                onError={event => {
                  event.currentTarget.style.display =
                    'none'
                }}
              />
            ) : (
              <span>No Image</span>
            )}
          </div>

          <div className="product-card-price-row">
            <span className="product-unit-price">
              UNIT{' '}
              {money(
                Number(product.price || 0) /
                  Math.max(
                    unitsPerCase(product),
                    1
                  )
              )}
            </span>

            <span className="product-code">
              {product.reference || '—'}
            </span>

            <span className="product-case-price">
              CASE {money(product.price)}
            </span>
          </div>

          <h3>{product.description}</h3>

          <p>
            EAN: {product.barcode_ean || '—'}
          </p>

          <div className="product-card-meta">
            <span>
              Case Size: {unitsPerCase(product)}
            </span>

            <span>
              Pallet:{' '}
              {product.pallet_quantity || 0}
            </span>

            <span>
              Layer:{' '}
              {product.layer_quantity || 0}
            </span>
          </div>
        </div>

        <div className="product-card-actions">
          <button
            type="button"
            className="view-btn"
            onClick={openProduct}
          >
            View Product
          </button>

          <button
            type="button"
            className={`heart-btn ${
              isInWishlist(product.id)
                ? 'active'
                : ''
            }`}
            onClick={handleWishlist}
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
            {isInWishlist(product.id)
              ? '♥'
              : '♡'}
          </button>

          <button
            type="button"
            className={`basket-btn ${
              addedMessage ? 'added' : ''
            }`}
            onClick={handleAddClick}
          >
            {addedMessage
              ? '✓ Added'
              : 'Add to Basket'}
          </button>
        </div>
      </article>

      {showShippingModal && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={event => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeShippingModal()
            }
          }}
        >
          <section
            className="shipping-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`shipping-title-${product.id}`}
          >
            <button
              type="button"
              className="modal-close"
              onClick={closeShippingModal}
              aria-label="Close shipping options"
            >
              ×
            </button>

            <h3
              id={`shipping-title-${product.id}`}
            >
              Choose Your Shipping Option
            </h3>

            <div className="shipping-modal-note">
              <strong>Important:</strong>{' '}
              Frozen and chilled items require
              a Reefer container. Frozen items
              cannot be mixed with Ambient or
              Chilled items in the same order.
            </div>

            {shippingLoading && (
              <div className="shipping-modal-status">
                Loading shipping options…
              </div>
            )}

            {shippingError && (
              <div className="shipping-modal-error">
                {shippingError}
              </div>
            )}

            {!shippingLoading && (
              <>
                <div
                  className={`shipping-modal-grid ${
                    popupIsCollection
                      ? 'collection-mode'
                      : ''
                  }`}
                >
                  <div>
                    <label
                      htmlFor={`container-${product.id}`}
                    >
                      Container / Method
                    </label>

                    <select
                      id={`container-${product.id}`}
                      value={containerId}
                      onChange={
                        handleContainerChange
                      }
                    >
                      <option value="">
                        Select container or
                        collection...
                      </option>

                      {containers.map(
                        container => (
                          <option
                            key={container.id}
                            value={container.id}
                          >
                            {
                              container.container_name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {!popupIsCollection && (
                    <>
                      <div>
                        <label
                          htmlFor={`country-${product.id}`}
                        >
                          Country
                        </label>

                        <select
                          id={`country-${product.id}`}
                          value={countryId}
                          onChange={event => {
                            setCountryId(
                              event.target.value
                            )

                            setShippingError('')
                          }}
                        >
                          <option value="">
                            Select country...
                          </option>

                          {countries.map(
                            country => (
                              <option
                                key={country.id}
                                value={country.id}
                              >
                                {
                                  country.country_name
                                }
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor={`port-${product.id}`}
                        >
                          Destination Port
                        </label>

                        <select
                          id={`port-${product.id}`}
                          value={portId}
                          onChange={event =>
                            setPortId(
                              event.target.value
                            )
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

                {selectedContainer &&
                  popupIsCollection && (
                    <div className="shipping-modal-selection-info">
                      <strong>
                        Collection / Ex Works:
                      </strong>{' '}
                      You will arrange pickup.
                      No container capacity checks
                      apply. Minimum order £5,000.
                    </div>
                  )}

                {selectedContainer &&
                  !popupIsCollection && (
                    <div className="shipping-modal-selection-info">
                      <strong>
                        {
                          selectedContainer.container_name
                        }
                      </strong>
                      {' · '}
                      Volume{' '}
                      {Number(
                        selectedContainer.volume_m3 ||
                          0
                      ).toLocaleString()}{' '}
                      m³
                      {' · '}
                      Payload{' '}
                      {Number(
                        selectedContainer.payload_weight_kg ||
                          0
                      ).toLocaleString()}{' '}
                      kg
                    </div>
                  )}

                <button
                  type="button"
                  className="modal-primary-btn"
                  disabled={
                    !selectedContainer ||
                    (!popupIsCollection &&
                      (!selectedCountry ||
                        !selectedPort))
                  }
                  onClick={saveShipping}
                >
                  Start Order →
                </button>
              </>
            )}
          </section>
        </div>
      )}

      {showQtyModal && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={event => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeQtyModal()
            }
          }}
        >
          <section
            className="qty-modal qty-modal-redesigned"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`quantity-title-${product.id}`}
          >
            <button
              type="button"
              className="modal-close"
              onClick={closeQtyModal}
              aria-label="Close quantity options"
            >
              ×
            </button>

            <div className="qty-modal-heading">
              <div>
                <span className="qty-modal-kicker">
                  QUICK ORDER
                </span>

                <h3
                  id={`quantity-title-${product.id}`}
                >
                  Quantity Options
                </h3>
              </div>

              <span
                className={`qty-storage-badge qty-storage-${productStorageType.toLowerCase()}`}
              >
                {productStorageType}
              </span>
            </div>

            <div className="qty-modal-new-layout">
              <div className="qty-modal-left">
                <div className="qty-large-image">
                  {getImage(product) ? (
                    <img
                      src={getImage(product)}
                      alt={product.description}
                      onError={event => {
                        event.currentTarget.style.display =
                          'none'
                      }}
                    />
                  ) : (
                    <div className="qty-no-image">
                      <span>📦</span>
                      No Image Available
                    </div>
                  )}
                </div>

                <div className="qty-selection-panel">
                  <QtyLine
                    label="Case"
                    qty={0}
                    desc={`${unitsPerCase(
                      product
                    )} Units per Case`}
                    disabled
                  />

                  <QtyLine
                    label="Layer"
                    qty={layerQty}
                    desc={`${
                      product.layer_quantity || 0
                    } Cases per Layer`}
                    onMinus={() =>
                      setLayerQty(current =>
                        Math.max(
                          0,
                          current - 1
                        )
                      )
                    }
                    onPlus={() =>
                      setLayerQty(
                        current => current + 1
                      )
                    }
                    onClear={() =>
                      setLayerQty(0)
                    }
                    disabled={
                      Number(
                        product.layer_quantity ||
                          0
                      ) <= 0
                    }
                  />

                  <QtyLine
                    label="Pallet"
                    qty={palletQty}
                    desc={`${
                      product.pallet_quantity || 0
                    } Cases per Pallet`}
                    onMinus={() =>
                      setPalletQty(current =>
                        Math.max(
                          0,
                          current - 1
                        )
                      )
                    }
                    onPlus={() =>
                      setPalletQty(
                        current => current + 1
                      )
                    }
                    onClear={() =>
                      setPalletQty(0)
                    }
                    disabled={
                      Number(
                        product.pallet_quantity ||
                          0
                      ) <= 0
                    }
                  />

                  <div className="qty-order-summary">
                    <div className="qty-summary-primary">
                      <span>
                        <strong>
                          {totalCases}
                        </strong>{' '}
                        total cases
                      </span>

                      <span>
                        <strong>
                          {money(totalPrice)}
                        </strong>
                      </span>
                    </div>

                    <div className="qty-summary-metrics">
                      <div>
                        <span>
                          Total Weight
                        </span>

                        <strong>
                          {totalWeight.toFixed(
                            2
                          )}{' '}
                          kg
                        </strong>
                      </div>

                      <div>
                        <span>
                          Total CBM
                        </span>

                        <strong>
                          {totalVolume.toFixed(
                            6
                          )}{' '}
                          m³
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="qty-product-details">
                <span className="qty-detail-label">
                  PRODUCT INFORMATION
                </span>

                <h4>
                  {product.description}
                </h4>

                <div className="qty-detail-price">
                  {money(product.price)}

                  <small>
                    per case
                  </small>
                </div>

                <div className="qty-detail-list">
                  <div>
                    <span>SKU</span>
                    <strong>
                      {product.reference || '—'}
                    </strong>
                  </div>

                  <div>
                    <span>EAN</span>
                    <strong>
                      {product.barcode_ean ||
                        '—'}
                    </strong>
                  </div>

                  <div>
                    <span>Storage</span>
                    <strong>
                      {productStorageType}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Units per Case
                    </span>

                    <strong>
                      {unitsPerCase(product)}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Cases per Layer
                    </span>

                    <strong>
                      {product.layer_quantity ||
                        0}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Cases per Pallet
                    </span>

                    <strong>
                      {product.pallet_quantity ||
                        0}
                    </strong>
                  </div>
                </div>

                <div className="qty-product-actions">
                  <button
                    type="button"
                    className="qty-view-product-btn"
                    onClick={openProduct}
                  >
                    View Full Product Details →
                  </button>

                  <button
                    type="button"
                    className="qty-add-btn qty-add-btn-right"
                    onClick={addSelectedQty}
                    disabled={totalCases <= 0}
                  >
                    {totalCases > 0
                      ? `Add ${totalCases} Cases to Basket`
                      : 'Select Quantity'}
                  </button>
                </div>
              </aside>
            </div>
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
    </>
  )
}

function QtyLine({
  label,
  qty,
  desc,
  onMinus,
  onPlus,
  onClear,
  disabled = false,
}) {
  return (
    <div
      className={`qty-line ${
        disabled ? 'disabled' : ''
      }`}
    >
      <span>{label}</span>

      <div className="qty-line-controls">
        <button
          type="button"
          disabled={
            disabled || qty <= 0
          }
          onClick={onMinus}
        >
          −
        </button>

        <strong>{qty}</strong>

        <button
          type="button"
          disabled={disabled}
          onClick={onPlus}
        >
          +
        </button>

        <button
          type="button"
          disabled={
            disabled || qty <= 0
          }
          onClick={onClear}
          title={`Clear ${label} quantity`}
        >
          ×
        </button>
      </div>

      <small>{desc}</small>
    </div>
  )
}

export default ProductCard