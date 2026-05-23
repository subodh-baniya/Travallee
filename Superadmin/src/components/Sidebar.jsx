import { theme } from "../theme";

const NAV = [
  { section: "Overview" },
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { section: "Manage" },
  { id: "website",   icon: "🌐", label: "Website",      badge: "3" },
  { id: "app",       icon: "📱", label: "App" },
  { id: "ads",       icon: "📣", label: "Ads & Promos" },
  { id: "coming",    icon: "🚀", label: "What's Coming" },
  { section: "People" },
  { id: "users",     icon: "👥", label: "Users", badge: "2", badgeRed: true },
  { section: "System" },
  { id: "analytics", icon: "📈", label: "Analytics" },
  { id: "settings",  icon: "⚙️", label: "Settings" },
];

const css = `
  .sidebar {
    width: 230px;
    min-width: 230px;
    background: ${theme.sidebar};
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 12px rgba(26,37,96,0.10);
  }
  .logo {
    padding: 24px 20px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .logo-badge {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: #e8ff47;
    background: rgba(232,255,71,0.1);
    border: 1px solid rgba(232,255,71,0.2);
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 8px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .logo-name {
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.2px;
  }
  .logo-sub { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; }

  .nav { flex: 1; padding: 12px 10px; overflow-y: auto; }
  .nav-section {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.14em;
    color: rgba(255,255,255,0.3);
    padding: 14px 10px 5px;
    text-transform: uppercase;
  }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    color: rgba(255,255,255,0.55);
    transition: all 0.15s;
    margin-bottom: 2px;
    font-weight: 500;
  }
  .nav-item:hover {
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.9);
  }
  .nav-item.active {
    background: rgba(255,255,255,0.12);
    color: #ffffff;
  }
  .nav-item.active .ni {
    background: ${theme.accent2};
  }
  .ni {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
    transition: background 0.15s;
  }
  .badge {
    margin-left: auto;
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    background: rgba(232,255,71,0.15);
    color: #e8ff47;
    padding: 2px 7px;
    border-radius: 20px;
    font-weight: 700;
  }
  .badge.red {
    background: rgba(224,62,62,0.2);
    color: #ff7a7a;
  }

  .sidebar-footer {
    padding: 14px 10px;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .admin-pill {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px;
    background: rgba(255,255,255,0.07);
    cursor: pointer;
    transition: background 0.15s;
  }
  .admin-pill:hover { background: rgba(255,255,255,0.11); }
  .admin-av {
    width: 32px; height: 32px; border-radius: 50%;
    background: ${theme.accent2};
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .admin-name { font-size: 13px; font-weight: 600; color: #fff; }
  .admin-role { font-size: 11px; color: rgba(255,255,255,0.4); }
  .online-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #3ddc84; margin-left: auto; flex-shrink: 0;
    box-shadow: 0 0 0 2px rgba(61,220,132,0.25);
  }
`;

export default function Sidebar({ page, setPage }) {
  return (
    <>
      <style>{css}</style>
      <div className="sidebar">
        <div className="logo">
          <div className="logo-badge">Superadmin</div>
          <div className="logo-name">Control Center</div>
          <div className="logo-sub">Full access mode</div>
        </div>

        <nav className="nav">
          {NAV.map((item, i) =>
            item.section ? (
              <div className="nav-section" key={i}>{item.section}</div>
            ) : (
              <div
                key={item.id}
                className={`nav-item${page === item.id ? " active" : ""}`}
                onClick={() => setPage(item.id)}
              >
                <div className="ni">{item.icon}</div>
                {item.label}
                {item.badge && (
                  <span className={`badge${item.badgeRed ? " red" : ""}`}>
                    {item.badge}
                  </span>
                )}
              </div>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-pill">
            <div className="admin-av">SA</div>
            <div>
              <div className="admin-name">Super Admin</div>
              <div className="admin-role">Root access</div>
            </div>
            <div className="online-dot" />
          </div>
        </div>
      </div>
    </>
  );
}