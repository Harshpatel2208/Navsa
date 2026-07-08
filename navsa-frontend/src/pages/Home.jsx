import HeroSlider from "../components/HeroSlider";
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { colors, fonts } from '../theme'
import ShippingSelector from '../components/ShippingSelector'

const stripCardStyle = `
.navsa-strip-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
.navsa-strip-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 22px rgba(8, 43, 83, 0.12);
}
`


const services = [
  'Consolidation and Bulk Loading Expertise', 'Flexible Transport Solutions',
  'Custom Labelling and Packaging Services', 'Expert Export Documentation and Compliance'
]

const brands = [
  'Kit Kat', 'Twix', 'Lipton', 'Nescafe', 'Bisto', 'Tetley', 'Walkers', "Young's", 'Lindt', 'McVities'
]

const comingSoon = [
  'Spring Range 2027', 'New Snacking Line', 'Expanded Health & Wellness'
]

// Product image component — serves from public/products/
function ProductImage({ webImage, description }) {
  const [imgError, setImgError] = useState(false)

  if (!webImage || imgError) {
    return (
      <span style={{ color: '#A7AAB2', fontFamily: fonts.mono, fontSize: '11px' }}>NO IMAGE</span>
    )
  }

  return (
    <img
      src={`/products/${webImage}`}
      alt={description}
      style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }}
      onError={() => setImgError(true)}
    />
  )
}

