// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { CartProvider } from './context/CartContext.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <CartProvider>
//       <App />
//     </CartProvider>
//   </StrictMode>,
// )
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ShippingProvider } from './context/ShippingContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShippingProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ShippingProvider>
  </StrictMode>,
)