import { useState } from "react";
import { globalCSS } from "./theme";

import Sidebar        from "./components/Sidebar";
import Topbar         from "./components/Topbar";

import RegisterHotels from "./pages/Hotels/RegisterHotels";
import Bookings       from "./pages/Hotels/Bookings";
import HotelStatus    from "./pages/Hotels/HotelStatus";
import AppPage        from "./pages/AppPage";
import Analysis       from "./pages/Analysis";

export default function App() {
  const [page,     setPage]     = useState("register");
  const [mini,     setMini]     = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  // keep hotels dropdown state globally so Sidebar can read it
  window.__hotelsOpen = ["register","bookings","status"].includes(page);

  const handleSetPage = (p) => {
    if (p === "hotels-toggle") {
      window.__hotelsOpen = !window.__hotelsOpen;
      setPage((prev) => prev); // force re-render
    } else {
      setPage(p);
    }
  };

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1500);
  };

  const renderPage = () => {
    switch (page) {
      case "register": return <RegisterHotels />;
      case "bookings": return <Bookings />;
      case "status":   return <HotelStatus />;
      case "app":      return <AppPage />;
      case "analysis": return <Analysis />;
      default:         return <RegisterHotels />;
    }
  };

  return (
    <>
      <style>{globalCSS}</style>
      <div className="dash-wrap">
        <Sidebar
          page={page}
          setPage={handleSetPage}
          mini={mini}
          setMini={setMini}
        />
        <div className="main">
          <Topbar
            page={page}
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