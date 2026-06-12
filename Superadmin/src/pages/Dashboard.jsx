import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";


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
  const { socketConnected, setsocketConnected } = auth;
  const { socket } = auth;

  useEffect(() => {
    if (!socket) return;

    const handleData = (data) => {
      console.log("Received hotel registration data:", data);
    };

    socket.on("hotelRegistrationsData", handleData);

    return () => {
      socket.off("hotelRegistrationsData", handleData);
    };
  }, [socket]);




  const handleLogout = async () => {
    if (!auth) return;
    await auth.logout();
  };

  return (
    <div className="grid gap-[18px]">
      <section className="bg-[linear-gradient(135deg,#0f172a_0%,#103b63_52%,#0369a1_100%)] text-white rounded-[18px] p-6 shadow-[0_18px_50px_rgba(2,132,199,0.18)] relative overflow-hidden">
        {/* Hero Background Shape */}
        <div className="absolute -right-[60px] -bottom-[60px] w-[180px] h-[180px] rounded-full bg-white/8 pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-[28px] font-bold mb-2 tracking-tight">Dashboard</h1>
          <p className="text-white/84 max-w-[620px] leading-relaxed text-sm">
            Welcome back. Use this control center to move between hotels, bookings, analytics, and the main platform overview.
          </p>
          <div className="flex flex-wrap gap-2.5 mt-4.5">
            <button className="border-none rounded-xl py-[11px] px-3.5 font-semibold cursor-pointer bg-white text-slate-900 hover:bg-slate-50 transition-colors" onClick={() => navigate("/dashboard/hotels/register")}>
              Manage Hotels
            </button>
            <button className="border-none rounded-xl py-[11px] px-3.5 font-semibold cursor-pointer bg-white text-slate-900 hover:bg-slate-50 transition-colors" onClick={() => navigate("/dashboard/analysis")}>
              Open Analysis
            </button>
            <button className="rounded-xl py-[11px] px-3.5 font-semibold cursor-pointer bg-white/12 text-white border border-white/18 hover:bg-white/20 transition-colors" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div className="bg-white rounded-2xl p-4.5 border border-slate-400/14 shadow-[0_14px_32px_rgba(15,23,42,0.05)]" key={card.title}>
            <div className="text-xs text-slate-500 mb-2">{card.title}</div>
            <div className="text-[28px] font-bold text-slate-900 tracking-tight font-mono">{card.value}</div>
            <div className="mt-1 text-xs text-slate-400">{card.sub}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-3">
        <div className="bg-white rounded-2xl p-4.5 border border-slate-400/14 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
          <div className="text-base font-bold text-slate-900 mb-1.5">Quick Actions</div>
          <div className="text-xs text-slate-500 mb-3.5">Jump to the most useful sections for superadmin work.</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <button className="flex justify-between items-center gap-3 bg-white border border-slate-400/14 rounded-2xl p-[16px_18px] cursor-pointer text-left hover:border-brand-accent2 transition-colors duration-150" key={link.path} onClick={() => navigate(link.path)}>
                <div>
                  <div className="text-[15px] font-bold text-slate-900">{link.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{link.note}</div>
                </div>
                <div className="text-brand-accent text-[22px] shrink-0 font-bold">→</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-400/14 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
          <div className="text-base font-bold text-slate-900 mb-1.5">Recent Activity</div>
          <div className="text-xs text-slate-500 mb-3.5">Latest platform events for the superadmin.</div>
          <div className="divide-y divide-slate-100">
            {[
              { dot: "#38bdf8", text: "New hotel registration received", time: "2 min ago" },
              { dot: "#4ade80", text: "Booking confirmed for Grand Vista Hotel", time: "8 min ago" },
              { dot: "#818cf8", text: "New app user joined the platform", time: "15 min ago" },
              { dot: "#fbbf24", text: "Revenue report refreshed", time: "1 hr ago" },
            ].map((item) => (
              <div className="flex items-start gap-2.5 py-2.5 first:pt-0 last:pb-0" key={item.text}>
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: item.dot }} />
                <div>
                  <div className="text-[13px] text-slate-900 leading-normal">{item.text}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}