// import { createContext, useContext, useState, useEffect } from 'react'

// const CartContext = createContext(null)

// const BASKET_KEY = 'navsa_basket'
// const WISHLIST_KEY = 'navsa_wishlist'

// function loadFromStorage(key) {
//   try {
//     const raw = localStorage.getItem(key)
//     return raw ? JSON.parse(raw) : []
//   } catch {
//     return []
//   }
// }

// export function CartProvider({ children }) {
//   const [basketItems, setBasketItems] = useState(() => loadFromStorage(BASKET_KEY))
//   const [wishlistItems, setWishlistItems] = useState(() => loadFromStorage(WISHLIST_KEY))

//   useEffect(() => {
//     try { localStorage.setItem(BASKET_KEY, JSON.stringify(basketItems)) } catch {}
//   }, [basketItems])

//   useEffect(() => {
//     try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems)) } catch {}
//   }, [wishlistItems])

//   function addToBasket(product, { layerQty = 0, palletQty = 0 } = {}) {
//     const totalCases =
//       (layerQty * Number(product.layer_quantity || 0)) +
//       (palletQty * Number(product.pallet_quantity || 0))

//     if (totalCases <= 0) return false

//     setBasketItems(prev => {
//       const existing = prev.find(item => item.id === product.id)

//       if (existing) {
//         return prev.map(item =>
//           item.id === product.id
//             ? {
//                 ...item,
//                 layerQty: Number(item.layerQty || 0) + layerQty,
//                 palletQty: Number(item.palletQty || 0) + palletQty,
//                 totalCases: Number(item.totalCases || 0) + totalCases,
//               }
//             : item
//         )
//       }

//       return [
//         ...prev,
//         {
//           id: product.id,
//           description: product.description,
//           brand: product.brand?.brand_name || '',
//           web_image: product.web_image || '',
//           price: product.price,
//           reference: product.reference,
//           layer_quantity: product.layer_quantity || 0,
//           pallet_quantity: product.pallet_quantity || 0,
//           weight: product.weight || 0,
//           volume: product.volume || 0,
//           storage_type: product.storage_type || 'Ambient',
//           layerQty,
//           palletQty,
//           totalCases,
//         },
//       ]
//     })

//     return true
//   }

//   function removeFromBasket(id) {
//     setBasketItems(prev => prev.filter(item => item.id !== id))
//   }

//   function removeByStorageType(type) {
//     setBasketItems(prev => prev.filter(item => (item.storage_type || 'Ambient') !== type))
//   }

//   function clearBasket() {
//     setBasketItems([])
//   }

//   function addToWishlist(product) {
//     setWishlistItems(prev => {
//       if (prev.find(item => item.id === product.id)) return prev

//       return [
//         ...prev,
//         {
//           id: product.id,
//           description: product.description,
//           brand: product.brand?.brand_name || '',
//           web_image: product.web_image || '',
//           price: product.price,
//           reference: product.reference,
//         },
//       ]
//     })
//   }

//   function removeFromWishlist(id) {
//     setWishlistItems(prev => prev.filter(item => item.id !== id))
//   }

//   function isInWishlist(id) {
//     return wishlistItems.some(item => item.id === id)
//   }

//   const basketCount = basketItems.reduce((sum, item) => sum + Number(item.totalCases || 0), 0)

//   const basketTotal = basketItems.reduce(
//     (sum, item) => sum + Number(item.totalCases || 0) * Number(item.price || 0),
//     0
//   )

//   const basketWeight = basketItems.reduce(
//     (sum, item) => sum + Number(item.totalCases || 0) * Number(item.weight || 0),
//     0
//   )

//   const basketVolume = basketItems.reduce(
//     (sum, item) => sum + Number(item.totalCases || 0) * Number(item.volume || 0),
//     0
//   )

//   const wishlistCount = wishlistItems.length

//   return (
//     <CartContext.Provider
//       value={{
//         basketItems,
//         wishlistItems,
//         addToBasket,
//         removeFromBasket,
//         removeByStorageType,
//         clearBasket,
//         addToWishlist,
//         removeFromWishlist,
//         isInWishlist,
//         basketCount,
//         basketTotal,
//         basketWeight,
//         basketVolume,
//         wishlistCount,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   )
// }

// export function useCart() {
//   const ctx = useContext(CartContext)
//   if (!ctx) throw new Error('useCart must be used within a CartProvider')
//   return ctx
// }

import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const BASKET_KEY = 'navsa_basket'
const WISHLIST_KEY = 'navsa_wishlist'

