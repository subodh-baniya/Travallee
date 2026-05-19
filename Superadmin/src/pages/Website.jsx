
import Toggle from "../components/Toggle.jsx";

export default function Website() {
  const pageToggles = [
    { label: "Homepage",         sub: "Main landing page",        on: true  },
    { label: "Blog",             sub: "Articles & updates",       on: true  },
    { label: "Pricing page",     sub: "Plans & billing",          on: true  },
    { label: "Maintenance mode", sub: "Blocks all public access", on: false },
  ];

  return (
    <>
      // homepage components
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">Homepage Content</span>
        </div>
        <div className="form-row">
          <label className="form-label">Hero Headline</label>
          <input className="form-input" defaultValue="Welcome to our platform" />
        </div>
        <div className="form-row">
          <label className="form-label">Hero Subtext</label>
          <input className="form-input" defaultValue="The best way to manage your workflow" />
        </div>
        <div className="form-row">
          <label className="form-label">CTA Button Text</label>
          <input className="form-input" defaultValue="Get Started Free" />
        </div>
        <button className="btn primary">Save Content</button>
      </div>

      // page visibility
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">Page Visibility</span>
        </div>
        {pageToggles.map((t) => (
          <div className="toggle-row" key={t.label}>
            <div>
              <div className="tl">{t.label}</div>
              <div className="ts">{t.sub}</div>
            </div>
            <Toggle defaultOn={t.on} />
          </div>
        ))}
      </div>

      //announcement banner
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">Announcement Banner</span>
        </div>
        <div className="form-row">
          <label className="form-label">Banner Message</label>
          <input className="form-input" defaultValue="🎉 New features dropping this Friday!" />
        </div>
        <div className="toggle-row">
          <div>
            <div className="tl">Show banner</div>
            <div className="ts">Displays site-wide</div>
          </div>
          <Toggle defaultOn={true} />
        </div>
      </div>
    </>
  );
}