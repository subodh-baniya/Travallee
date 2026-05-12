// src/components/Sidebar.jsx
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

const sidebarCSS = `
  .sidebar {
    width: 220px;
    min-width: 220px;
    background: ${theme.surface};
    border-right: 1px solid ${theme.border};
    display: flex;
    flex-direction: column;
  }
  .logo {
    padding: 20px 18px 16px;
    border-bottom: 1px solid ${theme.border};
  }
  .logo-badge {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: ${theme.accent};
    background: rgba(232,255,71,0.1);
    border: 1px solid rgba(232,255,71,0.25);
    padding: 2px 7px;
    border-radius: 3px;
    display: inline-block;
    margin-bottom: 6px;
    letter-spacing: 0.05em;
  }
  .logo-name { font-size: 15px; font-weight: 600; color: ${theme.text}; }
  .logo-sub  { font-size: 11px; color: ${theme.muted}; margin-top: 1px; }

  .nav { flex: 1; padding: 10px 8px; overflow-y: auto; }
  .nav-section {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.12em;
    color: ${theme.muted};
    padding: 12px 10px 4px;
    text-transform: uppercase;
  }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: 7px;
    cursor: pointer;
    font-size: 13px;
    color: ${theme.muted};
    transition: all 0.15s;
    margin-bottom: 1px;
  }
  .nav-item:hover { background: ${theme.surface2}; color: ${theme.text}; }
  .nav-item.active { background: rgba(232,255,71,0.08); color: ${theme.accent}; }
  .nav-item.active .ni { background: rgba(232,255,71,0.15); }
  .ni {
    width: 28px; height: 28px; border-radius: 6px;
    background: ${theme.surface2};
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }
  .badge {
    margin-left: auto;
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    background: rgba(232,255,71,0.15);
    color: ${theme.accent};
    padding: 1px 6px;
    border-radius: 20px;
  }
  .badge.red { background: rgba(255,79,79,0.15); color: ${theme.danger}; }

  .sidebar-footer { padding: 12px 8px; border-top: 1px solid ${theme.border}; }
  .admin-pill {
    display: flex; align-items: center; gap: 9px;
    padding: 8px 10px; border-radius: 8px;
    background: ${theme.surface2};
  }
  .admin-av {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg, ${theme.accent2}, ${theme.accent});
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .admin-name { font-size: 12px; font-weight: 500; color: ${theme.text}; }
  .admin-role { font-size: 10px; color: ${theme.muted}; }
  .online-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: ${theme.success}; margin-left: auto; flex-shrink: 0;
  }
`;

export default function Sidebar({ page, setPage }) {
  return (
    <>
      <style>{sidebarCSS}</style>
      <div className="sidebar">
        <div className="logo">
          <div className="logo-badge">SUPERADMIN</div>
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