import { theme } from "../theme";

const css = `
  .topbar {
    padding: 14px 28px;
    border-bottom: 1px solid ${theme.border};
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    background: ${theme.surface};
    box-shadow: 0 1px 4px rgba(99,120,210,0.06);
  }
  .page-title {
    font-size: 16px;
    font-weight: 700;
    color: ${theme.text};
    letter-spacing: -0.2px;
  }
  .page-path {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: ${theme.muted};
    margin-top: 2px;
    letter-spacing: 0.03em;
  }
  .top-actions { display: flex; gap: 10px; align-items: center; }
  .topbar-date {
    font-size: 12px;
    color: ${theme.muted};
    font-weight: 500;
    margin-right: 6px;
  }
`;

const PAGE_META = {
  dashboard: { title: "Dashboard",     path: "/ overview" },
  website:   { title: "Website",       path: "/ manage / website" },
  app:       { title: "App",           path: "/ manage / app" },
  ads:       { title: "Ads & Promos",  path: "/ manage / ads" },
  coming:    { title: "What's Coming", path: "/ manage / coming-soon" },
  users:     { title: "Users",         path: "/ people / users" },
  analytics: { title: "Analytics",     path: "/ system / analytics" },
  settings:  { title: "Settings",      path: "/ system / settings" },
};

export default function Topbar({ page, onSave, savedMsg }) {
  const meta = PAGE_META[page] || { title: page, path: "/" };
  const today = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <>
      <style>{css}</style>
      <div className="topbar">
        <div>
          <div className="page-title">{meta.title}</div>
          <div className="page-path">{meta.path}</div>
        </div>
        <div className="top-actions">
          <span className="topbar-date">{today}</span>
          <button className="btn">+ New</button>
          <button className="btn primary" onClick={onSave}>
            {savedMsg ? "✓ Saved" : "Save changes"}
          </button>
        </div>
      </div>
    </>
  );
}