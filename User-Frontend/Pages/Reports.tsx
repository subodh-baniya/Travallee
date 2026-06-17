import React, { useState, useMemo,useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { FaChartLine, FaHotel, FaUsers, FaStar } from "react-icons/fa";

import { useBookings,type Booking } from "../Hooks/useBooking";
import { useGuestStatus } from "../Hooks/useGuestStatus";
import { useRooms } from "../Hooks/useRooms";
import { useAuth } from "../Contexts/Authcontext";
import { getTotalIncome, getPendingIncome } from "../Services/booking.api";

interface IncomeData {
  totalIncome: number;
  pendingIncome: number;
}


type Period = "This Week" | "This Month" | "This Year";

function periodStart(period: Period): number {
  const now = new Date();
  if (period === "This Week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 6);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  if (period === "This Month") {
    return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  }
  return new Date(now.getFullYear(), 0, 1).getTime();
}

const parseAmount = (str: string): number => {
  const n = parseFloat(str.replace(/^[^\d]+/, ""));
  return isNaN(n) ? 0 : n;
};

const parseDisplayDate = (str: string): Date => {
  if (!str || str === "-") return new Date(0);
  const d = new Date(`${str} ${new Date().getFullYear()}`);
  return isNaN(d.getTime()) ? new Date(0) : d;
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];


const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<Period>("This Month");

  const auth    = useAuth();
  const hotelId = auth?.hotelId ?? null;

  const { bookings, loading: bLoading }          = useBookings(hotelId);
  const { loading: gLoading }  = useGuestStatus();
  const { rooms,            loading: rLoading }  = useRooms();

  const [income, setIncome]           = useState<IncomeData>({ totalIncome: 0, pendingIncome: 0 });
  const [incomeLoading, setIncomeLoading] = useState(false);

  useEffect(() => {
    if (!hotelId) return;
    setIncomeLoading(true);
    Promise.all([getTotalIncome(hotelId), getPendingIncome(hotelId)])
      .then(([totalRes, pendingRes]) => {
        setIncome({
          totalIncome:   totalRes.data.data.totalIncome        ?? 0,
          pendingIncome: pendingRes.data.data.totalPendingIncome ?? 0,
        });
      })
      .catch(() => {/* keep zeros on error */})
      .finally(() => setIncomeLoading(false));
  }, [hotelId]);

  const loading = bLoading || gLoading || rLoading || incomeLoading;

  const start = periodStart(period);

  const filteredBookings: Booking[] = useMemo(() => {
    return bookings.filter((b) => {
      const d = parseDisplayDate(b.checkIn);
      return d.getTime() >= start;
    });
  }, [bookings, start]);


  const totalRevenue  = income.totalIncome;
  const pendingIncome = income.pendingIncome;

  const totalRooms     = rooms.length;
  const occupiedRooms  = rooms.filter((r) => r.status === "OCCUPIED").length;
  const occupancyPct   = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const uniqueGuestIds = useMemo(
    () => new Set(filteredBookings.map((b) => b.userId).filter(Boolean)).size,
    [filteredBookings]
  );

  const avgRating = useMemo(() => {
    const rated = rooms.filter((r) => r.rating > 0);
    if (!rated.length) return 0;
    const sum = rated.reduce((s, r) => s + r.rating, 0);
    return (sum / rated.length).toFixed(1);
  }, [rooms]);


  const normalizeRoomType = (type: string): string => {
    const t = type.toUpperCase();
    if (t.includes("SUITE"))    return "Suite";
    if (t.includes("DELUXE"))   return "Deluxe";
    if (t.includes("STANDARD")) return "Standard";
    return "Other";
  };

  const revenueByRoomType = useMemo(() => {
    const map: Record<string, number> = { Suite: 0, Deluxe: 0, Standard: 0 };
    filteredBookings
      .filter((b) => b.status === "PAID")
      .forEach((b) => {
        // b.room may be a type name ("STANDARD", "Deluxe Double") or a room number ("101")
        // try matching by room number first, fall back to normalizing b.room directly
        const roomFromList = rooms.find((r) => r.roomNumber === b.room);
        const typeStr      = roomFromList?.roomType ?? b.room ?? "";
        const label        = normalizeRoomType(typeStr);
        map[label] = (map[label] ?? 0) + parseAmount(b.amount);
      });

    return Object.entries(map)
      .filter(([name, revenue]) => name !== "Other" || revenue > 0)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredBookings, rooms]);

  // ── occupancy trend (day-of-week or month) ───────────────────────────────

  const occupancyTrend = useMemo(() => {
    if (period === "This Week") {
      // count bookings (checked-in guests) per day-of-week over last 7 days
      const counts: Record<number, number> = {};
      filteredBookings.forEach((b) => {
        const d = parseDisplayDate(b.checkIn).getDay();
        counts[d] = (counts[d] ?? 0) + 1;
      });
      return DAY_LABELS.map((label, i) => ({ day: label, value: counts[i] ?? 0 }));
    }

    if (period === "This Month") {
      // group by week-of-month (1-4)
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
      filteredBookings.forEach((b) => {
        const date = parseDisplayDate(b.checkIn).getDate();
        const week = Math.min(Math.ceil(date / 7), 4);
        counts[week]++;
      });
      return [1, 2, 3, 4].map((w) => ({ day: `Wk ${w}`, value: counts[w] }));
    }

    // This Year → by month
    const counts: Record<number, number> = {};
    filteredBookings.forEach((b) => {
      const m = parseDisplayDate(b.checkIn).getMonth();
      counts[m] = (counts[m] ?? 0) + 1;
    });
    return MONTH_LABELS.map((label, i) => ({ day: label, value: counts[i] ?? 0 }));
  }, [filteredBookings, period]);

  // ── financial summary ────────────────────────────────────────────────────

  const refunds = useMemo(
    () => filteredBookings
      .filter((b) => b.bookingStatus === "CANCELLED")
      .reduce((s, b) => s + parseAmount(b.amount), 0),
    [filteredBookings]
  );

  // ── top performing rooms ─────────────────────────────────────────────────

  const isRoomNumber = (room: string) => {
    // type names are words like "STANDARD", "Deluxe Double", "Family Safari View"
    // room numbers are short alphanumeric like "101", "12A", "a-203", "1250"
    return /^[a-zA-Z0-9\-]+$/.test(room) && room.length <= 6 && !/^[a-zA-Z\s]+$/.test(room);
  };

  const topRooms = useMemo(() => {
    const map: Record<string, number> = {};
    bookings
      .filter((b) => b.status === "PAID" && isRoomNumber(b.room))
      .forEach((b) => {
        map[b.room] = (map[b.room] ?? 0) + parseAmount(b.amount);
      });

    const sorted = Object.entries(map)
      .map(([room, revenue]) => ({ room, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const max = sorted[0]?.revenue ?? 1;
    return sorted.map((r) => ({
      ...r,
      progress: Math.round((r.revenue / max) * 100),
    }));
  }, [bookings]);

  // ── booking distribution (pie) ───────────────────────────────────────────

  const pieData = useMemo(() => {
    const booked    = occupancyPct;
    const available = 100 - booked;
    return [
      { name: "Booked",    value: booked    },
      { name: "Available", value: available },
    ];
  }, [occupancyPct]);

  const COLORS = ["#2563eb", "#dbeafe"];

  // ── loading / empty states ───────────────────────────────────────────────

  const fmt = (n: number) =>
    `Rs. ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500 mt-1">
            Performance analytics and business insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>

          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition">
            Export Report
          </button>
        </div>
      </div>

      {/* loading bar */}
      {loading && (
        <div className="w-full h-1 bg-blue-100 rounded overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse w-2/3" />
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          label="Revenue"
          value={fmt(totalRevenue)}
          sub={`${fmt(pendingIncome)} pending`}
          subColor="text-emerald-600"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          icon={<FaChartLine />}
        />

        <StatCard
          label="Avg Occupancy"
          value={`${occupancyPct}%`}
          sub={`${occupiedRooms} of ${totalRooms} rooms occupied`}
          subColor="text-blue-600"
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          icon={<FaHotel />}
        />

        <StatCard
          label="Total Guests"
          value={String(uniqueGuestIds)}
          sub={`${filteredBookings.length} bookings in period`}
          subColor="text-purple-600"
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          icon={<FaUsers />}
        />

        <StatCard
          label="Avg Rating"
          value={String(avgRating)}
          sub={`Across ${rooms.filter((r) => r.rating > 0).length} rated rooms`}
          subColor="text-amber-500"
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          icon={<FaStar />}
        />

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        <ChartCard title="Revenue by Room Type" sub="Earnings by category">
          {revenueByRoomType.every((d) => d.revenue === 0) ? (
            <EmptyChart message="No paid bookings in this period" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByRoomType}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v) => v === 0 ? "0" : v < 1000 ? `Rs.${v}` : `Rs.${(v / 1000).toFixed(1)}k`}
                  tick={{ fontSize: 11 }}
                  width={60}
                />
                <Tooltip formatter={(v: number) => [`Rs. ${v.toLocaleString("en-IN")}`, "Revenue"]} />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Occupancy Trend" sub={`Check-in count — ${period.toLowerCase()}`}>
          {occupancyTrend.every((d) => d.value === 0) ? (
            <EmptyChart message="No check-ins recorded in this period" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyTrend}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={30} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#2563eb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

      </div>

      {/* LOWER GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* FINANCIAL SUMMARY */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">
            Financial Summary
          </h2>

          <div className="space-y-4">
            <SummaryRow label="Total Revenue"   value={fmt(totalRevenue)}  color="text-emerald-600" />
            <SummaryRow label="Pending Income"  value={fmt(pendingIncome)} color="text-amber-500"   />
            <SummaryRow label="Refund Loss"     value={`−${fmt(refunds)}`} color="text-rose-600"    />
          </div>
        </div>

        {/* TOP ROOMS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm xl:col-span-2">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-slate-900">
              Top Performing Rooms
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Highest revenue generating rooms
            </p>
          </div>

          {topRooms.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">
              No room revenue data for this period
            </p>
          ) : (
            <div className="space-y-5">
              {topRooms.map((room, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      Room {room.room}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {fmt(room.revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${room.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* PIE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Booking Distribution
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Available vs booked rooms (live)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>

          {/* legend */}
          <div className="flex sm:flex-col gap-4 text-sm shrink-0">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: COLORS[i] }}
                />
                <span className="text-slate-600">{entry.name}</span>
                <span className="font-semibold text-slate-900">
                  {entry.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

// ── sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  subColor: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  label, value, sub, subColor, iconBg, iconColor, icon,
}) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-2 truncate max-w-[140px]">
          {value}
        </h2>
        <p className={`text-xs mt-2 font-medium ${subColor}`}>{sub}</p>
      </div>
      <div className={`h-11 w-11 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

interface ChartCardProps {
  title: string;
  sub: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, sub, children }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
    <div className="h-72">{children}</div>
  </div>
);

const EmptyChart: React.FC<{ message: string }> = ({ message }) => (
  <div className="h-full flex items-center justify-center text-sm text-slate-400">
    {message}
  </div>
);

const SummaryRow: React.FC<{ label: string; value: string; color: string }> = ({
  label, value, color,
}) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-slate-500">{label}</span>
    <span className={`font-semibold ${color}`}>{value}</span>
  </div>
);

export default ReportsPage;