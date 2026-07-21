import './ServiceBar.css'

const SERVICES = [
  { title: 'MOQ UK & EUROPE', value: '£5,000.00' },
  { title: 'MOQ INTERNATIONAL', value: '£10,000.00' },
  { title: 'COMPETITIVE PRICING', value: 'ON BULK ORDER' },
  { title: 'NEW PRODUCTS', value: 'ADDED DAILY' },
  { title: 'LABELLING', value: 'INKJET' },
  { title: 'REEFER', value: 'CONSOLIDATION' },
  { title: 'ROAD', value: 'FREIGHT' },
  { title: 'SEA', value: 'FREIGHT' },
  { title: 'AIR', value: 'FREIGHT' },
  { title: 'DOCUMENTS', value: 'CERTIFICATION' },
  { title: 'WAREHOUSING', value: 'STORAGE' },
]

export default function ServiceBar() {
  const repeatedServices = [...SERVICES, ...SERVICES]

  return (
    <section className="service-bar" aria-label="NAVSA trade services">
      <div className="service-bar__viewport">
        <div className="service-bar__track">
          {repeatedServices.map((service, index) => (
            <div
              className="service-bar__item"
              key={`${service.title}-${service.value}-${index}`}
            >
              <strong className="service-bar__title">
                {service.title}
              </strong>

              <span className="service-bar__value">
                {service.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
