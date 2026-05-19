
import Toggle from "../components/Toggle";

export default function AppPage() {
  const flags = [
    { label: "Dark mode",             sub: "Enable in-app dark theme",      on: true  },
    { label: "Push notifications",    sub: "Allow sending push alerts",      on: true  },
    { label: "New onboarding flow",   sub: "Beta — 20% of users",           on: false },
    { label: "Force update prompt",   sub: "Show update dialog on open",    on: false },
  ];

  return (
    <>
      {/* App Config */}
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">App Configuration</span>
        </div>
        <div className="form-row">
          <label className="form-label">App Name</label>
          <input className="form-input" defaultValue="MyApp" />
        </div>
        <div className="form-row">
          <label className="form-label">Current Version</label>
          <input className="form-input" defaultValue="v2.4.1" />
        </div>
        <div className="form-row">
          <label className="form-label">Minimum Supported Version</label>
          <input className="form-input" defaultValue="v2.0.0" />
        </div>
        <button className="btn primary">Save Config</button>
      </div>

      {/* Feature Flags */}
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">Feature Flags</span>
        </div>
        {flags.map((t) => (
          <div className="toggle-row" key={t.label}>
            <div>
              <div className="tl">{t.label}</div>
              <div className="ts">{t.sub}</div>
            </div>
            <Toggle defaultOn={t.on} />
          </div>
        ))}
      </div>

      {/* In-App Notification */}
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">In-App Notification</span>
        </div>
        <div className="form-row">
          <label className="form-label">Message</label>
          <textarea
            className="form-input form-textarea"
            defaultValue="Hey! Check out what's new in v2.4.1 ✨"
          />
        </div>
        <button className="btn primary">Send to all users</button>
      </div>
    </>
  );
}