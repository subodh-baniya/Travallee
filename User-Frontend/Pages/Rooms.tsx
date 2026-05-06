import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ---------------- TYPES ---------------- */

type RoomType = "DELUXE" | "SUITE" | "STANDARD";
type StatusFilter = "ALL" | "AVAILABLE" | "BOOKED" | "MAINTENANCE";
type TypeFilter = "ALL" | "DELUXE" | "SUITE" | "STANDARD";

interface Room {
  id: string;
  roomNumber: string;
  roomType: RoomType;
  pricePerNight: number;
  capacity: number;
  images: string[];
  status: "AVAILABLE" | "BOOKED" | "MAINTENANCE";
}

interface RoomResponse {
  rooms: Room[];
}

/* ---------------- MOCK ---------------- */

const mockData: RoomResponse = {
  rooms: [
    {
      id: "1",
      roomNumber: "101",
      roomType: "DELUXE",
      pricePerNight: 4200,
      capacity: 2,
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      ],
      status: "AVAILABLE",
    },
    {
      id: "2",
      roomNumber: "202",
      roomType: "SUITE",
      pricePerNight: 8400,
      capacity: 4,
      images: [
        "https://media.designcafe.com/wp-content/uploads/2023/07/05141750/aesthetic-room-decor.jpg",
      ],
      status: "BOOKED",
    },
    {
      id: "3",
      roomNumber: "105",
      roomType: "DELUXE",
      pricePerNight: 4200,
      capacity: 2,
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      ],
      status: "MAINTENANCE",
    },
  ],
};

/* ---------------- STATUS STYLE ---------------- */

const statusMap: Record<string, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-600 border-emerald-100",
  BOOKED: "bg-blue-50 text-blue-600 border-blue-100",
  MAINTENANCE: "bg-rose-50 text-rose-600 border-rose-100",
};

/* ---------------- COMPONENT ---------------- */

const Rooms = () => {
  const [data, setData] = useState<RoomResponse | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setData(mockData);
  }, []);

  if (!data) return <div>Loading...</div>;

  const filtered = data.rooms.filter((room) => {
    return (
      (filter === "ALL" || room.status === filter) &&
      (typeFilter === "ALL" || room.roomType === typeFilter) &&
      room.roomNumber.includes(search)
    );
  });

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Rooms
          </h1>
          <p className="text-xs text-slate-500">
            Manage room inventory
          </p>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
          + Add Room
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3 items-center">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search room number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400"
        />

        {/* STATUS FILTER */}
        <div className="flex gap-2">
          {["ALL", "AVAILABLE", "BOOKED", "MAINTENANCE"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as StatusFilter)}
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

        {/* ROOM TYPE DROPDOWN */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
          className="px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white"
        >
          <option value="ALL">ALL TYPES</option>
          <option value="DELUXE">DELUXE</option>
          <option value="SUITE">SUITE</option>
          <option value="STANDARD">STANDARD</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {filtered.map((room) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              bg-white border border-slate-200 rounded-xl
              overflow-hidden
              hover:shadow-md hover:-translate-y-1
              transition
            "
          >

            {/* IMAGE */}
            <div className="relative">
              <img
                src={room.images[0]}
                className="h-40 w-full object-cover"
              />

              <span
                className={`
                  absolute top-3 right-3 text-[11px] px-2 py-1 rounded-full border
                  ${statusMap[room.status]}
                `}
              >
                {room.status}
              </span>
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-3">

              <div className="flex justify-between items-center">

                <div>
                  <h3 className="text-xl font-semibold text-blue-600">
                    {room.roomNumber}
                  </h3>
                  <p className="text-[11px] text-slate-400 tracking-wide">
                    {room.roomType}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    Rs. {room.pricePerNight}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    per night
                  </p>
                </div>

              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>Capacity: {room.capacity}</span>
                <span className="text-blue-600 font-medium">
                  Floor {room.roomNumber[0]}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button className="text-xs text-blue-600 hover:underline">
                  Manage
                </button>
              </div>

            </div>

          </motion.div>
        ))}

      </div>
    </div>
  );
};

export default Rooms;