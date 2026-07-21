import { useEffect, useLayoutEffect } from 'react'
import './Tradeshow.css'

const eventDetails = [
  { label: 'Event', value: 'Gulfood 2026' },
  { label: 'Dates', value: '26th to 30th January 2026' },
  { label: 'Venue', value: 'Dubai World Trade Centre' },
]

function Tradeshow() {
  const forcePageToTop = () => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    forcePageToTop()
  }, [])

  useEffect(() => {
    forcePageToTop()

    const frameId = window.requestAnimationFrame(forcePageToTop)
    const shortTimer = window.setTimeout(forcePageToTop, 50)
    const finalTimer = window.setTimeout(forcePageToTop, 250)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(shortTimer)
      window.clearTimeout(finalTimer)
    }
  }, [])

  return (
    <main className="tradeshow-page" id="tradeshow-top">
      <section className="tradeshow-hero">
        <div className="tradeshow-shell tradeshow-hero__grid">
          <div className="tradeshow-hero__content">
            <span className="tradeshow-kicker">NAVSA INTERNATIONAL</span>
            <h1>Tradeshow Information</h1>
            <p className="tradeshow-hero__lead">
              NAVSA International attended Gulfood 2026 in Dubai.
            </p>
            <p className="tradeshow-hero__copy">
              We showcased our latest products and innovations at one of the
              world&apos;s largest food and beverage exhibitions. The event gave
              us the opportunity to meet trade partners, explore new business
              opportunities and present our wholesale and export range to an
              international audience.
            </p>
          </div>

          <div className="tradeshow-hero__visual">
            <img
              src="/logos/tradeshow.png"
              alt="NAVSA International trade show brands"
            />
          </div>
        </div>
      </section>

      <section className="tradeshow-overview">
        <div className="tradeshow-shell">
          <div className="tradeshow-event-heading">
            <div className="tradeshow-section-heading">
              <span className="tradeshow-kicker">EVENT DETAILS</span>
              <h2>Gulfood 2026</h2>
              <p>
                NAVSA International participated in Gulfood 2026 at Dubai World
                Trade Centre, connecting with buyers, distributors and trade
                partners from around the world.
              </p>
            </div>
            <img
              src="/logos/gulfood.jpeg"
              alt="Gulfood"
              onError={event => {
                const image = event.currentTarget
                const attempted = image.dataset.fallback || 'jpeg'

                if (attempted === 'jpeg') {
                  image.dataset.fallback = 'jpg'
                  image.src = '/logos/gulfood.jpg'
                  return
                }

                if (attempted === 'jpg') {
                  image.dataset.fallback = 'png'
                  image.src = '/logos/gulfood.png'
                  return
                }

                image.style.display = 'none'
              }}
            />
          </div>

          <div className="tradeshow-detail-grid">
            {eventDetails.map(detail => (
              <article className="tradeshow-detail-card" key={detail.label}>
                <span>{detail.label}</span>
                <strong>{detail.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tradeshow-opportunities">
        <div className="tradeshow-shell tradeshow-opportunities__grid">
          <div>
            <span className="tradeshow-kicker">GULFOOD 2026 HIGHLIGHTS</span>
            <h2>New wholesale opportunities discovered</h2>
            <p>
              During the exhibition, we discussed product sourcing, export
              orders, consolidation, international distribution and potential
              long-term partnerships with visitors and trade professionals.
            </p>
          </div>

          <div className="tradeshow-benefit-grid">
            <article>
              <span aria-hidden="true">01</span>
              <h3>New Products</h3>
              <p>We presented new additions and popular British FMCG brands.</p>
            </article>
            <article>
              <span aria-hidden="true">02</span>
              <h3>Export Support</h3>
              <p>We discussed consolidation, documentation and freight solutions.</p>
            </article>
            <article>
              <span aria-hidden="true">03</span>
              <h3>Trade Partnerships</h3>
              <p>We connected with businesses interested in long-term wholesale opportunities.</p>
            </article>
          </div>
        </div>
      </section>

      {/*
      <section className="tradeshow-gallery-section">
        This gallery section is intentionally hidden until event photographs
        are available. It can be restored later without redesigning the page.
      </section>
      */}

      <section className="tradeshow-cta">
        <div className="tradeshow-shell tradeshow-cta__inner">
          <div>
            <span className="tradeshow-kicker tradeshow-kicker--light">EVENT COMPLETED</span>
            <h2>Thank you for meeting NAVSA at Gulfood 2026</h2>
            <p>
              We appreciated the opportunity to connect with customers, buyers
              and industry partners throughout the exhibition.
            </p>
          </div>
          <a href="mailto:sales@navsainternational.com" className="tradeshow-button tradeshow-button--light">
            sales@navsainternational.com
          </a>
        </div>
      </section>
    </main>
  )
}

export default Tradeshow