import { useMemo, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { globalCSS } from "./theme";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import RegisterHotels from "./pages/Hotels/RegisterHotels";
import Bookings from "./pages/Hotels/Bookings";
import HotelStatus from "./pages/Hotels/HotelStatus";
import Banners from "./pages/App/Banners";
import RedeemCode from "./pages/App/RedeemCode";
import AppUsers from "./pages/App/AppUsers";
import BlockUsers from "./pages/App/BlockUsers";
import Analysis from "./pages/Analysis";
import Login from "./pages/Login";

const SUPERADMIN_KEY = "superadmin_auth";

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SUPERADMIN_KEY) || "null");
  } catch {
    return null;
  }
}

function saveSession(session) {
  localStorage.setItem(SUPERADMIN_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SUPERADMIN_KEY);
}

function RequireAuth({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function DashboardLayout({ onLogout }) {
  const [mini, setMini] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1500);
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
          onLogout={onLogout}
        />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(getSession);

  const isAuthenticated = useMemo(() => {
    return Boolean(session?.token && session?.role === "superadmin");
  }, [session]);

  const handleLoginSuccess = (nextSession) => {
    saveSession(nextSession);
    setSession(nextSession);

    const fromPath = location.state?.from?.pathname;
    navigate(fromPath || "/dashboard/app/banners", { replace: true });
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    navigate("/login", { replace: true });
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard/app/banners" replace />
            : <Login onLoginSuccess={handleLoginSuccess} />
        }
      />

      <Route element={<RequireAuth isAuthenticated={isAuthenticated} />}>
        <Route path="/dashboard" element={<DashboardLayout onLogout={handleLogout} />}>
          <Route index element={<Navigate to="app/banners" replace />} />
          <Route path="app/banners" element={<Banners />} />
          <Route path="app/redeem" element={<RedeemCode />} />
          <Route path="app/users" element={<AppUsers />} />
          <Route path="app/block" element={<BlockUsers />} />
          <Route path="hotels/register" element={<RegisterHotels />} />
          <Route path="hotels/bookings" element={<Bookings />} />
          <Route path="hotels/status" element={<HotelStatus />} />
          <Route path="analysis" element={<Analysis />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard/app/banners" : "/login"} replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <style>{globalCSS}</style>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}