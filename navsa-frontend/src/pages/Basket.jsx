// import { Link } from 'react-router-dom'
// import { colors, fonts } from '../theme'
// import { useCart } from '../context/CartContext'
// import { useShipping } from '../context/ShippingContext'
// import './Basket.css'

// function Basket() {
//   const {
//     basketItems,
//     removeFromBasket,
//     removeByStorageType,
//     basketTotal,
//     basketCount,
//     basketWeight,
//     basketVolume,
//     clearBasket,
//   } = useCart()

//   const { shipping } = useShipping()

//   const selectedContainer = shipping?.container
//   const selectedCountry = shipping?.country
//   const selectedPort = shipping?.port

//   const hasShipping = Boolean(selectedContainer && selectedCountry && selectedPort)
//   const isCollection =
//     selectedContainer?.container_name?.toLowerCase().includes('collection / ex works')

//   const hasFrozen = basketItems.some(item => (item.storage_type || 'Ambient') === 'Frozen')
//   const hasChilled = basketItems.some(item => (item.storage_type || 'Ambient') === 'Chilled')
//   const hasAmbient = basketItems.some(item => (item.storage_type || 'Ambient') === 'Ambient')

//   const needsReefer = hasFrozen || hasChilled
//   const wrongContainer =
//     hasShipping &&
//     !isCollection &&
//     needsReefer &&
//     selectedContainer.container_type !== 'Reefer'

//   const mixedFrozenAmbient = hasFrozen && hasAmbient

//   const minimumOrder = selectedCountry?.zone_id === 1 ? 5000 : 10000
//   const belowMinimum = hasShipping && basketTotal < minimumOrder

//   const maxWeight = Number(selectedContainer?.payload_weight_kg || 0)
//   const maxVolume = Number(selectedContainer?.volume_m3 || 0)

//   const overWeight = hasShipping && !isCollection && maxWeight > 0 && basketWeight > maxWeight
//   const overVolume = hasShipping && !isCollection && maxVolume > 0 && basketVolume > maxVolume

//   const canRequestQuote =
//     hasShipping &&
//     !wrongContainer &&
//     !mixedFrozenAmbient &&
//     !belowMinimum &&
//     !overWeight &&
//     !overVolume

//   if (basketItems.length === 0) {
//     return (
//       <div className="basket-empty-page">
//         <div className="basket-empty-card">
//           <div className="basket-empty-icon">🧺</div>
//           <h2>Your Basket is Empty</h2>
//           <p>Add products from the catalogue to request a quote.</p>
//           <Link to="/shop">
//             <button className="basket-primary-btn">Browse Products</button>
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="basket-page">
//       <div className="basket-container">
//         <div className="basket-hero">
//           <div>
//             <p className="basket-eyebrow">NAVSA ORDER BASKET</p>
//             <h1>
//               Your Basket <span>({basketCount} cases)</span>
//             </h1>
//             <p>
//               Review your order, container limits and minimum order value before
//               sending your quote request.
//             </p>
//           </div>

//           <button
//             className="basket-clear-btn"
//             onClick={() => {
//               if (window.confirm('Remove all items from your basket?')) clearBasket()
//             }}
//           >
//             CLEAR BASKET
//           </button>
//         </div>

//         {!hasShipping && (
//           <StatusBox type="orange">
//             <strong>Shipping option required.</strong>
//             <br />
//             Please select your container, country and port before requesting a quote.
//             <br />
//             <Link to="/" className="basket-status-link">Choose shipping option</Link>
//           </StatusBox>
//         )}

//         {hasShipping && (
//           <div className="basket-shipping-card">
//             <div>
//               <p>SELECTED SHIPPING OPTION</p>
//               <h3>{selectedContainer.container_name}</h3>
//               <span>{selectedCountry.country_name} · {selectedPort.port_name}</span>
//             </div>

//             <Link to="/" className="basket-change-btn">
//               Change shipping option
//             </Link>
//           </div>
//         )}

