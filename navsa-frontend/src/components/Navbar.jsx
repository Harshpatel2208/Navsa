import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ShoppingBag, User, ChevronDown, Menu, X, Phone, Mail } from 'lucide-react'
import { colors, fonts } from '../theme'
import logoImg from '../assets/logo.png'
import awardImg from '../assets/award.jpg'

export default function Navbar() {
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [searchVal, setSearchVal] = useState('')
  const [megaOpen, setMegaOpen] = useState(false)
  const [brandsOpen, setBrandsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState('en')
  const [isSticky, setIsSticky] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Check language cookie on mount
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
    }
    const googtrans = getCookie('googtrans')
    if (googtrans) {
      const parts = googtrans.split('/')
      const lang = parts[parts.length - 1]
      if (['en', 'fr', 'de', 'es'].includes(lang)) {
        setSelectedLang(lang)
      }
    }
  }, [])

  // Handle sticky navbar scroll behavior and track progress
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          // Set progress between 0 and 220px
          const progress = Math.min(scrollY / 220, 1)
          setScrollProgress(progress)
          setIsSticky(scrollY > 220)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLanguageChange = (e) => {
    const lang = e.target.value
    setSelectedLang(lang)

    // Set translation cookie directly for reliability
    document.cookie = `googtrans=/en/${lang}; path=/`;
    document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;

    // Revert/delete cookie if English is selected
    if (lang === 'en') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    }

    const triggerTranslate = () => {
      const googleSelect = document.querySelector('.goog-te-combo')
      if (googleSelect) {
        googleSelect.value = lang
        googleSelect.dispatchEvent(new Event('change'))
      } else {
        setTimeout(triggerTranslate, 100) // check again in 100ms
      }
    }
    triggerTranslate()

    // Reload the page to ensure the translation is applied immediately and cleanly
    window.location.reload()
  }
  const navigate = useNavigate()
  const megaRef = useRef(null)
  const brandsRef = useRef(null)

  // Fetch categories and brands dynamically
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data)
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err)
        // Fallback categories
        setCategories([
          { id: 1, category_name: 'Chocolates' },
          { id: 2, category_name: 'Groceries' },
          { id: 3, category_name: 'Confectionery' },
          { id: 4, category_name: 'Crisps & Snacks' },
          { id: 5, category_name: 'Cold & Hot Beverages' },
          { id: 6, category_name: 'Biscuits' },
          { id: 7, category_name: 'Seasonal' },
          { id: 8, category_name: 'Chilled Items' },
          { id: 9, category_name: 'Frozen' },
          { id: 10, category_name: 'Baby & Kids' },
          { id: 11, category_name: 'Health & Personal Care' },
          { id: 12, category_name: 'Pet Care & Food' },
          { id: 13, category_name: 'Cleaning & Households' }
        ])
      })

    fetch('/api/brands')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setBrands(data.slice(0, 15)) // Top 15 brands for dropdown
      })
      .catch(err => {
        console.error('Failed to fetch brands:', err)
        setBrands([
          { id: 1, brand_name: 'Cadbury' },
          { id: 2, brand_name: 'KitKat' },
          { id: 3, brand_name: 'McVities' },
          { id: 4, brand_name: 'Walkers' },
          { id: 5, brand_name: 'Lipton' },
          { id: 6, brand_name: 'Nescafe' }
        ])
      })
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchVal.trim())}`)
      setSearchVal('')
      setMobileMenuOpen(false)
    }
  }

  // Ticker items
  const tickerItems = [
    { label: 'Sea Freight', icon: '🚢' },
    { label: 'Air Freight', icon: '✈️' },
    { label: 'Warehousing', icon: '🏢' },
    { label: 'Export Documentation', icon: '📄' },
    { label: 'Labelling', icon: '🏷️' },
    { label: 'Reefer Consolidation', icon: '❄️' },
    { label: 'Road Freight', icon: '🚛' }
  ]

  return (
    <header style={{ width: '100%', position: isSticky ? 'static' : 'relative', zIndex: isSticky ? 9999 : 100, background: '#fff', fontFamily: fonts.body }}>
      {/* 1. TOP BAR */}
      <div style={{ background: '#c31e24', color: '#fff', fontSize: '12px', borderBottom: `1px solid rgba(255,255,255,0.05)`, fontWeight: 700 }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '6px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {/* Social Icons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', background: '#000', color: '#fff', textDecoration: 'none' }}>
              <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', background: '#3b5998', color: '#fff', textDecoration: 'none' }}>
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: '#fff', textDecoration: 'none' }}>
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', background: '#0077b5', color: '#fff', textDecoration: 'none' }}>
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>

          {/* Valid Info */}
          <div style={{ flex: 1, textAlign: 'center', fontSize: '13px', letterSpacing: '0.5px' }}>
            NAVSA P10 VALID 08/06/2026 TO 19/07/2026
          </div>

          {/* Contact Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#00a0e9', color: '#fff' }}>
                <Phone size={12} fill="currentColor" />
              </div>
              <span style={{ fontSize: '12px' }}>+44(0) 1908 909 160</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#00a0e9', color: '#fff' }}>
                <Mail size={12} fill="currentColor" />
              </div>
              <span style={{ fontSize: '12px' }}>sales@navsainternational.com</span>
            </div>
          </div>
        </div>
      </div>



      {/* 2. HEADER MAIN */}
      <div style={{ background: '#ffffff', borderBottom: `1px solid #d1d5db` }}>
        <div className="header-main-row" style={{ maxWidth: '1600px', margin: '0 auto', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          {/* Left: Trophy + Become a Customer Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img className="header-trophy-img" src={awardImg} alt="King's Award Trophy" style={{ height: '95px', objectFit: 'contain' }} />
            <Link to="/become-a-customer" style={{ display: 'inline-block', background: '#293681', color: '#fff', padding: '12px 24px', borderRadius: '9999px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', whiteSpace: 'nowrap', transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity = 0.9} onMouseLeave={e => e.target.style.opacity = 1}>
              Become a Customer
            </Link>
          </div>

          {/* Center: Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={logoImg} alt="NAVSA Logo" style={{ height: '145px', objectFit: 'contain' }} />
          </Link>

          {/* Right: Login Button + Trophy */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/account" style={{ display: 'inline-block', background: '#4274D9', color: '#fff', padding: '12px 28px', borderRadius: '9999px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', whiteSpace: 'nowrap', transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity = 0.9} onMouseLeave={e => e.target.style.opacity = 1}>
              Login
            </Link>
            <img className="header-trophy-img" src={awardImg} alt="King's Award Trophy" style={{ height: '95px', objectFit: 'contain' }} />
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION BAR */}
      <nav 
        style={{ 
          background: colors.paper, 
          borderBottom: `1px solid ${colors.hairline}`, 
          padding: '8px 0',
          position: isSticky ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          boxShadow: isSticky ? '0 10px 30px rgba(0,0,0,0.1)' : 'none',
          animation: isSticky ? 'navsa-slide-down 0.3s ease-out' : 'none'
        }}
      >
        <div className="nav-row-container" style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', gap: '20px', flexWrap: 'wrap' }}>
          
          {/* Left: Navigation links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Live Progress Scroll Animated Logo */}
            <div
              style={{
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                opacity: scrollProgress,
                maxWidth: `${scrollProgress * 80}px`,
                marginRight: `${scrollProgress * 16}px`,
                transform: `translateX(${(1 - scrollProgress) * -40}px)`,
                transition: 'none'
              }}
            >
              <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                <img src={logoImg} alt="NAVSA Logo" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
              </Link>
            </div>

            {/* Home Link */}
            <Link to="/" style={{ color: colors.navy, textDecoration: 'none', padding: '10px 16px', fontWeight: 700, fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#4274D9'} onMouseLeave={e => e.target.style.color = colors.navy}>
              Home
            </Link>

            {/* Shop Megamenu dropdown */}
            <div
              ref={megaRef}
              style={{ position: 'relative' }}
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <Link to="/shop" style={{ color: colors.navy, textDecoration: 'none', padding: '10px 16px', fontWeight: 700, fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#4274D9'} onMouseLeave={e => e.target.style.color = colors.navy}>
                Shop <ChevronDown size={14} />
              </Link>

              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    style={{
                      position: 'absolute', top: '100%', left: 0, width: '420px',
                      background: '#fff', borderTop: `3px solid #4274D9`,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: '20px', zIndex: 999
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {categories.map(c => (
                        <Link
                          key={c.id}
                          to={`/shop?category=${encodeURIComponent(c.category_name)}`}
                          onClick={() => setMegaOpen(false)}
                          style={{ color: colors.navy, textDecoration: 'none', fontSize: '13.5px', padding: '6px 8px', borderRadius: '4px', transition: 'background 0.2s, color 0.2s' }}
                          onMouseEnter={e => { e.target.style.background = colors.paper; e.target.style.color = '#4274D9' }}
                          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = colors.navy }}
                        >
                          {c.category_name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Brands dropdown */}
            <div
              ref={brandsRef}
              style={{ position: 'relative' }}
              onMouseEnter={() => setBrandsOpen(true)}
              onMouseLeave={() => setBrandsOpen(false)}
            >
              <Link to="/brand" style={{ color: colors.navy, textDecoration: 'none', padding: '10px 16px', fontWeight: 700, fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#4274D9'} onMouseLeave={e => e.target.style.color = colors.navy}>
                Brand <ChevronDown size={14} />
              </Link>

              <AnimatePresence>
                {brandsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    style={{
                      position: 'absolute', top: '100%', left: 0, width: '380px',
                      background: '#fff', borderTop: `3px solid #4274D9`,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: '20px', zIndex: 999
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      {brands.map(b => (
                        <Link
                          key={b.id}
                          to={`/shop?brand=${encodeURIComponent(b.brand_name)}`}
                          onClick={() => setBrandsOpen(false)}
                          style={{ color: colors.navy, textDecoration: 'none', fontSize: '13px', padding: '6px 8px', borderRadius: '4px' }}
                          onMouseEnter={e => { e.target.style.background = colors.paper; e.target.style.color = '#4274D9' }}
                          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = colors.navy }}
                        >
                          {b.brand_name}
                        </Link>
                      ))}
                    </div>
                    <Link to="/brand" onClick={() => setBrandsOpen(false)} style={{ display: 'block', textAlign: 'center', color: '#4274D9', fontWeight: 700, fontSize: '12px', textDecoration: 'none', paddingTop: '8px', borderTop: `1px solid ${colors.hairline}` }}>
                      VIEW ALL BRANDS →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Center: Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: 'flex', maxWidth: '520px', minWidth: '240px', border: `1px solid ${colors.hairline}`, borderRadius: '9999px', overflow: 'hidden', padding: '2px 6px', background: '#fff', alignItems: 'center' }}>
            <input
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search Directory of 20,000 + British Products"
              style={{ flex: 1, padding: '8px 16px', border: 'none', outline: 'none', fontSize: '13.5px', fontFamily: fonts.body, color: colors.navy }}
            />
            <button type="submit" style={{ background: 'none', border: 'none', color: '#4274D9', cursor: 'pointer', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={18} />
            </button>
          </form>

          {/* Right: Language, Currency, Basket & Wishlist */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Select Language select box */}
            <select 
              value={selectedLang} 
              onChange={handleLanguageChange}
              style={{ border: `1px solid ${colors.hairline}`, borderRadius: '4px', padding: '6px 12px', fontSize: '15px', color: colors.navy, background: '#fff', outline: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
            </select>

            {/* Currency selector display */}
            <select style={{ border: 'none', background: 'transparent', fontSize: '15px', color: colors.navy, fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
              <option>GBP Pound Sterling</option>
              <option>EUR Euro</option>
              <option>USD US Dollar</option>
            </select>

            {/* Wishlist Heart Icon */}
            <Link to="/wishlist" title="Wishlist" style={{ display: 'flex', alignItems: 'center', color: '#4274D9', textDecoration: 'none' }}>
              <Heart size={20} fill="#4274D9" stroke="#4274D9" />
            </Link>

            {/* Shipping Container Basket Icon */}
            <Link to="/basket" title="Basket" style={{ textDecoration: 'none' }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="58" height="32" viewBox="0 0 58 32" fill="none" stroke={colors.navy} strokeWidth="1.5">
                  <rect x="2" y="3" width="54" height="26" rx="2" fill="#fff" />
                  <line x1="10" y1="3" x2="10" y2="29" stroke={colors.hairline} />
                  <line x1="18" y1="3" x2="18" y2="29" stroke={colors.hairline} />
                  <line x1="26" y1="3" x2="26" y2="29" stroke={colors.hairline} />
                  <line x1="34" y1="3" x2="34" y2="29" stroke={colors.hairline} />
                  <line x1="42" y1="3" x2="42" y2="29" stroke={colors.hairline} />
                  <line x1="50" y1="3" x2="50" y2="29" stroke={colors.hairline} />
                  <rect x="2" y="3" width="54" height="26" rx="2" stroke={colors.navy} strokeWidth="2" />
                </svg>
                <span style={{ position: 'absolute', color: '#4274D9', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                  0 items
                </span>
              </div>
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', border: 'none', background: 'none', cursor: 'pointer', padding: '8px' }} className="mobile-only-btn">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      {isSticky && <div style={{ height: '54px' }} />}


      {/* 4. SERVICES SCROLLING TICKER */}
      <div style={{ width: '100%', background: colors.accent, overflow: 'hidden', padding: '12px 0', borderBottom: `2px solid ${colors.navyDeep}` }}>
        <div style={{ display: 'flex', width: '200%', animation: 'navsa-scroll-ticker 25s linear infinite' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '50%', gap: '40px', paddingRight: '20px' }}>
            {tickerItems.map((item, idx) => (
              <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: colors.navyDeep, fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span> {item.label}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '50%', gap: '40px', paddingRight: '20px' }}>
            {tickerItems.map((item, idx) => (
              <span key={`dup-${idx}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: colors.navyDeep, fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span> {item.label}
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes navsa-scroll-ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes navsa-slide-down {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(0); }
          }
          @media (max-width: 1024px) {
            .mobile-only-btn { display: block !important; }
            .header-main-row {
              flex-direction: column !important;
              padding: 12px 16px !important;
              gap: 12px !important;
              text-align: center;
            }
            .header-trophy-img {
              height: 50px !important;
            }
            .nav-row-container {
              flex-direction: column !important;
              padding: 12px 16px !important;
              gap: 12px !important;
              align-items: center !important;
            }
          }
        `}</style>
      </div>
    </header>
  )
}