import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { useAuth } from "./Hooks/useAuth";

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
    <div className="flex h-screen bg-brand-bg font-sans overflow-hidden relative">
      <Sidebar mini={mini} setMini={setMini} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar
          mini={mini}
          setMini={setMini}
          onSave={handleSave}
          savedMsg={savedMsg}
          onLogout={handleLogout}
        />
        <div className="flex-1 overflow-y-auto p-[22px] md:px-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}