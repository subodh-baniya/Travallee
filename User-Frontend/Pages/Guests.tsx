import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ---------------- TYPES ---------------- */

type Status = "ALL" | "ACTIVE" | "VIP" | "BLOCKED";

interface Guest {
  id: string;
  name: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
  status: "ACTIVE" | "VIP" | "BLOCKED";
  lastVisit: string;
}

interface GuestResponse {
  guests: Guest[];
}

/* ---------------- MOCK DATA ---------------- */

const mockData: GuestResponse = {
  guests: [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      totalBookings: 5,
      totalSpent: 450,
      status: "VIP",
      lastVisit: "2026-04-18",
    },
    {
      id: "2",
      name: "Alice Smith",
      email: "alice@example.com",
      totalBookings: 2,
      totalSpent: 120,
      status: "ACTIVE",
      lastVisit: "2026-04-10",
    },
    {
      id: "3",
      name: "Mark Lee",
      email: "mark@example.com",
      totalBookings: 1,
      totalSpent: 80,
      status: "BLOCKED",
      lastVisit: "2026-03-30",
    },
  ],
};

/* ---------------- COMPONENT ---------------- */

const Guests = () => {
  const [data, setData] = useState<GuestResponse | null>(null);
  const [filter, setFilter] = useState<Status>("ALL");

  useEffect(() => {
    const fetchGuests = async () => {
      // future API
      // const res = await fetch(`/api/dashboard/guests?status=${filter}`);
      // const json = await res.json();
      // setData(json.data);

      setData(mockData);
    };

    fetchGuests();
  }, [filter]);

  if (!data) return <div>Loading...</div>;

  const filteredGuests =
    filter === "ALL"
      ? data.guests
      : data.guests.filter((g) => g.status === filter);

  return (
    <div className="space-y-6">

      {/* ---------------- FILTERS ---------------- */}
      <div className="flex gap-3">
        {["ALL", "ACTIVE", "VIP", "BLOCKED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as Status)}
            className={`px-4 py-1.5 text-sm rounded-full transition ${
              filter === s
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="p-4">Guest</th>
              <th className="p-4">Email</th>
              <th className="p-4">Bookings</th>
              <th className="p-4">Spent</th>
              <th className="p-4">Last Visit</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredGuests.map((g) => (
              <motion.tr
                key={g.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t hover:bg-gray-50 transition"
              >

                <td className="p-4 font-medium text-gray-800">
                  {g.name}
                </td>

                <td className="p-4 text-gray-600">
                  {g.email}
                </td>

                <td className="p-4">
                  {g.totalBookings}
                </td>

                <td className="p-4 font-medium">
                  ${g.totalSpent}
                </td>

                <td className="p-4 text-gray-600">
                  {g.lastVisit}
                </td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      g.status === "VIP"
                        ? "bg-purple-100 text-purple-700"
                        : g.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {g.status}
                  </span>
                </td>

              </motion.tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Guests;