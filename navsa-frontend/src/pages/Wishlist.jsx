import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmModal from '../components/common/ConfirmModal'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import './Wishlist.css'

function normaliseProduct(payload, fallback) {
  const product = payload?.data ?? payload?.product ?? payload

  if (!product || typeof product !== 'object' || Array.isArray(product)) {
    return fallback
  }

  return {
    ...fallback,
    ...product,
    id: product.id ?? fallback.id,
  }
}

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useCart()
  const [products, setProducts] = useState(wishlistItems)
  const [loading, setLoading] = useState(false)
  const [productToRemove, setProductToRemove] = useState(null)

  const wishlistIds = useMemo(
    () => wishlistItems.map(item => String(item.id)).join(','),
    [wishlistItems]
  )

  useEffect(() => {
    let cancelled = false

    async function hydrateWishlistProducts() {
      if (!wishlistItems.length) {
        setProducts([])
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const hydrated = await Promise.all(
          wishlistItems.map(async item => {
            try {
              const response = await fetch(`/api/products/${item.id}`, {
                headers: { Accept: 'application/json' },
              })

              if (!response.ok) return item

              const payload = await response.json()
              return normaliseProduct(payload, item)
            } catch (error) {
              console.error(
                `Could not refresh wishlist product ${item.id}:`,
                error
              )
              return item
            }
          })
        )

        if (!cancelled) {
          setProducts(hydrated)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    hydrateWishlistProducts()

    return () => {
      cancelled = true
    }
  }, [wishlistIds, wishlistItems])

  function requestRemove(product) {
    setProductToRemove(product)
  }

  function closeRemoveModal() {
    setProductToRemove(null)
  }

  function confirmRemove() {
    const productId = productToRemove?.id
    if (productId === undefined || productId === null) return

    removeFromWishlist(productId)
    setProducts(currentProducts =>
      currentProducts.filter(
        product => String(product.id) !== String(productId)
      )
    )
    closeRemoveModal()
  }

  if (!wishlistItems.length) {
    return (
      <main className="wishlist-page wishlist-page--empty">
        <section className="wishlist-empty-card">
          <div className="wishlist-empty-icon" aria-hidden="true">
            ♡
          </div>
          <span className="wishlist-eyebrow">SAVED PRODUCTS</span>
          <h1>Your Wishlist is Empty</h1>
          <p>
            Browse the catalogue and save products that you may want to
            order later.
          </p>
          <Link to="/shop" className="wishlist-primary-link">
            Browse Products →
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="wishlist-page">
      <div className="wishlist-shell">
        <header className="wishlist-header">
          <div>
            <span className="wishlist-eyebrow">SAVED PRODUCTS</span>
            <h1>
              Your Wishlist
              <small>
                {wishlistItems.length}{' '}
                {wishlistItems.length === 1 ? 'product' : 'products'}
              </small>
            </h1>
            <p>
              Review saved products, open their full details or add them
              directly to your basket.
            </p>
          </div>

          <Link to="/shop" className="wishlist-secondary-link">
            Continue Shopping →
          </Link>
        </header>

        {loading && (
          <div className="wishlist-refresh-message" role="status">
            Refreshing current product information…
          </div>
        )}

        <section className="wishlist-grid" aria-label="Wishlist products">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onWishlistRemoveRequest={requestRemove}
            />
          ))}
        </section>
      </div>

      <ConfirmModal
        open={Boolean(productToRemove)}
        eyebrow="WISHLIST"
        icon="♥"
        title="Remove this product?"
        message={
          <>
            Are you sure you want to remove
            <strong> “{productToRemove?.description}” </strong>
            from your wishlist?
          </>
        }
        description="You can add it again at any time."
        cancelText="Keep Item"
        confirmText="Remove Item"
        variant="danger"
        onClose={closeRemoveModal}
        onConfirm={confirmRemove}
      />
    </main>
  )
}