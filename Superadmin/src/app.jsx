import { Outlet } from "react-router-dom";
import { useState } from "react";

import { globalCSS } from "./theme";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { useAuth } from "../Hooks/useAuth";

export default function App() {
  const [mini, setMini] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const auth = useAuth();

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1500);
  };

  const handleLogout = async () => {
    if (!auth) {
      return;
    }

    await auth.logout();
  };

  return (
    <div className="dash-wrap">
      <Sidebar mini={mini} setMini={setMini} />
      <div className="main">
        <Topbar
          mini={mini}
          setMini={setMini}
          onSave={handleSave}
          savedMsg={savedMsg}
          onLogout={handleLogout}
        />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}