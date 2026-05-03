import { useState } from "react";
import { motion } from "framer-motion";
import { StatCard } from "../Components/Statcard";
import {
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

/* ---------------- DATA ---------------- */

type Status = "ALL" | "CONFIRMED" | "PENDING" | "CANCELLED";

const bookings = [
  {
    id: "R-1081",
    guest: "Priya Sharma",
    room: "101",
    type: "Deluxe",
    checkIn: "Mar 27",
    checkOut: "Mar 29",
    amount: "Rs. 8,400",
    status: "CONFIRMED",
  },
  {
    id: "R-1082",
    guest: "David Lee",
    room: "310",
    type: "Suite",
    checkIn: "Mar 27",
    checkOut: "Apr 1",
    amount: "Rs. 42,000",
    status: "CONFIRMED",
  },
  {
    id: "R-1083",
    guest: "Maya Karki",
    room: "217",
    type: "Standard",
    checkIn: "Mar 27",
    checkOut: "Mar 29",
    amount: "Rs. 4,200",
    status: "PENDING",
  },
  {
    id: "R-1077",
    guest: "Karen White",
    room: "304",
    type: "Deluxe",
    checkIn: "Mar 23",
    checkOut: "Mar 26",
    amount: "Rs. 12,600",
    status: "CANCELLED",
  },
];

/* ---------------- STATUS STYLE ---------------- */

const statusMap: Record<string, string> = {
  CONFIRMED: "bg-emerald-50 text-emerald-600 border-emerald-100",
  PENDING: "bg-amber-50 text-amber-600 border-amber-100",
  CANCELLED: "bg-rose-50 text-rose-600 border-rose-100",
};

/* ---------------- COMPONENT ---------------- */

const Bookings = () => {
  const [filter, setFilter] = useState<Status>("ALL");
  const [search, setSearch] = useState("");

  const filtered = bookings.filter((b) => {
    return (
      (filter === "ALL" || b.status === filter) &&
      (b.guest.toLowerCase().includes(search.toLowerCase()) ||
        b.room.includes(search))
    );
  });

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Bookings
          </h1>
          <p className="text-xs text-slate-500">
            Manage all reservations
          </p>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
          + New Booking
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total" value="142" icon={<FaCalendarCheck />} />
        <StatCard title="Confirmed" value="98" icon={<FaCheckCircle />} />
        <StatCard title="Pending" value="31" icon={<FaClock />} />
        <StatCard title="Cancelled" value="13" icon={<FaTimesCircle />} />
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3 items-center">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search guest or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400"
        />

        {/* STATUS FILTER */}
        <div className="flex gap-2">
          {["ALL", "CONFIRMED", "PENDING", "CANCELLED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as Status)}
              className={`px-3 py-1.5 text-xs rounded-full transition ${
                filter === s
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

      </div>

     {/* TABLE */}
<div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

  <table className="w-full text-sm">

    <thead className="bg-slate-50 text-slate-500 text-xs">
      <tr>
        <th className="text-left px-4 py-3 font-medium">ID</th>
        <th className="text-left px-4 py-3 font-medium">Guest</th>
        <th className="text-center px-4 py-3 font-medium">Room</th>
        <th className="text-left px-4 py-3 font-medium">Type</th>
        <th className="text-left px-4 py-3 font-medium">Dates</th>
        <th className="text-right px-4 py-3 font-medium">Amount</th>
        <th className="text-center px-4 py-3 font-medium">Status</th>
        <th className="text-right px-4 py-3 font-medium"></th>
      </tr>
    </thead>

    <tbody className="divide-y divide-slate-100">

      {filtered.map((b, i) => (
        <motion.tr
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hover:bg-slate-50 transition"
        >

          <td className="px-4 py-3 text-slate-400 align-middle">
            {b.id}
          </td>

          <td className="px-4 py-3 font-medium text-slate-800 align-middle">
            {b.guest}
          </td>

          <td className="px-4 py-3 text-center align-middle">
            <span className="text-blue-600 font-medium">
              {b.room}
            </span>
          </td>

          <td className="px-4 py-3 text-slate-600 align-middle">
            {b.type}
          </td>

          <td className="px-4 py-3 text-slate-500 text-xs align-middle">
            {b.checkIn} → {b.checkOut}
          </td>

          <td className="px-4 py-3 text-right font-medium align-middle">
            {b.amount}
          </td>

          <td className="px-4 py-3 text-center align-middle">
            <span
              className={`text-xs px-2.5 py-1 rounded-full border ${statusMap[b.status]}`}
            >
              {b.status}
            </span>
          </td>

          <td className="px-4 py-3 text-right align-middle">
            <button className="text-xs text-blue-600 hover:underline">
              Edit
            </button>
          </td>

        </motion.tr>
      ))}

    </tbody>
  </table>
</div>
    </div>
  );
};

export default Bookings;