function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function calcCases(item, layerQty, palletQty) {
  return (
    Number(layerQty || 0) * Number(item.layer_quantity || 0) +
    Number(palletQty || 0) * Number(item.pallet_quantity || 0)
  )
}

export function CartProvider({ children }) {
  const [basketItems, setBasketItems] = useState(() => loadFromStorage(BASKET_KEY))
  const [wishlistItems, setWishlistItems] = useState(() => loadFromStorage(WISHLIST_KEY))

  useEffect(() => {
    localStorage.setItem(BASKET_KEY, JSON.stringify(basketItems))
  }, [basketItems])

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems))
  }, [wishlistItems])

  function addToBasket(product, { layerQty = 0, palletQty = 0 } = {}) {
    const totalCases =
      Number(layerQty || 0) * Number(product.layer_quantity || 0) +
      Number(palletQty || 0) * Number(product.pallet_quantity || 0)

    if (totalCases <= 0) return false

    setBasketItems(prev => {
      const existing = prev.find(item => item.id === product.id)

      if (existing) {
        return prev.map(item => {
          if (item.id !== product.id) return item

          const newLayerQty = Number(item.layerQty || 0) + Number(layerQty || 0)
          const newPalletQty = Number(item.palletQty || 0) + Number(palletQty || 0)

          return {
            ...item,
            layerQty: newLayerQty,
            palletQty: newPalletQty,
            totalCases: calcCases(item, newLayerQty, newPalletQty),
          }
        })
      }

      return [
        ...prev,
        {
          id: product.id,
          description: product.description,
          brand: product.brand?.brand_name || '',
          web_image: product.web_image || '',
          price: product.price || 0,
          reference: product.reference,
          layer_quantity: product.layer_quantity || 0,
          pallet_quantity: product.pallet_quantity || 0,
          weight: product.weight || 0,
          volume: product.volume || 0,
          storage_type: product.storage_type || 'Ambient',
          layerQty,
          palletQty,
          totalCases,
        },
      ]
    })

    return true
  }

  function changeLayerQty(id, amount) {
    setBasketItems(prev =>
      prev
        .map(item => {
          if (item.id !== id) return item
          const layerQty = Math.max(0, Number(item.layerQty || 0) + amount)
          const palletQty = Number(item.palletQty || 0)
          return { ...item, layerQty, totalCases: calcCases(item, layerQty, palletQty) }
        })
        .filter(item => Number(item.totalCases || 0) > 0)
    )
  }

  function changePalletQty(id, amount) {
    setBasketItems(prev =>
      prev
        .map(item => {
          if (item.id !== id) return item
          const layerQty = Number(item.layerQty || 0)
          const palletQty = Math.max(0, Number(item.palletQty || 0) + amount)
          return { ...item, palletQty, totalCases: calcCases(item, layerQty, palletQty) }
        })
        .filter(item => Number(item.totalCases || 0) > 0)
    )
  }

  function removeFromBasket(id) {
    setBasketItems(prev => prev.filter(item => item.id !== id))
  }

  function removeByStorageType(type) {
    setBasketItems(prev => prev.filter(item => (item.storage_type || 'Ambient') !== type))
  }

  function clearBasket() {
    setBasketItems([])
  }

  function addToWishlist(product) {
    setWishlistItems(prev => {
      if (prev.find(item => item.id === product.id)) return prev
      return [
        ...prev,
        {
          id: product.id,
          description: product.description,
          brand: product.brand?.brand_name || '',
          web_image: product.web_image || '',
          price: product.price,
          reference: product.reference,
        },
      ]
    })
  }

  function removeFromWishlist(id) {
    setWishlistItems(prev => prev.filter(item => item.id !== id))
  }

  function isInWishlist(id) {
    return wishlistItems.some(item => item.id === id)
  }

  const basketCount = basketItems.reduce((sum, item) => sum + Number(item.totalCases || 0), 0)
  const basketTotal = basketItems.reduce((sum, item) => sum + Number(item.totalCases || 0) * Number(item.price || 0), 0)
  const basketWeight = basketItems.reduce((sum, item) => sum + Number(item.totalCases || 0) * Number(item.weight || 0), 0)
  const basketVolume = basketItems.reduce((sum, item) => sum + Number(item.totalCases || 0) * Number(item.volume || 0), 0)
  const wishlistCount = wishlistItems.length

  return (
    <CartContext.Provider value={{
      basketItems,
      wishlistItems,
      addToBasket,
      changeLayerQty,
      changePalletQty,
      removeFromBasket,
      removeByStorageType,
      clearBasket,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      basketCount,
      basketTotal,
      basketWeight,
      basketVolume,
      wishlistCount,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}