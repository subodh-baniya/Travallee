import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Users, CreditCard, BedDouble, ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Room {
  _id: string;
  roomNumber: string;
  pricePerNight: number;
  type?: string;
}

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  hotelName: string;
  rooms: Room[];
  onSuccess?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const today = new Date().toISOString().split("T")[0];

function calcNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// ─── Primitive UI pieces ──────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
      {children}
    </span>
  );
}

function Input({
  icon,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  error?: boolean;
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        {...props}
        className={`
          w-full rounded-lg border bg-white text-slate-800 text-sm placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-150
          ${icon ? "pl-9 pr-3 py-2.5" : "px-3 py-2.5"}
          ${error ? "border-red-300" : "border-slate-200"}
        `}
      />
    </div>
  );
}

function Select({
  icon,
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  icon?: React.ReactNode;
  error?: boolean;
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {icon}
        </span>
      )}
      <select
        {...props}
        className={`
          w-full appearance-none rounded-lg border bg-white text-slate-800 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-150
          ${icon ? "pl-9 pr-8 py-2.5" : "px-3 pr-8 py-2.5"}
          ${error ? "border-red-300" : "border-slate-200"}
        `}
      >
        {children}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -3 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1 text-xs text-red-500"
    >
      {msg}
    </motion.p>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function CreateBookingModal({
  isOpen,
  onClose,
  hotelId,
  hotelName,
  rooms,
  onSuccess,
}: CreateBookingModalProps) {
  const [guestName, setGuestName]       = useState("");
  const [guestEmail, setGuestEmail]     = useState("");
  const [roomId, setRoomId]             = useState("");
  const [checkIn, setCheckIn]           = useState("");
  const [checkOut, setCheckOut]         = useState("");
  const [guests, setGuests]             = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "KHALTI" | "ESEWA">("COD");

  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const selectedRoom = rooms.find((r) => r._id === roomId);
  const nights       = calcNights(checkIn, checkOut);
  const totalPrice   = selectedRoom ? selectedRoom.pricePerNight * nights : 0;

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setGuestName(""); setGuestEmail(""); setRoomId("");
      setCheckIn(""); setCheckOut(""); setGuests(1);
      setPaymentMethod("COD"); setErrors({}); setServerError("");
    }
  }, [isOpen]);

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!guestName.trim())  e.guestName  = "Guest name is required";
    if (!guestEmail.trim()) e.guestEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail))
      e.guestEmail = "Enter a valid email";
    if (!roomId)   e.roomId   = "Select a room";
    if (!checkIn)  e.checkIn  = "Check-in date is required";
    if (!checkOut) e.checkOut = "Check-out date is required";
    if (checkIn && checkOut && checkOut <= checkIn)
      e.checkOut = "Check-out must be after check-in";
    if (guests < 1) e.guests = "At least 1 guest required";
    return e;
  }, [guestName, guestEmail, roomId, checkIn, checkOut, guests]);

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setServerError("");
    setSubmitting(true);

    try {
      const { createBooking } = await import("../../Services/booking.api");
      await createBooking({
        roomId,
        hotelId,
        hotelName,
        roomNumber:    selectedRoom!.roomNumber,
        checkIn:       new Date(checkIn).toISOString(),
        checkOut:      new Date(checkOut).toISOString(),
        guests,
        totalPrice,
        paymentMethod,
        Name:          guestName,
        email:         guestEmail,
      });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setServerError(
        err?.response?.data?.message || err?.message || "Booking failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">New Booking</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{hotelName}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4 flex-1">

                {/* Guest info */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Guest Name</FieldLabel>
                    <Input
                      placeholder="Full name"
                      value={guestName}
                      error={!!errors.guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                    />
                    <FieldError msg={errors.guestName} />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      placeholder="guest@email.com"
                      value={guestEmail}
                      error={!!errors.guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                    />
                    <FieldError msg={errors.guestEmail} />
                  </div>
                </div>

                {/* Room */}
                <div>
                  <FieldLabel>Room</FieldLabel>
                  <Select
                    icon={<BedDouble size={15} />}
                    value={roomId}
                    error={!!errors.roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                  >
                    <option value="" disabled>Select a room</option>
                    {rooms.map((r) => (
                      <option key={r._id} value={r._id}>
                        Room {r.roomNumber}
                        {r.type ? ` · ${r.type}` : ""}
                        {" · "}${r.pricePerNight}/night
                      </option>
                    ))}
                  </Select>
                  <FieldError msg={errors.roomId} />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Check-in</FieldLabel>
                    <Input
                      type="date"
                      icon={<CalendarDays size={15} />}
                      min={today}
                      value={checkIn}
                      error={!!errors.checkIn}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        if (checkOut && checkOut <= e.target.value) setCheckOut("");
                      }}
                    />
                    <FieldError msg={errors.checkIn} />
                  </div>
                  <div>
                    <FieldLabel>Check-out</FieldLabel>
                    <Input
                      type="date"
                      icon={<CalendarDays size={15} />}
                      min={checkIn || today}
                      value={checkOut}
                      error={!!errors.checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                    <FieldError msg={errors.checkOut} />
                  </div>
                </div>

                {/* Guests + Payment */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Guests</FieldLabel>
                    <Input
                      type="number"
                      icon={<Users size={15} />}
                      min={1}
                      max={20}
                      value={guests}
                      error={!!errors.guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                    />
                    <FieldError msg={errors.guests} />
                  </div>
                  <div>
                    <FieldLabel>Payment Method</FieldLabel>
                    <Select
                      icon={<CreditCard size={15} />}
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as "COD" | "ESEWA" | "KHALTI")}
                    >
                      <option value="COD">Cash</option>
                      <option value="KHALTI">Khalti</option>
                      <option value="ESEWA">ESEWA</option>
                    </Select>
                  </div>
                </div>

                {/* Price summary */}
                <AnimatePresence>
                  {selectedRoom && nights > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          ${selectedRoom.pricePerNight}/night × {nights} {nights === 1 ? "night" : "nights"}
                        </span>
                        <span className="text-sm font-semibold text-blue-600">
                          ${totalPrice.toLocaleString()} total
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Server error */}
                <AnimatePresence>
                  {serverError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
                    >
                      {serverError}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 pb-5 pt-2 flex gap-3 border-t border-slate-100">
                <button
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Confirming…
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}