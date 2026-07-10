// import TopBar from "./header/TopBar";
// import HeaderMain from "./header/HeaderMain";
// import Navigation from "./header/Navigation";
// import ServiceBar from "./header/ServiceBar";

// export default function Navbar() {
//   return (
//     <header
//       style={{
//         width: "100%",
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         background: "#ffffff",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//       }}
//     >
//       <TopBar />

//       <HeaderMain />

//       <Navigation />

//       <ServiceBar />
//     </header>
//   );
// }
import TopBar from "./header/TopBar";
import HeaderMain from "./header/HeaderMain";
import Navigation from "./header/Navigation";
import ServiceBar from "./header/ServiceBar";

export default function Navbar() {
  return (
    <header
      style={{
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <TopBar />
      <HeaderMain />
      <Navigation />
      <ServiceBar />
    </header>
  );
}