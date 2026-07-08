import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { colors, fonts } from '../theme';

// Load all brand logo images automatically from assets/brands/
const imageModules = import.meta.glob(
  "../assets/brands/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
);

// Build a lookup: normalised key → image URL
// Key = lowercase alphanumeric only (e.g. "kitkat", "pgti ps", "mcvities")
const imageByKey = {};
Object.entries(imageModules).forEach(([path, mod]) => {
  const filename = path.split("/").pop().replace(/\.[^/.]+$/, "");
  const key = filename.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!imageByKey[key]) imageByKey[key] = mod.default;
});

// Given a brand name from DB, find the best matching logo image
function findLogo(brandName) {
  if (!brandName) return null;
  const key = brandName.toLowerCase().replace(/[^a-z0-9]/g, "");
  // Exact match
  if (imageByKey[key]) return imageByKey[key];
  // Partial match — logo filename contains the brand key or vice versa
  for (const [imgKey, url] of Object.entries(imageByKey)) {
    if (imgKey.includes(key) || key.includes(imgKey)) return url;
  }
  return null;
}

function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const brandsPerPage = 48;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/brands")
      .then(r => r.json())
      .then(data => {
        setBrands(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const name = brand.brand_name || "";
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
      const matchesLetter =
        selectedLetter === "ALL"
          ? true
          : name.toUpperCase().startsWith(selectedLetter);
      return matchesSearch && matchesLetter;
    });
  }, [brands, search, selectedLetter]);

  const totalPages = Math.ceil(filteredBrands.length / brandsPerPage);
  const displayedBrands = filteredBrands.slice(
    (currentPage - 1) * brandsPerPage,
    currentPage * brandsPerPage
  );

  return (
    <div style={{ width: '100%', background: colors.paper, fontFamily: fonts.body, minHeight: '80vh', padding: '40px 0' }}>
      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "20px" }}>
        <h1
          style={{
            textAlign: "center",
            fontSize: "42px",
            marginBottom: "30px",
            color: colors.navy,
            fontFamily: fonts.display,
            fontWeight: 800,
          }}
        >
          Brands
        </h1>

        <input
          type="text"
          placeholder="Search brands..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            width: "350px",
            display: "block",
            margin: "0 auto 25px",
            padding: "12px 18px",
            fontSize: "15px",
            border: `1px solid ${colors.hairline}`,
            fontFamily: fonts.body,
            borderRadius: '4px',
            color: colors.navyDeep,
            outline: 'none',
          }}
        />

        {/* Alphabet filter */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "30px",
          }}
        >
          <button
            onClick={() => { setSelectedLetter("ALL"); setCurrentPage(1); }}
            style={{
              padding: "8px 14px",
              cursor: "pointer",
              background: selectedLetter === "ALL" ? colors.navy : "#fff",
              color: selectedLetter === "ALL" ? "#fff" : colors.navy,
              border: `1px solid ${selectedLetter === "ALL" ? colors.navy : colors.hairline}`,
              fontFamily: fonts.mono,
              fontWeight: 700,
              fontSize: '12px',
              borderRadius: '4px',
            }}
          >
            ALL
          </button>

          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => { setSelectedLetter(letter); setCurrentPage(1); }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                background: selectedLetter === letter ? colors.navy : "#fff",
                color: selectedLetter === letter ? "#fff" : colors.navy,
                border: `1px solid ${selectedLetter === letter ? colors.navy : colors.hairline}`,
                fontFamily: fonts.mono,
                fontWeight: 700,
                fontSize: '12px',
                borderRadius: '4px',
              }}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', fontFamily: fonts.mono, color: colors.inkMuted, fontSize: '13px' }}>
            LOADING BRANDS…
          </div>
        ) : filteredBrands.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: colors.inkMuted }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontFamily: fonts.mono, fontSize: '13px' }}>No brands found matching "{search}"</p>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: fonts.mono, fontSize: '12px', color: colors.inkMuted, marginBottom: '20px', textAlign: 'center' }}>
              SHOWING {displayedBrands.length} OF {filteredBrands.length} BRANDS
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))",
                gap: "20px",
              }}
            >
              {displayedBrands.map((brand) => {
                const logo = findLogo(brand.brand_name);
                return (
                  <Link
                    key={brand.id}
                    to={`/shop?brand=${encodeURIComponent(brand.brand_name)}`}
                    style={{ textDecoration: "none", color: colors.navy }}
                  >
                    <div
                      style={{
                        border: `1px solid ${colors.hairline}`,
                        borderRadius: "8px",
                        padding: "15px",
                        textAlign: "center",
                        background: "#fff",
                        transition: "transform 0.22s ease, box-shadow 0.22s ease",
                        height: '140px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(8, 43, 83, 0.08)';
                        e.currentTarget.style.borderColor = colors.navy;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = colors.hairline;
                      }}
                    >
                      {logo ? (
                        <img
                          src={logo}
                          alt={brand.brand_name}
                          style={{ width: "100%", height: "80px", objectFit: "contain", marginBottom: '8px' }}
                        />
                      ) : (
                        <div style={{
                          width: '60px', height: '60px', borderRadius: '50%',
                          background: colors.navy, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', marginBottom: '8px', flexShrink: 0,
                        }}>
                          <span style={{
                            fontFamily: fonts.mono, fontSize: '20px', fontWeight: 800,
                            color: '#fff', letterSpacing: '0',
                          }}>
                            {brand.brand_name?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                      )}

                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "13px",
                          color: colors.navy,
                          fontFamily: fonts.body,
                          lineHeight: '1.3',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%',
                        }}
                        title={brand.brand_name}
                      >
                        {brand.brand_name}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  marginTop: "40px",
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  style={{
                    padding: "10px 18px",
                    border: `1px solid ${colors.hairline}`,
                    background: "#fff",
                    cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                    fontFamily: fonts.mono,
                    fontSize: "12px",
                    fontWeight: 700,
                    color: colors.navy,
                    borderRadius: '4px',
                    opacity: currentPage <= 1 ? 0.5 : 1,
                  }}
                >
                  ← Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      background: currentPage === i + 1 ? colors.navy : "#fff",
                      color: currentPage === i + 1 ? "#fff" : colors.navy,
                      border: `1px solid ${currentPage === i + 1 ? colors.navy : colors.hairline}`,
                      fontFamily: fonts.mono,
                      fontWeight: 700,
                      fontSize: '12px',
                      borderRadius: '4px',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  style={{
                    padding: "10px 18px",
                    border: `1px solid ${colors.hairline}`,
                    background: "#fff",
                    cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                    fontFamily: fonts.mono,
                    fontSize: "12px",
                    fontWeight: 700,
                    color: colors.navy,
                    borderRadius: '4px',
                    opacity: currentPage >= totalPages ? 0.5 : 1,
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Brands;