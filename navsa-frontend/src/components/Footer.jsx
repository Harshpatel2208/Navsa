import { Link } from 'react-router-dom'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
} from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import './Footer.css'

const categories = [
  'Chocolates',
  'Groceries',
  'Seasonal',
  'Health & Personal Care',
  'Chilled Items',
  'Confectionery',
  'Crisps & Snacks',
  'Cold & Hot Beverages',
  'Pet Care & Food',
  'Biscuits',
  'Cleaning & Households',
  'Frozen',
  'Baby and Kids',
]

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__grid">
          <section className="site-footer__brand">
            <img
              src="/logos/navsa-logo.png"
              alt="NAVSA International"
            />

            <p>
              Wholesale exporter, distributor and consolidator of leading
              British FMCG products.
            </p>

            <address>
              Unit 18, Regus House, Fairbourne Drive<br />
              Milton Keynes, MK10 9RG, United Kingdom
            </address>

            <div className="site-footer__socials">
              <a href="https://facebook.com/navsainternational" target="_blank" rel="noreferrer" aria-label="Facebook" className="footer-social-icon footer-social-icon--facebook">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com/navsainternational" target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social-icon footer-social-icon--instagram">
                <FaInstagram />
              </a>
              <a href="https://x.com/navsaintl" target="_blank" rel="noreferrer" aria-label="X" className="footer-social-icon footer-social-icon--x">
                <FaXTwitter />
              </a>
              <a href="https://linkedin.com/company/navsa-international-limited" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social-icon footer-social-icon--linkedin">
                <FaLinkedinIn />
              </a>
            </div>
          </section>

          <section>
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/brand">Brands</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/become-a-customer">Become a Customer</Link>
            <Link to="/become-a-supplier">Become a Supplier</Link>
          </section>

          <section>
            <h3>Product Categories</h3>

            <div className="site-footer__category-grid">
              {categories.map(category => (
                <Link
                  key={category}
                  to={`/shop?category=${encodeURIComponent(category)}`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h3>Contact NAVSA</h3>

            <a href="tel:+441908909160">
              <FaPhoneAlt />
              +44 (0) 1908 909160
            </a>

            <a href="mailto:sales@navsainternational.com">
              <FaEnvelope />
              sales@navsainternational.com
            </a>

            <a href="https://wa.me/447544359587" target="_blank" rel="noreferrer">
              <FaWhatsapp />
              +44 7544 359587
            </a>

            <div className="site-footer__deals">
              <span>Latest Promotions</span>
              <a href="/deals/deal1.pdf" target="_blank" rel="noreferrer">
                NAVSA P10
              </a>
              <a href="/deals/deal2.pdf" target="_blank" rel="noreferrer">
                NAVSA P11
              </a>
            </div>
          </section>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>
          © {new Date().getFullYear()} NAVSA INTERNATIONAL LIMITED —
          All Rights Reserved.
        </span>

        <span>
          Companies House No. 13041212 · VAT GB364947456 · EORI 13041212
        </span>
      </div>
    </footer>
  )
}

export default Footer
