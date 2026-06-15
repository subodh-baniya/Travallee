import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  const lineData = [
    { day: 'Mon', val: 120 }, { day: 'Tue', val: 200 }, { day: 'Wed', val: 150 }, { day: 'Thu', val: 220 }, { day: 'Fri', val: 260 }, { day: 'Sat', val: 300 }, { day: 'Sun', val: 180 }
  ];
  return (
    <>
      <div className="text-base font-semibold text-slate-900 mb-1">Analysis</div>
      <div className="text-[13px] text-slate-500 mb-4.5">Platform-wide performance metrics and insights</div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mb-5">
        {stats.map((s) => (
          <div 
            className="bg-white border border-brand-border rounded-xl p-[18px_20px] border-t-[3px]" 
            key={s.label} 
            style={{ borderTopColor: s.topColor }}
          >
            <div className="text-[11px] text-slate-500 mb-2 font-medium uppercase tracking-[0.07em]">{s.label}</div>
            <div className="text-[28px] font-semibold text-slate-900 font-mono">{s.val}</div>
            <div className="text-xs text-slate-400 mt-1.25">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Bookings chart + Top hotels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">

        {/* Bar chart */}
        <div className="bg-white border border-brand-border rounded-xl p-[18px_20px]">
          <div className="text-sm font-semibold text-slate-900 mb-1">Monthly Bookings</div>
          <div className="text-[11px] text-slate-500 mb-4">Jan – Dec 2025</div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="day" tick={{ fill: '#64748b' }} />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="val" stroke="#0284c7" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-1.5 px-1 mt-1">
            {months.map((m) => (
              <div key={m} className="flex-1 text-center text-[9px] text-slate-400 font-mono">
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Top hotels */}
        <div className="bg-white border border-brand-border rounded-xl p-[18px_20px]">
          <div className="text-sm font-semibold text-slate-900 mb-1">Top Hotels by Bookings</div>
          <div className="text-[11px] text-slate-500 mb-4">All time</div>
          <div className="flex flex-col gap-3">
            {topHotels.map((h) => (
              <div className="flex items-center gap-3" key={h.name}>
                <div className="w-[140px] shrink-0 text-xs text-slate-900 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  {h.emoji} {h.name}
                </div>
                <div className="flex-1 h-[7px] bg-[#f0f6ff] rounded-md overflow-hidden border border-brand-border/80">
                  <div className="h-full rounded-md bg-[linear-gradient(90deg,#38bdf8,#0284c7)]" style={{ width:`${h.pct}%` }} />
                </div>
                <div className="text-[11px] text-slate-500 font-mono w-10 text-right shrink-0">{h.bookings}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Revenue table + Recent activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">

        {/* Revenue table */}
        <div className="bg-white border border-brand-border rounded-xl p-[18px_20px]">
          <div className="text-sm font-semibold text-slate-900 mb-1">Revenue by Hotel</div>
          <div className="text-[11px] text-slate-500 mb-4">Top performers</div>
          <div className="border border-brand-border overflow-hidden bg-white rounded-lg">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#f8faff] border-b border-brand-border">
                  <th className="text-[11px] uppercase tracking-[0.06em] text-slate-500 p-[12px_16px] font-semibold text-left">Hotel</th>
                  <th className="text-[11px] uppercase tracking-[0.06em] text-slate-500 p-[12px_16px] font-semibold text-left">Bookings</th>
                  <th className="text-[11px] uppercase tracking-[0.06em] text-slate-500 p-[12px_16px] font-semibold text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topHotels.map((h) => (
                  <tr key={h.name} className="border-b border-brand-border/60 last:border-b-0 hover:bg-[#f8faff]">
                    <td className="p-[13px_16px] text-slate-900 align-middle">
                      <div className="flex items-center gap-[7px]">
                        <span className="text-base">{h.emoji}</span>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{h.name}</div>
                          <div className="text-[11px] text-slate-500">{h.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-[13px_16px] text-slate-900 align-middle font-mono text-xs text-brand-accent">{h.bookings}</td>
                    <td className="p-[13px_16px] align-middle text-xs font-semibold text-emerald-800">{h.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white border border-brand-border rounded-xl p-[18px_20px]">
          <div className="text-sm font-semibold text-slate-900 mb-1">Recent Activity</div>
          <div className="text-[11px] text-slate-500 mb-4">Live platform events</div>
          <div className="flex flex-col">
            {recentActivity.map((a, i) => (
              <div className="flex items-start gap-2.5 py-2.25 border-b border-brand-border/60 last:border-none" key={i}>
                <div className="w-[7px] h-[7px] rounded-full shrink-0 mt-1" style={{ background: a.color }} />
                <div>
                  <div className="text-xs text-slate-900 leading-normal">{a.text}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}