import { useLocation } from "react-router-dom";

const PAGE_META = {
  "/dashboard": { title: "Dashboard", path: "/dashboard" },
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
    <div className="bg-white border-b border-brand-border py-[13px] px-[22px] flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button 
          className="w-8 h-8 rounded-lg border border-[rgba(99,120,210,0.18)] bg-[#f8faff] flex items-center justify-center cursor-pointer shrink-0 transition-colors duration-150 hover:bg-brand-accentBg" 
          onClick={() => setMini(!mini)} 
          title="Toggle sidebar"
        >
          <i className="ti ti-menu-2 text-slate-500 text-base" aria-hidden="true" />
        </button>
        <div>
          <div className="text-[15px] font-semibold text-slate-900">{meta.title}</div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{meta.path}</div>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-xs text-slate-500 mr-1">{today}</span>
        <button className="py-2 px-4 rounded-lg text-[13px] font-medium cursor-pointer border border-brand-border2 bg-white text-slate-900 transition-all duration-150 hover:bg-[#f0f9ff] hover:border-brand-accent2">
          + New
        </button>
        <button 
          className="py-2 px-4 rounded-lg text-[13px] font-semibold cursor-pointer border border-brand-accent bg-brand-accent text-white transition-all duration-150 hover:bg-[#0369a1]" 
          onClick={onSave}
        >
          {savedMsg ? "✓ Saved" : "Save changes"}
        </button>
        <button 
          className="py-2 px-4 rounded-lg text-[13px] font-medium cursor-pointer border border-brand-border2 bg-white text-slate-900 transition-all duration-150 hover:bg-[#f0f9ff] hover:border-brand-accent2" 
          onClick={onLogout}
        >
          Logout
        </button>
        <div className="w-8 h-8 rounded-full bg-brand-accentLight flex items-center justify-center text-[11px] font-semibold text-[#0369a1] cursor-pointer shrink-0">
          SA
        </div>
      </div>
    </div>
  );
}