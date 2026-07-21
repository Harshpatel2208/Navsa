import './Deals.css'

const FALLBACK_DEALS = [
  {
    id: 'p10',
    title: 'NAVSA P10',
    valid_from: '08/06/2026',
    valid_to: '19/07/2026',
    description:
      'Monthly impulse promotions with all the top UK brands for retailers at fantastic prices.',
    preview_image: '/deals/deal1_preview.jpg',
    pdf_file: '/deals/deal1.pdf',
    badge: 'LATEST',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'p11',
    title: 'NAVSA P11',
    valid_from: '29/06/2026',
    valid_to: '09/08/2026',
    description:
      'Monthly retail grocery promotions with all the top UK brands for retailers at fantastic prices.',
    preview_image: '/deals/deal2_preview.png',
    pdf_file: '/deals/deal2.pdf',
    badge: 'NEW',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'christmas-2026',
    title: 'NAVSA Christmas 2026',
    valid_from: '',
    valid_to: '',
    description:
      'Monthly food service promotions: discover the latest products for the food service sector at fantastic prices.',
    preview_image: '/deals/deal3_preview.png',
    pdf_file: '/deals/deal3.pdf',
    badge: 'CHRISTMAS',
    sort_order: 3,
    is_active: true,
  },
]

function normaliseDeals(payload) {
  const collection = Array.isArray(payload)
    ? payload
    : payload?.data ?? payload?.items ?? payload?.results ?? []

  if (!Array.isArray(collection)) return []

  return collection
    .filter(item => item && item.pdf_file && item.preview_image && item.is_active !== false)
    .map((item, index) => ({
      id: item.id ?? `deal-${index}`,
      title: item.title ?? `NAVSA Promotion ${index + 1}`,
      valid_from: item.valid_from ?? item.validFrom ?? '',
      valid_to: item.valid_to ?? item.validTo ?? '',
      description: item.description ?? '',
      preview_image: item.preview_image_url ?? item.preview_image ?? item.preview,
      pdf_file: item.pdf_file_url ?? item.pdf_file ?? item.pdf,
      badge: item.badge ?? 'PROMOTION',
      sort_order: Number(item.sort_order ?? index + 1),
      is_active: item.is_active !== false,
    }))
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 4)
}

function DealCard({ deal }) {
  return (
    <article className="deals-card">
      <span className="deals-card__badge">{deal.badge}</span>

      <a
        href={deal.pdf_file}
        target="_blank"
        rel="noreferrer"
        className="deals-card__preview"
        aria-label={`Open ${deal.title} promotion PDF`}
      >
        <img
          src={deal.preview_image}
          alt={`${deal.title} first-page preview`}
          loading="lazy"
        />

        <span className="deals-card__preview-action">
          Open catalogue →
        </span>
      </a>

      <div className="deals-card__body">
        <div className="deals-card__title-row">
          <div>
            <span className="deals-card__kicker">PROMOTION CATALOGUE</span>
            <h3>{deal.title}</h3>
          </div>

          <span className="deals-card__pdf-label">PDF</span>
        </div>

        {deal.valid_from && deal.valid_to && (
          <p className="deals-card__validity">
            Valid {deal.valid_from} to {deal.valid_to}
          </p>
        )}

        {deal.description && (
          <p className="deals-card__description">
            {deal.description}
          </p>
        )}

        <div className="deals-card__buttons">
          <a
            href={deal.pdf_file}
            target="_blank"
            rel="noreferrer"
            className="deals-card__view"
          >
            View PDF
          </a>

          <a
            href={deal.pdf_file}
            download
            className="deals-card__download"
          >
            Download
          </a>
        </div>
      </div>
    </article>
  )
}

export default function Deals() {
  const deals = FALLBACK_DEALS
    .filter(deal => deal.is_active !== false)
    .sort((a, b) => Number(a.sort_order) - Number(b.sort_order))
    .slice(0, 4)

  /*
   * FUTURE ADMIN-PANEL API
   * ----------------------
   * Enable this after Laravel provides:
   * GET /api/deals?placement=homepage
   *
   * The API response can be passed through normaliseDeals(payload).
   * Until then, the local FALLBACK_DEALS array is used and no failing
   * network request is made.
   */

  if (!deals.length) return null

  return (
    <section className="deals-section">
      <div className="deals-shell">
        <header className="deals-header">
          <span>LATEST DEALS</span>
          <h2>Download Our Latest Promotions</h2>
          <p>
            Browse the latest NAVSA promotion brochures. Open a catalogue
            online or download it directly to your device.
          </p>
        </header>

        <div
          className={`deals-grid deals-grid--${Math.min(deals.length, 4)}`}
        >
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  )
}