//         {mixedFrozenAmbient && (
//           <StatusBox type="red">
//             <strong>Frozen items can't be mixed with ambient.</strong>
//             <br />
//             Please choose one option below to continue.
//             <div className="basket-warning-actions">
//               <button onClick={() => removeByStorageType('Ambient')}>
//                 Remove all ambient items
//               </button>
//               <button onClick={() => removeByStorageType('Frozen')}>
//                 Remove all frozen items
//               </button>
//             </div>
//           </StatusBox>
//         )}

//         {wrongContainer && (
//           <StatusBox type="red">
//             <strong>Frozen/Chilled items require a Reefer container.</strong>
//             <br />
//             Please select a Reefer container, or remove Frozen/Chilled items from your basket.
//           </StatusBox>
//         )}

//         <div className="basket-table-card">
//           <div className="basket-table-head">
//             <div>Item / Product</div>
//             <div>Storage</div>
//             <div>Qty</div>
//             <div>Weight</div>
//             <div>Volume</div>
//             <div>Subtotal</div>
//             <div></div>
//           </div>

//           {basketItems.map(item => {
//             const lineWeight = Number(item.weight || 0) * Number(item.totalCases || 0)
//             const lineVolume = Number(item.volume || 0) * Number(item.totalCases || 0)
//             const subtotal = Number(item.price || 0) * Number(item.totalCases || 0)

//             return (
//               <div key={item.id} className="basket-table-row">
//                 <div className="basket-product-cell">
//                   <div className="basket-image-box">
//                     {item.web_image ? (
//                       <img
//                         src={`/products/${item.web_image}`}
//                         alt={item.description}
//                         onError={(e) => { e.target.style.display = 'none' }}
//                       />
//                     ) : (
//                       <span>NO IMAGE</span>
//                     )}
//                   </div>

//                   <div>
//                     <Link to={`/product/${item.id}`} className="basket-product-title">
//                       {item.description}
//                     </Link>

//                     <div className="basket-product-meta">
//                       {item.brand && <>{item.brand} · </>}CODE {item.reference}
//                     </div>

//                     <div className="basket-product-meta">
//                       {item.layerQty > 0 && (
//                         <>
//                           {item.layerQty} Layer{item.layerQty > 1 ? 's' : ''}
//                           {item.palletQty > 0 ? ' · ' : ''}
//                         </>
//                       )}
//                       {item.palletQty > 0 && (
//                         <>
//                           {item.palletQty} Pallet{item.palletQty > 1 ? 's' : ''}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <StorageBadge type={item.storage_type || 'Ambient'} />
//                 </div>

//                 <div className="basket-strong">{item.totalCases} cases</div>
//                 <div className="basket-muted">{lineWeight.toFixed(2)} kg</div>
//                 <div className="basket-muted">{lineVolume.toFixed(3)} m³</div>
//                 <div className="basket-price">£{subtotal.toFixed(2)}</div>

//                 <button
//                   className="basket-remove-btn"
//                   onClick={() => removeFromBasket(item.id)}
//                 >
//                   ✕
//                 </button>
//               </div>
//             )
//           })}
//         </div>

//         <div className="basket-summary-grid">
//           <div className="basket-total-card">
//             <p>ESTIMATED TOTAL, EX WAREHOUSE</p>
//             <h2>£{basketTotal.toFixed(2)}</h2>
//             <div>
//               <span>Total Weight: <strong>{basketWeight.toFixed(2)} kg</strong></span>
//               <span>Total Volume: <strong>{basketVolume.toFixed(3)} m³</strong></span>
//             </div>
//           </div>

//           {hasShipping && (
//             <ValidationSummary
//               isCollection={isCollection}
//               selectedContainer={selectedContainer}
//               selectedCountry={selectedCountry}
//               selectedPort={selectedPort}
//               basketWeight={basketWeight}
//               basketVolume={basketVolume}
//               basketTotal={basketTotal}
//               minimumOrder={minimumOrder}
//               belowMinimum={belowMinimum}
//               overWeight={overWeight}
//               overVolume={overVolume}
//               wrongContainer={wrongContainer}
//               mixedFrozenAmbient={mixedFrozenAmbient}
//               canRequestQuote={canRequestQuote}
//             />
//           )}
//         </div>

