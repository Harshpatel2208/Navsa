import Banner from '../components/Banner'
import Deals from '../components/Deals'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ShippingSelector from '../components/ShippingSelector'
import ProductCard from '../components/ProductCard'
import './Home.css'

const categories = [
  { name: 'Chocolates', image: '/categories/1 Chocolates.PNG' },
  { name: 'Groceries', image: '/categories/2 Groceries.PNG' },
  { name: 'Confectionery', image: '/categories/3 Confectionery.PNG' },
  { name: 'Crisps & Snacks', image: '/categories/4 Crisps & Snacks.PNG' },
  { name: 'Cold & Hot Beverages', image: '/categories/5 Cold and Hot Beverages.PNG' },
  { name: 'Biscuits', image: '/categories/6 Biscuits.PNG' },
  { name: 'Seasonal', image: '/categories/7 Seasonal.PNG' },
  { name: 'Chilled Items', image: '/categories/8 Chilled Items.PNG' },
  { name: 'Frozen', image: '/categories/9 Frozen.PNG' },
  { name: 'Baby and Kids', image: '/categories/10 Baby and Kids.PNG' },
  { name: 'Health & Personal Care', image: '/categories/11 Health and Personal Care.PNG' },
  { name: 'Pet Care & Food', image: '/categories/12 Pet Care and Food.PNG' },
  { name: 'Cleaning & Households', image: '/categories/13 Cleaning & Households.PNG' },
]

const brandLogos = [
  '/brand logos/3706_2026011913353360.png',
  '/brand logos/3706_20260119133536595.png',
  '/brand logos/3706_20260119133537156.png',
  '/brand logos/3706_20260119133538846.png',
  '/brand logos/3706_20260119133541163.png',
  '/brand logos/3706_20260119133546487.png',
  '/brand logos/3706_20260119133547224.png',
  '/brand logos/3706_20260119133548337.png',
  '/brand logos/3706_20260119133550163.png',
  '/brand logos/3706_2026011913355125.png',
  '/brand logos/3706_20260119133818992.png',
  '/brand logos/3706_20260119133820735.png',
  '/brand logos/3706_20260119133822407.png',
  '/brand logos/3706_20260119133823491.png',
  '/brand logos/3706_20260119133824458.png',
  '/brand logos/3706_20260119133825685.png',
  '/brand logos/3706_20260119133826130.png',
  '/brand logos/3706_20260119133827372.png',
  '/brand logos/3706_2026012612325573.jpg',
  '/brand logos/3706_20260126123543675.jpg',
  '/brand logos/3706_20260126123543814.jpg',
  '/brand logos/3706_2026012612354431.jpg',
  '/brand logos/3706_20260126123544676.jpg',
  '/brand logos/3706_20260126123545663.jpg',
  '/brand logos/3706_20260126123546200.jpg',
  '/brand logos/3706_20260126123546300.jpg',
  '/brand logos/3706_20260126123547580.jpg',
  '/brand logos/3706_2026012612354770.jpg',
  '/brand logos/3706_20260317143151368.jpg',
  '/brand logos/3706_20260317143152425.jpg',
  '/brand logos/3706_20260317143152762.jpg',
  '/brand logos/3706_20260317143153215.jpg',
  '/brand logos/3706_20260317143153575.jpg',
  '/brand logos/3706_20260317143154422.jpg',
  '/brand logos/3706_20260317143154427.jpg',
  '/brand logos/3706_20260317143154840.jpg',
  '/brand logos/3706_20260317143155753.jpg',
]

const services = [
  {
    title: 'Consolidation and Bulk Loading Expertise',
    text: 'Efficient sourcing, consolidation and loading support for wholesale export orders.',
    icon: '◫',
  },
  {
    title: 'Flexible Transport Solutions',
    text: 'Reliable road, sea and air freight options matched to each destination.',
    icon: '↗',
  },
  {
    title: 'Custom Labelling and Packaging Services',
    text: 'Professional relabelling, date coding, translation and packaging support.',
    icon: '◈',
  },
  {
    title: 'Expert Export Documentation and Compliance',
    text: 'Certificates, regulatory guidance and accurate export documentation support.',
    icon: '▤',
  },
]

