import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  FaChevronDown,
  FaHeart,
  FaSearch,
  FaShoppingBasket,
  FaUser,
} from 'react-icons/fa'
import {
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md'
import { useCart } from '../../context/CartContext'
import './HeaderMain.css'

const CATEGORIES = [
  { label: 'Chocolates', db: 'Chocolates' },
  { label: 'Groceries', db: 'Groceries' },
  { label: 'Confectionery', db: 'Confectionery' },
  { label: 'Crisps & Snacks', db: 'Crisps & Snacks' },
  { label: 'Cold and Hot Beverages', db: 'Cold and Hot Beverages' },
  { label: 'Biscuits', db: 'Biscuits' },
  { label: 'Seasonal', db: 'Seasonal' },
  { label: 'Chilled Items', db: 'Chilled Items' },
  { label: 'Frozen', db: 'Frozen' },
  { label: 'Baby and Kids', db: 'Baby and Kids' },
  { label: 'Health and Personal Care', db: 'Health and Personal Care' },
  { label: 'Pet Care and Food', db: 'Pet Care and Food' },
  { label: 'Cleaning & Households', db: 'Cleaning & Households' },
]

const LANGUAGES = [
  { value: '', label: 'Select Language' },
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pl', label: 'Polish' },
  { value: 'es', label: 'Spanish' },
]

const CURRENCIES = [
  { value: 'USD', label: 'USD US Dollar' },
  { value: 'EUR', label: 'EUR Euro' },
  { value: 'GBP', label: 'GBP Pound Sterling' },
]

function normaliseProducts(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.products)) return payload.products
  return []
}

function getProductImage(product) {
  if (!product?.web_image) return null
  return `/products/${product.web_image}`
}

