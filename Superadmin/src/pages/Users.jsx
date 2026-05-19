import { theme } from "../theme";

const users = [
  { initials: "AK", color: "#7c5cfc", name: "Arjun K.",  email: "arjun@mail.com", roleLabel: "Admin",     roleCls: "admin", statusColor: theme.success, status: "Active"  },
  { initials: "SR", color: "#e8462a", name: "Sita R.",   email: "sita@mail.com",  roleLabel: "Moderator", roleCls: "mod",   statusColor: theme.success, status: "Active"  },
  { initials: "PM", color: "#1d9e75", name: "Priya M.",  email: "priya@mail.com", roleLabel: "User",      roleCls: "user",  statusColor: theme.warning, status: "Flagged" },
  { initials: "RB", color: "#555",    name: "Raj B.",    email: "raj@mail.com",   roleLabel: "User",      roleCls: "user",  statusColor: theme.danger,  status: "Banned"  },
];

export default function Users() {
  return (
    <>
      {/* User table */}
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">User Management</span>
          <input
            className="form-input"
            placeholder="Search users..."
            style={{ width: 180, padding: "6px 10px", fontSize: 12 }}
          />
        </div>
        <table className="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="user-av" style={{ background: u.color }}>{u.initials}</div>
                    {u.name}
                  </div>
                </td>
                <td style={{ color: theme.muted }}>{u.email}</td>
                <td><span className={`role-chip ${u.roleCls}`}>{u.roleLabel}</span></td>
                <td><span style={{ color: u.statusColor, fontSize: 11 }}>● {u.status}</span></td>
                <td>
                  <button className="mini-btn">
                    {u.status === "Banned" ? "Unban" : u.status === "Flagged" ? "Review" : "Edit"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite admin */}
      <div className="full-panel">
        <div className="panel-hd">
          <span className="panel-title">Invite Admin</span>
        </div>
        <div className="form-row">
          <label className="form-label">Email address</label>
          <input className="form-input" placeholder="admin@yourproject.com" />
        </div>
        <div className="form-row">
          <label className="form-label">Role</label>
          <select className="form-input">
            <option>Admin</option>
            <option>Moderator</option>
            <option>Editor</option>
          </select>
        </div>
        <button className="btn primary">Send invite</button>
      </div>
    </>
  );
}