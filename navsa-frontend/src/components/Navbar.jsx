import TopBar from './header/TopBar'
import HeaderMain from './header/HeaderMain'
import ServiceBar from './header/ServiceBar'
import './Navbar.css'

export default function Navbar() {
  return (
    <header className="site-header">
      <TopBar />
      <HeaderMain />
      <ServiceBar />
    </header>
  )
}