export default function HeaderMain() {
  const navigate = useNavigate()
  const { wishlistCount, basketCount, basketTotal } = useCart()

  const searchAreaRef = useRef(null)
  const searchRequestRef = useRef(null)

  const [shopOpen, setShopOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('navsa_language')
    return saved === 'en' ? '' : saved || ''
  })

  const [currency, setCurrency] = useState(
    () => localStorage.getItem('navsa_currency') || 'GBP'
  )

  const [pricesHidden, setPricesHidden] = useState(
    () => localStorage.getItem('navsa_prices_hidden') === 'true'
  )

  useEffect(() => {
    localStorage.setItem('navsa_language', language)

    window.dispatchEvent(
      new CustomEvent('navsa-language-change', {
        detail: { language },
      })
    )
  }, [language])

  useEffect(() => {
    localStorage.setItem('navsa_currency', currency)

    window.dispatchEvent(
      new CustomEvent('navsa-currency-change', {
        detail: { currency },
      })
    )
  }, [currency])

  useEffect(() => {
    localStorage.setItem(
      'navsa_prices_hidden',
      String(pricesHidden)
    )

    document.documentElement.classList.toggle(
      'navsa-prices-hidden',
      pricesHidden
    )

    window.dispatchEvent(
      new CustomEvent('navsa-price-visibility-change', {
        detail: { hidden: pricesHidden },
      })
    )
  }, [pricesHidden])

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        searchAreaRef.current &&
        !searchAreaRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
        setActiveSuggestion(-1)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setShowSuggestions(false)
        setActiveSuggestion(-1)
        setShopOpen(false)
        setMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    const value = search.trim()

    if (value.length < 3) {
      searchRequestRef.current?.abort()
      setSuggestions([])
      setSuggestionsLoading(false)
      setShowSuggestions(value.length > 0)
      setActiveSuggestion(-1)
      return
    }

    const timer = window.setTimeout(async () => {
      searchRequestRef.current?.abort()

      const controller = new AbortController()
      searchRequestRef.current = controller
      setSuggestionsLoading(true)

      try {
        const response = await fetch(
          `/api/products?search=${encodeURIComponent(value)}&page=1`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error(`Search request failed: ${response.status}`)
        }

        const payload = await response.json()
        setSuggestions(normaliseProducts(payload).slice(0, 8))
        setShowSuggestions(true)
        setActiveSuggestion(-1)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Header search error:', error)
          setSuggestions([])
          setShowSuggestions(true)
        }
      } finally {
        if (!controller.signal.aborted) {
          setSuggestionsLoading(false)
        }
      }
    }, 260)

    return () => window.clearTimeout(timer)
  }, [search])

  function closeMenus() {
    setShopOpen(false)
    setMobileOpen(false)
  }

  function runSearch(value = search) {
    const cleanValue = String(value || '').trim()

    if (cleanValue && cleanValue.length < 3) {
      setSuggestions([])
      setSuggestionsLoading(false)
      setShowSuggestions(true)
      setActiveSuggestion(-1)
      return
    }

    setShowSuggestions(false)
    setActiveSuggestion(-1)
    closeMenus()

    navigate(
      cleanValue
        ? `/shop?search=${encodeURIComponent(cleanValue)}`
        : '/shop'
    )
  }

  function handleSearchSubmit(event) {
    event.preventDefault()

    if (
      activeSuggestion >= 0 &&
      suggestions[activeSuggestion]
    ) {
      openSuggestion(suggestions[activeSuggestion])
      return
    }

    runSearch()
  }

  function openSuggestion(product) {
    setSearch(product.description || product.reference || '')
    setShowSuggestions(false)
    setActiveSuggestion(-1)
    closeMenus()

    if (product?.id) {
      navigate(`/product/${product.id}`)
      return
    }

    runSearch(product.description || product.reference || '')
  }

  function handleSearchKeyDown(event) {
    if (!showSuggestions) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveSuggestion(current =>
        Math.min(current + 1, suggestions.length - 1)
      )
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveSuggestion(current =>
        Math.max(current - 1, -1)
      )
    }

    if (
      event.key === 'Enter' &&
      activeSuggestion >= 0 &&
      suggestions[activeSuggestion]
    ) {
      event.preventDefault()
      openSuggestion(suggestions[activeSuggestion])
    }
  }

  return (
    <div className="header-main">
      <div className="header-main__brand-row">
        <div className="header-main__brand-side">
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

        <div className="header-main__brand-side header-main__brand-side--right">
          <Link
            to="/account"
            className="header-main__account-button"
          >
            <FaUser />
            <span>Login</span>
          </Link>

          <img
            src="/logos/award.jpg"
            alt="King's Award for Enterprise"
            className="header-main__award"
          />
        </div>
      </div>

      <button
        type="button"
        className="header-main__mobile-toggle"
        onClick={() => setMobileOpen(current => !current)}
        aria-expanded={mobileOpen}
      >
        <span>Menu & Product Search</span>
        <FaChevronDown />
      </button>

      <div
        className={`header-main__commerce-row ${
          mobileOpen ? 'is-open' : ''
        }`}
      >
        <nav
          className="header-main__navigation"
          aria-label="Primary navigation"
        >
          <Link to="/" onClick={closeMenus}>
            Home
          </Link>

          <div
            className="header-main__shop-menu"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <Link
              to="/shop"
              className={shopOpen ? 'is-active' : ''}
              onClick={closeMenus}
              aria-expanded={shopOpen}
            >
              Shop
              <FaChevronDown />
            </Link>

            {shopOpen && (
              <div className="header-main__mega-menu">
                <section>
                  <h3>Shop by Category</h3>

                  <div className="header-main__category-grid">
                    {CATEGORIES.map(category => (
                      <Link
                        key={category.db}
                        to={`/shop?category=${encodeURIComponent(
                          category.db
                        )}`}
                        onClick={closeMenus}
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>
                </section>

                <section>
                  <h3>Quick Access</h3>

                  <div className="header-main__mega-list">
                    <Link to="/" onClick={closeMenus}>
                      My Home
                    </Link>

                    <Link to="/wishlist" onClick={closeMenus}>
                      My Favourites
                    </Link>

                    <Link to="/shop" onClick={closeMenus}>
                      All Products
                    </Link>
                  </div>
                </section>

                <section>
                  <h3>Promotions</h3>

                  <div className="header-main__mega-list">
                    <a
                      href="/deals/deal1.pdf"
                      target="_blank"
                      rel="noreferrer"
                    >
                      NAVSA P10
                    </a>

                    <a
                      href="/deals/deal2.pdf"
                      target="_blank"
                      rel="noreferrer"
                    >
                      NAVSA P11
                    </a>

                    <a
                      href="/deals/deal3.pdf"
                      target="_blank"
                      rel="noreferrer"
                    >
                      NAVSA Christmas 2026
                    </a>
                  </div>
                </section>
              </div>
            )}
          </div>

          <Link to="/brand" onClick={closeMenus}>
            Brand
            <FaChevronDown />
          </Link>
        </nav>

        <div
          className="header-main__search-area"
          ref={searchAreaRef}
        >
          <form
            className="header-main__search"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              onFocus={() => {
                if (
                  search.trim().length >= 3 ||
                  suggestionsLoading
                ) {
                  setShowSuggestions(true)
                }
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search Directory of 20,000+ British Products"
              aria-label="Search products"
              autoComplete="off"
            />

            <button type="submit" aria-label="Search products">
              <FaSearch />
            </button>
          </form>

          {showSuggestions && (
            <div
              className="header-main__suggestions"
              role="listbox"
            >
              {search.trim().length > 0 &&
                search.trim().length < 3 && (
                  <div className="header-main__search-warning">
                    Please enter a search term of at least 3 characters
                  </div>
                )}

              {search.trim().length >= 3 && suggestionsLoading && (
                <div className="header-main__suggestion-status">
                  Searching products…
                </div>
              )}

              {search.trim().length >= 3 &&
                !suggestionsLoading &&
                suggestions.length === 0 && (
                  <button
                    type="button"
                    className="header-main__no-results"
                    onClick={() => runSearch()}
                  >
                    No quick matches. Search all products for
                    “{search.trim()}” →
                  </button>
                )}

              {search.trim().length >= 3 &&
                !suggestionsLoading &&
                suggestions.map((product, index) => {
                  const image = getProductImage(product)
                  const brandName =
                    product.brand?.brand_name ||
                    product.brand_name ||
                    ''

                  return (
                    <button
                      key={
                        product.id ||
                        `${product.reference}-${index}`
                      }
                      type="button"
                      role="option"
                      aria-selected={activeSuggestion === index}
                      className={`header-main__suggestion ${
                        activeSuggestion === index
                          ? 'is-active'
                          : ''
                      }`}
                      onMouseEnter={() =>
                        setActiveSuggestion(index)
                      }
                      onClick={() => openSuggestion(product)}
                    >
                      <span className="header-main__suggestion-image">
                        {image ? (
                          <img src={image} alt="" loading="lazy" />
                        ) : (
                          <FaShoppingBasket />
                        )}
                      </span>

                      <span className="header-main__suggestion-copy">
                        <strong>
                          {product.description ||
                            product.reference ||
                            'Product'}
                        </strong>

                        <small>
                          {[
                            brandName,
                            product.reference
                              ? `SKU ${product.reference}`
                              : '',
                            product.barcode_ean
                              ? `EAN ${product.barcode_ean}`
                              : '',
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </small>
                      </span>

                      {!pricesHidden && (
                        <span className="header-main__suggestion-price">
                          £{Number(product.price || 0).toFixed(2)}
                        </span>
                      )}
                    </button>
                  )
                })}

              {search.trim().length >= 3 &&
                !suggestionsLoading &&
                suggestions.length > 0 && (
                  <button
                    type="button"
                    className="header-main__view-all-results"
                    onClick={() => runSearch()}
                  >
                    View all results for “{search.trim()}” →
                  </button>
                )}
            </div>
          )}
        </div>

        <div className="header-main__controls">
          <label className="header-main__select">
            <span className="sr-only">Select language</span>

            <select
              value={language}
              onChange={event =>
                setLanguage(event.target.value)
              }
              aria-label="Select language"
            >
              {LANGUAGES.map(option => (
                <option
                  key={option.value || 'select-language'}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <FaChevronDown />
          </label>

          <label className="header-main__select header-main__currency">
            <span className="sr-only">Select currency</span>

            <select
              value={currency}
              onChange={event =>
                setCurrency(event.target.value)
              }
              aria-label="Select currency"
            >
              {CURRENCIES.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <FaChevronDown />
          </label>

          <button
            type="button"
            className={`header-main__price-toggle ${
              pricesHidden ? 'is-active' : ''
            }`}
            onClick={() =>
              setPricesHidden(current => !current)
            }
            aria-label={
              pricesHidden ? 'Show prices' : 'Hide prices'
            }
            title={
              pricesHidden ? 'Show prices' : 'Hide prices'
            }
          >
            {pricesHidden ? (
              <MdVisibility />
            ) : (
              <MdVisibilityOff />
            )}
          </button>

          <Link
            to="/basket"
            className="header-main__basket"
            onClick={closeMenus}
          >
            <span className="header-main__icon">
              <FaShoppingBasket />

              {basketCount > 0 && <span>{basketCount}</span>}
            </span>

            <span className="header-main__basket-copy">
              <strong>{basketCount} items</strong>

              {!pricesHidden && (
                <small>
                  £{Number(basketTotal || 0).toFixed(2)}
                </small>
              )}
            </span>
          </Link>

          <Link
            to="/wishlist"
            className="header-main__wishlist"
            onClick={closeMenus}
          >
            <span className="header-main__icon">
              <FaHeart />

              {wishlistCount > 0 && <span>{wishlistCount}</span>}
            </span>

            <span>My Wishlist</span>
          </Link>
        </div>
      </div>
    </div>
  )
}