import React, { useState } from "react";
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
} from "recharts";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaHotel,
  FaUsers,
  FaStar,
} from "react-icons/fa";

/* ---------------- TYPES ---------------- */

interface RevenueByRoom {
  name: string;
  revenue: number;
}

interface Occupancy {
  day: string;
  value: number;
}

interface TopRoom {
  room: string;
  revenue: string;
  progress: number;
}

interface ReportStats {
  revenue: string;
  occupancy: string;
  guests: number;
  rating: number;
}

/* ---------------- DATA ---------------- */

const stats: ReportStats = {
  revenue: "Rs. 1,25,018",
  occupancy: "74%",
  guests: 142,
  rating: 4.7,
};

const revenueByRoom: RevenueByRoom[] = [
  { name: "Suite", revenue: 84000 },
  { name: "Deluxe", revenue: 56700 },
  { name: "Standard", revenue: 35700 },
  { name: "Restaurant", revenue: 18400 },
];

const occupancyData: Occupancy[] = [
  { day: "Mon", value: 62 },
  { day: "Tue", value: 70 },
  { day: "Wed", value: 68 },
  { day: "Thu", value: 76 },
  { day: "Fri", value: 88 },
  { day: "Sat", value: 94 },
  { day: "Sun", value: 80 },
];

const topRooms: TopRoom[] = [
  {
    room: "Room 310",
    revenue: "Rs. 42,000",
    progress: 90,
  },
  {
    room: "Room 402",
    revenue: "Rs. 33,600",
    progress: 72,
  },
  {
    room: "Room 101",
    revenue: "Rs. 16,800",
    progress: 58,
  },
  {
    room: "Room 208",
    revenue: "Rs. 10,500",
    progress: 44,
  },
];

const pieData = [
  { name: "Booked", value: 74 },
  { name: "Available", value: 26 },
];

const COLORS = ["#2563eb", "#dbeafe"];

/* ---------------- COMPONENT ---------------- */

const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState("This Month");

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Reports
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Performance analytics and business insights
          </p>
        </div>

        <div className="flex items-center gap-3">

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="
              bg-white border border-slate-200 rounded-xl
              px-4 py-2 text-sm text-slate-700
              outline-none focus:border-blue-400
            "
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>

          <button
            className="
              px-4 py-2 bg-blue-600 text-white text-sm
              rounded-xl hover:bg-blue-700 transition
            "
          >
            Export Report
          </button>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <motion.div
          whileHover={{ y: -3 }}
          className="
            bg-white border border-slate-200 rounded-2xl
            p-5 shadow-sm
          "
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500">
                Revenue
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-2">
                {stats.revenue}
              </h2>

              <p className="text-xs text-emerald-600 mt-2 font-medium">
                ↑ 12.4% growth
              </p>
            </div>

            <div
              className="
                h-11 w-11 rounded-xl bg-emerald-50
                flex items-center justify-center
                text-emerald-600
              "
            >
              <FaChartLine />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="
            bg-white border border-slate-200 rounded-2xl
            p-5 shadow-sm
          "
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500">
                Avg Occupancy
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-2">
                {stats.occupancy}
              </h2>

              <p className="text-xs text-blue-600 mt-2 font-medium">
                ↑ 5% vs last month
              </p>
            </div>

            <div
              className="
                h-11 w-11 rounded-xl bg-blue-50
                flex items-center justify-center
                text-blue-600
              "
            >
              <FaHotel />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="
            bg-white border border-slate-200 rounded-2xl
            p-5 shadow-sm
          "
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500">
                Total Guests
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-2">
                {stats.guests}
              </h2>

              <p className="text-xs text-purple-600 mt-2 font-medium">
                ↑ 18 new guests
              </p>
            </div>

            <div
              className="
                h-11 w-11 rounded-xl bg-purple-50
                flex items-center justify-center
                text-purple-600
              "
            >
              <FaUsers />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="
            bg-white border border-slate-200 rounded-2xl
            p-5 shadow-sm
          "
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500">
                Avg Rating
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-2">
                {stats.rating}
              </h2>

              <p className="text-xs text-amber-500 mt-2 font-medium">
                ↑ 0.2 points
              </p>
            </div>

            <div
              className="
                h-11 w-11 rounded-xl bg-amber-50
                flex items-center justify-center
                text-amber-500
              "
            >
              <FaStar />
            </div>
          </div>
        </motion.div>

      </div>

      {/* ANALYTICS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* REVENUE */}
        <div
          className="
            bg-white border border-slate-200 rounded-2xl
            p-5 shadow-sm
          "
        >
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-slate-900">
              Revenue by Room Type
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Monthly earnings distribution
            </p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByRoom}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar
                  dataKey="revenue"
                  radius={[8, 8, 0, 0]}
                  fill="#2563eb"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* OCCUPANCY */}
        <div
          className="
            bg-white border border-slate-200 rounded-2xl
            p-5 shadow-sm
          "
        >
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-slate-900">
              Occupancy by Day
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Weekly room occupancy trend
            </p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyData}>
                <XAxis dataKey="day" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* LOWER GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* FINANCIAL SUMMARY */}
        <div
          className="
            bg-white border border-slate-200 rounded-2xl
            p-5 shadow-sm
          "
        >
          <h2 className="text-sm font-semibold text-slate-900 mb-5">
            Financial Summary
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">
                Total Revenue
              </span>

              <span className="font-semibold text-emerald-600">
                Rs. 1,25,018
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">
                Booking Revenue
              </span>

              <span className="font-semibold text-blue-600">
                Rs. 98,200
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">
                Restaurant Revenue
              </span>

              <span className="font-semibold text-purple-600">
                Rs. 18,400
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">
                Refund Loss
              </span>

              <span className="font-semibold text-rose-600">
                Rs. 4,200
              </span>
            </div>

          </div>
        </div>

        {/* TOP ROOMS */}
        <div
          className="
            bg-white border border-slate-200 rounded-2xl
            p-5 shadow-sm xl:col-span-2
          "
        >
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-slate-900">
              Top Performing Rooms
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Highest revenue generating rooms
            </p>
          </div>

          <div className="space-y-5">

            {topRooms.map((room, i) => (
              <div key={i}>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    {room.room}
                  </span>

                  <span className="text-sm font-semibold text-slate-900">
                    {room.revenue}
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="
                      bg-blue-600 h-full rounded-full
                    "
                    style={{
                      width: `${room.progress}%`,
                    }}
                  />
                </div>

              </div>
            ))}

          </div>
        </div>

      </div>

      {/* PIE SECTION */}
      <div
        className="
          bg-white border border-slate-200 rounded-2xl
          p-5 shadow-sm
        "
      >
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Booking Distribution
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Available vs booked rooms
          </p>
        </div>

        <div className="h-72 flex items-center justify-center">
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
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
};

export default ReportsPage;