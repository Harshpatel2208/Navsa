import './index.css'
import ProductDetail from './pages/ProductDetail'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Brands from './pages/Brands'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Account from './pages/Account'
import Wishlist from './pages/Wishlist'
import Basket from './pages/Basket'
import Services from './pages/Services'
import ScrollToHash from './components/ScrollToHash'
import Admin from './pages/Admin'
import BecomeCustomer from './pages/BecomeCustomer'
import BecomeSupplier from './pages/BecomeSupplier'
import Tradeshow from './pages/Tradeshow'

function PlaceholderPage({ title }) {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: '#D0E7E6', color: '#293681', fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#0a1128', fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>{title}</h1>
        <p style={{ color: '#5a6a7e', fontSize: '16px' }}>Coming Soon</p>
      </div>
    </div>
  )
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/*" element={<Admin />} />

        <Route path="/*" element={
          <PublicLayout>
            <Routes>
              <Route path="/"                   element={<Home />} />
              <Route path="/shop"               element={<Shop />} />
              <Route path="/account"            element={<Account />} />
              <Route path="/wishlist"           element={<Wishlist />} />
              <Route path="/basket"             element={<Basket />} />
              <Route path="/brand"              element={<Brands />} />
              <Route path="/services"           element={<Services />} />
              <Route path="/about"              element={<PlaceholderPage title="About Us" />} />
              <Route path="/contact"            element={<PlaceholderPage title="Contact Us" />} />
              <Route path="/terms"              element={<PlaceholderPage title="Terms & Conditions" />} />
              <Route path="/privacy"            element={<PlaceholderPage title="Privacy & Cookies" />} />
              <Route path="/become-a-customer"  element={<BecomeCustomer />} />
              <Route path="/become-a-supplier"  element={<BecomeSupplier />} />
              <Route path="/tradeshow"          element={<Tradeshow />} />
              <Route path="/product/:id"        element={<ProductDetail />} />
              <Route path="*"                   element={<Navigate to="/" replace />} />
            </Routes>
          </PublicLayout>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App