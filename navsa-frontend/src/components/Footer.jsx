// import { Link } from 'react-router-dom'
// import { colors, fonts } from '../theme'

// function Footer() {
//   return (
//     <div style={{ width: '100%', background: colors.navyDeep, color: '#9AA4B8' }}>
//       <div style={{
//         padding: '56px 6vw', display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px'
//       }}>
//         <div>
//           <h3 style={{ fontFamily: fonts.display, color: '#fff', fontSize: '18px', marginBottom: '14px' }}>
//             NAVSA INTERNATIONAL
//           </h3>
//           <p style={{ fontFamily: fonts.body, fontSize: '13px', lineHeight: '1.8' }}>
//             Wholesale, Distributor, Importer & Consolidator of UK FMCG products.
//             Milton Keynes, United Kingdom.
//           </p>
//         </div>

//         <div>
//           <h4 style={{ fontFamily: fonts.mono, fontSize: '12px', letterSpacing: '1px', color: '#fff', marginBottom: '14px' }}>
//             QUICK LINKS
//           </h4>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: fonts.body, fontSize: '13px' }}>
//             <Link to="/" style={{ color: '#9AA4B8', textDecoration: 'none' }}>Home</Link>
//             <Link to="/shop" style={{ color: '#9AA4B8', textDecoration: 'none' }}>Shop</Link>
//             <span>Trade Account</span>
//             <span>Services</span>
//           </div>
//         </div>

//         <div>
//           <h4 style={{ fontFamily: fonts.mono, fontSize: '12px', letterSpacing: '1px', color: '#fff', marginBottom: '14px' }}>
//             CONTACT
//           </h4>
//           <p style={{ fontFamily: fonts.body, fontSize: '13px', lineHeight: '1.8' }}>
//             +44 (0) 1908 909 160<br />
//             sales@navsainternational.com
//           </p>
//         </div>
//       </div>

//       <div style={{
//         borderTop: '1px solid #1C2C42', padding: '18px 6vw',
//         fontFamily: fonts.mono, fontSize: '11px', letterSpacing: '0.5px'
//       }}>
//         © {new Date().getFullYear()} NAVSA INTERNATIONAL LIMITED
//       </div>
//     </div>
//   )
// }

// export default Footer
import { Link } from 'react-router-dom'
import { colors, fonts } from '../theme'

const categories = [
  'Chocolates', 'Groceries', 'Seasonal', 'Health & Personal Care', 'Chilled Item',
  'Confectionery', 'Crisps & Snacks', 'Cold & Hot Beverages', 'Pet Care & Food',
  'Biscuits', 'Cleaning & Household', 'Frozen', 'Baby & Kids'
]

function Footer() {
  return (
    <div style={{ width: '100%', background: colors.navyDeep, color: '#9AA4B8' }}>
      <div style={{
        padding: '56px 6vw', display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px'
      }}>
        <div>
          <img
            src="https://www.navsainternational.co.uk/images/footer-logo.png"
            alt="NAVSA International"
            style={{ height: '40px', marginBottom: '16px', filter: 'brightness(0) invert(1)' }}
          />
          <p style={{ fontFamily: fonts.body, fontSize: '13px', lineHeight: '1.8' }}>
            NAVSA INTERNATIONAL LIMITED<br />
            Unit 18, Regus House, Fairbourne Drive<br />
            Milton Keynes, MK10 9RG, United Kingdom
          </p>
          <p style={{ fontFamily: fonts.body, fontSize: '13px', lineHeight: '1.8', marginTop: '10px' }}>
            Phone: +44 1908 909 160<br />
            Text Us: +44 7985 781627<br />
            WhatsApp: +44 7544 359587
          </p>
        </div>

        <div>
          <h4 style={{ fontFamily: fonts.mono, fontSize: '12px', letterSpacing: '1px', color: '#fff', marginBottom: '14px' }}>LINKS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: fonts.body, fontSize: '13px' }}>
            <span>Terms & Conditions</span>
            <span>Privacy & Cookies</span>
            <Link to="/shop" style={{ color: '#9AA4B8', textDecoration: 'none' }}>Offers</Link>
            <Link to="/shop" style={{ color: '#9AA4B8', textDecoration: 'none' }}>New Arrivals</Link>
            <span>About Us</span>
            <span>Contact Us</span>
          </div>
        </div>

        <div>
          <h4 style={{ fontFamily: fonts.mono, fontSize: '12px', letterSpacing: '1px', color: '#fff', marginBottom: '14px' }}>CATEGORIES</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: fonts.body, fontSize: '13px' }}>
            {categories.map(c => (
              <Link to="/shop" key={c} style={{ color: '#9AA4B8', textDecoration: 'none' }}>{c}</Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid #1C2C42', padding: '18px 6vw',
        fontFamily: fonts.mono, fontSize: '11px', letterSpacing: '0.5px'
      }}>
        © {new Date().getFullYear()} NAVSA INTERNATIONAL LIMITED — All Rights Reserved.
        Companies House No. 13041212 · VAT GB364947456 · EORI 13041212
      </div>
    </div>
  )
}

export default Footer