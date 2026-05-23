import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../Contexts/Authcontext";
import { useNavigate } from "react-router-dom";

/* ---------------- DATA ---------------- */

type Status = "ALL" | "PAID" | "NOTPAID";

type Booking = {
  id: string;
  userId: string;
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  amount: string;
  status: Exclude<Status, "ALL">;
  bookingStatus: "CONFIRMED" | "PENDING" | "CANCELLED";
};

type IncomingBookingEvent = {
  bookingId?: string;
  userId?: string;
  userName?: string;
  name?: string;
  email?: string;
  roomNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
  stayDurationNights?: number;
  amount?: number | string;
  paymentMethod?: string;
  bookingPayment?: string;
  status?: string;
};

type HotelBookingHistoryEntry = {
  bookingId?: string;
  userId?: string;
  guestName?: string;
  roomNumber?: string;
  checkinDate?: string;
  checkoutDate?: string;
  totalPrice?: number;
  paymentMethod?: string;
  bookingPayment?: string;
  status?: string;
  stayDurationNights?: number;
  email?: string;
};

const RECENT_BOOKINGS_STORAGE_KEY = "recentBookingEvents";


const statusMap: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-600 border-emerald-100",
  NOTPAID: "bg-amber-50 text-amber-600 border-amber-100",
};

const formatDisplayDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
};

const normalizePaymentStatus = (status?: string): Exclude<Status, "ALL"> => {
  if (status === "PAID" || status === "NOTPAID") {
    return status;
  }
  return "NOTPAID";
};

const normalizeBookingStatus = (status?: string): "CONFIRMED" | "PENDING" | "CANCELLED" => {
  if (status === "CONFIRMED" || status === "PENDING" || status === "CANCELLED") {
    return status;
  }
  return "PENDING";
};

const mapIncomingBooking = (payload: IncomingBookingEvent): Booking => {
  return {
    id: payload.bookingId || `TMP-${Date.now()}`,
    userId: payload.userId || "-",
    guest: payload.userName || payload.name || payload.email || "Guest",
    room: payload.roomNumber || "-",
    checkIn: formatDisplayDate(payload.checkInDate),
    checkOut: formatDisplayDate(payload.checkOutDate),
    amount: payload.amount !== undefined ? `Rs. ${payload.amount}` : "-",
    status: normalizePaymentStatus(payload.bookingPayment),
    bookingStatus: normalizeBookingStatus(payload.status),
  };
};

const mapHistoryBooking = (payload: HotelBookingHistoryEntry): Booking => {
  return {
    id: payload.bookingId || `TMP-${Date.now()}`,
    userId: payload.userId || "-",
    guest: payload.guestName || payload.email || payload.userId || "Guest",
    room: payload.roomNumber || "-",
    checkIn: formatDisplayDate(payload.checkinDate),
    checkOut: formatDisplayDate(payload.checkoutDate),
    amount: payload.totalPrice !== undefined ? `Rs. ${payload.totalPrice}` : "-",
    status: normalizePaymentStatus(payload.bookingPayment),
    bookingStatus: normalizeBookingStatus(payload.status),
  };
};


const Bookings = () => {
  const auth = useAuth();
  const hotelId = auth?.hotelId || null;
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<Status>("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBookingHistory = async () => {
      if (!hotelId) {
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL_ADMIN || "http://localhost:4001"}/api/v1/admin/booking-history/${hotelId}`,
          { withCredentials: true },
        );

        const history = response.data?.data?.bookingHistory || response.data?.bookingHistory || [];
        if (!Array.isArray(history)) {
          return;
        }

        setBookings(
          history
            .map((item: HotelBookingHistoryEntry) => mapHistoryBooking(item))
            .filter((item: Booking, index: number, array: Booking[]) =>
              array.findIndex((candidate) => candidate.id === item.id) === index,
            )
            .slice(0, 30),
        );
      } catch {
        try {
          const raw = localStorage.getItem(RECENT_BOOKINGS_STORAGE_KEY);
          if (!raw) {
            return;
          }

          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed)) {
            return;
          }

          const restored = parsed
            .map((item: IncomingBookingEvent) => mapIncomingBooking(item))
            .filter((item: Booking, index: number, array: Booking[]) =>
              array.findIndex((candidate) => candidate.id === item.id) === index,
            )
            .slice(0, 30);

          setBookings(restored);
        } catch {
          // Ignore local storage parse issues.
        }
      }
    };

    void fetchBookingHistory();
  }, [hotelId]);

  useEffect(() => {
    if (!hotelId) {
      return;
    }

    const socket: Socket = io(import.meta.env.VITE_API_BASE_URL_ADMIN || "http://localhost:4001", {
      path: "/api/v1/admin/socket.io",
      query: { HotelId: hotelId },
      withCredentials: true,
      transports: ["websocket"],
    });

    const handleNewBooking = (payload: IncomingBookingEvent) => {
      const incoming = mapIncomingBooking(payload);

      try {
        const previousRaw = localStorage.getItem(RECENT_BOOKINGS_STORAGE_KEY);
        const previous = previousRaw ? JSON.parse(previousRaw) : [];
        const normalized = Array.isArray(previous) ? previous : [];
        const withoutDuplicate = payload?.bookingId
          ? normalized.filter((item: IncomingBookingEvent) => item?.bookingId !== payload.bookingId)
          : normalized;
        localStorage.setItem(
          RECENT_BOOKINGS_STORAGE_KEY,
          JSON.stringify([payload, ...withoutDuplicate].slice(0, 30)),
        );
      } catch {
        // Ignore local storage failures.
      }

      setBookings((prev) => {
        const filteredExisting = prev.filter((item) => item.id !== incoming.id);
        return [incoming, ...filteredExisting];
      });
    };

    socket.on("new_booking", handleNewBooking);

    return () => {
      socket.off("new_booking", handleNewBooking);
      socket.disconnect();
    };
  }, [hotelId]);

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
          {["ALL", "PAID", "NOTPAID"].map((s) => (
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
        <th className="text-left px-4 py-3 font-medium">Name</th>
        <th className="text-center px-4 py-3 font-medium">Room No</th>
        <th className="text-center px-4 py-3 font-medium">Status</th>
        <th className="text-left px-4 py-3 font-medium">Check-in</th>
        <th className="text-left px-4 py-3 font-medium">Check-out</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-slate-100">

      {filtered.map((b, i) => (
        <motion.tr
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate(`/dashboard/bookings/${b.id}`)}
          className="hover:bg-slate-50 transition cursor-pointer"
        >

          <td className="px-4 py-3 font-medium text-slate-800 align-middle">
            {b.guest}
          </td>

          <td className="px-4 py-3 text-center align-middle">
            <span className="text-blue-600 font-medium">
              {b.room}
            </span>
          </td>

          <td className="px-4 py-3 text-slate-500 text-xs align-middle">
            {b.checkIn}
          </td>

          <td className="px-4 py-3 text-slate-500 text-xs align-middle">
            {b.checkOut}
          </td>

          <td className="px-4 py-3 text-center align-middle">
            <span
              className={`text-xs px-2.5 py-1 rounded-full border ${statusMap[b.status]}`}
            >
              {b.status}
            </span>
          </td>

        </motion.tr>
      ))}

      {filtered.length === 0 && (
        <tr>
          <td className="px-4 py-10 text-center text-slate-500" colSpan={5}>
            No bookings available.
          </td>
        </tr>
      )}

    </tbody>
  </table>
</div>
    </div>
  );
};

export default Bookings;