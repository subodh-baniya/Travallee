import { theme } from "../theme";

const topbarCSS = `
  .topbar {
    padding: 14px 22px;
    border-bottom: 1px solid ${theme.border};
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    background: ${theme.bg};
  }
  .page-title { font-size: 15px; font-weight: 600; color: ${theme.text}; }
  .page-path  { font-family: 'Space Mono', monospace; font-size: 10px; color: ${theme.muted}; margin-top: 1px; }
  .top-actions { display: flex; gap: 8px; }
`;

const PAGE_META = {
  dashboard: { title: "Dashboard",      path: "/ overview" },
  website:   { title: "Website",        path: "/ manage / website" },
  app:       { title: "App",            path: "/ manage / app" },
  ads:       { title: "Ads & Promos",   path: "/ manage / ads" },
  coming:    { title: "What's Coming",  path: "/ manage / coming-soon" },
  users:     { title: "Users",          path: "/ people / users" },
  analytics: { title: "Analytics",      path: "/ system / analytics" },
  settings:  { title: "Settings",       path: "/ system / settings" },
};

export default function Topbar({ page, onSave, savedMsg }) {
  const meta = PAGE_META[page] || { title: page, path: "/" };
  return (
    <>
      <style>{topbarCSS}</style>
      <div className="topbar">
        <div>
          <div className="page-title">{meta.title}</div>
          <div className="page-path">{meta.path}</div>
        </div>
        <div className="top-actions">
          <button className="btn">+ New</button>
          <button className="btn primary" onClick={onSave}>
            {savedMsg ? "Saved ✓" : "Save changes"}
          </button>
        </div>
      </div>
    </>
  );
}