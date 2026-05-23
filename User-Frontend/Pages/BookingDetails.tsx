import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Contexts/Authcontext";

type StoredBookingEvent = {
  bookingId?: string;
  userId?: string;
  guestName?: string;
  userName?: string;
  name?: string;
  email?: string;
  hotelId?: string;
  hotelName?: string;
  roomId?: string;
  roomNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
  stayDurationNights?: number;
  amount?: number | string;
  paymentMethod?: string;
  bookingPayment?: string;
  status?: string;
  createdAt?: string;
};

type HotelBookingHistoryEntry = {
  bookingId?: string;
  userId?: string;
  guestName?: string;
  roomNumber?: string;
  checkinDate?: string;
  checkoutDate?: string;
  stayDurationNights?: number;
  totalPrice?: number;
  paymentMethod?: string;
  bookingPayment?: string;
  status?: string;
  email?: string;
  hotelId?: string;
  hotelName?: string;
  createdAt?: string;
};

const BOOKING_HISTORY_STORAGE_KEY = "recentBookingHistory";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const BookingDetails = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const auth = useAuth();
  const hotelId = auth?.hotelId || null;
  const [booking, setBooking] = useState<StoredBookingEvent | null>(null);

  useEffect(() => {
    const loadBooking = async () => {
      if (!hotelId || !bookingId) {
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL_ADMIN || "http://localhost:4001"}/api/v1/admin/booking-history/${hotelId}`,
          { withCredentials: true },
        );

        const history = response.data?.data?.bookingHistory || response.data?.bookingHistory || [];
        if (Array.isArray(history)) {
          const matched = history.find((item: HotelBookingHistoryEntry) => item.bookingId === bookingId) || null;
          setBooking(matched);

          try {
            localStorage.setItem(
              BOOKING_HISTORY_STORAGE_KEY,
              JSON.stringify(
                history.map((item: HotelBookingHistoryEntry) => ({
                  bookingId: item.bookingId,
                  userId: item.userId,
                  guestName: item.guestName,
                  email: item.email,
                  hotelId: item.hotelId,
                  hotelName: item.hotelName,
                  roomNumber: item.roomNumber,
                  checkInDate: item.checkinDate,
                  checkOutDate: item.checkoutDate,
                  stayDurationNights: item.stayDurationNights,
                  amount: item.totalPrice,
                  paymentMethod: item.paymentMethod,
                  bookingPayment: item.bookingPayment,
                  status: item.status,
                  createdAt: item.createdAt,
                })).slice(0, 30),
              ),
            );
          } catch {
            // Ignore local storage failures.
          }
        }
      } catch {
        try {
          const raw = localStorage.getItem(BOOKING_HISTORY_STORAGE_KEY);
          if (!raw) {
            setBooking(null);
            return;
          }

          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed)) {
            setBooking(null);
            return;
          }

          setBooking(parsed.find((item: StoredBookingEvent) => item.bookingId === bookingId) || null);
        } catch {
          setBooking(null);
        }
      }
    };

    void loadBooking();
  }, [bookingId, hotelId]);

  if (!booking) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <button
          onClick={() => navigate("/dashboard/bookings")}
          className="mb-4 px-3 py-2 text-sm rounded-md border border-slate-200 hover:bg-white"
        >
          Back to Bookings
        </button>
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h1 className="text-lg font-semibold text-slate-900">Booking Details</h1>
          <p className="text-sm text-slate-500 mt-2">No booking details found for this entry.</p>
        </div>
      </div>
    );
  }

  const displayGuestName = booking.guestName || booking.userName || booking.name || booking.email || "Guest";
  const nights = booking.stayDurationNights || 1;
  const checkInValue = (booking as HotelBookingHistoryEntry).checkinDate || booking.checkInDate;
  const checkOutValue = (booking as HotelBookingHistoryEntry).checkoutDate || booking.checkOutDate;
  const amountValue = (booking as HotelBookingHistoryEntry).totalPrice ?? booking.amount;

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-4">
      <button
        onClick={() => navigate("/dashboard/bookings")}
        className="px-3 py-2 text-sm rounded-md border border-slate-200 hover:bg-white"
      >
        Back to Bookings
      </button>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h1 className="text-lg font-semibold text-slate-900">Booking Details</h1>
        <p className="text-xs text-slate-500">All information related to this booking</p>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100"><span className="text-slate-500">Booking ID:</span> <span className="font-medium text-slate-800">{booking.bookingId || "-"}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100"><span className="text-slate-500">User ID:</span> <span className="font-medium text-slate-800">{booking.userId || "-"}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100"><span className="text-slate-500">Guest:</span> <span className="font-medium text-slate-800">{displayGuestName}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100"><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-800">{booking.email || "-"}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100"><span className="text-slate-500">Hotel:</span> <span className="font-medium text-slate-800">{booking.hotelName || booking.hotelId || "-"}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100"><span className="text-slate-500">Room:</span> <span className="font-medium text-slate-800">{booking.roomNumber || booking.roomId || "-"}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100"><span className="text-slate-500">Check-in:</span> <span className="font-medium text-slate-800">{formatDateTime(checkInValue)}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100"><span className="text-slate-500">Check-out:</span> <span className="font-medium text-slate-800">{formatDateTime(checkOutValue)}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100"><span className="text-slate-500">Duration:</span> <span className="font-medium text-slate-800">{nights} night(s)</span></div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100"><span className="text-slate-500">Amount:</span> <span className="font-medium text-slate-800">Rs. {amountValue ?? "-"}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100"><span className="text-slate-500">Payment Method:</span> <span className="font-medium text-slate-800">{booking.paymentMethod || "-"}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100"><span className="text-slate-500">Payment Status:</span> <span className="font-medium text-slate-800">{booking.bookingPayment || "-"}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100"><span className="text-slate-500">Booking Status:</span> <span className="font-medium text-slate-800">{booking.status || "-"}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100"><span className="text-slate-500">Received At:</span> <span className="font-medium text-slate-800">{formatDateTime(booking.createdAt)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
