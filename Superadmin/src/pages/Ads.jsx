
import { theme } from "../theme";

const campaigns = [
  { color: theme.success, title: "Summer Promo Banner",   meta: "Web · Homepage · Runs until June 30 · 3,201 impressions", status: "Live"   },
  { color: theme.success, title: "App Install Campaign",  meta: "App · Splash screen · Runs always · 8,400 impressions",  status: "Live"   },
  { color: theme.warning, title: "Referral Bonus Push",   meta: "App · Push notification · Pending review",               status: "Review" },
  { color: theme.muted,   title: "Black Friday Teaser",   meta: "Web + App · Scheduled: Nov 1 · Draft",                   status: "Draft"  },
];

export default function Ads() {
  return (
    <>
      {/* Active Campaigns */}
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">Active Campaigns</span>
          <button className="btn primary" style={{ fontSize: 11, padding: "5px 12px" }}>
            + New Ad
          </button>
        </div>
        {campaigns.map((ad) => (
          <div className="ad-card" key={ad.title}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: ad.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="ad-title">{ad.title}</div>
              <div className="ad-meta">{ad.meta}</div>
            </div>
            <div className="ad-actions">
              <button className="mini-btn">{ad.status}</button>
              <button className="mini-btn">Edit</button>
              <button className="mini-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Quick Promo  */}
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">Create Quick Promo</span>
        </div>
        <div className="form-row">
          <label className="form-label">Promo Title</label>
          <input className="form-input" placeholder="e.g. Weekend Deal" />
        </div>
        <div className="form-row">
          <label className="form-label">Message</label>
          <textarea className="form-input form-textarea" placeholder="What's the offer?" />
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">Platform</label>
            <select className="form-input">
              <option>Both (Web + App)</option>
              <option>Website only</option>
              <option>App only</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label className="form-label">Placement</label>
            <select className="form-input">
              <option>Banner</option>
              <option>Pop-up</option>
              <option>Push notification</option>
            </select>
          </div>
        </div>
        <button className="btn primary">Publish promo</button>
      </div>
    </>
  );
}