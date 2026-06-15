import { useState, useMemo, useEffect, useCallback } from "react";
import { useContext } from "react";
import { motion } from "framer-motion";
import { Authcontext } from "../../Contexts/Authcontext";
import { getPendingRegistrations, approveRegistration, declineRegistration, getHotelBookings, createBooking } from "../../Services/admin.api";
import {
  MapPin,
  Mail,
  Phone,
  Calendar,
  Building2,
  Check,
  X,
  Search,
  AlertCircle,
  Plus,
} from "lucide-react";

const INITIAL_HOTELS = []

const STATUS_CONFIG = {
  pending: { label: "Pending Review", bg: "bg-amber-50", color: "text-amber-900", dot: "bg-amber-500", border: "border-amber-200" },
  active: { label: "Approved", bg: "bg-emerald-50", color: "text-emerald-900", dot: "bg-emerald-500", border: "border-emerald-200" },
  declined: { label: "Rejected", bg: "bg-red-50", color: "text-red-900", dot: "bg-red-500", border: "border-red-200" },
};

function Badge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function Initials({ name }) {
  const letters = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-sm font-bold text-blue-700">
      {letters}
    </div>
  );
}

function StatCard({ label, count, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg p-4 border border-slate-200 text-center hover:shadow-md transition-shadow"
    >
      <div className={`text-2xl font-bold ${color}`}>{count}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </motion.div>
  );
}

