

export const theme = {
  bg:       "#f0f4ff",
  surface:  "#ffffff",
  surface2: "#f7f9ff",
  border:   "rgba(99,120,210,0.12)",
  border2:  "rgba(99,120,210,0.22)",
  accent:   "#2a52d4",
  accent2:  "#5b7fff",
  text:     "#0f1733",
  muted:    "#6b7aaa",
  danger:   "#e03e3e",
  success:  "#1a9e6e",
  warning:  "#d4860a",
  sidebar:  "#1a2560",
  sidebarText: "rgba(255,255,255,0.6)",
  sidebarActive: "rgba(255,255,255,0.1)",
};

export const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dash-wrap {
    display: flex;
    height: 100vh;
    background: ${theme.bg};
    font-family: 'DM Sans', sans-serif;
    color: ${theme.text};
    overflow: hidden;
  }

  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: ${theme.bg};
  }

  .content {
    flex: 1;
    overflow-y: auto;
    padding: 24px 28px;
  }

  /*  Stat cards  */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 22px;
  }
  .stat-card {
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 12px;
    padding: 18px 20px;
    position: relative;
    overflow: hidden;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${theme.accent}, ${theme.accent2});
    border-radius: 12px 12px 0 0;
  }
  .stat-label {
    font-size: 11px;
    color: ${theme.muted};
    margin-bottom: 8px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }
  .stat-val {
    font-size: 26px;
    font-weight: 700;
    color: ${theme.text};
    font-family: 'Space Mono', monospace;
    letter-spacing: -0.5px;
  }
  .stat-change { font-size: 12px; margin-top: 6px; font-weight: 500; }
  .up { color: ${theme.success}; }
  .dn { color: ${theme.danger}; }

  /*  Layout  */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  /*  Panels  */
  .panel {
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 12px;
    padding: 20px;
  }
  .full-panel {
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
  }
  .panel-hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${theme.border};
  }
  .panel-title {
    font-size: 14px;
    font-weight: 600;
    color: ${theme.text};
  }

  /*  Buttons  */
  .btn {
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid ${theme.border2};
    background: ${theme.surface};
    color: ${theme.text};
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .btn:hover { background: ${theme.surface2}; border-color: ${theme.accent2}; }
  .btn.primary {
    background: ${theme.accent};
    color: #ffffff;
    border-color: ${theme.accent};
    font-weight: 600;
  }
  .btn.primary:hover { background: #1e3fb0; }
  .btn.danger {
    background: rgba(224,62,62,0.06);
    color: ${theme.danger};
    border-color: rgba(224,62,62,0.2);
  }
  .btn.danger:hover { background: rgba(224,62,62,0.1); }
  .mini-btn {
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid ${theme.border2};
    background: ${theme.surface2};
    color: ${theme.muted};
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .mini-btn:hover { color: ${theme.accent}; border-color: ${theme.accent2}; }

  /*  Forms  */
  .form-row { margin-bottom: 16px; }
  .form-label {
    font-size: 11px;
    color: ${theme.muted};
    margin-bottom: 6px;
    display: block;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }
  .form-input {
    width: 100%;
    background: ${theme.surface2};
    border: 1px solid ${theme.border2};
    border-radius: 8px;
    padding: 10px 13px;
    color: ${theme.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
    transition: border 0.15s, background 0.15s;
  }
  .form-input:focus {
    border-color: ${theme.accent};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(42,82,212,0.08);
  }
  .form-textarea { min-height: 90px; resize: vertical; }

  /*  Toggle rows  */
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid ${theme.border};
  }
  .toggle-row:last-child { border-bottom: none; }
  .tl { font-size: 13px; color: ${theme.text}; font-weight: 500; }
  .ts { font-size: 12px; color: ${theme.muted}; margin-top: 2px; }

  /*  Activity  */
  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid ${theme.border};
  }
  .activity-item:last-child { border-bottom: none; }
  .act-text { font-size: 13px; color: ${theme.text}; line-height: 1.5; }
  .act-time { font-size: 11px; color: ${theme.muted}; margin-top: 2px; }

  /*  Quick actions  */
  .quick-action {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 10px;
    cursor: pointer;
    border: 1px solid ${theme.border};
    background: ${theme.surface2};
    transition: all 0.15s;
    margin-bottom: 10px;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    text-align: left;
  }
  .quick-action:hover {
    border-color: ${theme.accent2};
    background: #eef2ff;
    transform: translateX(2px);
  }
  .qa-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; flex-shrink: 0;
  }
  .qa-label { font-size: 13px; font-weight: 600; color: ${theme.text}; }
  .qa-sub { font-size: 11px; color: ${theme.muted}; margin-top: 2px; }
  .qa-arrow { margin-left: auto; color: ${theme.muted}; font-size: 16px; }

  /*  Ads  */
  .ad-card {
    background: ${theme.surface2};
    border: 1px solid ${theme.border};
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 10px;
    display: flex;
    gap: 12px;
    align-items: center;
    transition: border 0.15s;
  }
  .ad-card:hover { border-color: ${theme.border2}; }
  .ad-title { font-size: 13px; font-weight: 600; color: ${theme.text}; }
  .ad-meta { font-size: 11px; color: ${theme.muted}; margin-top: 3px; }
  .ad-actions { display: flex; gap: 6px; }

  /*  Coming soon  */
  .coming-card {
    border-left: 3px solid ${theme.accent};
    background: ${theme.surface2};
    border-radius: 0 10px 10px 0;
    padding: 14px 16px;
    margin-bottom: 10px;
    transition: background 0.15s;
  }
  .coming-card:hover { background: #eef2ff; }
  .coming-tag {
    font-size: 10px;
    font-family: 'Space Mono', monospace;
    color: ${theme.accent};
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .coming-title { font-size: 13px; font-weight: 600; color: ${theme.text}; margin-bottom: 4px; }
  .coming-desc { font-size: 12px; color: ${theme.muted}; line-height: 1.6; }
  .chip { font-size: 10px; padding: 3px 9px; border-radius: 20px; font-weight: 500; }
  .chip.soon { background: rgba(212,134,10,0.1); color: ${theme.warning}; }
  .chip.dev  { background: rgba(91,127,255,0.1); color: ${theme.accent2}; }
  .chip.done { background: rgba(26,158,110,0.1); color: ${theme.success}; }

  /*  Users table  */
  .user-table { width: 100%; border-collapse: collapse; }
  .user-table th {
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em;
    color: ${theme.muted}; padding: 10px 12px; text-align: left;
    border-bottom: 1px solid ${theme.border}; font-weight: 600;
    background: ${theme.surface2};
  }
  .user-table td {
    font-size: 13px; color: ${theme.text}; padding: 12px;
    border-bottom: 1px solid ${theme.border}; vertical-align: middle;
  }
  .user-table tr:last-child td { border-bottom: none; }
  .user-table tbody tr:hover td { background: ${theme.surface2}; }
  .user-av {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #fff;
  }
  .role-chip { font-size: 11px; padding: 3px 10px; border-radius: 20px; font-weight: 500; }
  .role-chip.admin { background: rgba(42,82,212,0.1); color: ${theme.accent}; }
  .role-chip.user  { background: rgba(107,122,170,0.1); color: ${theme.muted}; }
  .role-chip.mod   { background: rgba(212,134,10,0.1); color: ${theme.warning}; }

  /*  Analytics bars  */
  .bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .bar-label { font-size: 12px; color: ${theme.muted}; width: 70px; flex-shrink: 0; font-weight: 500; }
  .bar-track { flex: 1; height: 6px; background: ${theme.surface2}; border-radius: 6px; overflow: hidden; border: 1px solid ${theme.border}; }
  .bar-fill { height: 100%; border-radius: 6px; background: ${theme.accent}; }
  .bar-val { font-size: 12px; color: ${theme.text}; font-family: 'Space Mono', monospace; width: 36px; text-align: right; font-weight: 700; }
`;