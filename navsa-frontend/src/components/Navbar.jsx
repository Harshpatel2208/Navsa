import { useState, useEffect } from "react";
import TopBar from "./header/TopBar";
import HeaderMain from "./header/HeaderMain";
import Navigation from "./header/Navigation";
import ServiceBar from "./header/ServiceBar";

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const progress = Math.min(scrollY / 220, 1);
          setScrollProgress(progress);
          setIsSticky(scrollY > 220);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        width: "100%",
        position: "relative",
        zIndex: 1000,
        background: "#ffffff",
      }}
    >
      <TopBar />
      <HeaderMain />
      <Navigation isSticky={isSticky} scrollProgress={scrollProgress} />
      <ServiceBar />
      {isSticky && <div style={{ height: "56px" }} />}
    </header>
  );
}