//         <div className="basket-actions">
//           <Link to="/shop">
//             <button className="basket-secondary-btn">← Continue Browsing</button>
//           </Link>

//           <button
//             disabled={!canRequestQuote}
//             className={`basket-primary-btn ${!canRequestQuote ? 'disabled' : ''}`}
//             onClick={() => alert('Thanks — our team will be in touch shortly to confirm your quote.')}
//           >
//             Request Quote →
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// function ValidationSummary({
//   isCollection,
//   selectedContainer,
//   selectedCountry,
//   selectedPort,
//   basketWeight,
//   basketVolume,
//   basketTotal,
//   minimumOrder,
//   belowMinimum,
//   overWeight,
//   overVolume,
//   wrongContainer,
//   mixedFrozenAmbient,
//   canRequestQuote,
// }) {
//   if (isCollection) {
//     return (
//       <StatusBox type={basketTotal >= minimumOrder ? 'green' : 'orange'} noMargin>
//         <strong>Collection / Ex Works selected.</strong>
//         <br />
//         You will arrange collection directly from our warehouse. Container capacity
//         calculations are not applicable.
//         <br />
//         Country: <strong>{selectedCountry.country_name}</strong> · Port:{' '}
//         <strong>{selectedPort.port_name}</strong>
//         <br />
//         {basketTotal < minimumOrder
//           ? <>Minimum order is £{minimumOrder.toLocaleString()}. Basket is below the minimum.</>
//           : <>Minimum order met.</>}
//       </StatusBox>
//     )
//   }

//   const remainingVolume = Number(selectedContainer.volume_m3 || 0) - basketVolume
//   const remainingWeight = Number(selectedContainer.payload_weight_kg || 0) - basketWeight

//   return (
//     <StatusBox type={canRequestQuote ? 'green' : 'orange'} noMargin>
//       <strong>{canRequestQuote ? 'Within container limits.' : 'Basket needs attention.'}</strong>
//       <br />
//       Selected container: <strong>{selectedContainer.container_name}</strong> - Volume{' '}
//       {basketVolume.toFixed(1)} m³ of {Number(selectedContainer.volume_m3).toFixed(1)} m³,
//       Weight {basketWeight.toFixed(1)} kg of{' '}
//       {Number(selectedContainer.payload_weight_kg).toLocaleString()} kg.
//       Remaining: {remainingVolume.toFixed(1)} m³, {remainingWeight.toFixed(1)} kg.
//       <br />
//       Country: <strong>{selectedCountry.country_name}</strong> · Port:{' '}
//       <strong>{selectedPort.port_name}</strong>
//       <br />
//       {belowMinimum && <>Minimum order is £{minimumOrder.toLocaleString()}. Basket is below the minimum. </>}
//       {overWeight && <>Basket exceeds container weight limit. </>}
//       {overVolume && <>Basket exceeds container volume limit. </>}
//       {wrongContainer && <>Frozen/Chilled items require a Reefer container. </>}
//       {mixedFrozenAmbient && <>Frozen items cannot be mixed with ambient. </>}
//       {canRequestQuote && <>Minimum order met and basket is within container limits.</>}
//     </StatusBox>
//   )
// }

// function StorageBadge({ type }) {
//   return <span className={`storage-badge storage-${type.toLowerCase()}`}>{type}</span>
// }

// function StatusBox({ children, type = 'orange', noMargin = false }) {
//   return (
//     <div className={`basket-status ${type} ${noMargin ? 'no-margin' : ''}`}>
//       {children}
//     </div>
//   )
// }

// export default Basket

