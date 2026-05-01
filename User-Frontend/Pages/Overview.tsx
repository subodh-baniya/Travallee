import { StatCard } from "../Components/Statcard";
import {
  FaBed,
  FaCalendarCheck,
  FaDollarSign,
  FaConciergeBell,
} from "react-icons/fa";

const Overview = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "Rs. 1,25,018",
      icon: <FaDollarSign />,
    },
    {
      title: "Rooms Occupied",
      value: "37 / 50",
      icon: <FaBed />,
    },
    {
      title: "Today's Check-ins",
      value: "8",
      icon: <FaCalendarCheck />,
    },
    {
      title: "Pending Complaints",
      value: "3",
      icon: <FaConciergeBell />,
    },
  ];

  const miniStats = [
    { label: "Restaurant Revenue Today", value: "Rs. 18,400" },
    { label: "Average Guest Rating", value: "4.7 / 5" },
    { label: "Service Requests Open", value: "12" },
  ];

  const rooms = [
    { room: "101", type: "Deluxe", guest: "Priya Sharma", status: "Occupied" },
    { room: "204", type: "Suite", guest: "—", status: "Available" },
    { room: "305", type: "Standard", guest: "Rajan Thapa", status: "Checkout" },
    { room: "112", type: "Deluxe", guest: "—", status: "Maintenance" },
  ];

  const checkins = [
    { name: "Priya Sharma", room: "101", time: "Arrived" },
    { name: "David Lee", room: "310", time: "2:30 PM" },
    { name: "Maya Karki", room: "217", time: "4:00 PM" },
  ];

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
        <h1 className="text-lg font-semibold text-slate-900">
          Overview
        </h1>
        <p className="text-xs text-slate-500">
          Hotel operations summary
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div key={i} className="transition hover:-translate-y-1 duration-200">
            <StatCard
              title={s.title}
              value={s.value}
              icon={s.icon}
            />
          </div>
        ))}
      </div>

      {/* MINI STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {miniStats.map((m, i) => (
          <div
            key={i}
            className="
              bg-white border border-slate-200 rounded-xl p-4
              transition duration-200
              hover:shadow-md hover:border-blue-200 hover:-translate-y-1
            "
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

        {/* ROOM TABLE */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition">

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">
              Room Overview
            </h3>
            <span className="text-xs text-slate-400">Live</span>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-100">

            <table className="w-full text-sm">

              <thead className="bg-slate-50 text-xs text-slate-400">
                <tr>
                  <th className="text-left py-3 px-3 font-medium">Room</th>
                  <th className="text-left font-medium">Type</th>
                  <th className="text-left font-medium">Guest</th>
                  <th className="text-left font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {rooms.map((r, i) => (
                  <tr
                    key={i}
                    className="
                      transition duration-150
                      hover:bg-slate-50 hover:scale-[1.01]
                    "
                  >

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="font-semibold text-blue-600">
                          {r.room}
                        </span>
                      </div>
                    </td>

                    <td className="text-slate-600">{r.type}</td>

                    <td className="text-slate-600">
                      {r.guest === "—" ? (
                        <span className="text-slate-400 italic">
                          No guest
                        </span>
                      ) : (
                        r.guest
                      )}
                    </td>

                    <td>
                      <span
                        className={`
                          text-xs px-2.5 py-1 rounded-full border
                          ${statusMap[r.status]}
                        `}
                      >
                        {r.status}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        </div>

        {/* CHECKINS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition">

          <h3 className="text-sm font-medium text-slate-700 mb-4">
            Today's Check-ins
          </h3>

          <div className="space-y-3">

            {checkins.map((c, i) => (
              <div
                key={i}
                className="
                  flex items-center justify-between
                  p-2 rounded-lg
                  hover:bg-slate-50 transition
                "
              >

                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {c.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Room {c.room}
                  </p>
                </div>

                <span className="text-xs text-blue-600">
                  {c.time}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Overview;