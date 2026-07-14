import { createContext, useContext, useEffect, useState } from 'react'

const ShippingContext = createContext(null)
const SHIPPING_KEY = 'navsa_shipping'

const emptyShipping = {
  container: null,
  country: null,
  port: null,
}

function loadShipping() {
  try {
    const raw = localStorage.getItem(SHIPPING_KEY)
    return raw ? JSON.parse(raw) : emptyShipping
  } catch {
    return emptyShipping
  }
}

export function ShippingProvider({ children }) {
  const [shipping, setShipping] = useState(loadShipping)

  useEffect(() => {
    localStorage.setItem(SHIPPING_KEY, JSON.stringify(shipping))
  }, [shipping])

  function setShippingOption({ container, country, port }) {
    setShipping({ container, country, port })
  }

  function clearShipping() {
    setShipping(emptyShipping)
  }

  const isCollection =
    shipping.container?.container_name?.toLowerCase().includes('collection / ex works')

  const hasShipping =
    Boolean(shipping.container) &&
    (isCollection || (Boolean(shipping.country) && Boolean(shipping.port)))

  return (
    <ShippingContext.Provider value={{
      shipping,
      hasShipping,
      isCollection,
      setShippingOption,
      clearShipping,
    }}>
      {children}
    </ShippingContext.Provider>
  )
}

export function useShipping() {
  const ctx = useContext(ShippingContext)
  if (!ctx) throw new Error('useShipping must be used within ShippingProvider')
  return ctx
}