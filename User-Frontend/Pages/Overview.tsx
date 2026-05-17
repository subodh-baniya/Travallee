import { useState, useMemo } from "react";
import { StatCard } from "../Components/Statcard";
import {
  FaBed,
  FaCalendarCheck,
  FaDollarSign,
  FaCheckCircle,
} from "react-icons/fa";
import { useHotelDashboard } from "../Hooks/useHotelDashboard";

const Overview = () => {
  const [floor, setFloor] = useState("all");

  const { statsData, rooms, checkins, loading } = useHotelDashboard();

  const stats = statsData
    ? [
        {
          title: "Total Revenue",
          value: `Rs. ${statsData.totalRevenue.toLocaleString()}`,
          icon: <FaDollarSign />,
        },
        {
          title: "Rooms Occupied",
          value: `${statsData.occupiedRooms} / ${statsData.totalRooms}`,
          icon: <FaBed />,
        },
        {
          title: "Average Rating",
          value: statsData.averageRating ? `${statsData.averageRating.toFixed(1)} / 5` : "0 / 5",
          icon: <FaCheckCircle />,
        },
        {
          title: "Today's Check-ins",
          value: String(statsData.todayCheckins),
          icon: <FaCalendarCheck />,
        },
      ]
    : [
        {
          title: "Total Revenue",
          value: "Rs. 0",
          icon: <FaDollarSign />,
        },
        {
          title: "Rooms Occupied",
          value: "0 / 0",
          icon: <FaBed />,
        },
        {
          title: "Average Rating",
          value: "0 / 5",
          icon: <FaCheckCircle />,
        },
        {
          title: "Today's Check-ins",
          value: "0",
          icon: <FaCalendarCheck />,
        },
      ];

  // Dynamic floors from room data
  const floors = useMemo(() => {
    const set = new Set<string>();
    rooms.forEach((r) => {
      if (r.floorNumber !== undefined && r.floorNumber !== null) {
        set.add(String(r.floorNumber));
      }
    });
    return Array.from(set).sort((a, b) => Number(a) - Number(b));
  }, [rooms]);

  const filteredRooms =
    floor === "all"
      ? rooms
      : rooms.filter((r) => String(r.floorNumber) === String(floor));

  const statusMap: Record<string, string> = {
    OCCUPIED: "bg-blue-50 text-blue-600 border-blue-100",
    AVAILABLE: "bg-emerald-50 text-emerald-600 border-emerald-100",
    MAINTENANCE: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Overview</h1>
        <p className="text-xs text-slate-500">Hotel operations summary</p>
      </div>

      {/* STATS */}
      {loading ? (
        <div className="text-center py-4 text-sm text-slate-500">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <div
                key={i}
                className="transition hover:-translate-y-1 duration-200"
              >
                <StatCard title={s.title} value={s.value} icon={s.icon} />
              </div>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-3 gap-5">

            {/* ROOM TABLE */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition">

              <div className="flex items-center justify-between mb-4">

                <h3 className="text-sm font-medium text-slate-700">
                  Room Overview
                </h3>

                {/* FLOOR FILTER */}
                <select
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="
                    text-xs border border-slate-200 rounded-md px-2 py-1
                    bg-white text-slate-600
                    focus:outline-none focus:ring-1 focus:ring-blue-500
                    hover:border-blue-300 transition
                  "
                >
                  <option value="all">All Floors</option>
                  {floors.map((f) => (
                    <option key={f} value={f}>
                      Floor {f}
                    </option>
                  ))}
                </select>

              </div>

              <div className="overflow-hidden rounded-lg border border-slate-100">

                <table className="w-full text-sm">

                  <thead className="bg-slate-50 text-xs text-slate-400">
                    <tr>
                      <th className="text-left py-3 px-3 font-medium">Room No.</th>
                      <th className="text-left font-medium">Type</th>
                      <th className="text-left font-medium">Floor</th>
                      <th className="text-left font-medium">Price/Night</th>
                      <th className="text-left font-medium">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {filteredRooms.length > 0 ? (
                      filteredRooms.map((r, i) => (
                        <tr
                          key={i}
                          className="transition hover:bg-slate-50 hover:scale-[1.01]"
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              <span className="font-semibold text-blue-600">
                                {r.roomNumber}
                              </span>
                            </div>
                          </td>

                          <td className="text-slate-600">{r.roomType}</td>

                          <td className="text-slate-600">Floor {r.floorNumber}</td>

                          <td className="text-slate-600">Rs. {r.pricePerNight}</td>

                          <td>
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full border ${
                                statusMap[r.status] || "bg-gray-50 text-gray-600 border-gray-100"
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No rooms found
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>
            </div>

            {/* CHECKINS */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition">

              <h3 className="text-sm font-medium text-slate-700 mb-4">
                Today's Check-ins ({checkins.length})
              </h3>

              <div className="space-y-3">

                {checkins.length > 0 ? (
                  checkins.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {c.guestName}
                        </p>
                        <p className="text-xs text-slate-500">
                          Room {c.roomNumber}
                        </p>
                      </div>

                      <span className="text-xs text-blue-600">
                        {new Date(c.checkInTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">
                    No check-ins today
                  </p>
                )}

              </div>

            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default Overview;