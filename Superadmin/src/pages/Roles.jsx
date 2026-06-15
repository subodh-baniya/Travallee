import { useState } from "react";
import { motion } from "framer-motion";
import { createAdmin, getRoles, updateRolePermissions } from "../Services/admin.api";

const blankNew = { username: '', email: '', password: '', role: 'admin' };

const initialRoles = [
  { id: 'admin', name: 'Administrator', permissions: { hotels:true, bookings:true, users:true, analysis:true, settings:true } },
  { id: 'moderator', name: 'Moderator', permissions: { hotels:true, bookings:true, users:false, analysis:false, settings:false } },
];

export default function Roles() {
  const [roles, setRoles] = useState(initialRoles);
  const [showCreate, setShowCreate] = useState(false);
  const [newAdmin, setNewAdmin] = useState(blankNew);

  const togglePerm = (roleId, key) => {
    setRoles(prev => prev.map(r => r.id===roleId?{...r, permissions:{...r.permissions,[key]:!r.permissions[key]}}:r));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">System Administration</div>
          <div className="text-xs text-slate-500">Roles & Permissions</div>
        </div>
        <div>
          <button onClick={() => setShowCreate(true)} className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm">Create Admin</button>
        </div>
      </div>

      <div className="space-y-4">
        {roles.map(r => (
          <div key={r.id} className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium text-slate-900">{r.name}</div>
                <div className="text-xs text-slate-500">{r.id}</div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(r.permissions).map(k => (
                <button key={k} onClick={() => togglePerm(r.id,k)} className={`px-3 py-1 rounded-md text-xs ${r.permissions[k]?'bg-blue-50 text-blue-700':'bg-slate-50 text-slate-600'}`}>{k}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold">Create Admin</div>
              <button onClick={() => setShowCreate(false)} className="text-slate-500">Close</button>
            </div>
            <div className="space-y-2">
              <input placeholder="Username" value={newAdmin.username} onChange={(e)=>setNewAdmin(s=>({...s,username:e.target.value}))} className="w-full border p-2 rounded" />
              <input placeholder="Email" value={newAdmin.email} onChange={(e)=>setNewAdmin(s=>({...s,email:e.target.value}))} className="w-full border p-2 rounded" />
              <input placeholder="Password" value={newAdmin.password} onChange={(e)=>setNewAdmin(s=>({...s,password:e.target.value}))} className="w-full border p-2 rounded" type="password" />
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setShowCreate(false)} className="px-3 py-1 rounded border">Cancel</button>
                <button onClick={async ()=>{ try{ await createAdmin(newAdmin); setShowCreate(false); }catch(e){console.error(e);} }} className="px-3 py-1 rounded bg-blue-600 text-white">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