import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useShipping } from '../context/ShippingContext'
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

  const hasFrozen = basketItems.some(item => (item.storage_type || 'Ambient') === 'Frozen')
  const hasChilled = basketItems.some(item => (item.storage_type || 'Ambient') === 'Chilled')
  const hasAmbient = basketItems.some(item => (item.storage_type || 'Ambient') === 'Ambient')

  const needsReefer = hasFrozen || hasChilled
  const wrongContainer =
    hasShipping &&
    !isCollection &&
    needsReefer &&
    selectedContainer?.container_type !== 'Reefer'

  const mixedFrozenAmbient = hasFrozen && hasAmbient

  const minimumOrder = selectedCountry?.zone_id === 1 || isCollection ? 5000 : 10000
  const zoneLabel = selectedCountry?.zone_id === 1 || isCollection ? 'UK & Europe' : 'Rest of World'
  const belowMinimum = hasShipping && basketTotal < minimumOrder

  const maxWeight = Number(selectedContainer?.payload_weight_kg || 0)
  const maxVolume = Number(selectedContainer?.volume_m3 || 0)

  const overWeight = hasShipping && !isCollection && maxWeight > 0 && basketWeight > maxWeight
  const overVolume = hasShipping && !isCollection && maxVolume > 0 && basketVolume > maxVolume

  const canCheckout =
    hasShipping &&
    !wrongContainer &&
    !mixedFrozenAmbient &&
    !belowMinimum &&
    !overWeight &&
    !overVolume

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
        <div className="basket-top">
          <div>
            <h1>Your Basket <span>({basketCount} cases)</span></h1>
            <p>Review quantity, minimum order, weight, volume and shipping container limits.</p>
          </div>

          <button className="basket-clear-btn" onClick={() => {
            if (window.confirm('Remove all items from your basket?')) clearBasket()
          }}>
            Clear Basket
          </button>
        </div>

        {hasShipping ? (
          <div className="basket-shipping-strip">
            <div>
              <strong>Shipping:</strong> {selectedContainer?.container_name}
              {!isCollection && <> · {selectedCountry?.country_name} · {selectedPort?.port_name}</>}
            </div>
            <Link to="/" className="basket-change-btn">Change Shipping</Link>
          </div>
        ) : (
          <Alert type="orange">
            <strong>Shipping option required.</strong> Please select container, country and port before checkout.{' '}
            <Link to="/" className="basket-link">Choose shipping option</Link>
          </Alert>
        )}

        {mixedFrozenAmbient && (
          <Alert type="red">
            <strong>Frozen items can’t be mixed with ambient.</strong> Please choose one of the options below to continue.
            <div className="basket-alert-actions">
              <button onClick={() => removeByStorageType('Ambient')}>Remove all ambient items</button>
              <button onClick={() => removeByStorageType('Frozen')}>Remove all frozen items</button>
            </div>
          </Alert>
        )}

        {wrongContainer && (
          <Alert type="red">
            <strong>Frozen/Chilled items require a Reefer container.</strong> Please select a Reefer container, or remove Frozen/Chilled items from your basket.
          </Alert>
        )}

        <div className="basket-layout">
          <div className="basket-main">
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
                const lineWeight = Number(item.weight || 0) * Number(item.totalCases || 0)
                const lineVolume = Number(item.volume || 0) * Number(item.totalCases || 0)
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
                        <div className="basket-code">Code: {item.reference}</div>
                        <StorageBadge type={item.storage_type || 'Ambient'} />
                      </div>
                    </div>

                    <div className="basket-price-cell">{money(item.price)}</div>

                    <div className="basket-qty-box">
                      <div className="basket-pack-line dark">
                        Pallet - {Number(item.pallet_quantity || 0)} Cases
                      </div>

                      <div className="basket-pack-line">
                        Layer - {Number(item.layer_quantity || 0)} Cases
                      </div>

                      <div className="basket-counter">
                        <button onClick={() => changePalletQty(item.id, -1)}>-</button>
                        <span>{Number(item.palletQty || 0)} Pallets</span>
                        <button onClick={() => changePalletQty(item.id, 1)}>+</button>
                      </div>

                      <div className="basket-counter">
                        <button onClick={() => changeLayerQty(item.id, -1)}>-</button>
                        <span>{Number(item.layerQty || 0)} Layers</span>
                        <button onClick={() => changeLayerQty(item.id, 1)}>+</button>
                      </div>
                    </div>

                    <div className="basket-case-cell">{item.totalCases}</div>
                    <div>{lineWeight.toFixed(2)}</div>
                    <div>{lineVolume.toFixed(3)}</div>
                    <div className="basket-subtotal">{money(subtotal)}</div>

                    <button className="basket-remove" onClick={() => removeFromBasket(item.id)}>×</button>
                  </div>
                )
              })}

              <div className="basket-footer-row">
                <div></div>
                <div></div>
                <div></div>
                <div>Total Weight (kg): <strong>{basketWeight.toFixed(2)}</strong></div>
                <div>Total Volume (m³): <strong>{basketVolume.toFixed(3)}</strong></div>
                <div>Total: <strong>{money(basketTotal)}</strong></div>
              </div>
            </div>

            <div className="basket-checks">
              <CheckCard title={`Minimum Order (${zoneLabel})`} status={!belowMinimum} text={belowMinimum ? `Minimum ${money(minimumOrder)} required.` : 'Minimum order met.'} />
              <CheckCard title="Reefer Required" status={!wrongContainer} text={wrongContainer ? 'Select Reefer container.' : needsReefer ? 'Reefer selected or not required.' : 'No frozen/chilled issue.'} />
              <CheckCard title="Mixing Check" status={!mixedFrozenAmbient} text={mixedFrozenAmbient ? 'Frozen cannot mix with ambient.' : 'No invalid mixing.'} />
              <CheckCard title="Weight Check" status={!overWeight} text={overWeight ? 'Container payload exceeded.' : 'Within payload capacity.'} />
              <CheckCard title="Volume Check" status={!overVolume} text={overVolume ? 'Container volume exceeded.' : 'Within cubic capacity.'} />
            </div>
          </div>

          <aside className="basket-side">
            <div className="basket-total-card">
              <p>Estimated Total, Ex Warehouse</p>
              <h2>{money(basketTotal)}</h2>
            </div>

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
                mixedFrozenAmbient={mixedFrozenAmbient}
                wrongContainer={wrongContainer}
                overWeight={overWeight}
                overVolume={overVolume}
                canCheckout={canCheckout}
                removeByStorageType={removeByStorageType}
              />
            )}

            <div className="basket-actions">
              <Link to="/shop">
                <button className="basket-secondary-btn">← Continue Browsing</button>
              </Link>

              <button
                disabled={!canCheckout}
                className={`basket-primary-btn ${!canCheckout ? 'disabled' : ''}`}
                onClick={() => alert('Thanks — our team will be in touch shortly to confirm your quote.')}
              >
                Proceed to checkout
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function ContainerSummary({
  isCollection,
  selectedContainer,
  selectedCountry,
  selectedPort,
  basketWeight,
  basketVolume,
  basketTotal,
  minimumOrder,
  zoneLabel,
  belowMinimum,
  mixedFrozenAmbient,
  wrongContainer,
  overWeight,
  overVolume,
  canCheckout,
  removeByStorageType,
}) {
  if (isCollection) {
    return (
      <div className={`basket-status-card ${basketTotal >= minimumOrder ? 'green' : 'orange'}`}>
        <strong>Collection / Ex Works selected.</strong>
        <p>You will arrange collection directly from our warehouse. Container capacity calculations are not applicable.</p>
        <p>Minimum order for {zoneLabel} is {money(minimumOrder)}.</p>
        {belowMinimum ? <p>Basket is below the minimum.</p> : <p>Minimum order met.</p>}
        <Link to="/" className="status-change">Change shipping option</Link>
      </div>
    )
  }

  const remainingVolume = Number(selectedContainer.volume_m3 || 0) - basketVolume
  const remainingWeight = Number(selectedContainer.payload_weight_kg || 0) - basketWeight

  const volumePercent = Number(selectedContainer.volume_m3 || 0) > 0
    ? Math.min(100, (basketVolume / Number(selectedContainer.volume_m3 || 1)) * 100)
    : 0

  const weightPercent = Number(selectedContainer.payload_weight_kg || 0) > 0
    ? Math.min(100, (basketWeight / Number(selectedContainer.payload_weight_kg || 1)) * 100)
    : 0

  return (
    <>
      <div className="container-summary">
        <h3>Container Summary</h3>
        <p><strong>{selectedContainer.container_name}</strong></p>
        <div><span>Cubic Capacity</span><strong>{m3(selectedContainer.volume_m3)} m³</strong></div>
        <div><span>Gross Weight</span><strong>{kg(selectedContainer.gross_weight_kg)} kg</strong></div>
        <div><span>Payload</span><strong>{kg(selectedContainer.payload_weight_kg)} kg</strong></div>

        <h4>Utilisation</h4>
        <Progress label="Volume Used" value={`${basketVolume.toFixed(3)} m³ / ${m3(selectedContainer.volume_m3)} m³`} percent={volumePercent} />
        <Progress label="Weight Used" value={`${kg(basketWeight)} kg / ${kg(selectedContainer.payload_weight_kg)} kg`} percent={weightPercent} />
      </div>

      <div className={`basket-status-card ${canCheckout ? 'green' : mixedFrozenAmbient || wrongContainer || overWeight || overVolume ? 'red' : 'orange'}`}>
        {mixedFrozenAmbient && (
          <>
            <strong>Frozen items can’t be mixed with ambient.</strong>
            <p>Please choose one option below to continue.</p>
            <div className="status-actions">
              <button onClick={() => removeByStorageType('Ambient')}>Remove all ambient items</button>
              <button onClick={() => removeByStorageType('Frozen')}>Remove all frozen items</button>
            </div>
          </>
        )}

        {!mixedFrozenAmbient && (
          <>
            <strong>
              {canCheckout
                ? 'Within container limits.'
                : belowMinimum
                  ? 'Below minimum order value.'
                  : 'Basket needs attention.'}
            </strong>

            <p>
              Selected container: <strong>{selectedContainer.container_name}</strong> - Volume {m3(basketVolume)} m³ ({m3(ft3(basketVolume))} ft³) of {m3(selectedContainer.volume_m3)} m³,
              Weight {kg(basketWeight)} kg of {kg(selectedContainer.payload_weight_kg)} kg.
              Remaining: {m3(remainingVolume)} m³, {kg(remainingWeight)} kg.
            </p>

            <p>
              Country: <strong>{selectedCountry.country_name}</strong> · Port: <strong>{selectedPort.port_name}</strong>
            </p>

            <p>
              {belowMinimum
                ? `Minimum order for ${zoneLabel} is ${money(minimumOrder)}. Basket is below the minimum.`
                : `Minimum order met for ${zoneLabel} (${money(minimumOrder)} minimum).`}
            </p>

            {wrongContainer && <p>Frozen/Chilled items require a Reefer container.</p>}
            {overWeight && <p>Basket exceeds container weight limit.</p>}
            {overVolume && <p>Basket exceeds container volume limit.</p>}
          </>
        )}

        <Link to="/" className="status-change">Change shipping option</Link>
      </div>
    </>
  )
}

function Progress({ label, value, percent }) {
  return (
    <div className="progress-block">
      <div className="progress-top">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="progress-track">
        <div style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  )
}

function CheckCard({ title, status, text }) {
  return (
    <div className="check-card">
      <span className={status ? 'ok' : 'bad'}>{status ? '✓' : '!'}</span>
      <div>
        <strong>{title}</strong>
        <p>{status ? 'OK' : 'Needs Attention'}</p>
        <small>{text}</small>
      </div>
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