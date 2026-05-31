const PAGE_META = {
  // App
  banners:  { title: "Banners",           path: "/ app / banners"   },
  redeem:   { title: "Redeem Code",       path: "/ app / redeem"    },
  users:    { title: "App Users",         path: "/ app / users"     },
  block:    { title: "Block / Unblock",   path: "/ app / block"     },
  // Hotels
  register: { title: "Register Hotels",   path: "/ hotels / register" },
  bookings: { title: "Bookings",          path: "/ hotels / bookings" },
  status:   { title: "Hotel Status",      path: "/ hotels / status"   },
  // Other
  analysis: { title: "Analysis",          path: "/ analysis"          },
};

export default function Topbar({ page, mini, setMini, onSave, savedMsg }) {
  const meta  = PAGE_META[page] || { title: "Dashboard", path: "/" };
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
        <div className="tb-av">SA</div>
      </div>
    </div>
  );
}