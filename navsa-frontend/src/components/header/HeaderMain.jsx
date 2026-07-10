// import { Link } from "react-router-dom";
// import {
//   FaSearch,
//   FaHeart,
//   FaShoppingBasket,
//   FaUser,
// } from "react-icons/fa";

// import logo from "../../assets/logo.png";
// import awards from "../../assets/award.jpg";

// export default function HeaderMain() {
//   return (
//     <div
//       style={{
//         width: "100%",
//         background: "#ffffff",
//         borderBottom: "1px solid #e9ecef",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "1600px",
//           margin: "0 auto",
//           padding: "20px 40px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: "30px",
//           flexWrap: "wrap",
//         }}
//       >
//         {/* Left */}

//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "18px",
//           }}
//         >
//           <img
//             src={awards}
//             alt="Award"
//             style={{
//               height: "58px",
//               objectFit: "contain",
//             }}
//           />

//           <Link to="/">
//             <img
//               src={logo}
//               alt="Navsa"
//               style={{
//                 height: "72px",
//                 objectFit: "contain",
//               }}
//             />
//           </Link>

//           <img
//             src={awards}
//             alt="Award"
//             style={{
//               height: "58px",
//               objectFit: "contain",
//             }}
//           />
//         </div>

//         {/* Search */}

//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             minWidth: "320px",
//             maxWidth: "700px",
//           }}
//         >
//           <input
//             type="text"
//             placeholder="Search by Product, Brand or Barcode..."
//             style={{
//               flex: 1,
//               padding: "15px 18px",
//               border: "2px solid #ececec",
//               borderRight: "none",
//               outline: "none",
//               fontSize: "15px",
//             }}
//           />

//           <button
//             style={{
//               width: "65px",
//               border: "none",
//               background: "#c9a84c",
//               color: "#fff",
//               cursor: "pointer",
//               fontSize: "20px",
//             }}
//           >
//             <FaSearch />
//           </button>
//         </div>

//         {/* Right */}

//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "18px",
//           }}
//         >
//           {/* Account */}

//           <Link
//             to="/account"
//             style={{
//               textDecoration: "none",
//             }}
//           >
//             <div
//               style={{
//                 background: "#c9a84c",
//                 color: "#fff",
//                 padding: "12px 18px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 borderRadius: "5px",
//                 fontWeight: 600,
//               }}
//             >
//               <FaUser />

//               Account
//             </div>
//           </Link>

//           {/* Wishlist */}

//           <Link
//             to="/wishlist"
//             style={{
//               textDecoration: "none",
//               color: "#293681",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 fontWeight: 600,
//               }}
//             >
//               <FaHeart color="#c9a84c" />

//               Wishlist
//             </div>
//           </Link>

//           {/* Basket */}

//           <Link
//             to="/basket"
//             style={{
//               textDecoration: "none",
//             }}
//           >
//             <div
//               style={{
//                 background: "#293681",
//                 color: "#fff",
//                 padding: "12px 18px",
//                 borderRadius: "5px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 fontWeight: 600,
//               }}
//             >
//               <FaShoppingBasket />

//               <div>
//                 <div style={{ fontSize: "13px" }}>Basket</div>

//                 <div
//                   style={{
//                     fontSize: "11px",
//                     opacity: 0.8,
//                   }}
//                 >
//                   £0.00
//                 </div>
//               </div>
//             </div>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaHeart,
  FaShoppingBasket,
  FaUser,
} from "react-icons/fa";

import logo from "../../assets/logo.png";
import awards from "../../assets/award.jpg";
import { useCart } from "../../context/CartContext";
import { colors } from "../../theme";

export default function HeaderMain() {
  const { wishlistCount, basketCount, basketTotal } = useCart();

  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
        borderBottom: "1px solid #e9ecef",
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        {/* Left */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <img
            src={awards}
            alt="Award"
            style={{
              height: "58px",
              objectFit: "contain",
            }}
          />

          <Link to="/">
            <img
              src={logo}
              alt="Navsa"
              style={{
                height: "72px",
                objectFit: "contain",
              }}
            />
          </Link>

          <img
            src={awards}
            alt="Award"
            style={{
              height: "58px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Search */}

        <div
          style={{
            flex: 1,
            display: "flex",
            minWidth: "320px",
            maxWidth: "700px",
          }}
        >
          <input
            type="text"
            placeholder="Search by Product, Brand or Barcode..."
            style={{
              flex: 1,
              padding: "15px 18px",
              border: "2px solid #ececec",
              borderRight: "none",
              outline: "none",
              fontSize: "15px",
            }}
          />

          <button
            style={{
              width: "65px",
              border: "none",
              background: colors.accent,
              color: "#fff",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            <FaSearch />
          </button>
        </div>

        {/* Right */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          {/* Account */}

          <Link
            to="/account"
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                background: colors.accent,
                color: "#fff",
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "5px",
                fontWeight: 600,
              }}
            >
              <FaUser />

              Account
            </div>
          </Link>

          {/* Wishlist */}

          <Link
            to="/wishlist"
            style={{
              textDecoration: "none",
              color: colors.navy,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 600,
                position: "relative",
              }}
            >
              <span style={{ position: "relative" }}>
                <FaHeart color={colors.accent} />
                {wishlistCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-9px",
                      right: "-11px",
                      background: colors.navy,
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: 700,
                      borderRadius: "50%",
                      minWidth: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 3px",
                    }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </span>

              Wishlist
            </div>
          </Link>

          {/* Basket */}

          <Link
            to="/basket"
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                background: colors.navy,
                color: "#fff",
                padding: "12px 18px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: 600,
                position: "relative",
              }}
            >
              <span style={{ position: "relative" }}>
                <FaShoppingBasket />
                {basketCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-9px",
                      right: "-9px",
                      background: colors.accent,
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: 700,
                      borderRadius: "50%",
                      minWidth: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 3px",
                    }}
                  >
                    {basketCount}
                  </span>
                )}
              </span>

              <div>
                <div style={{ fontSize: "13px" }}>Basket</div>

                <div
                  style={{
                    fontSize: "11px",
                    opacity: 0.8,
                  }}
                >
                  £{basketTotal.toFixed(2)}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
