import { useEffect, useState } from "react";
import { getPendingApprovals, approveItem, rejectItem } from "../../Services/admin.api";
import { motion } from "framer-motion";

export default function PendingApprovals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetch(); }, []);

  async function fetch() {
    setLoading(true);
    try {
      const data = await getPendingApprovals();
      setItems(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const handle = async (type, id, action) => {
    try {
      if (action === 'approve') await approveItem(type, id);
      else await rejectItem(type, id);
      setItems(prev => prev.filter(i => i._id !== id && i.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="text-sm font-semibold text-slate-900 mb-2">Pending Approvals</div>
      <div className="text-xs text-slate-500 mb-3">Approve or reject incoming requests</div>
      <div className="space-y-2">
        {loading && <div className="text-sm text-slate-400">Loading...</div>}
        {items.length===0 && !loading && <div className="text-sm text-slate-500">No pending items</div>}
        {items.map(it => (
          <motion.div key={it._id||it.id} initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="p-3 border rounded-lg flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-slate-900">{it.title||it.type||'Item'}</div>
              <div className="text-xs text-slate-500">{it.description||it.summary||'-'}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handle(it.type||'generic', it._id||it.id, 'approve')} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-md text-sm">Approve</button>
              <button onClick={() => handle(it.type||'generic', it._id||it.id, 'reject')} className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm">Reject</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
