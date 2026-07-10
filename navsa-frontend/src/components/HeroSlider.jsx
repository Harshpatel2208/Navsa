import { useEffect, useState } from "react";
import { colors } from "../theme";

import banner1 from "../assets/banners/banner1.jpg";
import banner2 from "../assets/banners/banner2.jpg";
import banner3 from "../assets/banners/banner3.jpg";

const slides = [
  banner1,
  banner2,
  banner3,
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const previous = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "500px",
        overflow: "hidden",
      }}
    >
      {slides.map((image, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            inset: 0,
            opacity: current === index ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        >
          <img
            src={image}
            alt={`Banner ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              userSelect: "none",
            }}
            draggable={false}
          />
        </div>
      ))}

      

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "25px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "12px",
          zIndex: 10,
        }}
      >
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            style={{
              width: current === index ? "34px" : "12px",
              height: "12px",
              borderRadius: "30px",
              background: current === index ? colors.accent : "#ffffff",
              cursor: "pointer",
              transition: "all .3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}