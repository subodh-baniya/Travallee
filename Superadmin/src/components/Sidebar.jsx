const NAV = [
  { section: "Main" },
  { id: "app",      icon: "ti-device-mobile", label: "App" },
  {
    id: "hotels", icon: "ti-building", label: "Hotels",
    children: [
      { id: "register", label: "Register Hotels" },
      { id: "bookings", label: "Bookings" },
      { id: "status",   label: "Status" },
    ],
  },
  { id: "analysis", icon: "ti-chart-bar", label: "Analysis" },
];

export default function Sidebar({ page, setPage, mini, setMini }) {
  const isHotelPage = ["register","bookings","status"].includes(page);
  const [hotelsOpen, setHotelsOpen] = window.__sidebarState || [isHotelPage, () => {}];

  return (
    <div className={`sidebar${mini ? " mini" : ""}`}>
      {/* Logo */}
      <div className="s-logo">
        <div className="s-logo-icon">
          <i className="ti ti-shield-lock" aria-hidden="true" />
        </div>
        <div>
          <div className="s-logo-name">Control Center</div>
          <div className="s-logo-sub">Superadmin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="s-nav">
        {NAV.map((item, i) => {
          if (item.section) return <div className="s-section" key={i}>{item.section}</div>;

          if (item.children) {
            return (
              <div key={item.id}>
                <div
                  className={`s-item${isHotelPage ? " active" : ""}`}
                  onClick={() => {
                    window.__hotelsOpen = !window.__hotelsOpen;
                    setPage("hotels-toggle");
                  }}
                >
                  <div className="s-icon"><i className={`ti ${item.icon}`} aria-hidden="true" /></div>
                  <span className="s-label">{item.label}</span>
                  <i className={`ti ti-chevron-down s-chevron${window.__hotelsOpen ? " open" : ""}`} aria-hidden="true" />
                </div>
                <div className={`s-submenu${window.__hotelsOpen ? " open" : ""}`}>
                  {item.children.map((c) => (
                    <div
                      key={c.id}
                      className={`s-sub-item${page === c.id ? " active" : ""}`}
                      onClick={() => { setPage(c.id); setMini(true); }}
                    >
                      <div className="s-dot" />
                      {c.label}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className={`s-item${page === item.id ? " active" : ""}`}
              onClick={() => { setPage(item.id); setMini(true); }}
            >
              <div className="s-icon"><i className={`ti ${item.icon}`} aria-hidden="true" /></div>
              <span className="s-label">{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="s-footer">
        <div className="s-user">
          <div className="s-av">SA</div>
          <div>
            <div className="s-uname">Super Admin</div>
            <div className="s-urole">Root access</div>
          </div>
          <div className="s-online" />
        </div>
      </div>
    </div>
  );
}