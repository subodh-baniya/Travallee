const stats = [
  { label: "Total Bookings",  val: "3,842", sub: "All time",          topColor: "#38bdf8" },
  { label: "Total Revenue",   val: "NPR 4.2M", sub: "All time",       topColor: "#4ade80" },
  { label: "Active Hotels",   val: "24",    sub: "Currently live",     topColor: "#818cf8" },
  { label: "App Users",       val: "12,481",sub: "Registered",         topColor: "#fbbf24" },
  { label: "Bookings Today",  val: "128",   sub: "Last 24 hours",      topColor: "#38bdf8" },
  { label: "Revenue Today",   val: "NPR 84K", sub: "Last 24 hours",   topColor: "#4ade80" },
];

const topHotels = [
  { emoji:"🏨", name:"Grand Vista Hotel",  location:"Kathmandu", bookings:412, revenue:"NPR 820K", pct:85 },
  { emoji:"🏦", name:"Lake View Resort",   location:"Chitwan",   bookings:310, revenue:"NPR 640K", pct:64 },
  { emoji:"🏩", name:"Sunrise Inn",         location:"Pokhara",   bookings:280, revenue:"NPR 480K", pct:58 },
  { emoji:"🏰", name:"Heritage Palace",    location:"Bhaktapur", bookings:194, revenue:"NPR 390K", pct:40 },
  { emoji:"🏡", name:"Green Valley Inn",   location:"Bandipur",  bookings:142, revenue:"NPR 210K", pct:29 },
];

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const bookingData = [180,240,310,280,420,390,450,510,380,460,520,480];
const maxVal = Math.max(...bookingData);

const recentActivity = [
  { color:"#4ade80", text:"New booking at Grand Vista Hotel",     time:"2 min ago"  },
  { color:"#38bdf8", text:"New user registered via App",          time:"8 min ago"  },
  { color:"#818cf8", text:"Redeem code TRAVALEE20 used",          time:"15 min ago" },
  { color:"#fbbf24", text:"Hotel status updated: Sunrise Inn",    time:"1 hr ago"   },
  { color:"#f87171", text:"Booking cancelled: #BK-4817",          time:"2 hrs ago"  },
];

export default function Analysis() {
  return (
    <>
      <style>{`
        .analysis-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }
        .analysis-stat {
          background: #fff;
          border: 0.5px solid rgba(99,120,210,0.12);
          border-radius: 12px;
          padding: 18px 20px;
          border-top: 3px solid #38bdf8;
        }
        .chart-bar-wrap {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 100px;
          padding: 0 4px;
        }
        .chart-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .chart-bar {
          width: 100%;
          background: linear-gradient(180deg, #38bdf8, #0284c7);
          border-radius: 4px 4px 0 0;
          transition: opacity 0.15s;
          min-height: 4px;
        }
        .chart-bar:hover { opacity: 0.75; }
        .chart-label {
          font-size: 9px;
          color: #94a3b8;
          font-family: monospace;
        }
        .chart-x-labels {
          display: flex;
          gap: 6px;
          padding: 0 4px;
          margin-top: 4px;
        }
        .hotel-bar-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .hotel-bar-name {
          width: 140px;
          flex-shrink: 0;
          font-size: 12px;
          color: #0f172a;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hotel-bar-track {
          flex: 1;
          height: 7px;
          background: #f0f6ff;
          border-radius: 6px;
          overflow: hidden;
          border: 0.5px solid rgba(99,120,210,0.1);
        }
        .hotel-bar-fill {
          height: 100%;
          border-radius: 6px;
          background: linear-gradient(90deg, #38bdf8, #0284c7);
        }
        .hotel-bar-val {
          font-size: 11px;
          color: #64748b;
          font-family: monospace;
          width: 40px;
          text-align: right;
          flex-shrink: 0;
        }
        .two-col-analysis {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        .analysis-panel {
          background: #fff;
          border: 0.5px solid rgba(99,120,210,0.12);
          border-radius: 12px;
          padding: 18px 20px;
        }
        .ap-title {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .ap-sub {
          font-size: 11px;
          color: #64748b;
          margin-bottom: 16px;
        }
        .activity-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;
        }
        .activity-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 9px 0;
          border-bottom: 0.5px solid rgba(99,120,210,0.08);
        }
        .activity-row:last-child { border-bottom: none; }
        .act-text { font-size: 12px; color: #0f172a; line-height: 1.5; }
        .act-time { font-size: 11px; color: #94a3b8; margin-top: 2px; }
      `}</style>

      <div className="section-title">Analysis</div>
      <div className="section-sub">Platform-wide performance metrics and insights</div>

      {/* Stats grid */}
      <div className="analysis-stat-grid">
        {stats.map((s) => (
          <div className="analysis-stat" key={s.label} style={{ borderTopColor: s.topColor }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Bookings chart + Top hotels */}
      <div className="two-col-analysis">

        {/* Bar chart */}
        <div className="analysis-panel">
          <div className="ap-title">Monthly Bookings</div>
          <div className="ap-sub">Jan – Dec 2025</div>
          <div className="chart-bar-wrap">
            {bookingData.map((val, i) => (
              <div className="chart-col" key={i}>
                <div
                  className="chart-bar"
                  style={{ height: `${(val / maxVal) * 100}%` }}
                  title={`${months[i]}: ${val} bookings`}
                />
              </div>
            ))}
          </div>
          <div className="chart-x-labels">
            {months.map((m) => (
              <div key={m} style={{ flex:1, textAlign:"center", fontSize:9, color:"#94a3b8", fontFamily:"monospace" }}>
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Top hotels */}
        <div className="analysis-panel">
          <div className="ap-title">Top Hotels by Bookings</div>
          <div className="ap-sub">All time</div>
          {topHotels.map((h) => (
            <div className="hotel-bar-row" key={h.name}>
              <div className="hotel-bar-name">{h.emoji} {h.name}</div>
              <div className="hotel-bar-track">
                <div className="hotel-bar-fill" style={{ width:`${h.pct}%` }} />
              </div>
              <div className="hotel-bar-val">{h.bookings}</div>
            </div>
          ))}
        </div>

      </div>

      {/* Revenue table + Recent activity */}
      <div className="two-col-analysis">

        {/* Revenue table */}
        <div className="analysis-panel">
          <div className="ap-title">Revenue by Hotel</div>
          <div className="ap-sub">Top performers</div>
          <div className="table-wrap" style={{ borderRadius:8 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hotel</th>
                  <th>Bookings</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topHotels.map((h) => (
                  <tr key={h.name}>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <span>{h.emoji}</span>
                        <div>
                          <div style={{ fontSize:12, fontWeight:500 }}>{h.name}</div>
                          <div style={{ fontSize:11, color:"#64748b" }}>{h.location}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily:"monospace", fontSize:12, color:"#0284c7" }}>{h.bookings}</td>
                    <td style={{ fontSize:12, fontWeight:500, color:"#166534" }}>{h.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent activity */}
        <div className="analysis-panel">
          <div className="ap-title">Recent Activity</div>
          <div className="ap-sub">Live platform events</div>
          {recentActivity.map((a, i) => (
            <div className="activity-row" key={i}>
              <div className="activity-dot" style={{ background: a.color }} />
              <div>
                <div className="act-text">{a.text}</div>
                <div className="act-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}