function ProductStrip({ title, subtitle, products, badge }) {
  if (!products.length) return null
  return (
    <div style={{ width: '100%', padding: '50px 6vw' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '24px', marginBottom: '6px' }}>{title}</h2>
        {subtitle && <p style={{ color: colors.inkMuted, fontSize: '14px', marginBottom: '26px' }}>{subtitle}</p>}

        <style>{stripCardStyle}</style>
        <div style={{ display: 'flex', gap: '18px', overflowX: 'auto', paddingBottom: '8px' }}>
          {products.map(p => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="navsa-strip-card"
              style={{ minWidth: '220px', background: '#fff', border: `1px solid ${colors.hairline}`, flex: '0 0 auto', textDecoration: 'none', display: 'block' }}
            >
              <div style={{ position: 'relative' }}>
                {badge && (
                  <span style={{
                    position: 'absolute', top: '8px', left: '8px', background: colors.accent,
                    color: '#fff', fontFamily: fonts.mono, fontSize: '10px', padding: '3px 8px', zIndex: 1
                  }}>
                    {badge}
                  </span>
                )}
                <div style={{ width: '100%', height: '150px', background: '#EFEDE6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <ProductImage
                    webImage={p.web_image}
                    description={p.description}
                  />
                </div>
              </div>
              <div style={{ padding: '14px' }}>
                <span style={{
                  fontFamily: fonts.mono, fontSize: '10px', color: '#f58220',
                  fontWeight: 700, letterSpacing: '0.8px', display: 'block', marginBottom: '4px'
                }}>
                  {p.brand?.brand_name?.toUpperCase() || 'UNBRANDED'}
                </span>
                <h4 style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.navy, fontWeight: 600, minHeight: '36px', marginTop: 0, marginBottom: '8px' }}>
                  {p.description}
                </h4>
                <div style={{ fontFamily: fonts.mono, fontSize: '11px', color: colors.inkMuted, marginTop: '8px', lineHeight: '1.6' }}>
                  EAN: {p.barcode_ean}<br />
                  Case: {p.inner_case_quantity} · Layer: {p.layer_quantity} · Pallet: {p.pallet_quantity}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function Home() {
  const [newArrivals, setNewArrivals] = useState([])
  const [clearance, setClearance] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [stats, setStats] = useState({ products: 0 })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/api/products?page=1&sort_by=created_at&order=desc')
      .then(r => r.json())
      .then(d => {
        setNewArrivals(d.data.slice(0, 10))
        setStats(s => ({ ...s, products: d.total }))
      })
      .catch(() => {})

    fetch('/api/products?page=2')
      .then(r => r.json())
      .then(d => setClearance(d.data.slice(0, 10)))
      .catch(() => {})

    fetch('/api/products?page=1&sort_by=price&order=desc')
      .then(r => r.json())
      .then(d => setBestSellers(d.data.slice(0, 10)))
      .catch(() => {})

    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d))
      .catch(() => {})
  }, [])


  return (
       <div
        style={{
      width: "100%",
      fontFamily: fonts.body,
      background: colors.paper,
      }}
      >

    <HeroSlider />

    
    

      <ProductStrip title="New Arrivals" subtitle="Everyday essentials, delivered fast — your go-to for FMCG products" products={newArrivals} badge="NEW" />
      <ProductStrip title="WIGIG — Limited Period / Clearance Offer" subtitle="Every Day Low Price" products={clearance} badge="EDLP" />


      <ShippingSelector />

      {/* Brand strip — NEW */}
      <div style={{ width: '100%', background: '#fff', padding: '30px 6vw', borderTop: `1px solid ${colors.hairline}`, borderBottom: `1px solid ${colors.hairline}` }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', gap: '14px', overflowX: 'auto' }}>
          {brands.map(b => (
            <span key={b} style={{
              fontFamily: fonts.mono, fontSize: '12px', color: colors.navy, fontWeight: 600,
              border: `1px solid ${colors.hairline}`, padding: '10px 18px', whiteSpace: 'nowrap', flex: '0 0 auto'
            }}>
              {b.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', paddingBottom: '20px', paddingTop: '20px' }}>
        <Link to="/shop" style={{ color: colors.navy, fontWeight: 600, fontFamily: fonts.body, textDecoration: 'none', border: `2px solid ${colors.navy}`, padding: '10px 26px', display: 'inline-block' }}>
          View All
        </Link>
      </div>

      {/* Shop by category */}
      <div style={{ width: '100%', padding: '60px 6vw' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '26px', marginBottom: '30px' }}>SHOP BY CATEGORY</h2>
          {categories.length === 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ height: '62px', background: '#e8e6e0', borderRadius: '2px' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
              {categories.map(cat => (
                <Link
                  to={`/shop?category=${encodeURIComponent(cat.category_name)}`}
                  key={cat.id}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{ background: '#fff', border: `1px solid ${colors.hairline}`, padding: '20px 16px', color: colors.navy, fontWeight: 600, fontSize: '13px', transition: 'all 0.18s ease' }}
                    onMouseOver={e => { e.currentTarget.style.background = colors.navy; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = colors.navy; }}
                  >
                    {cat.category_name}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Stats strip */}
      <div style={{ width: '100%', background: colors.navy, padding: '36px 6vw' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', color: '#fff', fontFamily: fonts.mono, fontSize: '13px' }}>
          <span>500+ BRANDS</span>
          <span>1,200+ CONTAINERS LOADED</span>
          <span>80+ COUNTRIES COVERED</span>
          <span>{stats.products}+ PRODUCTS AVAILABLE</span>
          <span>CUSTOMER SUPPORT 24×7</span>
        </div>
      </div>

      <ProductStrip title="Our Best-Sellers" products={bestSellers} badge="EDLP" />

      {/* Become a customer + Trade show */}
      <div style={{ width: '100%', padding: '60px 6vw' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#fff', border: `1px solid ${colors.hairline}`, padding: '30px' }}>
            <h3 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '20px', marginBottom: '14px' }}>Become a Customer</h3>
            <ul style={{ color: colors.inkMuted, fontSize: '13px', lineHeight: '1.9', paddingLeft: '18px' }}>
              <li>UK companies must be VAT registered</li>
              <li>Business registered at a commercial property, not a home address</li>
              <li>Minimum order £5,000 (UK & Europe) / £10,000 (Rest of World)</li>
              <li>UK customers must be trading for over 12 months</li>
            </ul>
          </div>
          <div style={{ background: colors.navy, color: '#fff', padding: '30px' }}>
            <h3 style={{ fontFamily: fonts.display, fontSize: '20px', marginBottom: '14px' }}>Trade Show</h3>
            <p style={{ color: '#AEB8CC', fontSize: '14px' }}>Gulfood — 26th to 30th January 2026</p>
          </div>
        </div>
      </div>


      {/* Services */}
      <div style={{ width: '100%', padding: '60px 6vw' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '24px', marginBottom: '28px' }}>Services We Offer</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            {services.map(s => (
              <div key={s} style={{ borderTop: `3px solid ${colors.accent}`, paddingTop: '14px', fontSize: '14px', color: colors.navy, fontWeight: 600 }}>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coming Soon — NEW */}
      <div style={{ width: '100%', padding: '60px 6vw' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '24px', marginBottom: '26px' }}>Coming Soon</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            {comingSoon.map(t => (
              <div key={t} style={{
                background: colors.navy, color: '#fff', height: '160px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontSize: '15px', textAlign: 'center', padding: '20px'
              }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest promotions PDF */}
      <div
        style={{
          width: '100%',
          background: colors.navy,
          color: '#fff',
          padding: '60px 6vw',
          textAlign: 'center'
        }}
      >
        <h2
          style={{
            fontFamily: fonts.display,
            fontSize: '22px',
            marginBottom: '12px'
          }}
        >
          Download Our Latest Promotions
        </h2>

        <p
          style={{
            color: '#AEB8CC',
            fontSize: '14px',
            maxWidth: '480px',
            margin: '0 auto 22px'
          }}
        >
          Monthly impulse promotions with all the top UK brands for retailers at
          fantastic prices.
        </p>

        
         <a href="https://www.navsainternational.co.uk/resources/deal1.pdf"
          target="_blank"
          rel="noreferrer"
          style={{
            background: colors.accent,
            color: '#fff',
            padding: '12px 28px',
            textDecoration: 'none',
            fontWeight: 600,
            display: 'inline-block',
            borderRadius: '6px'
          }}>
          View Latest Deals PDF
        </a>
      </div>

    </div>
  )
}

export default Home
