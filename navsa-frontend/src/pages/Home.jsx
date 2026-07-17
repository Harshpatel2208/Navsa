import HeroSlider from '../components/HeroSlider'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ShippingSelector from '../components/ShippingSelector'
import ProductCard from '../components/ProductCard'
import './Home.css'

const categories = [
  { name: 'Chocolates', number: '01' },
  { name: 'Groceries', number: '02' },
  { name: 'Confectionery', number: '03' },
  { name: 'Crisps & Snacks', number: '04' },
  { name: 'Cold & Hot Beverages', number: '05' },
  { name: 'Biscuits', number: '06' },
  { name: 'Seasonal', number: '07' },
  { name: 'Chilled Items', number: '08' },
  { name: 'Frozen', number: '09' },
  { name: 'Baby and Kids', number: '10' },
  { name: 'Health & Personal Care', number: '11' },
  { name: 'Pet Care & Food', number: '12' },
  { name: 'Cleaning & Households', number: '13' },
]

const services = [
  {
    title: 'Consolidation Expertise',
    text: 'Efficient mixed-load consolidation for wholesale export orders.',
    icon: '◫',
  },
  {
    title: 'Flexible Transport',
    text: 'Road, sea and air freight options matched to every destination.',
    icon: '↗',
  },
  {
    title: 'Custom Labelling',
    text: 'Professional relabelling, compliance and packaging support.',
    icon: '◈',
  },
  {
    title: 'Export Documentation',
    text: 'Accurate paperwork and compliance support for international trade.',
    icon: '▤',
  },
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



const promotions = [
  {
    id: 'p10',
    title: 'NAVSA P10',
    validFrom: '08/06/2026',
    validTo: '19/07/2026',
    description:
      'Monthly impulse promotions with all the top UK brands for retailers at fantastic prices.',
    preview: '/deals/deal1_preview.jpg',
    pdf: '/deals/deal1.pdf',
    badge: 'LATEST',
  },
  {
    id: 'p11',
    title: 'NAVSA P11',
    validFrom: '29/06/2026',
    validTo: '09/08/2026',
    description:
      'Monthly retail grocery promotions with all the top UK brands for retailers at fantastic prices.',
    preview: '/deals/deal2_preview.jpg',
    pdf: '/deals/deal2.pdf',
    badge: 'NEW',
  },
  {
    id: 'christmas-2026',
    title: 'NAVSA Christmas 2026',
    validFrom: '',
    validTo: '',
    description:
      'Monthly food service promotions: discover the latest products for the food service sector at fantastic prices.',
    preview: '/deals/deal3_preview.png',
    pdf: '/deals/deal3.pdf',
    badge: 'CHRISTMAS',
  },
]

const comingSoon = [
  'Spring Range 2027',
  'New Snacking Line',
  'Expanded Health & Wellness',
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


function PromotionCard({ promotion }) {
  return (
    <article className="home-promotion-card">
      <span className="home-promotion-badge">{promotion.badge}</span>

      <a
        href={promotion.pdf}
        target="_blank"
        rel="noreferrer"
        className="home-promotion-preview"
        aria-label={`Open ${promotion.title} promotion PDF`}
      >
        <img
          src={promotion.preview}
          alt={`${promotion.title} first-page preview`}
        />

        <span className="home-promotion-preview-action">
          Open catalogue →
        </span>
      </a>

      <div className="home-promotion-body">
        <div className="home-promotion-title-row">
          <div>
            <span className="home-promotion-kicker">
              PROMOTION CATALOGUE
            </span>

            <h3>{promotion.title}</h3>
          </div>

          <span className="home-promotion-pdf-label">PDF</span>
        </div>

        {promotion.validFrom && promotion.validTo && (
          <p className="home-promotion-validity">
            Valid {promotion.validFrom} to {promotion.validTo}
          </p>
        )}

        <p className="home-promotion-description">
          {promotion.description}
        </p>

        <div className="home-promotion-buttons">
          <a
            href={promotion.pdf}
            target="_blank"
            rel="noreferrer"
            className="home-promotion-view"
          >
            View PDF
          </a>

          <a
            href={promotion.pdf}
            download
            className="home-promotion-download"
          >
            Download
          </a>
        </div>
      </div>
    </article>
  )
}

function Home() {
  const [newArrivals, setNewArrivals] = useState([])
  const [clearance, setClearance] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [stats, setStats] = useState({ products: 0 })

  const categoryTrackRef = useRef(null)
  const categoryTimerRef = useRef(null)

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

  useEffect(() => {
    startCategoryAutoScroll()
    return stopCategoryAutoScroll
  }, [])

  function startCategoryAutoScroll() {
    stopCategoryAutoScroll()

    categoryTimerRef.current = window.setInterval(() => {
      const track = categoryTrackRef.current
      if (!track) return

      const firstCard = track.querySelector('.home-category-card')
      const distance = (firstCard?.offsetWidth || 280) + 18
      const maxScroll = track.scrollWidth - track.clientWidth
      const nextLeft = track.scrollLeft + distance

      if (nextLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        track.scrollBy({ left: distance, behavior: 'smooth' })
      }
    }, 3800)
  }

  function stopCategoryAutoScroll() {
    if (categoryTimerRef.current) {
      window.clearInterval(categoryTimerRef.current)
      categoryTimerRef.current = null
    }
  }

  function moveCategories(direction) {
    const track = categoryTrackRef.current
    if (!track) return

    const firstCard = track.querySelector('.home-category-card')
    const distance = (firstCard?.offsetWidth || 280) + 18

    track.scrollBy({
      left: direction * distance,
      behavior: 'smooth',
    })
  }

  return (
    <main className="home-page">
      <HeroSlider />

      <section className="home-highlight-strip">
        <div className="home-container home-highlight-grid">
          <div><strong>£5,000</strong><span>UK & Europe MOQ</span></div>
          <div><strong>£10,000</strong><span>International MOQ</span></div>
          <div><strong>Daily</strong><span>New Products Added</span></div>
          <div><strong>Bulk</strong><span>Competitive Pricing</span></div>
          <div><strong>24×7</strong><span>Customer Support</span></div>
        </div>
      </section>

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

      <section className="home-brand-strip">
        <div className="home-container">
          <div className="home-mini-heading">SHOP LEADING BRANDS</div>

          <div className="home-brand-scroll">
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
        </div>
      </section>

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
                Explore NAVSA's wholesale product families. Category images can
                be added later without changing this carousel structure.
              </p>
            </div>

            <div className="home-category-controls">
              <button type="button" onClick={() => moveCategories(-1)}>
                ←
              </button>
              <button type="button" onClick={() => moveCategories(1)}>
                →
              </button>
            </div>
          </div>

          <div
            ref={categoryTrackRef}
            className="home-category-track"
            onMouseEnter={stopCategoryAutoScroll}
            onMouseLeave={startCategoryAutoScroll}
            onTouchStart={stopCategoryAutoScroll}
            onTouchEnd={startCategoryAutoScroll}
          >
            {categories.map(category => (
              <Link
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                key={category.name}
                className="home-category-card"
              >
                <div className="home-category-number">{category.number}</div>
                <div className="home-category-orb" />
                <div className="home-category-content">
                  <span>{category.name}</span>
                  <strong>Explore category →</strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-stats-strip">
        <div className="home-container home-stats-grid">
          <article><strong>500+</strong><span>Brands</span></article>
          <article><strong>1,200+</strong><span>Containers Loaded</span></article>
          <article><strong>80+</strong><span>Countries Covered</span></article>
          <article><strong>{stats.products}+</strong><span>Products Available</span></article>
          <article><strong>24×7</strong><span>Customer Support</span></article>
        </div>
      </section>

      <ProductStrip
        title="Our Best-Sellers"
        subtitle="Popular export-ready products ordered frequently by trade customers."
        products={bestSellers}
        badge="EDLP"
        tone="white"
      />

      <section className="home-info-section">
        <div className="home-container home-info-grid">
          <div className="home-info-card">
            <span className="home-section-kicker">JOIN NAVSA</span>
            <h3>Become a Customer</h3>
            <p className="home-card-intro">
              Apply for a wholesale trade account and access the full NAVSA range.
            </p>
            <ul>
              <li>UK companies must be VAT registered.</li>
              <li>Business registered at a commercial property.</li>
              <li>Minimum order £5,000 for UK & Europe.</li>
              <li>Minimum order £10,000 for Rest of World.</li>
              <li>UK customers must be trading for over 12 months.</li>
            </ul>
            <Link to="/become-a-customer" className="home-card-button">
              Apply for an account
            </Link>
          </div>

          <div className="home-trade-card">
            <span className="home-section-kicker orange">TRADE SHOW</span>
            <h3>Gulfood 2026</h3>
            <p className="home-trade-date">26th to 30th January 2026</p>
            <p>
              Meet NAVSA for export, wholesale and consolidation opportunities.
            </p>
            <Link to="/contact" className="home-card-button home-card-button--light">
              Arrange a meeting
            </Link>
          </div>
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
        </div>
      </section>

      <section className="home-coming-section">
        <div className="home-container">
          <div className="home-section-head light">
            <span className="home-section-kicker orange">COMING SOON</span>
            <h2>Upcoming Ranges</h2>
          </div>

          <div className="home-coming-grid">
            {comingSoon.map((item, index) => (
              <div className="home-coming-card" key={item}>
                <span>0{index + 1}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-promotions-section">
        <div className="home-container">
          <div className="home-section-head home-section-head--center">
            <span className="home-section-kicker">
              LATEST DEALS
            </span>

            <h2>Download Our Latest Promotions</h2>

            <p>
              Browse the latest NAVSA promotion brochures. Open a catalogue
              online or download it directly to your device.
            </p>
          </div>

          <div className="home-promotions-grid">
            {promotions.map(promotion => (
              <PromotionCard
                key={promotion.id}
                promotion={promotion}
              />
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}

export default Home