import { theme } from "../theme";

const stats = [
  { label: "Avg. Session", val: "4:32", change: "↑ 0:24 vs last week", cls: "up" },
  { label: "Bounce Rate",  val: "38%",  change: "↓ 4% (good)",         cls: "up" },
  { label: "Daily Active", val: "2,104",change: "↑ 6% today",           cls: "up" },
  { label: "Retention 7d", val: "61%",  change: "↓ 2%",                 cls: "dn" },
];

const traffic = [
  { label: "Organic",  pct: 72, color: theme.accent2 },
  { label: "Direct",   pct: 14, color: theme.accent  },
  { label: "Social",   pct: 9,  color: theme.warning  },
  { label: "Referral", pct: 5,  color: theme.success  },
];

const topPages = [
  { label: "Home",    pct: 85, color: theme.accent2 },
  { label: "Pricing", pct: 41, color: theme.accent  },
  { label: "Blog",    pct: 28, color: theme.warning  },
  { label: "Docs",    pct: 16, color: theme.success  },
];

export default function Analytics() {
  return (
    <>
      // stats
      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val">{s.val}</div>
            <div className={`stat-change ${s.cls}`}>{s.change}</div>
          </div>
        ))}
      </div>

      // barcharts
      <div className="two-col">
        {[
          { title: "Traffic by source", rows: traffic },
          { title: "Top pages",         rows: topPages },
        ].map((panel) => (
          <div className="panel" key={panel.title}>
            <div className="panel-hd">
              <span className="panel-title">{panel.title}</span>
            </div>
            {panel.rows.map((r) => (
              <div className="bar-row" key={r.label}>
                <div className="bar-label">{r.label}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                </div>
                <div className="bar-val">{r.pct}%</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}