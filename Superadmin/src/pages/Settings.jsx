
import Toggle from "../components/Toggle";

const systemToggles = [
  { label: "Maintenance mode",       sub: "Disables public site access", on: false },
  { label: "New user registrations", sub: "Allow new signups",           on: true  },
  { label: "Email notifications",    sub: "System emails to admins",     on: true  },
  { label: "API access",             sub: "Allow external API calls",    on: true  },
];

export default function Settings() {
  return (
    <>
      // settings
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">Project Settings</span>
        </div>
        <div className="form-row">
          <label className="form-label">Project Name</label>
          <input className="form-input" defaultValue="My Project" />
        </div>
        <div className="form-row">
          <label className="form-label">Support Email</label>
          <input className="form-input" defaultValue="support@myproject.com" />
        </div>
        <div className="form-row">
          <label className="form-label">Website URL</label>
          <input className="form-input" defaultValue="https://myproject.com" />
        </div>
        <button className="btn primary">Save Settings</button>
      </div>

      // system controls
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">System Controls</span>
        </div>
        {systemToggles.map((t) => (
          <div className="toggle-row" key={t.label}>
            <div>
              <div className="tl">{t.label}</div>
              <div className="ts">{t.sub}</div>
            </div>
            <Toggle defaultOn={t.on} />
          </div>
        ))}
      </div>

      // danger zone
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">Danger Zone</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn danger">Clear cache</button>
          <button className="btn danger">Reset DB</button>
        </div>
      </div>
    </>
  );
}