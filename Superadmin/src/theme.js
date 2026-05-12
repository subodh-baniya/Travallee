// src/theme.js
// Central design tokens for the entire admin panel

export const theme = {
  bg:       "#0a0a0c",
  surface:  "#111115",
  surface2: "#18181e",
  border:   "rgba(255,255,255,0.07)",
  border2:  "rgba(255,255,255,0.13)",
  accent:   "#e8ff47",
  accent2:  "#7c5cfc",
  text:     "#f0f0f4",
  muted:    "#7a7a8c",
  danger:   "#ff4f4f",
  success:  "#3ddc84",
  warning:  "#f5a623",
};

export const globalCSS = `
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
  }

  .content {
    flex: 1;
    overflow-y: auto;
    padding: 20px 22px;
  }

  /* Stat cards */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  .stat-card {
    background: ${theme.surface2};
    border: 1px solid ${theme.border};
    border-radius: 10px;
    padding: 14px 16px;
  }
  .stat-label {
    font-size: 11px;
    color: ${theme.muted};
    margin-bottom: 6px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .stat-val {
    font-size: 22px;
    font-weight: 700;
    color: ${theme.text};
    font-family: 'Space Mono', monospace;
  }
  .stat-change { font-size: 11px; margin-top: 4px; }
  .up { color: ${theme.success}; }
  .dn { color: ${theme.danger}; }

  /* Two column layout */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  /* Panels */
  .panel {
    background: ${theme.surface2};
    border: 1px solid ${theme.border};
    border-radius: 10px;
    padding: 16px;
  }
  .full-panel {
    background: ${theme.surface2};
    border: 1px solid ${theme.border};
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 14px;
  }
  .panel-hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .panel-title {
    font-size: 13px;
    font-weight: 600;
    color: ${theme.text};
  }

  /* Buttons */
  .btn {
    padding: 7px 14px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid ${theme.border2};
    background: ${theme.surface2};
    color: ${theme.text};
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .btn:hover { background: #222230; }
  .btn.primary {
    background: ${theme.accent};
    color: #0a0a0c;
    border-color: ${theme.accent};
    font-weight: 700;
  }
  .btn.primary:hover { background: #d4eb30; }
  .btn.danger {
    background: rgba(255,79,79,0.1);
    color: ${theme.danger};
    border-color: rgba(255,79,79,0.25);
  }
  .mini-btn {
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 5px;
    cursor: pointer;
    border: 1px solid ${theme.border2};
    background: ${theme.surface2};
    color: ${theme.muted};
    font-family: 'DM Sans', sans-serif;
  }
  .mini-btn:hover { color: ${theme.text}; }

  /* Forms */
  .form-row { margin-bottom: 14px; }
  .form-label {
    font-size: 11px;
    color: ${theme.muted};
    margin-bottom: 5px;
    display: block;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .form-input {
    width: 100%;
    background: ${theme.surface};
    border: 1px solid ${theme.border2};
    border-radius: 7px;
    padding: 9px 12px;
    color: ${theme.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
  }
  .form-input:focus { border-color: rgba(232,255,71,0.4); }
  .form-textarea { min-height: 80px; resize: vertical; }

  /* Toggle rows */
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 0;
    border-bottom: 1px solid ${theme.border};
  }
  .toggle-row:last-child { border-bottom: none; }
  .tl { font-size: 13px; color: ${theme.text}; }
  .ts { font-size: 11px; color: ${theme.muted}; margin-top: 2px; }

  /* Activity */
  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid ${theme.border};
  }
  .activity-item:last-child { border-bottom: none; }
  .act-text { font-size: 12px; color: ${theme.text}; line-height: 1.4; }
  .act-time { font-size: 10px; color: ${theme.muted}; margin-top: 2px; }

  /* Quick actions */
  .quick-action {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid ${theme.border};
    background: transparent;
    transition: all 0.15s;
    margin-bottom: 8px;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
  }
  .quick-action:hover { border-color: ${theme.border2}; background: rgba(255,255,255,0.03); }
  .qa-icon {
    width: 34px; height: 34px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .qa-label { font-size: 13px; font-weight: 500; color: ${theme.text}; }
  .qa-sub { font-size: 11px; color: ${theme.muted}; }
  .qa-arrow { margin-left: auto; color: ${theme.muted}; font-size: 14px; }

  /* Ads */
  .ad-card {
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 9px;
    padding: 14px;
    margin-bottom: 10px;
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .ad-title { font-size: 13px; font-weight: 600; color: ${theme.text}; }
  .ad-meta { font-size: 11px; color: ${theme.muted}; margin-top: 3px; }
  .ad-actions { display: flex; gap: 6px; }

  /* Coming soon */
  .coming-card {
    border-left: 3px solid ${theme.accent2};
    background: ${theme.surface};
    border-radius: 0 9px 9px 0;
    padding: 12px 14px;
    margin-bottom: 10px;
  }
  .coming-tag {
    font-size: 10px;
    font-family: 'Space Mono', monospace;
    color: ${theme.accent2};
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .coming-title { font-size: 13px; font-weight: 600; color: ${theme.text}; margin-bottom: 3px; }
  .coming-desc { font-size: 12px; color: ${theme.muted}; line-height: 1.5; }
  .chip { font-size: 10px; padding: 2px 8px; border-radius: 20px; }
  .chip.soon { background: rgba(245,166,35,0.12); color: ${theme.warning}; }
  .chip.dev  { background: rgba(124,92,252,0.12); color: ${theme.accent2}; }
  .chip.done { background: rgba(61,220,132,0.12); color: ${theme.success}; }

  /* Users table */
  .user-table { width: 100%; border-collapse: collapse; }
  .user-table th {
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em;
    color: ${theme.muted}; padding: 8px 10px; text-align: left;
    border-bottom: 1px solid ${theme.border};
  }
  .user-table td {
    font-size: 12px; color: ${theme.text}; padding: 10px;
    border-bottom: 1px solid ${theme.border}; vertical-align: middle;
  }
  .user-table tr:last-child td { border-bottom: none; }
  .user-av {
    width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; color: #fff;
  }
  .role-chip { font-size: 10px; padding: 2px 8px; border-radius: 20px; }
  .role-chip.admin { background: rgba(124,92,252,0.15); color: ${theme.accent2}; }
  .role-chip.user  { background: rgba(122,122,140,0.15); color: ${theme.muted}; }
  .role-chip.mod   { background: rgba(245,166,35,0.12); color: ${theme.warning}; }

  /* Analytics bars */
  .bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .bar-label { font-size: 11px; color: ${theme.muted}; width: 70px; flex-shrink: 0; }
  .bar-track { flex: 1; height: 5px; background: ${theme.surface}; border-radius: 3px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 3px; background: ${theme.accent2}; }
  .bar-val { font-size: 11px; color: ${theme.text}; font-family: 'Space Mono', monospace; width: 36px; text-align: right; }
`;