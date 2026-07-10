import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useShipping } from '../context/ShippingContext'
import { getContainers, getCountries, getPorts } from '../services/shippingService'
import './ProductCard.css'

function money(v) {
  return `£${Number(v || 0).toFixed(2)}`
}

function getImage(product) {
  return product?.web_image ? `/products/${product.web_image}` : ''
}

function getStorageType(product) {
  return product?.storage_type || 'Ambient'
}

function unitsPerCase(product) {
  return Number(product?.units_of || product?.inner_case_quantity || product?.case_size || 1)
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

  const { shipping, hasShipping, isCollection, setShippingOption } = useShipping()

  const [showShippingModal, setShowShippingModal] = useState(false)
  const [showQtyModal, setShowQtyModal] = useState(false)

  const [containers, setContainers] = useState([])
  const [countries, setCountries] = useState([])
  const [ports, setPorts] = useState([])

  const [containerId, setContainerId] = useState('')
  const [countryId, setCountryId] = useState('')
  const [portId, setPortId] = useState('')

  const [layerQty, setLayerQty] = useState(0)
  const [palletQty, setPalletQty] = useState(0)

  const selectedContainer = containers.find(c => String(c.id) === String(containerId))
  const selectedCountry = countries.find(c => String(c.id) === String(countryId))
  const selectedPort = ports.find(p => String(p.id) === String(portId))

  const shippingIsCollection =
    selectedContainer?.container_name?.toLowerCase().includes('collection / ex works')

  const productStorageType = getStorageType(product)

  const basketHasFrozen = basketItems.some(item => getStorageType(item) === 'Frozen')
  const basketHasAmbientOrChilled = basketItems.some(item => {
    const type = getStorageType(item)
    return type === 'Ambient' || type === 'Chilled'
  })

  const selectedShippingContainer = shipping?.container
  const isDrySelected = selectedShippingContainer?.container_type === 'Dry'

  const dryBlocked =
    !isCollection &&
    isDrySelected &&
    (productStorageType === 'Frozen' || productStorageType === 'Chilled')

  const frozenMixBlocked =
    (productStorageType === 'Frozen' && basketHasAmbientOrChilled) ||
    ((productStorageType === 'Ambient' || productStorageType === 'Chilled') && basketHasFrozen)

  const totalCases =
    Number(layerQty || 0) * Number(product.layer_quantity || 0) +
    Number(palletQty || 0) * Number(product.pallet_quantity || 0)

  const totalWeight =
    Number(product.weight || 0) * unitsPerCase(product) * totalCases

  const totalVolume =
    Number(product.volume || 0) * totalCases

  useEffect(() => {
    if (!showShippingModal) return

    async function loadShippingData() {
      try {
        const [containerData, countryData] = await Promise.all([
          getContainers(),
          getCountries(),
        ])

        setContainers(containerData)
        setCountries(countryData)
      } catch (error) {
        console.error(error)
      }
    }

    loadShippingData()
  }, [showShippingModal])

  useEffect(() => {
    async function loadPorts() {
      setPorts([])
      setPortId('')

      if (!countryId || shippingIsCollection) return

      try {
        const portData = await getPorts(countryId)
        setPorts(portData)
      } catch (error) {
        console.error(error)
      }
    }

    loadPorts()
  }, [countryId, shippingIsCollection])

  function openProduct() {
    navigate(`/product/${product.id}`)
  }

  function handleWishlist(e) {
    e.stopPropagation()

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  function handleAddClick(e) {
    e.stopPropagation()

    if (!hasShipping) {
      setShowShippingModal(true)
      return
    }

    if (dryBlocked) {
      alert(`${productStorageType} items require a Reefer container. Please change shipping option first.`)
      return
    }

    if (frozenMixBlocked) {
      alert('Frozen items cannot be mixed with Ambient or Chilled items in the same basket.')
      return
    }

    setShowQtyModal(true)
  }

  // function saveShipping() {
  //   if (!selectedContainer) {
  //     alert('Please select container.')
  //     return
  //   }

  //   if (!shippingIsCollection && (!selectedCountry || !selectedPort)) {
  //     alert('Please select country and port.')
  //     return
  //   }

  //   setShippingOption({
  //     container: selectedContainer,
  //     country: shippingIsCollection
  //       ? { id: null, country_name: 'Collection / Ex Works', zone_id: 1 }
  //       : selectedCountry,
  //     port: shippingIsCollection
  //       ? { id: null, port_name: 'Warehouse Collection' }
  //       : selectedPort,
  //   })

  //   setShowShippingModal(false)
  //   setShowQtyModal(true)
  // }
  function saveShipping() {
  if (!selectedContainer) {
    alert('Please select a container or collection method.')
    return
  }

  if (!shippingIsCollection && (!selectedCountry || !selectedPort)) {
    alert('Please select country and port.')
    return
  }

  const chosenContainerType = selectedContainer?.container_type
  const chosenIsDry = chosenContainerType === 'Dry'

  if (
    !shippingIsCollection &&
    chosenIsDry &&
    (productStorageType === 'Frozen' || productStorageType === 'Chilled')
  ) {
    alert(
      `${productStorageType} items require a Reefer container. Please select a Reefer container.`
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
    container: selectedContainer,

    country: shippingIsCollection
      ? {
          id: null,
          country_name: 'Collection / Ex Works',
          zone_id: null,
        }
      : selectedCountry,

    port: shippingIsCollection
      ? {
          id: null,
          port_name: 'Warehouse Collection',
        }
      : selectedPort,
  })

  setShowShippingModal(false)
  setShowQtyModal(true)
}

  function addSelectedQty() {
    if (dryBlocked) {
      alert(`${productStorageType} items require a Reefer container.`)
      return
    }

    if (frozenMixBlocked) {
      alert('Frozen items cannot be mixed with Ambient or Chilled items in the same basket.')
      return
    }

    const added = addToBasket(product, { layerQty, palletQty })

    if (!added) {
      alert('Please select at least one Layer or Pallet.')
      return
    }

    setLayerQty(0)
    setPalletQty(0)
    setShowQtyModal(false)
  }

  return (
    <>
      <div className="product-card">
        <div className="product-card-click" onClick={openProduct}>
          {badge && <span className="product-card-badge">{badge}</span>}

          <div className="product-card-image">
            {getImage(product) ? (
              <img src={getImage(product)} alt={product.description} />
            ) : (
              <span>No Image</span>
            )}
          </div>

          <div className="product-card-price-row">
            <span className="product-unit-price">UNIT {money(Number(product.price || 0) / unitsPerCase(product))}</span>
            <span className="product-code">{product.reference}</span>
            <span className="product-case-price">CASE {money(product.price)}</span>
          </div>

          <h3>{product.description}</h3>

          <p>EAN: {product.barcode_ean || '—'}</p>

          <div className="product-card-meta">
            <span>Case Size: {unitsPerCase(product)}</span>
            <span>Pallet: {product.pallet_quantity || 0}</span>
            <span>Layer: {product.layer_quantity || 0}</span>
          </div>
        </div>

        <div className="product-card-actions">
          <button type="button" className="view-btn" onClick={openProduct}>
            View product
          </button>

          <button
            type="button"
            className={`heart-btn ${isInWishlist(product.id) ? 'active' : ''}`}
            onClick={handleWishlist}
            title="Add to wishlist"
          >
            ♥
          </button>

          <button type="button" className="basket-btn" onClick={handleAddClick}>
            Add to Basket
          </button>
        </div>
      </div>

      {showShippingModal && (
        <div className="modal-backdrop">
          <div className="shipping-modal">
            <button className="modal-close" onClick={() => setShowShippingModal(false)}>×</button>

            <h3>Choose your shipping option</h3>

            <div className="shipping-modal-note">
              Frozen and chilled items require a Reefer container. Please select a Reefer container, or remove Frozen/Chilled items from your basket.
            </div>

            <div className="shipping-modal-grid">
              <div>
                <label>Container</label>
                <select
                  value={containerId}
                  onChange={(e) => {
                    setContainerId(e.target.value)
                    setCountryId('')
                    setPortId('')
                    setPorts([])
                  }}
                >
                  <option value="">Select container...</option>
                  {containers.map(c => (
                    <option key={c.id} value={c.id}>{c.container_name}</option>
                  ))}
                </select>
              </div>

              {!shippingIsCollection && (
                <>
                  <div>
                    <label>Country</label>
                    <select value={countryId} onChange={(e) => setCountryId(e.target.value)}>
                      <option value="">Select country...</option>
                      {countries.map(c => (
                        <option key={c.id} value={c.id}>{c.country_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Port</label>
                    <select value={portId} onChange={(e) => setPortId(e.target.value)} disabled={!countryId}>
                      <option value="">{countryId ? 'Select port...' : 'Select country first'}</option>
                      {ports.map(p => (
                        <option key={p.id} value={p.id}>{p.port_name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            <button
              className="modal-primary-btn"
              disabled={!selectedContainer || (!shippingIsCollection && (!selectedCountry || !selectedPort))}
              onClick={saveShipping}
            >
              Start Order
            </button>
          </div>
        </div>
      )}

      {showQtyModal && (
        <div className="modal-backdrop">
          <div className="qty-modal">
            <button className="modal-close" onClick={() => setShowQtyModal(false)}>×</button>

            <h3>Quantity Options</h3>

            <div className="qty-modal-grid">
              <div className="qty-product-info">
                <div className="qty-modal-image">
                  {getImage(product) ? <img src={getImage(product)} alt={product.description} /> : <span>No Image</span>}
                </div>

                <div>
                  <h4>{product.description}</h4>
                  <strong>{money(product.price)}</strong>

                  <p><b>SKU</b> {product.reference || '—'}</p>
                  <p><b>EAN</b> {product.barcode_ean || '—'}</p>
                  <p><b>Packaging</b> {product.packaging || `${unitsPerCase(product)} units`}</p>
                  <p><b>Units per Case</b> {unitsPerCase(product)}</p>
                  <p><b>Cases per Layer</b> {product.layer_quantity || 0}</p>
                  <p><b>Cases per Pallet</b> {product.pallet_quantity || 0}</p>
                </div>
              </div>

              <div className="qty-controls-box">
                <QtyLine label="Case" disabled qty={0} desc={`${unitsPerCase(product)} Units per Case`} />

                <QtyLine
                  label="Layer"
                  qty={layerQty}
                  desc={`${product.layer_quantity || 0} Cases per Layer`}
                  onMinus={() => setLayerQty(q => Math.max(0, q - 1))}
                  onPlus={() => setLayerQty(q => q + 1)}
                  onClear={() => setLayerQty(0)}
                />

                <QtyLine
                  label="Pallet"
                  qty={palletQty}
                  desc={`${product.pallet_quantity || 0} Cases per Pallet`}
                  onMinus={() => setPalletQty(q => Math.max(0, q - 1))}
                  onPlus={() => setPalletQty(q => q + 1)}
                  onClear={() => setPalletQty(0)}
                />

                <div className="qty-total-line">
                  <b>{totalCases}</b> total cases
                </div>

                <div className="qty-calc-line">
                  Weight: <b>{totalWeight.toFixed(2)} kg</b> · CBM: <b>{totalVolume.toFixed(3)} m³</b>
                </div>

                <button className="qty-add-btn" onClick={addSelectedQty}>
                  Add to Basket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function QtyLine({ label, qty, desc, onMinus, onPlus, onClear, disabled }) {
  return (
    <div className={`qty-line ${disabled ? 'disabled' : ''}`}>
      <span>{label}</span>

      <div className="qty-line-controls">
        <button disabled={disabled} onClick={onMinus}>-</button>
        <strong>{qty}</strong>
        <button disabled={disabled} onClick={onPlus}>+</button>
        <button disabled={disabled} onClick={onClear}>×</button>
      </div>

      <small>{desc}</small>
    </div>
  )
}

export default ProductCard