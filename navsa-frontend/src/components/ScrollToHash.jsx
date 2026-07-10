import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return

    setTimeout(() => {
      const element = document.querySelector(location.hash)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }, 300)
  }, [location])

  return null
}

export default ScrollToHash