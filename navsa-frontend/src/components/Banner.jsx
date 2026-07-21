import { useEffect, useMemo, useRef, useState } from 'react'
import './Banner.css'

const AUTO_SLIDE_TIME = 5000

const FALLBACK_BANNERS = {
  hero: [
    {
      id: 'hero-1',
      title: 'Twix promotion',
      image: '/banners/hero-1.jpg',
      link: '/shop?brand=Twix',
      sort_order: 1,
      is_active: true,
    },
    {
      id: 'hero-2',
      title: 'KitKat promotion',
      image: '/banners/hero-2.jpg',
      link: '/shop?brand=KitKat',
      sort_order: 2,
      is_active: true,
    },
    {
      id: 'hero-3',
      title: 'Lipton promotion',
      image: '/banners/hero-3.jpg',
      link: '/shop?brand=Lipton',
      sort_order: 3,
      is_active: true,
    },
  ],
  middle: [
    {
      id: 'middle-1',
      title: 'Coming soon promotion 1',
      image: '/banners/middle-1.jpg',
      link: '',
      sort_order: 1,
      is_active: true,
    },
    {
      id: 'middle-2',
      title: 'Coming soon promotion 2',
      image: '/banners/middle-2.jpg',
      link: '',
      sort_order: 2,
      is_active: true,
    },
    {
      id: 'middle-3',
      title: 'Coming soon promotion 3',
      image: '/banners/middle-3.jpg',
      link: '',
      sort_order: 3,
      is_active: true,
    },
  ],
  bottom: [
    {
      id: 'bottom-1',
      title: 'NAVSA featured promotion 1',
      image: '/banners/bottom-1.jpg',
      link: '',
      sort_order: 1,
      is_active: true,
    },
    {
      id: 'bottom-2',
      title: 'NAVSA featured promotion 2',
      image: '/banners/bottom-2.jpg',
      link: '',
      sort_order: 2,
      is_active: true,
    },
  ],
}

function normaliseBannerPayload(payload) {
  const items = Array.isArray(payload)
    ? payload
    : payload?.data ?? payload?.items ?? payload?.results ?? []

  if (!Array.isArray(items)) return []

  return items
    .filter(item => item && item.is_active !== false)
    .map((item, index) => ({
      id: item.id ?? `banner-${index + 1}`,
      title: item.title ?? `NAVSA banner ${index + 1}`,
      image: item.image_url ?? item.image ?? '',
      link: item.link_url ?? item.link ?? '',
      sort_order: Number(item.sort_order ?? index + 1),
      is_active: item.is_active !== false,
    }))
    .filter(item => item.image)
    .sort((a, b) => a.sort_order - b.sort_order)
}

function BannerImage({ banner, onLoad }) {
  const image = (
    <img
      src={banner.image}
      alt={banner.title || 'NAVSA promotional banner'}
      draggable={false}
      onLoad={onLoad}
    />
  )

  if (!banner.link) return image

  const isExternal = /^https?:\/\//i.test(banner.link)

  return (
    <a
      href={banner.link}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      aria-label={banner.title}
    >
      {image}
    </a>
  )
}

function BannerSlider({ banners, type }) {
  const sectionRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(type === 'hero')
  const [hasStarted, setHasStarted] = useState(type === 'hero')
  const [ratios, setRatios] = useState({})

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.35

        setIsVisible(visible)

        if (visible) {
          setHasStarted(true)
        }
      },
      {
        threshold: [0, 0.35, 0.6],
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasStarted || !isVisible || banners.length < 2) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setActiveIndex(current => (current + 1) % banners.length)
    }, AUTO_SLIDE_TIME)

    return () => window.clearInterval(timer)
  }, [banners.length, hasStarted, isVisible])

  useEffect(() => {
    if (activeIndex >= banners.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, banners.length])

  function handleImageLoad(event, bannerId) {
    const image = event.currentTarget

    if (!image.naturalWidth || !image.naturalHeight) return

    setRatios(current => ({
      ...current,
      [bannerId]: `${image.naturalWidth} / ${image.naturalHeight}`,
    }))
  }

  if (!banners.length) return null

  const activeBanner = banners[activeIndex]
  const activeRatio =
    ratios[activeBanner?.id] ||
    (type === 'hero' ? '1920 / 500' : '1920 / 450')

  return (
    <div
      ref={sectionRef}
      className={`banner-slider banner-slider--${type}`}
    >
      <div
        className="banner-slider__stage"
        style={{ aspectRatio: activeRatio }}
      >
        {banners.map((banner, index) => (
          <div
            className={`banner-slider__slide ${
              index === activeIndex ? 'banner-slider__slide--active' : ''
            }`}
            key={banner.id}
            aria-hidden={index !== activeIndex}
          >
            <BannerImage
              banner={banner}
              onLoad={event => handleImageLoad(event, banner.id)}
            />
          </div>
        ))}

        {banners.length > 1 && (
          <div className="banner-slider__dots" aria-label="Select banner">
            {banners.map((banner, index) => (
              <button
                type="button"
                key={banner.id}
                className={`banner-slider__dot ${
                  activeIndex === index ? 'banner-slider__dot--active' : ''
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show banner ${index + 1}`}
                aria-current={activeIndex === index ? 'true' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Banner({ type = 'hero' }) {
  const banners = useMemo(
    () => FALLBACK_BANNERS[type] ?? [],
    [type]
  )

  /*
   * FUTURE ADMIN-PANEL API
   * ----------------------
   * Enable this after Laravel provides:
   * GET /api/home-banners?position=hero|middle|bottom
   *
   * Replace the local `banners` constant above with state, then enable:
   *
   * const [banners, setBanners] = useState(
   *   FALLBACK_BANNERS[type] ?? []
   * )
   *
   * useEffect(() => {
   *   const controller = new AbortController()
   *
   *   fetch(`/api/home-banners?position=${encodeURIComponent(type)}`, {
   *     signal: controller.signal,
   *     headers: { Accept: 'application/json' },
   *   })
   *     .then(response => {
   *       if (!response.ok) throw new Error(String(response.status))
   *       return response.json()
   *     })
   *     .then(payload => {
   *       const nextBanners = normaliseBannerPayload(payload)
   *       if (nextBanners.length) setBanners(nextBanners)
   *     })
   *     .catch(error => {
   *       if (error.name !== 'AbortError') {
   *         setBanners(FALLBACK_BANNERS[type] ?? [])
   *       }
   *     })
   *
   *   return () => controller.abort()
   * }, [type])
   */

  if (!banners.length) return null

  return (
    <section className={`banner-section banner-section--${type}`}>
      <BannerSlider banners={banners} type={type} />
    </section>
  )
}
