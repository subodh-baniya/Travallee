import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, LogOut, Plus, Save, Bell, Search } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { globalSearch } from "../Services/admin.api";

const PAGE_META = {
  "/dashboard": { title: "Dashboard", icon: "📊", path: "dashboard" },
  "/dashboard/hotels/register": { title: "Register Hotels", icon: "🏨", path: "hotels/register" },
  "/dashboard/hotels/bookings": { title: "Bookings", icon: "📅", path: "hotels/bookings" },
  "/dashboard/hotels/status": { title: "Hotel Status", icon: "✓", path: "hotels/status" },
  "/dashboard/analysis": { title: "Analysis", icon: "📈", path: "analysis" },
};

export default function Topbar({ mini, setMini, onSave, savedMsg, onLogout }) {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] || { title: "Dashboard", path: "dashboard" };
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
  const [openNotif, setOpenNotif] = useState(false);
  const [notifications] = useState([
    { id:1, text: '3 pending approvals', unread: true },
    { id:2, text: 'New booking confirmed', unread: false },
  ]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [openSearch, setOpenSearch] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const doSearch = async (q) => {
    if (!q || q.length < 2) { setResults(null); return; }
    try {
      const res = await globalSearch(q);
      setResults(res);
      setOpenSearch(true);
    } catch (e) { console.error(e); }
  };

  return (
    <header className="bg-white border-b border-slate-200 py-3 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => setMini(!mini)}
          title="Toggle sidebar"
        >
          <Menu size={16} className="text-slate-600" />
        </motion.button>
        
        <div>
          <h1 className="text-base font-semibold text-slate-900">{meta.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">{meta.path}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              if (debounceRef.current) clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => doSearch(v), 300);
            }}
            onFocus={() => { if (results) setOpenSearch(true); }}
            placeholder="Search users, hotels, bookings..."
            className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-sm w-[340px] focus:outline-none"
          />
          {openSearch && results && (
            <div className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-30">
              <div className="p-2">
                {results.users?.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs text-slate-400 px-2 py-1">Users</div>
                    {results.users.slice(0,5).map(u => (
                      <div key={u._id||u.id} onClick={() => { navigate(`/dashboard/users`); setOpenSearch(false); }} className="px-2 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">{(u.name||u.username||'U').slice(0,2).toUpperCase()}</div>
                        <div>
                          <div className="text-sm text-slate-900">{u.name||u.username}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {results.hotels?.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs text-slate-400 px-2 py-1">Hotels</div>
                    {results.hotels.slice(0,5).map(h => (
                      <div key={h._id||h.id} onClick={() => { navigate(`/dashboard/hotels/register`); setOpenSearch(false); }} className="px-2 py-2 hover:bg-slate-50 cursor-pointer">
                        <div className="text-sm text-slate-900">{h.hotelName||h.name}</div>
                        <div className="text-xs text-slate-500">{h.location}</div>
                      </div>
                    ))}
                  </div>
                )}
                {results.bookings?.length > 0 && (
                  <div>
                    <div className="text-xs text-slate-400 px-2 py-1">Bookings</div>
                    {results.bookings.slice(0,5).map(b => (
                      <div key={b._id||b.id} onClick={() => { navigate(`/dashboard/hotels/bookings`); setOpenSearch(false); }} className="px-2 py-2 hover:bg-slate-50 cursor-pointer">
                        <div className="text-sm text-slate-900">{b._id||b.bookingId}</div>
                        <div className="text-xs text-slate-500">{b.userName||b.guestName}</div>
                      </div>
                    ))}
                  </div>
                )}
                {!results.users?.length && !results.hotels?.length && !results.bookings?.length && (
                  <div className="p-3 text-sm text-slate-500">No results</div>
                )}
              </div>
            </div>
          )}
        </div>

        <span className="text-xs text-slate-500 px-3 py-1 rounded-lg bg-slate-50">
          {today}
        </span>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="py-2 px-4 rounded-lg text-sm font-medium cursor-pointer border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Plus size={16} />
            <span>New</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          className={`py-2 px-4 rounded-lg text-sm font-semibold cursor-pointer border transition-all flex items-center gap-2 ${
            savedMsg
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Save size={16} />
          <span>{savedMsg ? "Saved" : "Save"}</span>
        </motion.button>
        <div className="relative">
          <button onClick={() => setOpenNotif(o => !o)} className="p-2 rounded-md hover:bg-slate-50">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500" />
          </button>
          {openNotif && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-20">
              {notifications.map(n => (
                <div key={n.id} className="px-3 py-2 flex items-center justify-between">
                  <div className="text-sm text-slate-700">{n.text}</div>
                  {n.unread && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="py-2 px-4 rounded-lg text-sm font-medium cursor-pointer border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </motion.button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white cursor-pointer">
          SA
        </div>
      </div>
    </header>
  );
}