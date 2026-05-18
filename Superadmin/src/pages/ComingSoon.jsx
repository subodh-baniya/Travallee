// src/pages/ComingSoon.jsx
import { theme } from "../theme";
import Toggle from "../components/Toggle";

const items = [
  {
    borderColor: theme.accent2,
    tagColor: theme.accent2,
    tag: "In development",
    title: "AI-powered recommendations",
    desc: "Personalized feed based on user behavior and preferences.",
    chips: [{ cls: "dev", label: "v2.5" }, { cls: "soon", label: "ETA: July 2025" }],
  },
  {
    borderColor: theme.warning,
    tagColor: theme.warning,
    tag: "Coming soon",
    title: "Team collaboration mode",
    desc: "Invite teammates, assign roles, and work together in real time.",
    chips: [{ cls: "soon", label: "ETA: Aug 2025" }],
  },
  {
    borderColor: theme.success,
    tagColor: theme.success,
    tag: "Just shipped",
    title: "Dark mode",
    desc: "Full dark theme across web and app.",
    chips: [{ cls: "done", label: "v2.4.1" }],
  },
];

export default function ComingSoon() {
  return (
    <>
      {/* Current announcements */}
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">Upcoming Features</span>
        </div>
        {items.map((item) => (
          <div
            className="coming-card"
            key={item.title}
            style={{ borderLeftColor: item.borderColor }}
          >
            <div className="coming-tag" style={{ color: item.tagColor }}>{item.tag}</div>
            <div className="coming-title">{item.title}</div>
            <div className="coming-desc">{item.desc}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 9 }}>
              {item.chips.map((c) => (
                <span className={`chip ${c.cls}`} key={c.label}>{c.label}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add new announcement */}
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">Add Announcement</span>
        </div>
        <div className="form-row">
          <label className="form-label">Feature Name</label>
          <input className="form-input" placeholder="e.g. Live chat support" />
        </div>
        <div className="form-row">
          <label className="form-label">Description</label>
          <textarea className="form-input form-textarea" placeholder="Short description for users..." />
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">Status</label>
            <select className="form-input">
              <option>In development</option>
              <option>Coming soon</option>
              <option>Just shipped</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label className="form-label">ETA</label>
            <input className="form-input" placeholder="e.g. Q3 2025" />
          </div>
        </div>
        <div className="toggle-row" style={{ paddingBottom: 14, borderBottom: "none" }}>
          <div>
            <div className="tl">Visible to users</div>
            <div className="ts">Show on public roadmap</div>
          </div>
          <Toggle defaultOn={true} />
        </div>
        <button className="btn primary">Publish announcement</button>
      </div>
    </>
  );
}