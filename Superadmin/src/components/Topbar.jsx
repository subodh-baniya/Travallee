import { useLocation } from "react-router-dom";

const PAGE_META = {
  "/dashboard/app/banners": { title: "Banners", path: "/app/banners" },
  "/dashboard/app/redeem": { title: "Redeem Code", path: "/app/redeem" },
  "/dashboard/app/users": { title: "App Users", path: "/app/users" },
  "/dashboard/app/block": { title: "Block / Unblock", path: "/app/block" },
  "/dashboard/hotels/register": { title: "Register Hotels", path: "/hotels/register" },
  "/dashboard/hotels/bookings": { title: "Bookings", path: "/hotels/bookings" },
  "/dashboard/hotels/status": { title: "Hotel Status", path: "/hotels/status" },
  "/dashboard/analysis": { title: "Analysis", path: "/analysis" },
};

export default function Topbar({ mini, setMini, onSave, savedMsg, onLogout }) {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] || { title: "Dashboard", path: "/dashboard" };
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className="topbar">
      <div className="tb-left">
        <div className="toggle-btn" onClick={() => setMini(!mini)} title="Toggle sidebar">
          <i className="ti ti-menu-2" aria-hidden="true" />
        </div>
        <div>
          <div className="tb-title">{meta.title}</div>
          <div className="tb-path">{meta.path}</div>
        </div>
      </div>
      <div className="tb-right">
        <span className="tb-date">{today}</span>
        <button className="btn">+ New</button>
        <button className="btn primary" onClick={onSave}>
          {savedMsg ? "✓ Saved" : "Save changes"}
        </button>
        <button className="btn" onClick={onLogout}>Logout</button>
        <div className="tb-av">SA</div>
      </div>
    </div>
  );
}