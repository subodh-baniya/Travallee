import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import { useState, useEffect } from "react";
import { getDashboardStats, getRevenue7Days, getRecentActivity, getPendingApprovals } from "../Services/admin.api";
import CountUp from "../components/CountUp";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import PendingApprovals from "./components/PendingApprovals";
import RecentActivity from "./components/RecentActivity";

const cards = [
  { key: 'totalHotels', title: "Total Hotels", value: 0, sub: "Live on the platform" },
  { key: 'activeBookings', title: "Active Bookings", value: 0, sub: "All-time booking count" },
  { key: 'todayRevenue', title: "Today Revenue", value: 0, sub: "Last 24 hours" },
  { key: 'appUsers', title: "App Users", value: 0, sub: "Registered accounts" },
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
  const { socketConnected, setsocketConnected } = auth;
  const { socket } = auth;
  const [stats, setStats] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [recent, setRecent] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!socket) {
      console.warn("⚠️ Socket not initialized in Dashboard");
      return;
    }

    console.log("✅ Socket available in Dashboard. Connected:", socketConnected);
    console.log("📡 Socket ID:", socket.id);

    const handleData = (data) => {
      console.log("🎉 Dashboard received hotel registration data:", data);
    };

    socket.on("hotelRegistrationsData", handleData);
    console.log("📡 Registered 'hotelRegistrationsData' listener in Dashboard");

    return () => {
      socket.off("hotelRegistrationsData", handleData);
      console.log("🔌 Unregistered 'hotelRegistrationsData' listener in Dashboard");
    };
  }, [socket, socketConnected]);

  useEffect(() => {
    (async () => {
      try {
        const s = await getDashboardStats();
        setStats(s || {});
        const rv = await getRevenue7Days();
        setRevenueData(rv || []);
        const act = await getRecentActivity();
        setRecent(act || []);
        const pend = await getPendingApprovals();
        setPendingCount((pend || []).length);
      } catch (e) { console.error(e); }
    })();
  }, []);




  const handleLogout = async () => {
    if (!auth) return;
    await auth.logout();
  };

  return (
    <div className="grid gap-[18px]">
      {/* Hero section removed */}

      <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div className="bg-white rounded-2xl p-4.5 border border-slate-400/14 shadow-[0_14px_32px_rgba(15,23,42,0.05)]" key={card.key}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 mb-2">{card.title}</div>
                <div className="text-[28px] font-bold text-slate-900 tracking-tight font-mono"><CountUp end={stats[card.key] ?? card.value} /></div>
                <div className="mt-1 text-xs text-slate-400">{card.sub}</div>
              </div>
              <div className="text-sm text-slate-400">{stats[`${card.key}Trend`]>0?`↑ ${stats[`${card.key}Trend`]}%`:`${stats[`${card.key}Trend`]}%`}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-3">
        <div className="bg-white rounded-2xl p-4.5 border border-slate-400/14 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
          <div className="text-base font-bold text-slate-900 mb-1.5">Revenue (7 days)</div>
          <div className="text-xs text-slate-500 mb-3.5">Last week</div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="revenue" fill="#0284c7" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-400/14 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
          <RecentActivity items={recent} />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-3 mt-3">
        <div>
          <PendingApprovals />
        </div>
        <div>
          {/* Right column placeholder for additional widgets */}
          <div className="bg-white rounded-2xl p-4.5 border border-slate-400/14 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
            <div className="text-base font-bold text-slate-900 mb-2">Platform Health</div>
            <div className="text-sm text-slate-600">All systems operational · No incidents reported</div>
          </div>
        </div>
      </section>
    </div>
  );
}