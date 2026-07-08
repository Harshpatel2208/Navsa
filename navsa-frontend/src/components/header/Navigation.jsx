import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { colors } from "../../theme";

const categories = [
  { label: "Chocolates",               db: "Chocolates" },
  { label: "Groceries",                db: "Groceries" },
  { label: "Confectionery",            db: "Confectionery" },
  { label: "Crisps & Snacks",          db: "Crisps & Snacks" },
  { label: "Cold and Hot Beverages",   db: "Cold and Hot Beverages" },
  { label: "Biscuits",                 db: "Biscuits" },
  { label: "Seasonal",                 db: "Seasonal" },
  { label: "Chilled Items",            db: "Chilled Items" },
  { label: "Frozen",                   db: "Frozen" },
  { label: "Baby and Kids",            db: "Baby and Kids" },
  { label: "Health and Personal Care", db: "Health and Personal Care" },
  { label: "Pet Care and Food",        db: "Pet Care and Food" },
  { label: "Cleaning & Households",    db: "Cleaning & Households" },
];

const quickAccess = [
  "My Home", "My Favourites", "Previous Products", "All Products",
];

const promotions = [
  "Every Day Low Price", "Weekly Deals", "Monthly Promotions",
  "Seasonal Offers", "New Products", "Clearance",
];

const navItems = [
  { name: "Home",               path: "/",                  mega: false },
  { name: "Shop",               path: "/shop",              mega: true  },
  { name: "Brands",              path: "/brand",             mega: false, dropdown: true },
  { name: "About Us",           path: "/about",             mega: false },
  { name: "Contact Us",         path: "/contact",           mega: false },
  { name: "Become a Customer",  path: "/become-a-customer", mega: false },
];

export default function Navigation() {
  const [megaOpen, setMegaOpen] = useState(false);

  return (
    <nav style={{ width: "100%", background: colors.navy, position: "relative", zIndex: 200 }}>
      <div style={{
        maxWidth: "1600px", margin: "0 auto",
        display: "flex", alignItems: "center", padding: "0 40px",
      }}>
        {navItems.map((item) =>
          item.mega ? (
            <div
              key={item.name}
              style={{ position: "relative" }}
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <Link
                to={item.path}
                style={{
                  color: "#fff", textDecoration: "none",
                  padding: "18px 24px", display: "flex", alignItems: "center",
                  gap: "8px", fontWeight: 600, fontSize: "15px", whiteSpace: "nowrap",
                  background: megaOpen ? "#f58220" : "transparent",
                }}
              >
                {item.name}
                <FaChevronDown size={11} />
              </Link>

              {megaOpen && (
                <div style={{
                  position: "fixed", top: "auto", left: 0, right: 0,
                  background: "#fff", borderTop: "3px solid #f58220",
                  boxShadow: "0 18px 40px rgba(0,0,0,.15)",
                  padding: "35px 6vw", display: "flex", gap: "55px", zIndex: 999,
                }}>
                  <div style={{ flex: 2 }}>
                    <div style={{ fontWeight: 700, color: colors.navy, marginBottom: "18px", fontSize: "13px", letterSpacing: ".5px" }}>
                      SHOP BY CATEGORY
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                      {categories.map((c) => (
                        <Link
                          key={c.db}
                          to={`/shop?category=${encodeURIComponent(c.db)}`}
                          onClick={() => setMegaOpen(false)}
                          style={{
                            color: "#222", textDecoration: "none",
                            padding: "7px 0", borderBottom: "1px solid #f1f1f1", fontSize: "14px",
                          }}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div style={{ width: "220px", borderLeft: "1px solid #ececec", paddingLeft: "35px" }}>
                    <div style={{ fontWeight: 700, color: colors.navy, marginBottom: "18px", fontSize: "13px", letterSpacing: ".5px" }}>
                      QUICK ACCESS
                    </div>
                    {quickAccess.map((q) => (
                      <div key={q} style={{ padding: "7px 0", borderBottom: "1px solid #f3f3f3", fontSize: "14px" }}>
                        {q}
                      </div>
                    ))}
                  </div>

                  <div style={{ width: "260px", borderLeft: "1px solid #ececec", paddingLeft: "35px" }}>
                    <div style={{ fontWeight: 700, color: colors.navy, marginBottom: "18px", fontSize: "13px", letterSpacing: ".5px" }}>
                      PROMOTIONS
                    </div>
                    {promotions.map((p) => (
                      <div key={p} style={{ padding: "7px 0", borderBottom: "1px solid #f3f3f3", color: "#f58220", fontWeight: 600, fontSize: "14px" }}>
                        {p}
                      </div>
                    ))}
                    
                    <a href="https://www.navsainternational.co.uk/resources/deal1.pdf"
                      target="_blank" rel="noreferrer"
                      style={{ display: "inline-block", marginTop: "20px", color: colors.navy, textDecoration: "none", fontWeight: 700, fontSize: "14px" }}
                    >
                      📄 Download Latest Deals PDF
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              key={item.name}
              to={item.path}
              style={{
                color: "#fff", textDecoration: "none",
                padding: "18px 24px", display: "flex", alignItems: "center",
                gap: "8px", fontWeight: 600, fontSize: "15px", whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f58220"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {item.name}
              {item.dropdown && <FaChevronDown size={11} />}
            </Link>
          )
        )}
      </div>
    </nav>
  );
}