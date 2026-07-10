import HeroSlider from '../components/HeroSlider'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ShippingSelector from '../components/ShippingSelector'
import ProductCard from '../components/ProductCard'
import './Home.css'

const categories = [
  'Chocolates',
  'Groceries',
  'Confectionery',
  'Crisps & Snacks',
  'Cold & Hot Beverages',
  'Biscuits',
  'Seasonal',
  'Chilled Items',
  'Frozen',
  'Baby and Kids',
  'Health & Personal Care',
  'Pet Care & Food',
  'Cleaning & Households',
]

const services = [
  'Consolidation and Bulk Loading Expertise',
  'Flexible Transport Solutions',
  'Custom Labelling and Packaging Services',
  'Expert Export Documentation and Compliance',
]

const brands = [
  'Kit Kat',
  'Twix',
  'Lipton',
  'Nescafe',
  'Bisto',
  'Tetley',
  'Walkers',
  "Young's",
  'Lindt',
  'McVities',
]

const comingSoon = [
  'Spring Range 2027',
  'New Snacking Line',
  'Expanded Health & Wellness',
]

function ProductStrip({ title, subtitle, products, badge }) {
  if (!products.length) return null

  return (
    <section className="home-product-section">
      <div className="home-container">
        <div className="home-section-head">
          <span className="home-section-kicker">NAVSA RANGE</span>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
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

function Home() {
  const [newArrivals, setNewArrivals] = useState([])
  const [clearance, setClearance] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [stats, setStats] = useState({ products: 0 })

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
  }, [])

  return (
    <main className="home-page">
      <HeroSlider />

      <ProductStrip
        title="New Arrivals"
        subtitle="Everyday essentials, delivered fast — your go-to for FMCG products."
        products={newArrivals}
        badge="NEW"
      />

      <ProductStrip
        title="WIGIG — Limited Period / Clearance Offer"
        subtitle="Every day low price products for fast-moving trade orders."
        products={clearance}
        badge="EDLP"
      />

      <ShippingSelector />

      <section className="home-brand-strip">
        <div className="home-container home-brand-scroll">
          {brands.map(brand => (
            <Link
              key={brand}
              to={`/shop?brand=${encodeURIComponent(brand)}`}
              className="home-brand-pill"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      <div className="home-view-all">
        <Link to="/shop">View All Products</Link>
      </div>

      <section className="home-category-section">
        <div className="home-container">
          <div className="home-section-head">
            <span className="home-section-kicker">BROWSE RANGE</span>
            <h2>Shop by Category</h2>
          </div>

          <div className="home-category-grid">
            {categories.map(category => (
              <Link
                to={`/shop?category=${encodeURIComponent(category)}`}
                key={category}
                className="home-category-card"
              >
                <span>{category}</span>
                <strong>Explore →</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-stats-strip">
        <div className="home-container home-stats-grid">
          <span>500+ Brands</span>
          <span>1,200+ Containers Loaded</span>
          <span>80+ Countries Covered</span>
          <span>{stats.products}+ Products Available</span>
          <span>Customer Support 24×7</span>
        </div>
      </section>

      <ProductStrip
        title="Our Best-Sellers"
        subtitle="Popular export-ready products ordered frequently by trade customers."
        products={bestSellers}
        badge="EDLP"
      />

      <section className="home-info-section">
        <div className="home-container home-info-grid">
          <div className="home-info-card">
            <span className="home-section-kicker">JOIN NAVSA</span>
            <h3>Become a Customer</h3>
            <ul>
              <li>UK companies must be VAT registered.</li>
              <li>Business registered at a commercial property, not a home address.</li>
              <li>Minimum order £5,000 for UK & Europe.</li>
              <li>Minimum order £10,000 for Rest of World.</li>
              <li>UK customers must be trading for over 12 months.</li>
            </ul>
          </div>

          <div className="home-trade-card">
            <span className="home-section-kicker orange">TRADE SHOW</span>
            <h3>Gulfood 2026</h3>
            <p>26th to 30th January 2026</p>
            <p>Meet NAVSA for export, wholesale and consolidation opportunities.</p>
          </div>
        </div>
      </section>

      <section className="home-services-section">
        <div className="home-container">
          <div className="home-section-head">
            <span className="home-section-kicker">EXPORT SUPPORT</span>
            <h2>Services We Offer</h2>
          </div>

          <div className="home-services-grid">
            {services.map(service => (
              <div className="home-service-card" key={service}>
                {service}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-coming-section">
        <div className="home-container">
          <div className="home-section-head light">
            <span className="home-section-kicker orange">COMING SOON</span>
            <h2>Upcoming Ranges</h2>
          </div>

          <div className="home-coming-grid">
            {comingSoon.map(item => (
              <div className="home-coming-card" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-promo-section">
        <div className="home-container home-promo-card">
          <span className="home-section-kicker orange">LATEST DEALS</span>
          <h2>Download Our Latest Promotions</h2>
          <p>
            Monthly impulse promotions with top UK brands for retailers at fantastic prices.
          </p>

          <a
            href="https://www.navsainternational.co.uk/resources/deal1.pdf"
            target="_blank"
            rel="noreferrer"
          >
            View Latest Deals PDF
          </a>
        </div>
      </section>
    </main>
  )
}

export default Home