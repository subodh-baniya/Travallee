// src/pages/Dashboard.jsx
import { theme } from "../theme";

export default function Dashboard({ setPage }) {
  const stats = [
    { label: "Total Users",   val: "12,481", change: "↑ 8.2% this week", cls: "up" },
    { label: "App Opens",     val: "4,329",  change: "↑ 12% today",       cls: "up" },
    { label: "Web Sessions",  val: "7,102",  change: "↓ 3.1% today",      cls: "dn" },
    { label: "Active Ads",    val: "06",     change: "2 pending review",   cls: "up" },
  ];

  const activity = [
    { color: theme.success, text: "New user registered via App",          time: "2 mins ago" },
    { color: theme.accent,  text: "Homepage banner updated",              time: "18 mins ago" },
    { color: theme.accent2, text: 'New "Coming Soon" post published',     time: "1 hr ago" },
    { color: theme.warning, text: "Ad campaign #4 flagged for review",    time: "3 hrs ago" },
    { color: theme.danger,  text: "User report: spam account detected",   time: "5 hrs ago" },
  ];

  const quickActions = [
    { icon: "🌐", bg: "rgba(232,255,71,0.08)", label: "Edit Website",      sub: "Update content & pages",  page: "website" },
    { icon: "📱", bg: "rgba(124,92,252,0.1)",  label: "Manage App",        sub: "Screens, settings, builds", page: "app" },
    { icon: "📣", bg: "rgba(245,166,35,0.1)",  label: "Run New Ad",        sub: "Create a promotion",      page: "ads" },
    { icon: "🚀", bg: "rgba(61,220,132,0.1)",  label: "Announce Feature",  sub: "What's coming next",      page: "coming" },
  ];

  return (
    <>
      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val">{s.val}</div>
            <div className={`stat-change ${s.cls}`}>{s.change}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        {/* Activity feed */}
        <div className="panel">
          <div className="panel-hd">
            <span className="panel-title">Recent Activity</span>
          </div>
          {activity.map((a, i) => (
            <div className="activity-item" key={i}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.color, marginTop: 5, flexShrink: 0 }} />
              <div>
                <div className="act-text">{a.text}</div>
                <div className="act-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="panel">
          <div className="panel-hd">
            <span className="panel-title">Quick Actions</span>
          </div>
          {quickActions.map((q) => (
            <button className="quick-action" key={q.label} onClick={() => setPage(q.page)}>
              <div className="qa-icon" style={{ background: q.bg }}>{q.icon}</div>
              <div>
                <div className="qa-label">{q.label}</div>
                <div className="qa-sub">{q.sub}</div>
              </div>
              <div className="qa-arrow">›</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}S