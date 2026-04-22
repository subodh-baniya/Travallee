import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ---------------- TYPES ---------------- */

type Status = "ALL" | "CONFIRMED" | "PENDING" | "CANCELLED";

interface Booking {
  id: string;
  guestName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: string;
}

interface BookingResponse {
  bookings: Booking[];
  pagination: {
    page: number;
    totalPages: number;
  };
}

/* ---------------- MOCK ---------------- */

const mockData: BookingResponse = {
  bookings: [
    {
      id: "1",
      guestName: "John Doe",
      roomType: "Deluxe",
      checkIn: "2026-04-20",
      checkOut: "2026-04-22",
      nights: 2,
      totalPrice: 200,
      status: "CONFIRMED",
    },
    {
      id: "2",
      guestName: "Alice",
      roomType: "Suite",
      checkIn: "2026-04-18",
      checkOut: "2026-04-19",
      nights: 1,
      totalPrice: 120,
      status: "PENDING",
    },
  ],
  pagination: {
    page: 1,
    totalPages: 3,
  },
};

/* ---------------- COMPONENT ---------------- */

const Bookings = () => {
  const [data, setData] = useState<BookingResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status>("ALL");

  useEffect(() => {
    const fetchData = async () => {
      // future API
      // const res = await fetch(`/api/dashboard/bookings?status=${statusFilter}`);
      // const json = await res.json();
      // setData(json.data);

      setData(mockData);
    };

    fetchData();
  }, [statusFilter]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">

      {/* -------- FILTERS -------- */}
      <div className="flex gap-3">
        {["ALL", "CONFIRMED", "PENDING", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s as Status)}
            className={`px-4 py-1.5 text-sm rounded-full ${
              statusFilter === s
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* -------- TABLE -------- */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="p-4">Guest</th>
              <th className="p-4">Room</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Nights</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.bookings.map((b) => (
              <motion.tr
                key={b.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4 font-medium">{b.guestName}</td>

                <td className="p-4 text-gray-600">{b.roomType}</td>

                <td className="p-4 text-gray-600">
                  {b.checkIn} → {b.checkOut}
                </td>

                <td className="p-4">{b.nights}</td>

                <td className="p-4 font-medium">
                  ${b.totalPrice}
                </td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      b.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : b.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* -------- PAGINATION -------- */}
      <div className="flex justify-end gap-2">
        {Array.from({ length: data.pagination.totalPages }).map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 text-sm rounded ${
              data.pagination.page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
};

export default Bookings;