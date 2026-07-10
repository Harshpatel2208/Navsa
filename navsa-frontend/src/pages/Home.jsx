// import HeroSlider from "../components/HeroSlider";
// import { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { colors, fonts } from '../theme'
// import ShippingSelector from '../components/ShippingSelector'
// import ProductCard from '../components/ProductCard'

// const stripCardStyle = `
// .navsa-strip-card {
//   transition: transform 0.2s ease, box-shadow 0.2s ease;
//   cursor: pointer;
// }
// .navsa-strip-card:hover {
//   transform: translateY(-3px);
//   box-shadow: 0 10px 22px rgba(8, 43, 83, 0.12);
// }
// `

// const categories = [
//   'Chocolates', 'Groceries', 'Confectionery', 'Crisps & Snacks',
//   'Cold & Hot Beverages', 'Biscuits', 'Seasonal', 'Chilled Items',
//   'Frozen', 'Baby and Kids', 'Health & Personal Care', 'Pet Care & Food', 'Cleaning & Households'
// ]

// const services = [
//   'Consolidation and Bulk Loading Expertise', 'Flexible Transport Solutions',
//   'Custom Labelling and Packaging Services', 'Expert Export Documentation and Compliance'
// ]

// const brands = [
//   'Kit Kat', 'Twix', 'Lipton', 'Nescafe', 'Bisto', 'Tetley', 'Walkers', "Young's", 'Lindt', 'McVities'
// ]

// const comingSoon = [
//   'Spring Range 2027', 'New Snacking Line', 'Expanded Health & Wellness'
// ]

// function ProductStrip({ title, subtitle, products, badge }) {
//   if (!products.length) return null
//   return (
//     <div style={{ width: '100%', padding: '50px 6vw' }}>
//       <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
//         <h2 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '24px', marginBottom: '6px' }}>{title}</h2>
//         {subtitle && <p style={{ color: colors.inkMuted, fontSize: '14px', marginBottom: '26px' }}>{subtitle}</p>}

//         <style>{stripCardStyle}</style>
//         <div style={{ display: 'flex', gap: '18px', overflowX: 'auto', paddingBottom: '8px' }}>
//           {products.map(p => (
//             <Link
//               key={p.id}
//               to={`/product/${p.id}`}
//               className="navsa-strip-card"
//               style={{ minWidth: '220px', background: '#fff', border: `1px solid ${colors.hairline}`, flex: '0 0 auto', textDecoration: 'none', display: 'block' }}
//             >
//               <div style={{ position: 'relative' }}>
//                 {badge && (
//                   <span style={{
//                     position: 'absolute', top: '8px', left: '8px', background: colors.accent,
//                     color: '#fff', fontFamily: fonts.mono, fontSize: '10px', padding: '3px 8px'
//                   }}>
//                     {badge}
//                   </span>
//                 )}
//                 <div style={{ width: '100%', height: '150px', background: '#EFEDE6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
//                   {p.web_image ? (
//                     <img
//                       src={`/products/${p.web_image}`}
//                       alt={p.description}
//                       style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }}
//                       onError={(e) => {
//                         e.target.onerror = null
//                         e.target.style.display = 'none'
//                         e.target.parentElement.innerHTML = '<span style="color:#A7AAB2;font-family:JetBrains Mono,monospace;font-size:11px">NO IMAGE</span>'
//                       }}
//                     />
//                   ) : (
//                     <span style={{ color: '#A7AAB2', fontFamily: fonts.mono, fontSize: '11px' }}>NO IMAGE</span>
//                   )}
//                 </div>
//               </div>
//               <div style={{ padding: '14px' }}>
//                 <h4 style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.navy, fontWeight: 600, minHeight: '36px' }}>
//                   {p.description}
//                 </h4>
//                 <div style={{ fontFamily: fonts.mono, fontSize: '11px', color: colors.inkMuted, marginTop: '8px', lineHeight: '1.6' }}>
//                   EAN: {p.barcode_ean}<br />
//                   Case: {p.inner_case_quantity} · Layer: {p.layer_quantity} · Pallet: {p.pallet_quantity}
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// function Home() {
//   const [newArrivals, setNewArrivals] = useState([])
//   const [clearance, setClearance] = useState([])
//   const [bestSellers, setBestSellers] = useState([])
//   const [stats, setStats] = useState({ products: 0 })

//   useEffect(() => {
//     fetch('/api/products?page=1&sort_by=created_at&order=desc')
//       .then(r => r.json())
//       .then(d => {
//         setNewArrivals(d.data.slice(0, 10))
//         setStats(s => ({ ...s, products: d.total }))
//       })
//       .catch(() => {})

//     fetch('/api/products?page=2')
//       .then(r => r.json())
//       .then(d => setClearance(d.data.slice(0, 10)))
//       .catch(() => {})

//     fetch('/api/products?page=1&sort_by=price&order=desc')
//       .then(r => r.json())
//       .then(d => setBestSellers(d.data.slice(0, 10)))
//       .catch(() => {})
//   }, [])

//   return (
//        <div
//         style={{
//       width: "100%",
//       fontFamily: fonts.body,
//       background: colors.paper,
//       }}
//       >

//     <HeroSlider />

    
    

//       <ProductStrip title="New Arrivals" subtitle="Everyday essentials, delivered fast — your go-to for FMCG products" products={newArrivals} badge="NEW" />
//       <ProductStrip title="WIGIG — Limited Period / Clearance Offer" subtitle="Every Day Low Price" products={clearance} badge="EDLP" />


//       <ShippingSelector />