function ProductStrip({ title, subtitle, products, badge, tone = 'cream' }) {
  if (!products.length) return null

  return (
    <section className={`home-product-section home-product-section--${tone}`}>
      <div className="home-container">
        <div className="home-section-head home-section-head--split">
          <div>
            <span className="home-section-kicker">NAVSA RANGE</span>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>

          <Link to="/shop" className="home-text-link">
            View full range →
          </Link>
        </div>

        <div className="home-product-scroll">
          {products.map(product => (
            <div className="home-product-card-wrap" key={product.id}>
              <ProductCard product={product} badge={badge} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BrandLogoMarquee() {
  const brandViewportRef = useRef(null)
  const brandAnimationRef = useRef(null)
  const brandPausedRef = useRef(false)
  const repeatedLogos = [...brandLogos, ...brandLogos]

  useEffect(() => {
    let previousTime = 0

    function animate(timestamp) {
      const viewport = brandViewportRef.current

      if (viewport && !brandPausedRef.current) {
        if (previousTime) {
          const elapsed = timestamp - previousTime
          const pixelsToMove = elapsed * 0.045
          const halfwayPoint = viewport.scrollWidth / 2

          viewport.scrollLeft += pixelsToMove

          if (viewport.scrollLeft >= halfwayPoint) {
            viewport.scrollLeft -= halfwayPoint
          }
        }
      }

      previousTime = timestamp
      brandAnimationRef.current = window.requestAnimationFrame(animate)
    }

    brandAnimationRef.current = window.requestAnimationFrame(animate)

    return () => {
      if (brandAnimationRef.current) {
        window.cancelAnimationFrame(brandAnimationRef.current)
      }
    }
  }, [])

  function moveBrands(direction) {
    const viewport = brandViewportRef.current
    if (!viewport) return

    viewport.scrollBy({
      left: direction * Math.min(viewport.clientWidth * 0.72, 760),
      behavior: 'smooth',
    })
  }

  return (
    <section
      className="home-logo-marquee"
      aria-label="Featured brands"
      onMouseEnter={() => {
        brandPausedRef.current = true
      }}
      onMouseLeave={() => {
        brandPausedRef.current = false
      }}
      onTouchStart={() => {
        brandPausedRef.current = true
      }}
      onTouchEnd={() => {
        brandPausedRef.current = false
      }}
    >
      <button
        type="button"
        className="home-logo-marquee__arrow home-logo-marquee__arrow--left"
        onClick={() => moveBrands(-1)}
        aria-label="Previous brands"
      >
        ‹
      </button>

      <div
        ref={brandViewportRef}
        className="home-logo-marquee__viewport"
      >
        <div className="home-logo-marquee__track">
          {repeatedLogos.map((logo, index) => (
            <div className="home-logo-marquee__item" key={`${logo}-${index}`}>
              <img src={logo} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="home-logo-marquee__arrow home-logo-marquee__arrow--right"
        onClick={() => moveBrands(1)}
        aria-label="Next brands"
      >
        ›
      </button>
    </section>
  )
}

function getCollectionCount(payload) {
  if (Array.isArray(payload)) return payload.length
  if (Array.isArray(payload?.data)) return payload.data.length
  if (Array.isArray(payload?.items)) return payload.items.length
  if (Array.isArray(payload?.results)) return payload.results.length

  const numericTotal = Number(
    payload?.total ??
    payload?.count ??
    payload?.meta?.total ??
    payload?.pagination?.total
  )

  return Number.isFinite(numericTotal) ? numericTotal : 0
}

function formatStatNumber(value) {
  return new Intl.NumberFormat('en-GB').format(Number(value || 0))
}

function Home() {
  const repeatedCategories = [...categories, ...categories]
  const [newArrivals, setNewArrivals] = useState([])
  const [clearance, setClearance] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [stats, setStats] = useState({
    brands: 0,
    containers: 0,
    countries: 0,
    products: 0,
  })

  const categoryTrackRef = useRef(null)
  const categoryAnimationRef = useRef(null)
  const categoryPausedRef = useRef(false)

  useEffect(() => {
    fetch('/api/products?page=1&sort_by=created_at&order=desc')
      .then(r => r.json())
      .then(d => {
        setNewArrivals((d.data || []).slice(0, 10))
        setStats(s => ({ ...s, products: d.total || 0 }))
      })
      .catch(() => {})

    fetch('/api/products?page=2')
      .then(r => r.json())
      .then(d => setClearance((d.data || []).slice(0, 10)))
      .catch(() => {})

    fetch('/api/products?page=1&sort_by=price&order=desc')
      .then(r => r.json())
      .then(d => setBestSellers((d.data || []).slice(0, 10)))
      .catch(() => {})

    Promise.allSettled([
      fetch('/api/brands').then(response => response.json()),
      fetch('/api/shipping/containers').then(response => response.json()),
      fetch('/api/shipping/countries').then(response => response.json()),
    ]).then(([brandsResult, containersResult, countriesResult]) => {
      setStats(current => ({
        ...current,
        brands:
          brandsResult.status === 'fulfilled'
            ? getCollectionCount(brandsResult.value)
            : current.brands,
        containers:
          containersResult.status === 'fulfilled'
            ? getCollectionCount(containersResult.value)
            : current.containers,
        countries:
          countriesResult.status === 'fulfilled'
            ? getCollectionCount(countriesResult.value)
            : current.countries,
      }))
    })
  }, [])

  useEffect(() => {
    let previousTime = 0

    function animateCategories(timestamp) {
      const track = categoryTrackRef.current

      if (track && !categoryPausedRef.current) {
        if (previousTime) {
          const elapsed = timestamp - previousTime
          const pixelsToMove = elapsed * 0.03
          const halfwayPoint = track.scrollWidth / 2

          if (halfwayPoint > track.clientWidth) {
            track.scrollLeft += pixelsToMove

            if (track.scrollLeft >= halfwayPoint) {
              track.scrollLeft -= halfwayPoint
            }
          }
        }
      }

      previousTime = timestamp
      categoryAnimationRef.current =
        window.requestAnimationFrame(animateCategories)
    }

    categoryAnimationRef.current =
      window.requestAnimationFrame(animateCategories)

    return () => {
      if (categoryAnimationRef.current) {
        window.cancelAnimationFrame(categoryAnimationRef.current)
      }
    }
  }, [])

  function pauseCategoryAutoScroll() {
    categoryPausedRef.current = true
  }

  function resumeCategoryAutoScroll() {
    categoryPausedRef.current = false
  }

  function moveCategories(direction) {
    const track = categoryTrackRef.current
    if (!track) return

    const firstCard = track.querySelector('.home-category-card')
    const distance = (firstCard?.offsetWidth || 360) + 22

    track.scrollBy({
      left: direction * distance,
      behavior: 'smooth',
    })
  }

  return (
    <main className="home-page">
      <Banner type="hero" />
      <BrandLogoMarquee />

      <ProductStrip
        title="New Arrivals"
        subtitle="Fresh additions to the NAVSA range, ready for trade and export."
        products={newArrivals}
        badge="NEW"
        tone="cream"
      />

      <ProductStrip
        title="WIGIG — Limited Period / Clearance Offer"
        subtitle="Fast-moving opportunities with everyday low pricing."
        products={clearance}
        badge="EDLP"
        tone="white"
      />

      <ShippingSelector />

      <div className="home-view-all">
        <Link to="/shop">View All Products</Link>
      </div>

      <section className="home-category-section">
        <div className="home-container">
          <div className="home-section-head home-section-head--split">
            <div>
              <span className="home-section-kicker">BROWSE RANGE</span>
              <h2>Shop by Category</h2>
              <p>
                Browse NAVSA's wholesale product families and open the
                relevant product range.
              </p>
            </div>

            <div className="home-category-controls">
              <button
                type="button"
                onClick={() => moveCategories(-1)}
                aria-label="Previous categories"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => moveCategories(1)}
                aria-label="Next categories"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref={categoryTrackRef}
            className="home-category-track"
            onMouseEnter={pauseCategoryAutoScroll}
            onMouseLeave={resumeCategoryAutoScroll}
            onTouchStart={pauseCategoryAutoScroll}
            onTouchEnd={resumeCategoryAutoScroll}
          >
            {repeatedCategories.map((category, index) => (
              <Link
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                key={`${category.name}-${index}`}
                className="home-category-card"
                aria-label={`Shop ${category.name}`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-stats-strip">
        <div className="home-container home-stats-grid">
          <article>
            <strong>{formatStatNumber(stats.brands)}</strong>
            <span>Brands</span>
          </article>
          <article>
            <strong>{formatStatNumber(stats.containers)}</strong>
            <span>Containers Available</span>
          </article>
          <article>
            <strong>{formatStatNumber(stats.countries)}</strong>
            <span>Countries Covered</span>
          </article>
          <article>
            <strong>{formatStatNumber(stats.products)}</strong>
            <span>Products Available</span>
          </article>
          <article>
            <strong>24×7</strong>
            <span>Customer Support</span>
          </article>
        </div>
      </section>

      <ProductStrip
        title="Our Best-Sellers"
        subtitle="Popular export-ready products ordered frequently by trade customers."
        products={bestSellers}
        badge="EDLP"
        tone="white"
      />

      <Banner type="middle" />

      <section className="home-info-section">
        <div className="home-container home-info-grid">
          <article className="home-feature-card home-feature-card--customer">
            <div className="home-feature-card__image-wrap">
              <img
                src="/logos/navsa logo combined.png"
                alt="NAVSA International and The King's Awards for Enterprise"
                className="home-feature-card__image"
                loading="lazy"
              />
            </div>

            <div className="home-feature-card__content">
              <h3>Become a Customer</h3>
              <p className="home-card-intro">
                Please note: You need to meet the following criteria for us to be able to process your account.
              </p>
              <ul>
                <li>UK companies must be VAT registered.</li>
                <li>Your business is registered at a commercial property, not a home address</li>
                <li>Our minimum order is £5,000.00 for UK & Europe, £10,000.00 for ROW (Rest of the World)</li>
                <li>You need to be trading for over 12 months for UK Customers</li>
                <li>UK customers must be trading for over 12 months.</li>
              </ul>
              <Link to="/become-a-customer" className="home-card-button">
                Apply for an account
              </Link>
            </div>
          </article>

          <article className="home-feature-card home-feature-card--trade">
            <div className="home-feature-card__image-wrap home-feature-card__image-wrap--trade">
              <img
                src="/logos/tradeshow.png"
                alt="NAVSA International trade show brands"
                className="home-feature-card__image home-feature-card__image--trade"
                loading="lazy"
              />
            </div>

            <div className="home-feature-card__content home-feature-card__content--trade">
              <span className="home-section-kicker orange">TRADE SHOW</span>
              <h3>Gulfood 2026</h3>
              <p className="home-trade-date">26th to 30th January 2026</p>
              <Link
                to="/tradeshow"
                className="home-card-button home-card-button--light"
                onClick={() => {
                  if ('scrollRestoration' in window.history) {
                    window.history.scrollRestoration = 'manual'
                  }
                  window.scrollTo(0, 0)
                }}
              >
                More Details
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="home-services-section">
        <div className="home-container">
          <div className="home-section-head">
            <span className="home-section-kicker">EXPORT SUPPORT</span>
            <h2>Services We Offer</h2>
            <p>
              Practical support for retailers, wholesalers and international buyers.
            </p>
          </div>

          <div className="home-services-grid">
            {services.map(service => (
              <div className="home-service-card" key={service.title}>
                <span className="home-service-icon">{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </div>
            ))}
          </div>

          <div className="home-services-more">
            <Link to="/services" className="home-services-more__button">
              View All Services
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <Deals />

      <Banner type="bottom" />
    </main>
  )
}

export default Home