function ActionButtons({ hotel, onAction, compact = false, loading }) {
  const BaseButton = ({ label, icon: Icon, variant, type }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={loading}
      onClick={(e) => { e.stopPropagation(); onAction(hotel.id, type); }}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-60 disabled:cursor-wait ${variant}`}
    >
      <Icon size={14} />
      {label}
    </motion.button>
  );

  if (hotel.status === "pending") return (
    <div className="flex gap-2">
      <BaseButton label="Approve" icon={Check} variant="bg-emerald-100 text-emerald-700 hover:bg-emerald-200" type="accept" />
      <BaseButton label="Reject" icon={X} variant="bg-red-100 text-red-700 hover:bg-red-200" type="delete" />
    </div>
  );
  if (hotel.status === "active") return (
    <div className="flex gap-2">
      <BaseButton label="Revoke" icon={X} variant="bg-red-100 text-red-700 hover:bg-red-200" type="delete" />
    </div>
  );
  return (
    <div className="flex gap-2">
      <BaseButton label="Reconsider" icon={AlertCircle} variant="bg-amber-100 text-amber-700 hover:bg-amber-200" type="reconsider" />
    </div>
  );
}

function DrawerDetail({ hotel, onClose, onAction, loading, bookings = [], onCreateBooking }) {
  const [form, setForm] = useState({ guestName: '', checkIn: '', checkOut: '', rooms: 1, price: 0 });
  const [submitting, setSubmitting] = useState(false);

  const submitBooking = async () => {
    if (!onCreateBooking) return;
    setSubmitting(true);
    try {
      await onCreateBooking(form);
      setForm({ guestName: '', checkIn: '', checkOut: '', rooms: 1, price: 0 });
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 flex justify-end z-10"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ duration: 0.3 }}
        className="w-80 h-full bg-white flex flex-col border-l border-slate-200 overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Hotel Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Hotel Identity */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Building2 size={24} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 truncate">{hotel.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge status={hotel.status} />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-start">
              <span className="text-slate-600">Rooms</span>
              <span className="font-medium text-slate-900">{hotel.rooms}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-slate-600 flex items-center gap-1"><MapPin size={14} /> Address</span>
              <span className="font-medium text-slate-900 text-right max-w-[140px]">{hotel.address}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-slate-600 flex items-center gap-1"><Calendar size={14} /> Submitted</span>
              <span className="font-medium text-slate-900">{hotel.date}</span>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="p-4 border-b border-slate-100">
          <p className="text-xs font-semibold uppercase text-slate-500 tracking-widest mb-3">Owner</p>
          <div className="flex items-center gap-3 mb-3">
            <Initials name={hotel.owner} />
            <div>
              <p className="text-sm font-semibold text-slate-900">{hotel.owner}</p>
              <p className="text-xs text-slate-500">Hotel Owner</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 flex items-center gap-2"><Phone size={14} /> Phone</span>
              <span className="font-medium text-blue-600">{hotel.phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 flex items-center gap-2"><Mail size={14} /> Email</span>
              <span className="font-medium text-blue-600 truncate">{hotel.email}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="p-4 flex-1">
          <p className="text-xs font-semibold uppercase text-slate-500 tracking-widest mb-2">Notes</p>
          <p className="text-sm text-slate-700 leading-relaxed">{hotel.notes}</p>
        </div>

        {/* Bookings */}
        <div className="p-4 border-t border-slate-100">
          <div className="text-xs font-semibold uppercase text-slate-500 tracking-widest mb-3">Bookings</div>
          {bookings.length===0 && <div className="text-sm text-slate-500">No bookings yet for this hotel.</div>}
          {bookings.map((b,i) => (
            <div key={b._id||i} className="p-2 border rounded mb-2">
              <div className="text-sm font-medium">{b.guestName || b.userName || 'Guest'}</div>
              <div className="text-xs text-slate-500">{b.checkIn} → {b.checkOut} · {b.rooms} room(s)</div>
            </div>
          ))}

          <div className="mt-3">
            <div className="text-xs font-semibold text-slate-500 mb-2">Create Booking</div>
            <div className="space-y-2">
              <input value={form.guestName} onChange={e=>setForm(s=>({...s,guestName:e.target.value}))} placeholder="Guest name" className="w-full border p-2 rounded" />
              <div className="flex gap-2">
                <input value={form.checkIn} onChange={e=>setForm(s=>({...s,checkIn:e.target.value}))} type="date" className="flex-1 border p-2 rounded" />
                <input value={form.checkOut} onChange={e=>setForm(s=>({...s,checkOut:e.target.value}))} type="date" className="flex-1 border p-2 rounded" />
              </div>
              <div className="flex gap-2">
                <input value={form.rooms} onChange={e=>setForm(s=>({...s,rooms:Number(e.target.value)}))} type="number" min={1} className="w-20 border p-2 rounded" />
                <input value={form.price} onChange={e=>setForm(s=>({...s,price:Number(e.target.value)}))} type="number" min={0} className="flex-1 border p-2 rounded" placeholder="Total price" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button onClick={()=>{ setForm({ guestName: '', checkIn: '', checkOut: '', rooms: 1, price: 0 })}} className="px-3 py-1 border rounded">Reset</button>
                <button onClick={submitBooking} disabled={submitting} className="px-3 py-1 bg-blue-600 text-white rounded">{submitting?'Saving...':'Create Booking'}</button>
              </div>
            </div>
          </div>

        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-100 flex gap-2">
          <ActionButtons hotel={hotel} onAction={onAction} compact loading={loading} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function normalizeHotelData(hotelData) {
  return {
    id: hotelData.userID || hotelData._id || Date.now(),
    name: hotelData.hotelName || hotelData.hotelLocation || "Unnamed Hotel",
    rooms: `${hotelData.rooms || hotelData.roomCount || 0} rooms`,
    owner: hotelData.ownerName || hotelData.contactName || hotelData.hotelOwner || "Unknown Owner",
    phone: hotelData.phone || hotelData.contactNumber || "-",
    email: hotelData.email || hotelData.contactEmail || "-",
    location: hotelData.location || hotelData.hotelLocation || hotelData.address || "-",
    address: hotelData.address || hotelData.hotelAddress || hotelData.location || "-",
    date: hotelData.createdAt ? new Date(hotelData.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
    status: hotelData.status || "pending",
    notes: hotelData.notes || hotelData.hotelDescription || hotelData.description || "No notes provided.",
    raw: hotelData,
  };
}

export default function HotelRegistrations() {
  const [hotels, setHotels] = useState(INITIAL_HOTELS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { socket } = useContext(Authcontext);

  const fetchPending = useCallback(async () => {
    try {
      const data = await getPendingRegistrations();
      setHotels(data.map(normalizeHotelData));
    } catch (error) {
      console.error("Failed to fetch pending registrations:", error);
      setErrorMessage("Unable to load pending registrations. Please refresh to try again.");
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  useEffect(() => {
    if (!socket) {
      console.warn("Socket not available");
      return;
    }

    const handleHotelRegistration = (hotelData) => {
      console.log("Hotel registration received:", hotelData);
      try {
        const normalized = normalizeHotelData(hotelData);
        setHotels((prev) => [normalized, ...prev]);
      } catch (err) {
        console.error("Error processing hotel registration:", err);
      }
    };

    socket.on("hotelRegistrationsData", handleHotelRegistration);

    return () => {
      socket.off("hotelRegistrationsData", handleHotelRegistration);
    };
  }, [socket]);

  const handleReviewAction = async (id, action) => {
    setErrorMessage("");
    setLoadingId(id);

    try {
      if (action === "accept") {
        await approveRegistration(id);
        setHotels(prev => prev.map(h => h.id === id ? { ...h, status: "active" } : h));
      } else if (action === "delete") {
        await declineRegistration(id);
        setHotels(prev => prev.map(h => h.id === id ? { ...h, status: "declined" } : h));
      } else if (action === "reconsider") {
        setHotels(prev => prev.map(h => h.id === id ? { ...h, status: "pending" } : h));
      }
    } catch (error) {
      console.error("Review action error:", error);
      setErrorMessage("Action failed. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const counts = useMemo(() => ({
    pending: hotels.filter(h => h.status === "pending").length,
    active: hotels.filter(h => h.status === "active").length,
    declined: hotels.filter(h => h.status === "declined").length,
  }), [hotels]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return hotels.filter(h => {
      const matches = (h.name + h.owner + h.location + h.stars).toLowerCase().includes(q);
      return matches && (filter === "all" || h.status === filter);
    });
  }, [hotels, search, filter]);

  const selectedHotel = hotels.find(h => h.id === selectedId);
  const [bookings, setBookings] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!selectedId) return;
    let mounted = true;
    (async () => {
      try {
        const b = await getHotelBookings(selectedId);
        if (mounted) setBookings(b || []);
      } catch (e) { console.error('Failed to load bookings', e); }
    })();
    return () => { mounted = false; };
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Hotel Registrations</h1>
          <p className="text-slate-600 mt-2">Review and manage incoming hotel submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Pending Review" count={counts.pending} color="text-amber-600" />
          <StatCard label="Approved" count={counts.active} color="text-emerald-600" />
          <StatCard label="Rejected" count={counts.declined} color="text-red-600" />
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search hotels, owners, locations…"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="active">Approved</option>
            <option value="declined">Rejected</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            New Registration
          </motion.button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"
          >
            <AlertCircle size={16} />
            {errorMessage}
          </motion.div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Building2 size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">No hotels match your search</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Hotel</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Owner</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Location</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Submitted</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map(h => (
                    <motion.tr
                      key={h.id}
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      onClick={() => setSelectedId(h.id)}
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Building2 size={18} className="text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate">{h.name}</p>
                            <p className="text-xs text-slate-500 mt-1">{h.rooms}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{h.owner}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400" />
                        {h.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{h.date}</td>
                      <td className="px-6 py-4">
                        <Badge status={h.status} />
                      </td>
                      <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                        <ActionButtons hotel={h} onAction={handleReviewAction} loading={loadingId === h.id} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-4">
          {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} total · Click any row to view full details
        </p>

        {/* Detail Drawer */}
        {selectedHotel && (
          <DrawerDetail
            hotel={selectedHotel}
            onClose={() => setSelectedId(null)}
            onAction={handleReviewAction}
            loading={loadingId === selectedHotel.id}
            bookings={bookings}
            onCreateBooking={async (payload) => {
              try {
                setCreating(true);
                await createBooking(selectedHotel.id, payload);
                const b = await getHotelBookings(selectedHotel.id);
                setBookings(b || []);
              } catch (e) { console.error(e); }
              finally { setCreating(false); }
            }}
          />
        )}
      </div>
    </div>
  );
}