//       {/* Brand strip — NEW */}
//       <div style={{ width: '100%', background: '#fff', padding: '30px 6vw', borderTop: `1px solid ${colors.hairline}`, borderBottom: `1px solid ${colors.hairline}` }}>
//         <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', gap: '14px', overflowX: 'auto' }}>
//           {brands.map(b => (
//             <span key={b} style={{
//               fontFamily: fonts.mono, fontSize: '12px', color: colors.navy, fontWeight: 600,
//               border: `1px solid ${colors.hairline}`, padding: '10px 18px', whiteSpace: 'nowrap', flex: '0 0 auto'
//             }}>
//               {b.toUpperCase()}
//             </span>
//           ))}
//         </div>
//       </div>

//       <div style={{ textAlign: 'center', paddingBottom: '20px', paddingTop: '20px' }}>
//         <Link to="/shop" style={{ color: colors.navy, fontWeight: 600, fontFamily: fonts.body, textDecoration: 'none', border: `2px solid ${colors.navy}`, padding: '10px 26px', display: 'inline-block' }}>
//           View All
//         </Link>
//       </div>

//       {/* Shop by category */}
//       <div style={{ width: '100%', padding: '60px 6vw' }}>
//         <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
//           <h2 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '26px', marginBottom: '30px' }}>SHOP BY CATEGORY</h2>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
//             {categories.map(cat => (
//               // <Link to="/shop" key={cat} style={{ textDecoration: 'none' }}>
//               <Link to={`/shop?category=${encodeURIComponent(cat)}`} key={cat} style={{ textDecoration: 'none' }}>
//                 <div style={{ background: '#fff', border: `1px solid ${colors.hairline}`, padding: '20px 16px', color: colors.navy, fontWeight: 600, fontSize: '13px' }}>
//                   {cat}
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Stats strip */}
//       <div style={{ width: '100%', background: colors.navy, padding: '36px 6vw' }}>
//         <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', color: '#fff', fontFamily: fonts.mono, fontSize: '13px' }}>
//           <span>500+ BRANDS</span>
//           <span>1,200+ CONTAINERS LOADED</span>
//           <span>80+ COUNTRIES COVERED</span>
//           <span>{stats.products}+ PRODUCTS AVAILABLE</span>
//           <span>CUSTOMER SUPPORT 24×7</span>
//         </div>
//       </div>

//       <ProductStrip title="Our Best-Sellers" products={bestSellers} badge="EDLP" />

//       {/* Become a customer + Trade show */}
//       <div style={{ width: '100%', padding: '60px 6vw' }}>
//         <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
//           <div style={{ background: '#fff', border: `1px solid ${colors.hairline}`, padding: '30px' }}>
//             <h3 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '20px', marginBottom: '14px' }}>Become a Customer</h3>
//             <ul style={{ color: colors.inkMuted, fontSize: '13px', lineHeight: '1.9', paddingLeft: '18px' }}>
//               <li>UK companies must be VAT registered</li>
//               <li>Business registered at a commercial property, not a home address</li>
//               <li>Minimum order £5,000 (UK & Europe) / £10,000 (Rest of World)</li>
//               <li>UK customers must be trading for over 12 months</li>
//             </ul>
//           </div>
//           <div style={{ background: colors.navy, color: '#fff', padding: '30px' }}>
//             <h3 style={{ fontFamily: fonts.display, fontSize: '20px', marginBottom: '14px' }}>Trade Show</h3>
//             <p style={{ color: '#AEB8CC', fontSize: '14px' }}>Gulfood — 26th to 30th January 2026</p>
//           </div>
//         </div>
//       </div>


//       {/* Services */}
//       <div style={{ width: '100%', padding: '60px 6vw' }}>
//         <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
//           <h2 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '24px', marginBottom: '28px' }}>Services We Offer</h2>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
//             {services.map(s => (
//               <div key={s} style={{ borderTop: `3px solid ${colors.accent}`, paddingTop: '14px', fontSize: '14px', color: colors.navy, fontWeight: 600 }}>
//                 {s}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Coming Soon — NEW */}
//       <div style={{ width: '100%', padding: '60px 6vw' }}>
//         <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
//           <h2 style={{ fontFamily: fonts.display, color: colors.navy, fontSize: '24px', marginBottom: '26px' }}>Coming Soon</h2>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
//             {comingSoon.map(t => (
//               <div key={t} style={{
//                 background: colors.navy, color: '#fff', height: '160px', display: 'flex',
//                 alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontSize: '15px', textAlign: 'center', padding: '20px'
//               }}>
//                 {t}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Latest promotions PDF */}
//       <div
//         style={{
//           width: '100%',
//           background: colors.navy,
//           color: '#fff',
//           padding: '60px 6vw',
//           textAlign: 'center'
//         }}
//       >
//         <h2
//           style={{
//             fontFamily: fonts.display,
//             fontSize: '22px',
//             marginBottom: '12px'
//           }}
//         >
//           Download Our Latest Promotions
//         </h2>

//         <p
//           style={{
//             color: '#AEB8CC',
//             fontSize: '14px',
//             maxWidth: '480px',
//             margin: '0 auto 22px'
//           }}
//         >
//           Monthly impulse promotions with all the top UK brands for retailers at
//           fantastic prices.
//         </p>

        
//          <a href="https://www.navsainternational.co.uk/resources/deal1.pdf"
//           target="_blank"
//           rel="noreferrer"
//           style={{
//             background: colors.accent,
//             color: '#fff',
//             padding: '12px 28px',
//             textDecoration: 'none',
//             fontWeight: 600,
//             display: 'inline-block',
//             borderRadius: '6px'
//           }}>
//           View Latest Deals PDF
//         </a>
//       </div>

//     </div>
//   )
// }

// export default Home
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