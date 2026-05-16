
import { useState } from "react";
import { globalCSS } from "./theme";

import Sidebar    from "./components/Sidebar";
import Topbar     from "./components/Topbar";

import Dashboard  from "./pages/Dashboard";
import Website    from "./pages/Website";
import AppPage    from "./pages/AppPage";
import Ads        from "./pages/Ads";
import ComingSoon from "./pages/ComingSoon";
import Users      from "./pages/Users";
import Analytics  from "./pages/Analytics";
import Settings   from "./pages/Settings";

export default function App() {
  const [page, setPage]         = useState("dashboard");
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1500);
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard  setPage={setPage} />;
      case "website":   return <Website    />;
      case "app":       return <AppPage    />;
      case "ads":       return <Ads        />;
      case "coming":    return <ComingSoon />;
      case "users":     return <Users      />;
      case "analytics": return <Analytics  />;
      case "settings":  return <Settings   />;
      default:          return null;
    }
  };

  return (
    <>
      <style>{globalCSS}</style>
      <div className="dash-wrap">
        <Sidebar page={page} setPage={setPage} />
        <div className="main">
          <Topbar page={page} onSave={handleSave} savedMsg={savedMsg} />
          <div className="content">
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}