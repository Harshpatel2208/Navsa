import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useShipping } from '../context/ShippingContext'
import ConfirmModal from '../components/common/ConfirmModal'
import './Basket.css'

function money(value) {
  return `£${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function kg(value) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

function m3(value) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

function ft3(value) {
  return Number(value || 0) * 35.3147
}

function Basket() {
  const [itemToRemove, setItemToRemove] = useState(null)

  const {
    basketItems,
    changeLayerQty,
    changePalletQty,
    removeFromBasket,
    removeByStorageType,
    basketTotal,
    basketCount,
    basketWeight,
    basketVolume,
    clearBasket,
  } = useCart()

  const { shipping, hasShipping, isCollection } = useShipping()

  const selectedContainer = shipping?.container
  const selectedCountry = shipping?.country
  const selectedPort = shipping?.port

  const hasAmbient = basketItems.some(item => (item.storage_type || 'Ambient') === 'Ambient')
  const hasChilled = basketItems.some(item => (item.storage_type || 'Ambient') === 'Chilled')
  const hasFrozen = basketItems.some(item => (item.storage_type || 'Ambient') === 'Frozen')

  const isDry = selectedContainer?.container_type === 'Dry'

  const dryNeedsReefer =
    hasShipping &&
    !isCollection &&
    isDry &&
    (hasChilled || hasFrozen)

  const frozenMixed =
    hasFrozen &&
    (hasAmbient || hasChilled)

  const minimumOrder = isCollection || selectedCountry?.zone_id === 1 ? 5000 : 10000
  const zoneLabel = isCollection || selectedCountry?.zone_id === 1 ? 'Collection (EXW)' : 'Rest of World'
  const belowMinimum = hasShipping && basketTotal < minimumOrder

  const maxWeight = Number(selectedContainer?.payload_weight_kg || 0)
  const maxVolume = Number(selectedContainer?.volume_m3 || 0)

  const overWeight = hasShipping && !isCollection && maxWeight > 0 && basketWeight > maxWeight
  const overVolume = hasShipping && !isCollection && maxVolume > 0 && basketVolume > maxVolume

  const canCheckout =
    hasShipping &&
    !belowMinimum &&
    !dryNeedsReefer &&
    !frozenMixed &&
    !overWeight &&
    !overVolume

  function requestBasketRemoval(item) {
    setItemToRemove(item)
  }

  function closeBasketRemoval() {
    setItemToRemove(null)
  }

  function confirmBasketRemoval() {
    if (itemToRemove?.id == null) return

    removeFromBasket(itemToRemove.id)
    setItemToRemove(null)
  }

  if (basketItems.length === 0) {
    return (
      <div className="basket-empty-page">
        <div className="basket-empty-card">
          <div className="basket-empty-icon">🧺</div>
          <h2>Your Basket is Empty</h2>
          <p>Add products from the catalogue to request a quote.</p>
          <Link to="/shop">
            <button className="basket-primary-btn">Browse Products</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="basket-page">
      <div className="basket-container">
        <h1 className="basket-title">
          Your Basket <span>({basketCount} cases)</span>
        </h1>

        {hasShipping ? (
          <div className="basket-shipping-strip">
            <div>
              <strong>Shipping:</strong> {selectedContainer?.container_name}
              {!isCollection && <> · {selectedCountry?.country_name} · {selectedPort?.port_name}</>}
            </div>

            <Link to="/#shipping-selector" className="basket-change-btn">
              Change shipping option
            </Link>
          </div>
        ) : (
          <Alert type="orange">
            <strong>Shipping option required.</strong> Please select a container before checkout.{' '}
            <Link to="/#shipping-selector" className="basket-link">Choose shipping option</Link>
          </Alert>
        )}

        <div className="basket-table">
          <div className="basket-head">
            <div>Item / Product</div>
            <div>Price</div>
            <div>Qty Controls</div>
            <div>Qty (Cases)</div>
            <div>Line Weight (kg)</div>
            <div>Line Volume (m³)</div>
            <div>Subtotal</div>
            <div></div>
          </div>

          {basketItems.map(item => {
            // const lineWeight = Number(item.weight || 0) * Number(item.totalCases || 0)
            // const lineVolume = Number(item.volume || 0) * Number(item.totalCases || 0)

            const unitsPerCase = Number(item.units_of || item.inner_case_quantity || 1)

            const lineWeight =
  Number(item.weight || 0) *
  unitsPerCase *
  Number(item.totalCases || 0)

const lineVolume =
  Number(item.volume || 0) *
  Number(item.totalCases || 0)
            
            const subtotal = Number(item.price || 0) * Number(item.totalCases || 0)

            return (
              <div className="basket-row" key={item.id}>
                <div className="basket-product">
                  <div className="basket-img">
                    {item.web_image ? (
                      <img src={`/products/${item.web_image}`} alt={item.description} />
                    ) : (
                      <span>NO IMAGE</span>
                    )}
                  </div>

                  <div>
                    <Link to={`/product/${item.id}`} className="basket-product-name">
                      {item.description}
                    </Link>
                    <StorageBadge type={item.storage_type || 'Ambient'} />
                  </div>
                </div>

                <div>{money(item.price)}</div>

                <div className="basket-qty-box">
                  <div className="basket-pack-line dark">
                    Pallet - {Number(item.pallet_quantity || 0)} Cases
                  </div>
                  <div className="basket-pack-line">
                    Layer - {Number(item.layer_quantity || 0)} Cases
                  </div>
                  <div className="basket-pack-line muted">
                    Case - Units
                  </div>

                  <div className="basket-counter">
                    <button onClick={() => changePalletQty(item.id, -1)}>-</button>
                    <span>Pallets</span>
                    <button onClick={() => changePalletQty(item.id, 1)}>+</button>
                  </div>

                  <div className="basket-counter">
                    <button onClick={() => changeLayerQty(item.id, -1)}>-</button>
                    <span>Layers</span>
                    <button onClick={() => changeLayerQty(item.id, 1)}>+</button>
                  </div>
                </div>

                <div className="basket-case-cell">{item.totalCases}</div>
                <div>{lineWeight.toFixed(2)}</div>
                <div>{lineVolume.toFixed(2)}</div>
                <div>{money(subtotal)}</div>

                <button
                  type="button"
                  className="basket-remove"
                  onClick={() => requestBasketRemoval(item)}
                  aria-label={`Remove ${item.description} from basket`}
                  title="Remove from basket"
                >
                  ×
                </button>
              </div>
            )
          })}

          <div className="basket-totals">
            <div></div>
            <div></div>
            <div></div>
            <div>Total Weight (kg): <strong>{basketWeight.toFixed(2)}</strong></div>
            <div>Total Volume (m³): <strong>{basketVolume.toFixed(2)}</strong></div>
            <div>Total (inc VAT): <strong>{money(basketTotal)}</strong></div>
          </div>
        </div>

        <div className="basket-bottom">
          <div></div>

          {hasShipping && (
            <ContainerSummary
              isCollection={isCollection}
              selectedContainer={selectedContainer}
              selectedCountry={selectedCountry}
              selectedPort={selectedPort}
              basketWeight={basketWeight}
              basketVolume={basketVolume}
              basketTotal={basketTotal}
              minimumOrder={minimumOrder}
              zoneLabel={zoneLabel}
              belowMinimum={belowMinimum}
              dryNeedsReefer={dryNeedsReefer}
              frozenMixed={frozenMixed}
              hasFrozen={hasFrozen}
              hasChilled={hasChilled}
              overWeight={overWeight}
              overVolume={overVolume}
              canCheckout={canCheckout}
              removeByStorageType={removeByStorageType}
            />
          )}

          <button
            disabled={!canCheckout}
            className={`basket-primary-btn ${!canCheckout ? 'disabled' : ''}`}
            onClick={() => alert('Thanks — our team will be in touch shortly to confirm your quote.')}
          >
            Proceed to checkout
          </button>
        </div>
      </div>

      <ConfirmModal
        open={Boolean(itemToRemove)}
        eyebrow="BASKET"
        icon={<BasketIcon />}
        title="Remove this product?"
        message={
          <>
            Are you sure you want to remove
            <strong> “{itemToRemove?.description}” </strong>
            from your basket?
          </>
        }
        description="You can add it again at any time."
        cancelText="Keep Item"
        confirmText="Remove Item"
        variant="danger"
        onClose={closeBasketRemoval}
        onConfirm={confirmBasketRemoval}
      />
    </div>
  )
}

function BasketIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 10h14l-1.2 9H6.2L5 10Z" />
      <path d="m8 10 4-6 4 6" />
      <path d="M9 14v2" />
      <path d="M12 14v2" />
      <path d="M15 14v2" />
    </svg>
  )
}

function ContainerSummary({
  isCollection,
  selectedContainer,
  selectedCountry,
  selectedPort,
  basketWeight,
  basketVolume,
  minimumOrder,
  zoneLabel,
  belowMinimum,
  dryNeedsReefer,
  frozenMixed,
  hasFrozen,
  hasChilled,
  overWeight,
  overVolume,
  canCheckout,
  removeByStorageType,
}) {
  const remainingVolume = Number(selectedContainer?.volume_m3 || 0) - basketVolume
  const remainingWeight = Number(selectedContainer?.payload_weight_kg || 0) - basketWeight

  const minimumText = belowMinimum
    ? `Minimum order for ${zoneLabel} is ${money(minimumOrder)}. Basket is below the minimum.`
    : `Minimum order met for ${zoneLabel} (${money(minimumOrder)} minimum).`

  if (isCollection) {
    return (
      <div className={`basket-status-card ${belowMinimum ? 'orange' : 'green'}`}>
        <p>
          <strong>Collection selected (EX Works).</strong> You will arrange collection.
          No container capacity checks apply. Current order totals:{' '}
          {kg(basketWeight)} kg, {m3(basketVolume)} m³ ({m3(ft3(basketVolume))} ft³).
        </p>
        <p>{minimumText}</p>
        <Link to="/#shipping-selector" className="status-change">Change shipping option</Link>
      </div>
    )
  }

  const summary = (
    <>
      Selected container: <strong>{selectedContainer.container_name}</strong> - Volume{' '}
      {m3(basketVolume)} m³ ({m3(ft3(basketVolume))} ft³) of {m3(selectedContainer.volume_m3)} m³,
      Weight {kg(basketWeight)} kg of {kg(selectedContainer.payload_weight_kg)} kg.
      Remaining: {m3(remainingVolume)} m³, {kg(remainingWeight)} kg.
      <br />
      Country: <strong>{selectedCountry.country_name}</strong> · Port:{' '}
      <strong>{selectedPort.port_name}</strong>
      <br />
      {minimumText}
    </>
  )

  if (frozenMixed) {
    return (
      <div className="basket-status-card red">
        <p>
          <strong>Frozen items can’t be mixed with Ambient or Chilled items.</strong>{' '}
          Please choose one of the options below to continue.
        </p>

        <div className="status-actions">
          <button onClick={() => {
            removeByStorageType('Ambient')
            removeByStorageType('Chilled')
          }}>
            Remove all ambient/chilled items
          </button>

          <button onClick={() => removeByStorageType('Frozen')}>
            Remove all frozen items
          </button>
        </div>

        <p>{summary}</p>
        <Link to="/#shipping-selector" className="status-change">Change shipping option</Link>
      </div>
    )
  }

  if (dryNeedsReefer) {
    return (
      <div className="basket-status-card red">
        <p>
          <strong>
            {hasFrozen && hasChilled
              ? 'Frozen and Chilled items require a Reefer container.'
              : hasFrozen
                ? 'Frozen items require a Reefer container (20ft Reefer or 40ft Reefer).'
                : 'Chilled items require a Reefer container (20ft Reefer or 40ft Reefer).'}
          </strong>{' '}
          Switching you to Reefer options...
        </p>

        <p>{summary}</p>
        <Link to="/#shipping-selector" className="status-change">Change shipping option</Link>
      </div>
    )
  }

  if (overWeight || overVolume) {
    return (
      <div className="basket-status-card red">
        <p>
          <strong>Container capacity exceeded.</strong>{' '}
          {overWeight && 'Basket exceeds container weight limit. '}
          {overVolume && 'Basket exceeds container volume limit.'}
        </p>

        <p>{summary}</p>
        <Link to="/#shipping-selector" className="status-change">Change shipping option</Link>
      </div>
    )
  }

  return (
    <div className={`basket-status-card ${canCheckout ? 'green' : 'orange'}`}>
      <p>
        <strong>{canCheckout ? 'Within container limits.' : 'Below minimum order value.'}</strong>{' '}
        {summary}
      </p>
      <Link to="/#shipping-selector" className="status-change">Change shipping option</Link>
    </div>
  )
}

function StorageBadge({ type }) {
  return <span className={`storage-badge storage-${String(type).toLowerCase()}`}>{type}</span>
}

function Alert({ children, type = 'orange' }) {
  return <div className={`basket-alert ${type}`}>{children}</div>
}

export default Basket