import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import './Shop.css'

function normaliseProducts(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.products)) return payload.products
  return []
}

function productImage(product) {
  return product?.web_image ? `/products/${product.web_image}` : ''
}

function Shop() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const suggestionRequestRef = useRef(null)

  const categoryFilter = searchParams.get('category') || ''
  const brandFilter = searchParams.get('brand') || ''
  const urlSearch = searchParams.get('search') || ''

  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [search, setSearch] = useState(urlSearch)
  const [loading, setLoading] = useState(true)
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchTouched, setSearchTouched] = useState(false)

  async function loadProducts(page = 1, searchValue = search) {
    setLoading(true)

    try {
      let url = `/api/products?page=${page}`
      if (categoryFilter) url += `&category=${encodeURIComponent(categoryFilter)}`
      if (brandFilter) url += `&brand=${encodeURIComponent(brandFilter)}`
      if (searchValue.trim().length >= 3) {
        url += `&search=${encodeURIComponent(searchValue.trim())}`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error(`Products request failed: ${response.status}`)
      const data = await response.json()

      setProducts(data.data || [])
      setTotal(data.total || 0)
      setCurrentPage(data.current_page || 1)
      setLastPage(data.last_page || 1)
    } catch (error) {
      console.error(error)
      setProducts([])
      setTotal(0)
      setCurrentPage(1)
      setLastPage(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSearch(urlSearch)
    setSearchTouched(false)
    setSuggestions([])
    setShowSuggestions(false)
    loadProducts(1, urlSearch)
  }, [categoryFilter, brandFilter, urlSearch])

  useEffect(() => {
    const value = search.trim()

    if (value.length < 3) {
      suggestionRequestRef.current?.abort()
      setSuggestions([])
      setSuggestionsLoading(false)
      setShowSuggestions(value.length > 0)
      return
    }

    const timer = window.setTimeout(async () => {
      suggestionRequestRef.current?.abort()
      const controller = new AbortController()
      suggestionRequestRef.current = controller
      setSuggestionsLoading(true)
      setShowSuggestions(true)

      try {
        let url = `/api/products?page=1&search=${encodeURIComponent(value)}`
        if (categoryFilter) url += `&category=${encodeURIComponent(categoryFilter)}`
        if (brandFilter) url += `&brand=${encodeURIComponent(brandFilter)}`

        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) throw new Error(`Suggestion request failed: ${response.status}`)
        const payload = await response.json()
        setSuggestions(normaliseProducts(payload).slice(0, 8))
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(error)
          setSuggestions([])
        }
      } finally {
        if (!controller.signal.aborted) setSuggestionsLoading(false)
      }
    }, 280)

    return () => window.clearTimeout(timer)
  }, [search, categoryFilter, brandFilter])

  function handleSearch(event) {
    event.preventDefault()
    const value = search.trim()
    setSearchTouched(true)

    if (value.length < 3) {
      setShowSuggestions(true)
      return
    }

    setShowSuggestions(false)
    navigate(`/shop?${new URLSearchParams({
      ...(categoryFilter ? { category: categoryFilter } : {}),
      ...(brandFilter ? { brand: brandFilter } : {}),
      search: value,
    }).toString()}`)
  }

  function openSuggestion(product) {
    setShowSuggestions(false)
    if (product?.id) navigate(`/product/${product.id}`)
  }

  return (
    <main className="shop-page">
      {(categoryFilter || brandFilter || urlSearch) && (
        <section className="shop-filter-strip">
          <div>
            {categoryFilter && <span>Category: <strong>{categoryFilter}</strong></span>}
            {brandFilter && <span>Brand: <strong>{brandFilter}</strong></span>}
            {urlSearch && <span>Search: <strong>{urlSearch}</strong></span>}
          </div>
          <Link to="/shop">Clear filters</Link>
        </section>
      )}

      <section className="shop-search-section">
        <div className="shop-search-area">
          <form className="shop-search-box" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder={categoryFilter
                ? `Search within ${categoryFilter}...`
                : 'Search by product, brand, barcode or code...'}
              value={search}
              onChange={event => {
                setSearch(event.target.value)
                setSearchTouched(true)
              }}
              onFocus={() => {
                if (search.trim().length > 0) setShowSuggestions(true)
              }}
              autoComplete="off"
            />
            <button type="submit">Search</button>
          </form>

          {showSuggestions && search.trim().length > 0 && (
            <div className="shop-search-suggestions">
              {search.trim().length < 3 ? (
                <div className="shop-search-warning">
                  Please enter a search term of at least 3 characters
                </div>
              ) : suggestionsLoading ? (
                <div className="shop-search-status">Searching products…</div>
              ) : suggestions.length ? (
                <>
                  {suggestions.map(product => (
                    <button
                      type="button"
                      key={product.id}
                      className="shop-search-suggestion"
                      onClick={() => openSuggestion(product)}
                    >
                      <span className="shop-search-suggestion-image">
                        {productImage(product) && (
                          <img src={productImage(product)} alt="" loading="lazy" />
                        )}
                      </span>
                      <span>
                        <strong>{product.description || product.reference}</strong>
                        <small>
                          {[product.brand?.brand_name || product.brand_name,
                            product.reference ? `SKU ${product.reference}` : '',
                            product.barcode_ean ? `EAN ${product.barcode_ean}` : '']
                            .filter(Boolean).join(' · ')}
                        </small>
                      </span>
                    </button>
                  ))}
                  <button type="button" className="shop-search-view-all" onClick={handleSearch}>
                    View all matching products →
                  </button>
                </>
              ) : (
                <div className="shop-search-status">
                  No matching products found{categoryFilter ? ` in ${categoryFilter}` : ''}.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="shop-content">
        <div className="shop-toolbar">
          <div>
            <span className="shop-kicker">PRODUCT DIRECTORY</span>
            <h1>{categoryFilter || brandFilter || (urlSearch ? `Results for “${urlSearch}”` : 'All Products')}</h1>
          </div>
          <p>Showing <strong>{products.length}</strong> of <strong>{total}</strong> products</p>
        </div>

        {loading ? (
          <div className="shop-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="shop-skeleton-card" key={index}>
                <div className="shop-skeleton-img" />
                <div className="shop-skeleton-line big" />
                <div className="shop-skeleton-line" />
                <div className="shop-skeleton-line small" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="shop-empty">
            <div>🔍</div><h2>No products found</h2>
            <p>Try another search term, category or brand.</p>
            <Link to="/shop">View all products</Link>
          </div>
        ) : (
          <div className="shop-grid">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="shop-pagination">
            <button type="button" onClick={() => loadProducts(currentPage - 1, urlSearch)} disabled={currentPage <= 1}>← Prev</button>
            <span>Page {currentPage} / {lastPage}</span>
            <button type="button" onClick={() => loadProducts(currentPage + 1, urlSearch)} disabled={currentPage >= lastPage}>Next →</button>
          </div>
        )}
      </section>
    </main>
  )
}

export default Shop