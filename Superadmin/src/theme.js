// src/theme.js
export const theme = {
  bg:       "#f0f6ff",
  surface:  "#ffffff",
  surface2: "#f8faff",
  border:   "rgba(99,120,210,0.12)",
  border2:  "rgba(99,120,210,0.22)",
  accent:   "#0284c7",
  accent2:  "#38bdf8",
  accentBg: "#e0f2fe",
  accentLight: "#bae6fd",
  text:     "var(--color-text-primary)",
  muted:    "var(--color-text-secondary)",
  danger:   "#dc2626",
  success:  "#166534",
  warning:  "#854d0e",
};

export const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { overflow: hidden; }

  .dash-wrap {
    display: flex;
    height: 100vh;
    background: #f0f6ff;
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
    position: relative;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 220px;
    min-width: 220px;
    background: #fff;
    border-right: 0.5px solid rgba(99,120,210,0.12);
    display: flex;
    flex-direction: column;
    transition: width 0.22s ease, min-width 0.22s ease;
    overflow: hidden;
    flex-shrink: 0;
  }
  .sidebar.mini { width: 58px; min-width: 58px; }

  .sidebar-expand-btn {
  position: absolute;
  top: 50%;
  left: 58px;
  transform: translateY(-50%);
  z-index: 100;
  width: 20px;
  height: 40px;
  background: #fff;
  border: 0.5px solid rgba(99,120,210,0.22);
  border-left: none;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #0284c7;
  cursor: pointer;
  box-shadow: 2px 0 6px rgba(99,120,210,0.1);
  transition: background 0.15s;
  font-weight: 700;
}
.sidebar-expand-btn:hover {
  background: #e0f2fe;
  color: #0369a1;
}

  .s-logo {
    padding: 18px 14px 14px;
    border-bottom: 0.5px solid rgba(99,120,210,0.12);
    display: flex; align-items: center; gap: 10px;
    white-space: nowrap; overflow: hidden;
  }
  .s-logo-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: #e0f2fe; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0; overflow: hidden;
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.14);
    animation: logoFloat 3.2s ease-in-out infinite;
  }
  .s-logo-icon i { font-size: 17px; color: #0284c7; }
  .s-logo-icon img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .s-logo-name { font-size: 14px; font-weight: 600; color: #0f172a; }
  .s-logo-sub  { font-size: 10px; color: #64748b; margin-top: 1px; }

  .s-nav { flex: 1; padding: 8px 6px; overflow-y: auto; overflow-x: hidden; }

  .s-section {
    font-size: 9px; letter-spacing: 0.13em; color: #bae6fd;
    text-transform: uppercase; padding: 12px 8px 4px;
    white-space: nowrap; overflow: hidden; transition: opacity 0.15s;
  }
  .sidebar.mini .s-section { opacity: 0; height: 0; padding: 0; }

  .s-item {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 8px; border-radius: 8px; cursor: pointer;
    font-size: 13px; color: #64748b; transition: all 0.15s;
    margin-bottom: 2px; white-space: nowrap; overflow: hidden;
    font-weight: 400; position: relative;
  }
  .s-item:hover { background: #f0f9ff; color: #0284c7; }
  .s-item.active { background: #e0f2fe; color: #0284c7; font-weight: 500; }

  .s-icon {
    width: 30px; height: 30px; border-radius: 7px;
    background: #f0f9ff; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0; font-size: 15px;
    color: #38bdf8; transition: background 0.15s;
  }
  .s-item.active .s-icon { background: #bae6fd; color: #0369a1; }
  .s-item:hover .s-icon  { background: #bae6fd; }

  .s-label { flex: 1; overflow: hidden; }

  .s-chevron {
    font-size: 11px; color: #94a3b8;
    transition: transform 0.2s; flex-shrink: 0;
  }
  .s-chevron.open { transform: rotate(180deg); }

  .s-submenu { overflow: hidden; max-height: 0; transition: max-height 0.22s ease; }
  .s-submenu.open { max-height: 200px; }
  .sidebar.mini .s-submenu { max-height: 0 !important; }

  .s-sub-item {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 8px 8px 40px; cursor: pointer;
    font-size: 12px; color: #64748b; border-radius: 7px;
    transition: all 0.15s; margin-bottom: 1px; white-space: nowrap;
  }
  .s-sub-item:hover  { background: #f0f9ff; color: #0284c7; }
  .s-sub-item.active { color: #0284c7; background: #e0f2fe; font-weight: 500; }
  .s-dot { width: 5px; height: 5px; border-radius: 50%; background: #bae6fd; flex-shrink: 0; }
  .s-sub-item.active .s-dot { background: #0284c7; }

  .s-footer {
    padding: 10px 6px;
    border-top: 0.5px solid rgba(99,120,210,0.12);
    white-space: nowrap; overflow: hidden;
  }
  .s-user {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 8px; border-radius: 8px;
    background: #f0f9ff; cursor: pointer; transition: background 0.15s;
  }
  .s-user:hover { background: #e0f2fe; }
  .s-av {
    width: 28px; height: 28px; border-radius: 50%;
    background: #bae6fd; display: flex; align-items: center;
    justify-content: center; font-size: 10px; font-weight: 600;
    color: #0369a1; flex-shrink: 0;
  }
  .s-uname { font-size: 12px; font-weight: 500; color: #0f172a; }
  .s-urole  { font-size: 10px; color: #64748b; }
  .s-online {
    width: 7px; height: 7px; border-radius: 50%;
    background: #4ade80; margin-left: auto; flex-shrink: 0;
  }

  /* ── Main ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

  /* ── Topbar ── */
  .topbar {
    background: #fff;
    border-bottom: 0.5px solid rgba(99,120,210,0.12);
    padding: 13px 22px;
    display: flex; align-items: center;
    justify-content: space-between; flex-shrink: 0;
  }
  .tb-left  { display: flex; align-items: center; gap: 12px; }
  .tb-title { font-size: 15px; font-weight: 600; color: #0f172a; }
  .tb-path  { font-size: 11px; color: #64748b; margin-top: 2px; font-family: 'Space Mono', monospace; }
  .tb-right { display: flex; align-items: center; gap: 10px; }
  .tb-date  { font-size: 12px; color: #64748b; }
  .tb-av {
    width: 32px; height: 32px; border-radius: 50%;
    background: #bae6fd; display: flex; align-items: center;
    justify-content: center; font-size: 11px; font-weight: 600;
    color: #0369a1; cursor: pointer; flex-shrink: 0;
  }
  .toggle-btn {
    width: 32px; height: 32px; border-radius: 8px;
    border: 0.5px solid rgba(99,120,210,0.18);
    background: #f8faff; display: flex; align-items: center;
    justify-content: center; cursor: pointer; flex-shrink: 0;
    transition: background 0.15s;
  }
  .toggle-btn i { font-size: 16px; color: #64748b; }
  .toggle-btn:hover { background: #e0f2fe; }

  /* ── Content ── */
  .content { flex: 1; overflow-y: auto; padding: 22px 24px; }

  /* ── Buttons ── */
  .btn {
    padding: 8px 16px; border-radius: 8px; font-size: 13px;
    font-weight: 500; cursor: pointer;
    border: 0.5px solid rgba(99,120,210,0.22);
    background: #fff; color: #0f172a;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .btn:hover { background: #f0f9ff; border-color: #38bdf8; }
  .btn.primary {
    background: #0284c7; color: #fff;
    border-color: #0284c7; font-weight: 600;
  }
  .btn.primary:hover { background: #0369a1; }
  .btn.danger {
    background: #fff5f5; color: #dc2626;
    border: 0.5px solid #fca5a5;
  }
  .btn.danger:hover { background: #fee2e2; }

  @keyframes logoFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-2px) scale(1.02); }
  }

  /* ── Forms ── */
  .form-row { margin-bottom: 16px; }
  .form-label {
    font-size: 11px; color: #64748b; margin-bottom: 6px;
    display: block; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.07em;
  }
  .form-input {
    width: 100%; background: #f8faff;
    border: 0.5px solid rgba(99,120,210,0.22);
    border-radius: 8px; padding: 10px 13px;
    color: #0f172a; font-family: 'DM Sans', sans-serif;
    font-size: 13px; outline: none; transition: all 0.15s;
  }
  .form-input:focus {
    border-color: #0284c7; background: #fff;
    box-shadow: 0 0 0 3px rgba(2,132,199,0.08);
  }
  .form-textarea { min-height: 90px; resize: vertical; }

  /* ── Toggle rows ── */
  .toggle-row {
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 12px 0; border-bottom: 0.5px solid rgba(99,120,210,0.1);
  }
  .toggle-row:last-child { border-bottom: none; }
  .tl { font-size: 13px; color: #0f172a; font-weight: 500; }
  .ts { font-size: 12px; color: #64748b; margin-top: 2px; }

  /* ── Section header ── */
  .section-title { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
  .section-sub   { font-size: 13px; color: #64748b; margin-bottom: 18px; }

  /* ── Search bar ── */
  .search-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .search-input {
    flex: 1; padding: 9px 13px; border-radius: 8px;
    border: 0.5px solid rgba(99,120,210,0.18);
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    outline: none; background: #fff; color: #0f172a; transition: border 0.15s;
  }
  .search-input:focus { border-color: #38bdf8; }

  /* ── Stat cards ── */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px; margin-bottom: 18px;
  }
  .stat-card {
    background: #fff;
    border: 0.5px solid rgba(99,120,210,0.12);
    border-radius: 12px; padding: 18px 20px;
    border-top: 3px solid #38bdf8;
  }
  .stat-label {
    font-size: 11px; color: #64748b; margin-bottom: 8px;
    font-weight: 500; text-transform: uppercase; letter-spacing: 0.07em;
  }
  .stat-val { font-size: 28px; font-weight: 600; color: #0f172a; font-family: 'Space Mono', monospace; }
  .stat-sub { font-size: 12px; color: #64748b; margin-top: 5px; }

  /* ── Table ── */
  .table-wrap {
    border-radius: 12px;
    border: 0.5px solid rgba(99,120,210,0.12);
    overflow: hidden; background: #fff;
  }
  .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .data-table th {
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em;
    color: #64748b; padding: 12px 16px; background: #f8faff;
    border-bottom: 0.5px solid rgba(99,120,210,0.12);
    font-weight: 600; text-align: left;
  }
  .data-table td {
    padding: 13px 16px;
    border-bottom: 0.5px solid rgba(99,120,210,0.08);
    color: #0f172a; vertical-align: middle;
  }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tbody tr:hover td { background: #f8faff; }

  /* ── Badge ── */
  .badge { font-size: 11px; padding: 3px 10px; border-radius: 20px; font-weight: 500; }
  .b-pending  { background: #fef9c3; color: #854d0e; }
  .b-active   { background: #dcfce7; color: #166534; }
  .b-declined { background: #fee2e2; color: #991b1b; }

  /* ── Hotel rows ── */
  .hotel-row {
    background: #fff;
    border: 0.5px solid rgba(99,120,210,0.12);
    border-radius: 10px; padding: 13px 18px;
    margin-bottom: 9px; display: flex;
    align-items: center; gap: 12px; transition: border 0.15s;
  }
  .hotel-row:hover { border-color: #7dd3fc; }
  .hotel-indicator { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .hotel-av {
    width: 34px; height: 34px; border-radius: 9px;
    background: #e0f2fe; display: flex; align-items: center;
    justify-content: center; font-size: 16px; flex-shrink: 0;
  }
  .hotel-name { font-size: 13px; font-weight: 500; color: #0f172a; }
  .hotel-loc  { font-size: 12px; color: #64748b; margin-top: 2px; }

  /* ── Booking cards ── */
  .booking-card {
    background: #fff;
    border: 0.5px solid rgba(99,120,210,0.12);
    border-radius: 10px; padding: 14px 18px;
    margin-bottom: 10px; display: flex;
    align-items: center; gap: 14px; transition: border 0.15s;
  }
  .booking-card:hover { border-color: #7dd3fc; }
  .bk-num    { font-size: 12px; color: #0284c7; font-weight: 500; width: 80px; flex-shrink: 0; font-family: 'Space Mono', monospace; }
  .bk-hotel  { font-size: 13px; font-weight: 500; color: #0f172a; }
  .bk-guest  { font-size: 12px; color: #64748b; margin-top: 2px; }
  .bk-meta   { margin-left: auto; text-align: right; }
  .bk-date   { font-size: 12px; color: #64748b; }
  .bk-amount { font-size: 13px; font-weight: 600; color: #0369a1; margin-top: 2px; }

  /* ── Mini btn ── */
  .mini-btn {
    font-size: 11px; padding: 5px 12px; border-radius: 6px;
    cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500;
    transition: all 0.15s;
  }
  .mini-btn.accept {
    border: none; background: #0284c7; color: #fff;
  }
  .mini-btn.accept:hover { background: #0369a1; }
  .mini-btn.decline {
    border: 0.5px solid #fca5a5; background: #fff5f5; color: #dc2626;
  }
  .mini-btn.decline:hover { background: #fee2e2; }
  .mini-btn.neutral {
    border: 0.5px solid rgba(99,120,210,0.22); background: #f8faff; color: #64748b;
  }
  .mini-btn.neutral:hover { border-color: #38bdf8; color: #0284c7; }

  /* ── Full panel ── */
  .full-panel {
    background: #fff;
    border: 0.5px solid rgba(99,120,210,0.12);
    border-radius: 12px; padding: 20px; margin-bottom: 16px;
  }
  .panel-hd {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-bottom: 16px; padding-bottom: 12px;
    border-bottom: 0.5px solid rgba(99,120,210,0.1);
  }
  .panel-title { font-size: 14px; font-weight: 600; color: #0f172a; }
`;