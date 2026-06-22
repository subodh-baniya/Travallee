import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { getUsers, banUser, unbanUser } from "../Services/admin.api";
import { X, UserPlus } from "lucide-react";

function StatusPill({ status }) {
  const map = {
    active: "bg-emerald-100 text-emerald-700",
    banned: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
  };
  return <span className={`text-xs px-2 py-1 rounded-full font-medium ${map[status]||'bg-slate-100 text-slate-700'}`}>{status}</span>;
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetch(); }, []);

  async function fetch() {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }

  const filtered = useMemo(() => users.filter(u => tab==='all' || u.status===tab), [users, tab]);

  const toggleBan = async (u) => {
    try {
      if (u.status === 'banned') {
        await unbanUser(u._id || u.id);
        setUsers(prev => prev.map(p => p._id===u._id?{...p,status:'active'}:p));
      } else {
        await banUser(u._id || u.id);
        setUsers(prev => prev.map(p => p._id===u._id?{...p,status:'banned'}:p));
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">User Management</div>
          <div className="text-xs text-slate-500">Manage accounts and statuses</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm px-3 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2"><UserPlus size={14}/> Invite</button>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        {['all','active','pending','banned'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded-md text-sm ${tab===t?'bg-slate-100':'text-slate-600'}`}>{t.toUpperCase()}</button>
        ))}
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 text-xs text-left">
              <th className="py-2">User</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id||u.id} className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">{(u.name||u.username||'U').slice(0,2).toUpperCase()}</div>
                    <div>
                      <div className="font-medium text-slate-900">{u.name||u.username}</div>
                      <div className="text-xs text-slate-500">{u._id||u.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-slate-700">{u.email}</td>
                <td className="py-3 text-slate-700">{u.role||'user'}</td>
                <td className="py-3"><StatusPill status={u.status||'pending'} /></td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button onClick={() => toggleBan(u)} className="px-3 py-1 text-xs rounded-md bg-slate-100">{u.status==='banned'?'Unban':'Ban'}</button>
                    <button onClick={() => setSelected(u)} className="px-3 py-1 text-xs rounded-md bg-white border">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 flex justify-end z-20" onClick={() => setSelected(null)}>
          <motion.div initial={{x:300}} animate={{x:0}} className="w-96 bg-white p-4 h-full" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-lg font-semibold">{selected.name||selected.username}</div>
                <div className="text-xs text-slate-500">{selected.email}</div>
              </div>
              <button onClick={()=>setSelected(null)} className="p-1"><X/></button>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <div><strong>Role:</strong> {selected.role||'user'}</div>
              <div><strong>Status:</strong> {selected.status}</div>
              <div><strong>Joined:</strong> {selected.createdAt?new Date(selected.createdAt).toLocaleString():'-'}</div>
              <div><strong>Phone:</strong> {selected.phone||'-'}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
