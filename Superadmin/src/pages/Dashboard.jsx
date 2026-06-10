import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

const cards = [
  { title: "Total Hotels", value: "124", sub: "Live on the platform" },
  { title: "Active Bookings", value: "3,842", sub: "All-time booking count" },
  { title: "Today Revenue", value: "NPR 84K", sub: "Last 24 hours" },
  { title: "App Users", value: "12,481", sub: "Registered accounts" },
];

const quickLinks = [
  { label: "Hotels", path: "/dashboard/hotels/register", note: "Register and manage hotels" },
  { label: "Bookings", path: "/dashboard/hotels/bookings", note: "See recent reservations" },
  { label: "Hotel Status", path: "/dashboard/hotels/status", note: "Check live availability" },
  { label: "Analysis", path: "/dashboard/analysis", note: "View performance insights" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = async () => {
    if (!auth) return;
    await auth.logout();
  };

  return (
    <>
      <style>{`
        .dash-home { display: grid; gap: 18px; }
        .dash-hero {
          background: linear-gradient(135deg, #0f172a 0%, #103b63 52%, #0369a1 100%);
          color: #fff;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 18px 50px rgba(2, 132, 199, 0.18);
          position: relative;
          overflow: hidden;
        }
        .dash-hero::after {
          content: "";
          position: absolute;
          inset: auto -60px -60px auto;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }
        .dash-hero-title { font-size: 28px; font-weight: 700; margin: 0 0 8px; letter-spacing: -0.03em; }
        .dash-hero-sub { margin: 0; color: rgba(255,255,255,0.84); max-width: 620px; line-height: 1.6; }
        .dash-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
        .dash-action,
        .dash-logout { border: none; border-radius: 12px; padding: 11px 14px; font-weight: 600; cursor: pointer; }
        .dash-action { background: #fff; color: #0f172a; }
        .dash-logout { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.18); }
        .dash-card-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
        .dash-card {
          background: #fff;
          border-radius: 16px;
          padding: 18px;
          border: 1px solid rgba(148,163,184,0.14);
          box-shadow: 0 14px 32px rgba(15, 23, 42, 0.05);
        }
        .dash-card-label { font-size: 12px; color: #64748b; margin-bottom: 8px; }
        .dash-card-value { font-size: 28px; font-weight: 700; color: #0f172a; letter-spacing: -0.03em; }
        .dash-card-sub { margin-top: 4px; font-size: 12px; color: #94a3b8; }
        .dash-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .dash-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          background: #fff;
          border: 1px solid rgba(148,163,184,0.14);
          border-radius: 16px;
          padding: 16px 18px;
          cursor: pointer;
          text-align: left;
        }
        .dash-link-title { font-size: 15px; font-weight: 700; color: #0f172a; }
        .dash-link-note { font-size: 12px; color: #64748b; margin-top: 4px; }
        .dash-link-arrow { color: #0284c7; font-size: 22px; flex-shrink: 0; }
        .dash-summary {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 12px;
        }
        .dash-panel {
          background: #fff;
          border-radius: 16px;
          padding: 18px;
          border: 1px solid rgba(148,163,184,0.14);
          box-shadow: 0 14px 32px rgba(15, 23, 42, 0.05);
        }
        .dash-panel-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
        .dash-panel-sub { font-size: 12px; color: #64748b; margin-bottom: 14px; }
        .activity-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(148,163,184,0.12);
        }
        .activity-row:last-child { border-bottom: none; }
        .activity-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }
        .activity-text { font-size: 13px; color: #0f172a; line-height: 1.5; }
        .activity-time { font-size: 11px; color: #94a3b8; margin-top: 2px; }
        @media (max-width: 860px) { .dash-card-row, .dash-links, .dash-summary { grid-template-columns: 1fr; } }
      `}</style>

      <div className="dash-home">
        <section className="dash-hero">
          <h1 className="dash-hero-title">Dashboard</h1>
          <p className="dash-hero-sub">
            Welcome back. Use this control center to move between hotels, bookings, analytics, and the main platform overview.
          </p>
          <div className="dash-actions">
            <button className="dash-action" onClick={() => navigate("/dashboard/hotels/register")}>Manage Hotels</button>
            <button className="dash-action" onClick={() => navigate("/dashboard/analysis")}>Open Analysis</button>
            <button className="dash-logout" onClick={handleLogout}>Logout</button>
          </div>
        </section>

        <section className="dash-card-row">
          {cards.map((card) => (
            <div className="dash-card" key={card.title}>
              <div className="dash-card-label">{card.title}</div>
              <div className="dash-card-value">{card.value}</div>
              <div className="dash-card-sub">{card.sub}</div>
            </div>
          ))}
        </section>

        <section className="dash-summary">
          <div className="dash-panel">
            <div className="dash-panel-title">Quick Actions</div>
            <div className="dash-panel-sub">Jump to the most useful sections for superadmin work.</div>
            <div className="dash-links">
              {quickLinks.map((link) => (
                <button className="dash-link" key={link.path} onClick={() => navigate(link.path)}>
                  <div>
                    <div className="dash-link-title">{link.label}</div>
                    <div className="dash-link-note">{link.note}</div>
                  </div>
                  <div className="dash-link-arrow">→</div>
                </button>
              ))}
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-title">Recent Activity</div>
            <div className="dash-panel-sub">Latest platform events for the superadmin.</div>
            {[
              { dot: "#38bdf8", text: "New hotel registration received", time: "2 min ago" },
              { dot: "#4ade80", text: "Booking confirmed for Grand Vista Hotel", time: "8 min ago" },
              { dot: "#818cf8", text: "New app user joined the platform", time: "15 min ago" },
              { dot: "#fbbf24", text: "Revenue report refreshed", time: "1 hr ago" },
            ].map((item) => (
              <div className="activity-row" key={item.text}>
                <div className="activity-dot" style={{ background: item.dot }} />
                <div>
                  <div className="activity-text">{item.text}</div>
                  <div className="activity-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}