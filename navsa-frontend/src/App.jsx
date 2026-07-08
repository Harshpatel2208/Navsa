import './index.css'
import { useEffect } from 'react'
import { colors } from './theme'
import ProductDetail from './pages/ProductDetail'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Brands from './pages/Brands'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Account from './pages/Account'
import Wishlist from './pages/Wishlist'
import Basket from './pages/Basket'

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return null
}

function PlaceholderPage({ title }) {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: colors.paper, fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: colors.navy, fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>{title}</h1>
        <p style={{ color: '#5a6a7e', fontSize: '16px' }}>Coming Soon</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/shop"               element={<Shop />} />
        <Route path="/account"            element={<Account />} />
        <Route path="/wishlist"           element={<Wishlist />} />
        <Route path="/basket"             element={<Basket />} />
        <Route path="/brand"              element={<Brands />} />
        <Route path="/about"              element={<PlaceholderPage title="About Us" />} />
        <Route path="/contact"            element={<PlaceholderPage title="Contact Us" />} />
        <Route path="/terms"              element={<PlaceholderPage title="Terms & Conditions" />} />
        <Route path="/privacy"            element={<PlaceholderPage title="Privacy & Cookies" />} />
        <Route path="/become-a-customer"  element={<PlaceholderPage title="Become a Customer" />} />
        <Route path="/product/:id"        element={<ProductDetail />} />
        <Route path="*"                   element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App