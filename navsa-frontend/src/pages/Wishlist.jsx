import { Link } from 'react-router-dom'
import { colors, fonts, radius, shadow } from '../theme'
import { useCart } from '../context/CartContext'

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useCart()

  if (wishlistItems.length === 0) {
    return (
      <div style={{ width: '100%', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.paper, padding: '60px 6vw' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '14px' }}>♥</div>
          <h2 style={{ fontFamily: fonts.display, color: colors.navy, marginBottom: '10px' }}>Your Wishlist is Empty</h2>
          <p style={{ color: colors.inkMuted, fontSize: '14px', marginBottom: '24px' }}>
            Browse the catalogue and save products you're interested in.
          </p>
          <Link to="/shop">
            <button style={{ background: colors.accent, color: '#fff', border: 'none', padding: '12px 30px', fontWeight: 600, cursor: 'pointer', borderRadius: radius.pill, boxShadow: '0 8px 20px rgba(201, 168, 76, 0.3)' }}>
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', minHeight: '60vh', background: colors.paper, padding: '50px 6vw' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '28px', marginBottom: '28px' }}>
          Your Wishlist <span style={{ color: colors.inkMuted, fontSize: '16px', fontWeight: 400 }}>({wishlistItems.length} products)</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '22px' }}>
          {wishlistItems.map(item => (
            <div key={item.id} style={{ background: '#fff', border: `1px solid rgba(149, 204, 221, 0.6)`, borderRadius: radius.md, boxShadow: shadow.soft, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', height: '170px', background: '#EFEDE6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {item.web_image ? (
                  <img
                    src={`/products/${item.web_image}`}
                    alt={item.description}
                    style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <span style={{ color: '#A7AAB2', fontFamily: fonts.mono, fontSize: '11px' }}>NO IMAGE</span>
                )}
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {item.brand && (
                  <span style={{ fontFamily: fonts.mono, fontSize: '10px', color: '#f58220', fontWeight: 700, marginBottom: '6px' }}>
                    {item.brand}
                  </span>
                )}
                <h3 style={{ fontFamily: fonts.display, fontSize: '14px', color: colors.navy, minHeight: '40px', margin: '0 0 10px' }}>
                  {item.description}
                </h3>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#1F7A4D', marginBottom: '14px', fontFamily: fonts.display }}>
                  £{item.price}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <Link to={`/product/${item.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                    <button style={{ width: '100%', background: colors.navy, color: '#fff', border: 'none', padding: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: fonts.mono, fontSize: '11px', borderRadius: radius.sm }}>
                      VIEW PRODUCT
                    </button>
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    style={{ background: 'transparent', border: `1px solid ${colors.hairline}`, color: '#B3261E', padding: '10px 12px', cursor: 'pointer', fontFamily: fonts.mono, fontSize: '11px', borderRadius: radius.sm }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
