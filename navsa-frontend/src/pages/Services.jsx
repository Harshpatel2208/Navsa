import { useEffect } from 'react'
import {
  FaBoxesStacked,
  FaCertificate,
  FaClipboardCheck,
  FaDolly,
  FaFileSignature,
  FaTags,
  FaTruckFast,
  FaWarehouse,
} from 'react-icons/fa6'
import './Services.css'

const services = [
  {
    id: 'full-loads',
    title: 'FULL LOADS',
    icon: <FaBoxesStacked />,
    image: '/service-images/full-loads.jpg',
    points: [
      'We Can source and supply up to full loads from leading brands.',
      'Strong relations with Manufacturers.',
      'Excellent connections and stock holding on floor for fast moving lines.',
    ],
  },
  {
    id: 'store-deliveries',
    title: 'STORE DELIVERIES',
    icon: <FaDolly />,
    image: '/service-images/store-deliveries.jpg',
    points: [
      'We Deliver throughout the UK on pallets.',
      'Our Min order is £5k per order for UK store deliveries',
    ],
  },
  {
    id: 'road-freight',
    title: 'ROAD FREIGHT',
    icon: <FaTruckFast />,
    image: '/service-images/road-freight.jpg',
    points: [
      'We can arrange UK or European haulage at low cost.',
      'Economy and Express options.',
      'Temperature-controlled vehicles available.',
    ],
  },
  {
    id: 'documents',
    title: 'DOCUMENTS',
    icon: <FaFileSignature />,
    image: '/service-images/documents.jpg',
    intro: 'We can provide:',
    points: [
      'Health Certificates.',
      'Certificates of Origin and Free Sale.',
      'Advice and support in meeting regulations.',
    ],
  },
  {
    id: 'labelling',
    title: 'LABELLING',
    icon: <FaTags />,
    image: '/service-images/labelling.jpg',
    points: [
      'Products can be prepared in compliance with regulations, accounting for prohibited ingredients.',
      'We can add Production and Best Before dates.',
      'Translation and printing services available.',
    ],
  },
  {
    id: 'picking-packing',
    title: 'PICKING & PACKING',
    icon: <FaClipboardCheck />,
    image: '/service-images/picking-packing.jpg',
    points: [
      'We can assist with: - Sorting and labelling - Loading and unloading vehicles , re-boxing and re-labelling, sorting mixed cargo and returns handling',
      'Temporary cargo storage available.',
    ],
  },
  {
    id: 'storage',
    title: 'STORAGE',
    icon: <FaWarehouse />,
    image: '/service-images/storage.jpg',
    points: [
      '15,000 sq. ft. of modern warehouse storage.',
      'Stock control.',
      'Shrink wrapping.',
    ],
  },
  {
    id: 'receipt-dispatch',
    title: 'RECEIPT HANDLING & DISPATCH',
    icon: <FaCertificate />,
    image: '/service-images/receipt-handling-dispatch.jpg',
    points: [
      'We have expertise in goods handling: - Unloading - Checking - Storage - Reloading',
      'Stock identification and checking from product labels or consignment notes.',
    ],
  },
]

function PlaceholderArtwork() {
  return (
    <svg
      className="services-placeholder"
      viewBox="0 0 640 360"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="services-placeholder-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#082b53" />
          <stop offset="100%" stopColor="#174a83" />
        </linearGradient>
        <linearGradient id="services-placeholder-accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f58220" />
          <stop offset="100%" stopColor="#d91f26" />
        </linearGradient>
      </defs>

      <rect width="640" height="360" fill="url(#services-placeholder-bg)" />
      <circle cx="555" cy="50" r="122" fill="rgba(255,255,255,.06)" />
      <circle cx="74" cy="330" r="132" fill="rgba(255,255,255,.045)" />
      <rect
        x="78"
        y="86"
        width="484"
        height="188"
        rx="24"
        fill="rgba(255,255,255,.08)"
        stroke="rgba(255,255,255,.18)"
      />

      <g fill="url(#services-placeholder-accent)">
        <rect x="130" y="180" width="86" height="64" rx="9" />
        <rect x="230" y="145" width="98" height="99" rx="9" />
        <rect x="342" y="112" width="108" height="132" rx="9" />
      </g>

      <path
        d="M105 268H520"
        stroke="#fff"
        strokeWidth="8"
        strokeLinecap="round"
        opacity=".92"
      />
      <circle cx="190" cy="274" r="22" fill="#fff" />
      <circle cx="452" cy="274" r="22" fill="#fff" />
      <circle cx="190" cy="274" r="9" fill="#082b53" />
      <circle cx="452" cy="274" r="9" fill="#082b53" />
    </svg>
  )
}

export default function Services() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }, [])

  return (
    <main className="services-page">
      <section className="services-hero">
        <div className="services-shell">
          <span className="services-kicker">NAVSA EXPORT SUPPORT</span>
          <h1>Services We Offer</h1>
          <p>
            Wholesale, logistics, labelling, documentation and warehousing
            support for UK and international customers.
          </p>
        </div>
      </section>

      <section className="services-grid-section">
        <div className="services-shell">
          <div className="services-grid">
            {services.map((service, index) => (
              <article
                className="services-card"
                id={service.id}
                key={service.id}
                style={{ '--service-delay': `${index * 45}ms` }}
              >
                <div className="services-card__visual">
                  <PlaceholderArtwork />

                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    onLoad={event => {
                      event.currentTarget.classList.add(
                        'services-card__image--loaded'
                      )
                    }}
                    onError={event => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                </div>

                <div className="services-card__content">
                  <span className="services-card__icon">
                    {service.icon}
                  </span>

                  <h2>{service.title}</h2>

                  {service.intro && (
                    <p className="services-card__intro">
                      {service.intro}
                    </p>
                  )}

                  <ul>
                    {service.points.map(point => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="services-cta">
        <div className="services-cta__shape services-cta__shape--one" />
        <div className="services-cta__shape services-cta__shape--two" />

        <div className="services-shell services-cta__inner">
          <div className="services-cta__copy">
            <span className="services-kicker services-kicker--light">
              NEED SUPPORT?
            </span>

            <h2>
              Let NAVSA support your next wholesale or export order.
            </h2>

            <p>
              Speak with our team about product sourcing, consolidation,
              transport, labelling, documentation, storage and dispatch.
            </p>
          </div>

          <a href="mailto:sales@navsainternational.com">
            Contact our team
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  )
}