import { useState } from "react";
import { motion } from "framer-motion";

/* ---------------- TYPES ---------------- */

type Membership = "VIP" | "ORDINARY";
type StayStatus = "CHECKED_IN" | "CHECKED_OUT";
type Filter = "ALL" | Membership | StayStatus;

interface Guest {
  id: string;
  name: string;
  room: string;
  type: string;
  checkIn: string;
  checkOut: string;
  totalStays: number;
  totalSpent: string;
  membership: Membership;
  stayStatus: StayStatus;
}

/* ---------------- DATA ---------------- */

const guests: Guest[] = [
  {
    id: "1",
    name: "Priya Sharma",
    room: "101",
    type: "Deluxe",
    checkIn: "Mar 27",
    checkOut: "Mar 29",
    totalStays: 4,
    totalSpent: "Rs. 42,000",
    membership: "VIP",
    stayStatus: "CHECKED_IN",
  },
  {
    id: "2",
    name: "David Lee",
    room: "310",
    type: "Suite",
    checkIn: "Mar 27",
    checkOut: "Apr 1",
    totalStays: 1,
    totalSpent: "Rs. 42,000",
    membership: "ORDINARY",
    stayStatus: "CHECKED_IN",
  },
  {
    id: "3",
    name: "Maya Karki",
    room: "217",
    type: "Standard",
    checkIn: "Mar 27",
    checkOut: "Mar 29",
    totalStays: 2,
    totalSpent: "Rs. 8,400",
    membership: "ORDINARY",
    stayStatus: "CHECKED_OUT",
  },
];

/* ---------------- STYLES ---------------- */

const membershipMap = {
  VIP: "bg-purple-50 text-purple-600 border-purple-100",
  ORDINARY: "bg-slate-100 text-slate-600 border-slate-200",
};

const stayMap = {
  CHECKED_IN: "bg-emerald-50 text-emerald-600 border-emerald-100",
  CHECKED_OUT: "bg-rose-50 text-rose-600 border-rose-100",
};

/* ---------------- COMPONENT ---------------- */

const Guests = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered = guests.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.room.includes(search);

    const matchFilter =
      filter === "ALL" ||
      g.membership === filter ||
      g.stayStatus === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Guests
          </h1>
          <p className="text-xs text-slate-500">
            Guest profiles and stay details
          </p>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
          + Add Guest
        </button>
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

        {/* FILTERS */}
        <div className="flex flex-wrap gap-2">
          {["ALL", "VIP", "ORDINARY", "CHECKED_IN", "CHECKED_OUT"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as Filter)}
              className={`px-3 py-1.5 text-xs rounded-full transition ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {filtered.map((g, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              bg-white border border-slate-200 rounded-xl p-5
              transition duration-200
              hover:shadow-md hover:-translate-y-1
            "
          >

            {/* TOP */}
            <div className="flex justify-between items-start mb-4">

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {g.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Room {g.room} • {g.type}
                </p>
              </div>

              <div className="flex flex-col gap-1 items-end">

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${membershipMap[g.membership]}`}
                >
                  {g.membership}
                </span>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${stayMap[g.stayStatus]}`}
                >
                  {g.stayStatus === "CHECKED_IN"
                    ? "Checked In"
                    : "Checked Out"}
                </span>

              </div>

            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-y-3 text-xs">

              <div className="text-slate-500">Check-in</div>
              <div className="text-right text-slate-800 font-medium">
                {g.checkIn}
              </div>

              <div className="text-slate-500">Check-out</div>
              <div className="text-right text-slate-800 font-medium">
                {g.checkOut}
              </div>

              <div className="text-slate-500">Total stays</div>
              <div className="text-right text-slate-800 font-medium">
                {g.totalStays}
              </div>

              <div className="text-slate-500">Total spent</div>
              <div className="text-right text-slate-900 font-semibold">
                {g.totalSpent}
              </div>

            </div>

          </motion.div>
        ))}

      </div>

    </div>
  );
};

export default Guests;