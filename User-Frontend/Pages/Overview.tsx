import { useState } from "react";
import { StatCard } from "../Components/Statcard";
import { FaBed, FaCalendarCheck, FaDollarSign } from "react-icons/fa";
import { useHotelDashboard } from "../Hooks/usehoteldashboard";

const Overview = () => {
  const [floor, setFloor] = useState("all");
  const { statsData, rooms, checkins, loading } = useHotelDashboard();

  const stats = statsData
    ? [
        {
          title: "Total Revenue",
          value: `Rs. ${statsData.totalRevenue}`,
          icon: <FaDollarSign />,
        },
        {
          title: "Rooms Occupied",
          value: statsData.roomsOccupied,
          icon: <FaBed />,
        },
        {
          title: "Today's Check-ins",
          value: String(statsData.todayCheckins),
          icon: <FaCalendarCheck />,
        },
      ]
    : [];

  const miniStats = [
    { label: "Restaurant Revenue Today", value: "Rs. 0" },
    { label: "Average Guest Rating", value: "0 / 5" },
  ];

  const filteredRooms =
    floor === "all"
      ? rooms
      : rooms.filter((r) => String(r.floor) === String(floor));

  const statusMap: Record<string, string> = {
    Occupied: "bg-blue-50 text-blue-600 border-blue-100",
    Available: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Checkout: "bg-amber-50 text-amber-600 border-amber-100",
    Maintenance: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Overview</h1>
        <p className="text-xs text-slate-500">Hotel operations summary</p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-sm text-slate-500 py-6">
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {stats.map((s, i) => (
              <StatCard
                key={i}
                title={s.title}
                value={s.value}
                icon={s.icon}
              />
            ))}
          </div>

          {/* MINI STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {miniStats.map((m, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-4"
              >
                <p className="text-xs text-slate-500">{m.label}</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-3 gap-5">
            {/* ROOMS */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-700">
                  Room Overview
                </h3>

                <select
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="text-xs border rounded-md px-2 py-1"
                >
                  <option value="all">All Floors</option>
                  <option value="1">Floor 1</option>
                  <option value="2">Floor 2</option>
                  <option value="3">Floor 3</option>
                </select>
              </div>

              <table className="w-full text-sm">
                <thead className="text-xs text-slate-400 bg-slate-50">
                  <tr>
                    <th className="text-left p-2">Room</th>
                    <th className="text-left">Type</th>
                    <th className="text-left">Guest</th>
                    <th className="text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRooms.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2 font-semibold text-blue-600">
                        {r.room}
                      </td>
                      <td>{r.type}</td>
                      <td>{r.guest === "—" ? "No guest" : r.guest}</td>
                      <td>
                        <span
                          className={`text-xs px-2 py-1 rounded border ${
                            statusMap[r.status]
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CHECKINS */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-medium text-slate-700 mb-4">
                Today's Check-ins
              </h3>

              <div className="space-y-3">
                {checkins.map((c, i) => (
                  <div
                    key={i}
                    className="flex justify-between p-2 hover:bg-slate-50 rounded"
                  >
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-slate-500">
                        Room {c.room}
                      </p>
                    </div>
                    <span className="text-xs text-blue-600">{c.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Overview;