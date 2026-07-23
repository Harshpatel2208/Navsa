import { useEffect, useRef, useState } from 'react'
import TopBar from './header/TopBar'
import HeaderMain from './header/HeaderMain'
import ServiceBar from './header/ServiceBar'
import './Navbar.css'

export default function Navbar() {
  const headerRef = useRef(null)
  const [spacerHeight, setSpacerHeight] = useState(0)
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    function onScroll() {
      const sticky = window.scrollY > 80
      setIsSticky(sticky)
      if (sticky && headerRef.current) {
        setSpacerHeight(headerRef.current.offsetHeight)
      } else {
        setSpacerHeight(0)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header ref={headerRef} className="site-header">
        <TopBar />
        <HeaderMain />
        <ServiceBar />
      </header>
      {isSticky && (
        <div style={{ height: spacerHeight }} aria-hidden="true" />
      )}
    </>
  )
}
