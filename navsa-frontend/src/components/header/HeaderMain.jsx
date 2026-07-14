import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  FaSearch,
  FaHeart,
  FaShoppingBasket,
  FaUser,
} from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
import './HeaderMain.css'

export default function HeaderMain() {
  const navigate = useNavigate()
  const { wishlistCount, basketCount, basketTotal } = useCart()
  const [search, setSearch] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const value = search.trim()
    navigate(value ? `/shop?search=${encodeURIComponent(value)}` : '/shop')
  }

  return (
    <div className="header-main">
      <div className="header-main__brand-row">
        <div className="header-main__side header-main__side--left">
          <img
            src="/logos/award.jpg"
            alt="King's Award for Enterprise"
            className="header-main__award"
          />

          <Link
            to="/become-a-customer"
            className="header-main__customer-button"
          >
            Become a Customer
          </Link>
        </div>

        <Link to="/" className="header-main__logo-link">
          <img
            src="/logos/navsa-logo.png"
            alt="NAVSA International"
            className="header-main__logo"
          />
        </Link>

        <div className="header-main__side header-main__side--right">
          <Link to="/account" className="header-main__account-button">
            <FaUser />
            <span>Account</span>
          </Link>

          <img
            src="/logos/award.jpg"
            alt="King's Award for Enterprise"
            className="header-main__award"
          />
        </div>
      </div>

      <div className="header-main__utility-row">
        <form className="header-main__search" onSubmit={handleSubmit}>
          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search Directory of 20,000+ British Products"
            aria-label="Search products"
          />

          <button type="submit" aria-label="Search">
            <FaSearch />
          </button>
        </form>

        <div className="header-main__actions">
          <Link to="/wishlist" className="header-main__wishlist">
            <span className="header-main__icon-wrap">
              <FaHeart />
              {wishlistCount > 0 && (
                <span className="header-main__count header-main__count--wishlist">
                  {wishlistCount}
                </span>
              )}
            </span>
            <span>Wishlist</span>
          </Link>

          <Link to="/basket" className="header-main__basket">
            <span className="header-main__icon-wrap">
              <FaShoppingBasket />
              {basketCount > 0 && (
                <span className="header-main__count header-main__count--basket">
                  {basketCount}
                </span>
              )}
            </span>

            <span className="header-main__basket-copy">
              <strong>{basketCount} items</strong>
              <small>£{Number(basketTotal || 0).toFixed(2)}</small>
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

