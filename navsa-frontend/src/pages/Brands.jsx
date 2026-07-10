import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

// Load all brand logos automatically
const images = import.meta.glob(
  "../assets/brands/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
);

const replacements = {
  "BIRDS EYE": "Bird's Eye",
  "MR KIPLING": "Mr Kipling",
  "MCVITIES": "McVitie's",
  "CADBURYS": "Cadbury",
  "CADBURY": "Cadbury",
  "PG TIPS": "PG Tips",
  "PG TIPS TEA": "PG Tips",
  "COCA COLA": "Coca-Cola",
  "COCACOLA": "Coca-Cola",
  "DR OETKER": "Dr. Oetker",
  "JACK DANIELS": "Jack Daniel's",
  "JACK DANIELS TENNESSEE": "Jack Daniel's",
  "JACK DANIELS OLD NO 7": "Jack Daniel's",
  "LOVE HEARTS": "Love Hearts",
  "YORKIE": "Yorkie",
  "MALTESERS": "Maltesers",
  "KIT KAT": "KitKat",
  "TWININGS": "Twinings",
  "FOXS": "Fox's",
  "WALKERS": "Walkers",
  "BENS ORIGINAL": "Ben's Original",
  "7UP": "7UP",
  "IRN BRU": "IRN-BRU",
  "MR MUSCLE": "Mr Muscle",
};

const uniqueBrands = {};

Object.entries(images).forEach(([path, module]) => {
  const file = path.split("/").pop();

  let clean = file
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]/g, " ")

    .replace(/company\s*logo/gi, "")
    .replace(/official\s*logo/gi, "")
    .replace(/logo\s*png/gi, "")
    .replace(/logo\s*svg/gi, "")
    .replace(/logo\s*vector/gi, "")
    .replace(/vector/gi, "")
    .replace(/brand/gi, "")
    .replace(/company/gi, "")
    .replace(/official/gi, "")
    .replace(/logo/gi, "")

    .replace(/\(.*?\)/g, "")
    .replace(/\d+/g, "")
    .replace(/[–—-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

  clean = replacements[clean] || clean;

  if (!clean) return;

  const key = clean
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const ext = file.split(".").pop().toLowerCase();

  const priority = {
    png: 4,
    webp: 3,
    jpg: 2,
    jpeg: 2,
    svg: 1,
  };

  if (
    !uniqueBrands[key] ||
    priority[ext] > priority[uniqueBrands[key].ext]
  ) {
    uniqueBrands[key] = {
      name: clean,
      image: module.default,
      ext,
    };
  }
});

const brands = Object.values(uniqueBrands)
  .map(({ ext, ...brand }) => brand)
  .sort((a, b) =>
    a.name.localeCompare(b.name, undefined, {
      sensitivity: "base",
    })
  );

function Brands() {
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const brandsPerPage = 48;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const matchesSearch = brand.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesLetter =
        selectedLetter === "ALL"
          ? true
          : brand.name.toUpperCase().startsWith(selectedLetter);

      return matchesSearch && matchesLetter;
    });
  }, [search, selectedLetter]);

  const totalPages = Math.ceil(filteredBrands.length / brandsPerPage);

  const displayedBrands = filteredBrands.slice(
    (currentPage - 1) * brandsPerPage,
    currentPage * brandsPerPage
  );

  return (
    <div
      style={{
        maxWidth: "1500px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "42px",
          marginBottom: "30px",
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
          padding: "12px",
          fontSize: "16px",
        }}
      />

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
          onClick={() => {
            setSelectedLetter("ALL");
            setCurrentPage(1);
          }}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
            background: selectedLetter === "ALL" ? "#ff7a00" : "#f2f2f2",
            color: selectedLetter === "ALL" ? "#fff" : "#000",
            border: "none",
          }}
        >
          ALL
        </button>

        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => {
              setSelectedLetter(letter);
              setCurrentPage(1);
            }}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              background:
                selectedLetter === letter ? "#ff7a00" : "#f2f2f2",
              color: selectedLetter === letter ? "#fff" : "#000",
              border: "none",
            }}
          >
            {letter}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))",
          gap: "20px",
        }}
      >
        {displayedBrands.map((brand) => (
          <Link
            key={brand.name}
            to={`/shop?brand=${encodeURIComponent(brand.name)}`}
            style={{
              textDecoration: "none",
              color: "#000",
            }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                textAlign: "center",
                background: "#fff",
                transition: ".2s",
              }}
            >
              <img
                src={brand.image}
                alt={brand.name}
                style={{
                  width: "100%",
                  height: "90px",
                  objectFit: "contain",
                }}
              />

              <div
                style={{
                  marginTop: "12px",
                  fontWeight: "600",
                  fontSize: "14px",
                  minHeight: "38px",
                }}
              >
                {brand.name
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </div>
            </div>
          </Link>
        ))}
      </div>

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
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              padding: "10px 14px",
              border: "none",
              cursor: "pointer",
              background:
                currentPage === i + 1 ? "#ff7a00" : "#eee",
              color: currentPage === i + 1 ? "#fff" : "#000",
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Brands;