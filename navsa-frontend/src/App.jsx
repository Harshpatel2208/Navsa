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
import ScrollToHash from './components/ScrollToHash'

function PlaceholderPage({ title }) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1>{title}</h1>
        <p>Coming Soon</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/account" element={<Account />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/basket" element={<Basket />} />

        <Route path="/brand" element={<Brands />} />

        <Route
          path="/about"
          element={<PlaceholderPage title="About Us" />}
        />

        <Route
          path="/contact"
          element={<PlaceholderPage title="Contact Us" />}
        />

        <Route
          path="/terms"
          element={<PlaceholderPage title="Terms & Conditions" />}
        />

        <Route
          path="/privacy"
          element={<PlaceholderPage title="Privacy & Cookies" />}
        />

        <Route
          path="/become-a-customer"
          element={<PlaceholderPage title="Become a Customer" />}
        />

        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      <Footer />

    </BrowserRouter>
  )
}

export default App