import { motion, AnimatePresence } from "framer-motion";

// ── types ────────────────────────────────────────────────────────────────────
export interface Room {
  _id: string;
  hotelId: string;
  roomNumber: string;
  roomType: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  pricePerNight: number;
  basePrice?: number;
  weekendPrice?: number;
  capacity: number;
  maxOccupancy?: number;
  floorNumber: number;
  rating: number;
  numberOfReviews?: number;
  discount: number;
  amenities?: string[];
  specialFeatures?: string[];
  roomImages?: string[];
  roomDescription?: string;
  bedType?: string;
  roomSize?: number;
  viewType?: string;
  suitetype?: string;
  cancellationPolicy?: string;
  taxRate?: number;
  minStayNights?: number;
  hasWifi?: boolean;
  hasAC?: boolean;
  hasBalcony?: boolean;
  hasBathtub?: boolean;
  hasShower?: boolean;
  hasHeating?: boolean;
  isAccessible?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface RoomDetailModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

// ── helpers ──────────────────────────────────────────────────────────────────
const statusStyle: Record<string, string> = {
  AVAILABLE:   "bg-emerald-50 text-emerald-600 border-emerald-200",
  OCCUPIED:    "bg-blue-50 text-blue-600 border-blue-200",
  MAINTENANCE: "bg-rose-50 text-rose-600 border-rose-200",
};

const boolFeatures = [
  { key: "hasWifi",     icon: "📶", label: "Wi-Fi" },
  { key: "hasAC",       icon: "❄️", label: "Air Conditioning" },
  { key: "hasBalcony",  icon: "🏞️", label: "Balcony" },
  { key: "hasBathtub",  icon: "🛁", label: "Bathtub" },
  { key: "hasShower",   icon: "🚿", label: "Shower" },
  { key: "hasHeating",  icon: "🔥", label: "Heating" },
  { key: "isAccessible",icon: "♿", label: "Accessible" },
] as const;

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-medium text-slate-700">{value}</span>
    </div>
  );
}

// ── component ────────────────────────────────────────────────────────────────
export const RoomDetailModal = ({ room, isOpen, onClose }: RoomDetailModalProps) => {
  if (!room) return null;

  const discountedPrice =
    room.discount > 0
      ? room.pricePerNight * (1 - room.discount / 100)
      : null;

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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* ── Hero Image ─────────────────────────────────────────── */}
              <div className="relative h-52 flex-shrink-0">
                <img
                  src={room.roomImages?.[0] ?? "/placeholder-room.jpg"}
                  alt={`Room ${room.roomNumber}`}
                  className="w-full h-full object-cover"
                />
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition text-sm"
                >
                  ✕
                </button>

                {/* Status badge */}
                <span className={`absolute top-3 left-3 text-[11px] px-2.5 py-1 rounded-full border font-medium ${statusStyle[room.status]}`}>
                  {room.status}
                </span>

                {/* Featured badge */}
                {room.isFeatured && (
                  <span className="absolute top-10 left-3 text-[10px] px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-900 font-semibold mt-1">
                    ★ Featured
                  </span>
                )}

                {/* Room number + type overlay */}
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-2xl font-bold text-white leading-none">
                    Room {room.roomNumber}
                  </h2>
                  <p className="text-white/70 text-xs mt-0.5 tracking-wide">
                    {room.roomType}{room.suitetype ? ` · ${room.suitetype}` : ""}
                  </p>
                </div>

                {/* Rating */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/40 rounded-full px-2.5 py-1">
                  <span className="text-yellow-400 text-xs">★</span>
                  <span className="text-white text-xs font-medium">{room.rating.toFixed(1)}</span>
                  {room.numberOfReviews && (
                    <span className="text-white/60 text-[10px]">({room.numberOfReviews})</span>
                  )}
                </div>
              </div>

              {/* ── Scrollable Body ─────────────────────────────────────── */}
              <div className="overflow-y-auto flex-1 p-5 space-y-5">

                {/* Price block */}
                <div className="flex items-end justify-between">
                  <div>
                    {discountedPrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">
                          Rs. {Math.round(discountedPrice).toLocaleString()}
                        </span>
                        <span className="text-sm text-slate-400 line-through">
                          Rs. {room.pricePerNight.toLocaleString()}
                        </span>
                        <span className="text-xs bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-medium">
                          {room.discount}% off
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-slate-900">
                        Rs. {room.pricePerNight.toLocaleString()}
                      </span>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">per night{room.taxRate ? ` · ${room.taxRate}% tax applies` : ""}</p>
                  </div>
                  {room.weekendPrice && room.weekendPrice !== room.pricePerNight && (
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Weekend rate</p>
                      <p className="text-sm font-semibold text-slate-700">
                        Rs. {room.weekendPrice.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {room.roomDescription && (
                  <p className="text-sm text-slate-500 leading-relaxed border-l-2 border-blue-200 pl-3">
                    {room.roomDescription}
                  </p>
                )}

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Floor", value: room.floorNumber },
                    { label: "Capacity", value: `${room.capacity} guests` },
                    { label: "Size", value: room.roomSize ? `${room.roomSize} sq.ft` : "—" },
                    { label: "Bed Type", value: room.bedType ?? "—" },
                    { label: "View", value: room.viewType ?? "—" },
                    { label: "Min Stay", value: room.minStayNights ? `${room.minStayNights} night` : "—" },
                  ].map(stat => (
                    <div key={stat.label} className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">{stat.label}</p>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5 capitalize">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Facilities (boolean flags) */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Facilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {boolFeatures.map(({ key, icon, label }) => {
                      const enabled = (room as any)[key];
                      return (
                        <span
                          key={key}
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                            enabled
                              ? "bg-blue-50 border-blue-100 text-blue-600"
                              : "bg-slate-50 border-slate-100 text-slate-300 line-through"
                          }`}
                        >
                          <span>{icon}</span>
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Amenities */}
                {room.amenities && room.amenities.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {room.amenities.map((a, i) => (
                        <span key={i} className="text-xs bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special features */}
                {room.specialFeatures && room.specialFeatures.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Special Features</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {room.specialFeatures.map((f, i) => (
                        <span key={i} className="text-xs bg-yellow-50 border border-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">
                          ✦ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional info */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Details</h4>
                  <div className="bg-slate-50 rounded-xl px-4 py-1">
                    <InfoRow label="Max Occupancy" value={`${room.maxOccupancy ?? room.capacity} guests`} />
                    {room.cancellationPolicy && (
                      <InfoRow label="Cancellation" value={room.cancellationPolicy} />
                    )}
                    <InfoRow label="Room ID" value={<span className="font-mono text-[10px] text-slate-400">{room._id}</span>} />
                  </div>
                </div>
              </div>

              {/* ── Footer ──────────────────────────────────────────────── */}
              <div className="flex-shrink-0 border-t border-slate-100 p-4 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
                  Manage Room
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};