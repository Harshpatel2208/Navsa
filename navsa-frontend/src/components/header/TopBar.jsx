import { useEffect, useState } from 'react'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
} from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import './TopBar.css'

const promotions = [
  {
    text: 'NAVSA P10 VALID 08/06/2026 TO 19/07/2026',
    pdf: '/deals/deal1.pdf',
  },
  {
    text: 'NAVSA P11 VALID 29/06/2026 TO 09/08/2026',
    pdf: '/deals/deal2.pdf',
  },
  {
    text: 'NAVSA CHRISTMAS 2026',
    pdf: '/deals/deal3.pdf',
  },
]

export default function TopBar() {
  const [promotionIndex, setPromotionIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPromotionIndex(current =>
        current === promotions.length - 1 ? 0 : current + 1
      )
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const socialLinks = [
    {
      icon: <FaFacebookF />,
      url: 'https://facebook.com/navsainternational',
      label: 'Facebook',
    },
    {
      icon: <FaInstagram />,
      url: 'https://instagram.com/navsainternational',
      label: 'Instagram',
    },
    {
      icon: <FaXTwitter />,
      url: 'https://x.com/navsaintl',
      label: 'X',
    },
    {
      icon: <FaLinkedinIn />,
      url: 'https://linkedin.com/company/navsa-international-limited',
      label: 'LinkedIn',
    },
  ]

  const activePromotion = promotions[promotionIndex]

  return (
    <div className="top-bar">
      <div className="top-bar__inner">
        <div className="top-bar__socials">
          {socialLinks.map(item => (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              className={`top-bar__social-icon top-bar__social-icon--${item.label.toLowerCase()}`}
            >
              {item.icon}
            </a>
          ))}
        </div>

        <a
          key={promotionIndex}
          href={activePromotion.pdf}
          target="_blank"
          rel="noreferrer"
          className="top-bar__promotion"
        >
          {activePromotion.text}
        </a>

        <div className="top-bar__contact">
          <a href="tel:+441908909160">
            <FaPhoneAlt />
            <span>+44 (0) 1908 909160</span>
          </a>

          <a href="mailto:sales@navsainternational.com">
            <FaEnvelope />
            <span>sales@navsainternational.com</span>
          </a>
        </div>
      </div>
    </div>
  )
}
