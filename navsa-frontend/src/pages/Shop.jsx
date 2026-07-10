import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import './Shop.css'

function Shop() {
  const [searchParams] = useSearchParams()

  const categoryFilter = searchParams.get('category') || ''
  const brandFilter = searchParams.get('brand') || ''

  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadProducts(page = 1) {
    setLoading(true)

    try {
      let url = `/api/products?page=${page}`

      if (categoryFilter) {
        url += `&category=${encodeURIComponent(categoryFilter)}`
      }

      if (brandFilter) {
        url += `&brand=${encodeURIComponent(brandFilter)}`
      }

      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`
      }

      const response = await fetch(url)
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
    setSearch('')
    loadProducts(1)
  }, [categoryFilter, brandFilter])

  function handleSearch(e) {
    e.preventDefault()
    loadProducts(1)
  }

  return (
    <main className="shop-page">
      {(categoryFilter || brandFilter) && (
        <section className="shop-filter-strip">
          <div>
            {categoryFilter && (
              <span>
                Category: <strong>{categoryFilter}</strong>
              </span>
            )}

            {brandFilter && (
              <span>
                Brand: <strong>{brandFilter}</strong>
              </span>
            )}
          </div>

          <Link to="/shop">Clear filters</Link>
        </section>
      )}

      <section className="shop-search-section">
        <form className="shop-search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by product, brand, barcode or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">Search</button>
        </form>
      </section>

      <section className="shop-content">
        <div className="shop-toolbar">
          <div>
            <span className="shop-kicker">PRODUCT DIRECTORY</span>
            <h1>
              {categoryFilter
                ? categoryFilter
                : brandFilter
                  ? brandFilter
                  : 'All Products'}
            </h1>
          </div>

          <p>
            Showing <strong>{products.length}</strong> of <strong>{total}</strong> products
          </p>
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
            <div>🔍</div>
            <h2>No products found</h2>
            <p>Try another search term, category or brand.</p>
            <Link to="/shop">View all products</Link>
          </div>
        ) : (
          <div className="shop-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="shop-pagination">
            <button
              type="button"
              onClick={() => loadProducts(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              ← Prev
            </button>

            <span>
              Page {currentPage} / {lastPage}
            </span>

            <button
              type="button"
              onClick={() => loadProducts(currentPage + 1)}
              disabled={currentPage >= lastPage}
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default Shop