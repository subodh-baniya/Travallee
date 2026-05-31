import { useState } from "react";
import { globalCSS } from "./theme";

import Sidebar        from "./components/Sidebar";
import Topbar         from "./components/Topbar";

// Hotels
import RegisterHotels from "./pages/Hotels/RegisterHotels";
import Bookings       from "./pages/Hotels/Bookings";
import HotelStatus    from "./pages/Hotels/HotelStatus";

// App
import Banners        from "./pages/App/Banners";
import RedeemCode     from "./pages/App/RedeemCode";
import AppUsers       from "./pages/App/AppUsers";
import BlockUsers     from "./pages/App/BlockUsers";

// Other
import Analysis       from "./pages/Analysis";

export default function App() {
  const [page,     setPage]     = useState("banners");
  const [mini,     setMini]     = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const appPages    = ["banners","redeem","users","block"];
  const hotelPages  = ["register","bookings","status"];

  window.__appOpen   = appPages.includes(page);
  window.__hotelsOpen = hotelPages.includes(page);

  const handleSetPage = (p) => {
    if (p === "app-toggle") {
      window.__appOpen = !window.__appOpen;
      setPage((prev) => prev + " "); // force re-render trick
    } else if (p === "hotels-toggle") {
      window.__hotelsOpen = !window.__hotelsOpen;
      setPage((prev) => prev + " ");
    } else {
      setPage(p.trim());
    }
  };

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1500);
  };

  const renderPage = () => {
    switch (page.trim()) {
      // App
      case "banners":   return <Banners />;
      case "redeem":    return <RedeemCode />;
      case "users":     return <AppUsers />;
      case "block":     return <BlockUsers />;
      // Hotels
      case "register":  return <RegisterHotels />;
      case "bookings":  return <Bookings />;
      case "status":    return <HotelStatus />;
      // Other
      case "analysis":  return <Analysis />;
      default:          return <Banners />;
    }
  };

  return (
    <>
      <style>{globalCSS}</style>
      <div className="dash-wrap">
        <Sidebar
          page={page.trim()}
          setPage={handleSetPage}
          mini={mini}
          setMini={setMini}
        />
        <div className="main">
          <Topbar
            page={page.trim()}
            mini={mini}
            setMini={setMini}
            onSave={handleSave}
            savedMsg={savedMsg}
          />
          <div className="content">
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}