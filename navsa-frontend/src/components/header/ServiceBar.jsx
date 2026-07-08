import { useEffect, useState } from "react";
import {
  FaTruck,
  FaShip,
  FaPlane,
  FaSnowflake,
  FaTags,
  FaWarehouse,
  FaFileAlt,
} from "react-icons/fa";

const services = [
  {
    icon: <FaTags />,
    text: "Labelling",
  },
  {
    icon: <FaSnowflake />,
    text: "Reefer Consolidation",
  },
  {
    icon: <FaTruck />,
    text: "Road Freight",
  },
  {
    icon: <FaShip />,
    text: "Sea Freight",
  },
  {
    icon: <FaPlane />,
    text: "Air Freight",
  },
  {
    icon: <FaWarehouse />,
    text: "Warehousing",
  },
  {
    icon: <FaFileAlt />,
    text: "Export Documentation",
  },
];

export default function ServiceBar() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setOffset((prev) => (prev <= -100 ? 0 : prev - 0.06));
    }, 35);

    return () => clearInterval(timer);
  }, []);

  const items = [...services, ...services, ...services];

  return (
    <div
      style={{
        width: "100%",
        background: "#f58220",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,.15)",
        borderBottom: "1px solid rgba(0,0,0,.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          transform: `translateX(${offset}%)`,
          whiteSpace: "nowrap",
          width: "max-content",
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 38px",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            <span
              style={{
                fontSize: "17px",
              }}
            >
              {item.icon}
            </span>

            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}