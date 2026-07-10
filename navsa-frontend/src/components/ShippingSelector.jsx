import { useEffect, useState } from 'react'
import { getContainers, getCountries, getPorts } from '../services/shippingService'
import { useShipping } from '../context/ShippingContext'
import './ShippingSelector.css'

function ShippingSelector() {
  const { setShippingOption } = useShipping()

  const [containers, setContainers] = useState([])
  const [countries, setCountries] = useState([])
  const [ports, setPorts] = useState([])

  const [containerId, setContainerId] = useState('')
  const [countryId, setCountryId] = useState('')
  const [portId, setPortId] = useState('')

  const selectedContainer = containers.find(c => String(c.id) === String(containerId))
  const selectedCountry = countries.find(c => String(c.id) === String(countryId))
  const selectedPort = ports.find(p => String(p.id) === String(portId))

  const isCollection =
    selectedContainer?.container_name?.toLowerCase().includes('collection / ex works')

  useEffect(() => {
    async function loadData() {
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

    loadData()
  }, [])

  useEffect(() => {
    async function loadPorts() {
      setPorts([])
      setPortId('')

      if (!countryId || isCollection) return

      try {
        const portData = await getPorts(countryId)
        setPorts(portData)
      } catch (error) {
        console.error(error)
      }
    }

    loadPorts()
  }, [countryId, isCollection])

  function handleContainerChange(e) {
    setContainerId(e.target.value)
    setCountryId('')
    setPortId('')
    setPorts([])
  }

  function handleStartOrder() {
    if (!selectedContainer) {
      alert('Please select container.')
      return
    }

    if (!isCollection && (!selectedCountry || !selectedPort)) {
      alert('Please select country and port.')
      return
    }

    setShippingOption({
      container: selectedContainer,
      country: isCollection
        ? { id: null, country_name: 'Collection / Ex Works', zone_id: 1 }
        : selectedCountry,
      port: isCollection
        ? { id: null, port_name: 'Warehouse Collection' }
        : selectedPort,
    })

    alert('Shipping option saved. You can now continue shopping.')
  }

  return (
    <section id="shipping-selector" className="shipping-section">
      <div className="shipping-card">
        <div className="shipping-header">
          <span className="shipping-badge">EXPORT SHIPPING OPTIONS</span>

          <h2>Check Estimated Shipping Duration and Pricing</h2>

          <div className="shipping-note">
  <strong>NOTE:</strong> Frozen and chilled items require a Reefer container.
  Please select a Reefer container, or remove Frozen/Chilled items from your basket.
</div>

          <p>
  {isCollection
    ? 'Collection selected. Country and port selection are not required.'
    : 'Select your container, delivery country and destination port before ordering.'}
</p>
        </div>

        <div className={`shipping-form ${isCollection ? 'collection-mode' : ''}`}>
          <div className="shipping-field">
            <label>Container</label>
            <select value={containerId} onChange={handleContainerChange}>
              <option value="">Select container...</option>
              {containers.map(container => (
                <option key={container.id} value={container.id}>
                  {container.container_name}
                </option>
              ))}
            </select>
          </div>

          {!isCollection && (
            <>
              <div className="shipping-field">
                <label>Country</label>
                <select value={countryId} onChange={(e) => setCountryId(e.target.value)}>
                  <option value="">Select country...</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.country_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="shipping-field">
                <label>Port</label>
                <select
                  value={portId}
                  onChange={(e) => setPortId(e.target.value)}
                  disabled={!countryId}
                >
                  <option value="">
                    {countryId ? 'Select port...' : 'Select country first'}
                  </option>

                  {ports.map(port => (
                    <option key={port.id} value={port.id}>
                      {port.port_name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            className="shipping-start-btn"
            onClick={handleStartOrder}
            disabled={!selectedContainer || (!isCollection && (!selectedCountry || !selectedPort))}
          >
            Start Order →
          </button>
        </div>

        {selectedContainer && isCollection && (
          <>
            <div className="shipping-collection-line">
              <strong>Collection:</strong> You will arrange pickup (EXW). No shipping specs.
              Minimum order <strong>£5,000</strong>.
            </div>

            <div className="shipping-collection-note">
              Collection selected - minimum order <strong>£5,000</strong> applies. Click{' '}
              <strong>Start Order</strong>.
            </div>
          </>
        )}

        {selectedContainer && !isCollection && (
          <div className="shipping-spec-line">
            <strong>Specs:</strong> {selectedContainer.container_name}
            {' | '}Cubic:{' '}
            <strong>{Number(selectedContainer.volume_m3).toLocaleString(undefined, { maximumFractionDigits: 1 })} m³</strong>
            {' | '}Gross:{' '}
            <strong>{Number(selectedContainer.gross_weight_kg).toLocaleString()} kg</strong>
            {' | '}Payload:{' '}
            <strong>{Number(selectedContainer.payload_weight_kg).toLocaleString()} kg</strong>
          </div>
        )}

        {!isCollection && selectedCountry && selectedPort && (
          <div className="shipping-selected">
            Shipping selected: {selectedCountry.country_name} · {selectedPort.port_name}
          </div>
        )}
      </div>
    </section>
  )
}

export default ShippingSelector