import { useEffect, useState } from "react";
import { getAllHotels, getHotelBookings } from "../../Services/admin.api";
import { Building2 } from "lucide-react";

const badgeMap = {
  active: { cls: "bg-emerald-100 text-emerald-800", label: "Confirmed" },
  pending: { cls: "bg-yellow-100 text-yellow-800", label: "Pending" },
  declined: { cls: "bg-red-100 text-red-800", label: "Cancelled" },
};

export default function Bookings() {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingHotels(true);
      try {
        const list = await getAllHotels();
        if (!mounted) return;
        setHotels(list.map(h => ({ id: h._id || h.id, name: h.hotelName || h.name || 'Unnamed', location: h.location || h.address || '-' })));
      } catch (e) { console.error('Failed to load hotels', e); }
      finally { setLoadingHotels(false); }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!selectedHotel) { setBookings([]); return; }
    let mounted = true;
    (async () => {
      setLoadingBookings(true);
      try {
        const b = await getHotelBookings(selectedHotel.id);
        if (!mounted) return;
        setBookings(b || []);
      } catch (e) { console.error('Failed to load bookings', e); }
      finally { setLoadingBookings(false); }
    })();
    return () => { mounted = false; };
  }, [selectedHotel]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <div className="text-sm font-semibold text-slate-900 mb-2">Hotels</div>
        <div className="bg-white rounded-lg border p-3 space-y-2">
          {loadingHotels && <div className="text-sm text-slate-500">Loading hotels...</div>}
          {!loadingHotels && hotels.length===0 && <div className="text-sm text-slate-500">No hotels found</div>}
          {hotels.map(h => (
            <div key={h.id} onClick={() => setSelectedHotel(h)} className={`p-2 rounded cursor-pointer hover:bg-slate-50 flex items-center gap-2 ${selectedHotel?.id===h.id?'bg-slate-50':''}`}>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><Building2 size={18} className="text-blue-600" /></div>
              <div>
                <div className="text-sm font-medium text-slate-900">{h.name}</div>
                <div className="text-xs text-slate-500">{h.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="text-base font-semibold text-slate-900 mb-1">Booking History</div>
        <div className="text-[13px] text-slate-500 mb-4.5">Select a hotel to view its booking history</div>

        {!selectedHotel && (
          <div className="bg-white rounded-lg border p-6 text-sm text-slate-500">Select a hotel from the left to view bookings.</div>
        )}

        {selectedHotel && (
          <div>
            <div className="mb-3 text-sm text-slate-700">Showing bookings for <strong>{selectedHotel.name}</strong></div>
            <div className="bg-white rounded-lg border p-3 space-y-3">
              {loadingBookings && <div className="text-sm text-slate-500">Loading bookings...</div>}
              {!loadingBookings && bookings.length===0 && <div className="text-sm text-slate-500">No bookings for this hotel.</div>}
              {!loadingBookings && bookings.map((b) => {
                const badge = badgeMap[b.status] || badgeMap.pending;
                return (
                  <div key={b._id||b.id||b.bookingRef} className="p-3 border rounded flex items-center gap-3">
                    <div className="text-xs text-brand-accent font-medium w-24 shrink-0 font-mono">{b.bookingRef || b._id || b.id}</div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{b.guestName || b.userName || b.guest || 'Guest'}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{b.nights || `${b.nightCount || 1} night(s)`} · {b.dates || `${b.checkIn || '-'} → ${b.checkOut || '-'}`}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-xs text-slate-500">{b.dates || `${b.checkIn || '-'} → ${b.checkOut || '-'}`}</div>
                      <div className="text-[13px] font-semibold text-[#0369a1] mt-0.5">{b.amount || b.total || '-'}</div>
                    </div>
                    <span className={`text-[11px] py-0.75 px-2.5 rounded-full font-medium mx-2 ${badge.cls}`}>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
