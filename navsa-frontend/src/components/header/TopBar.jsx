import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

export default function TopBar() {
  const socialLinks = [
    {
      icon: <FaFacebookF />,
      url: "https://facebook.com/navsainternational",
    },
    {
      icon: <FaInstagram />,
      url: "https://instagram.com/navsainternational",
    },
    {
      icon: <FaXTwitter />,
      url: "https://x.com/navsaintl",
    },
    {
      icon: <FaLinkedinIn />,
      url: "https://linkedin.com/company/navsa-international-limited",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        background: "#082c52",
        color: "#ffffff",
        fontSize: "13px",
        fontFamily: "Arial, sans-serif",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "10px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Left Side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {socialLinks.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.12)",
                color: "#ffffff",
                textDecoration: "none",
                transition: "0.3s",
              }}
            >
              {item.icon}
            </a>
          ))}

          <span
            style={{
              marginLeft: "12px",
              fontWeight: 600,
              letterSpacing: "0.3px",
            }}
          >
            NAVSA P10 VALID 01/06/2026 TO 30/06/2026
          </span>
        </div>

        {/* Right Side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaPhoneAlt size={12} />
            <span>+44 (0) 1908 909160</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaEnvelope size={12} />
            <span>sales@navsainternational.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}