import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import banner1 from '../assets/banners/banner1.jpg'
import banner2 from '../assets/banners/banner2.jpg'
import banner3 from '../assets/banners/banner3.jpg'
import './HeroSlider.css'

const slides = [
  {
    image: banner1,
    brand: 'Twix',
    link: '/shop?brand=Twix',
    alt: 'Shop all Twix products',
  },
  {
    image: banner2,
    brand: 'KitKat',
    link: '/shop?brand=KitKat',
    alt: 'Shop all KitKat products',
  },
  {
    image: banner3,
    brand: 'Lipton',
    link: '/shop?brand=Lipton',
    alt: 'Shop all Lipton products',
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent(previous => (previous + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="hero-slider" aria-label="NAVSA promotions">
      <div className="hero-slider__stage">
        {slides.map((slide, index) => (
          <Link
            to={slide.link}
            className={`hero-slider__slide ${
              current === index ? 'hero-slider__slide--active' : ''
            }`}
            key={slide.brand}
            aria-hidden={current !== index}
            tabIndex={current === index ? 0 : -1}
            aria-label={slide.alt}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              draggable={false}
            />
          </Link>
        ))}

        <div className="hero-slider__dots" aria-label="Select banner">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.brand}
              className={`hero-slider__dot ${
                current === index ? 'hero-slider__dot--active' : ''
              }`}
              onClick={event => {
                event.preventDefault()
                event.stopPropagation()
                setCurrent(index)
              }}
              aria-label={`Show ${slide.brand} banner`}
              aria-current={current === index ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
