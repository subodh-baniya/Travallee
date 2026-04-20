import React from 'react';

const GuestsPage: React.FC = () => {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Guests</div>
          <div className="page-sub">All registered guests</div>
        </div>
        <div className="header-right">
          <button className="btn-primary">+ Add Guest</button>
        </div>
      </div>
      <div className="fbar">
        <input type="text" placeholder="🔍  Search guest name or email..." />
        <select>
          <option>All Guests</option>
          <option>Current Stay</option>
          <option>Checked Out</option>
          <option>VIP</option>
        </select>
      </div>
      <div className="gc-grid">
        <div className="gc">
          <div className="gc-top">
            <div className="gc-av" style={{ background: 'rgba(44,62,80,0.15)', color: 'var(--accent)' }}>
              PS
            </div>
            <div>
              <div className="gc-name">Priya Sharma</div>
              <div className="gc-since">Guest since Jan 2025</div>
            </div>
          </div>
          <div className="gc-row">
            Room <span>101 – Deluxe</span>
          </div>
          <div className="gc-row">
            Check-out <span>Mar 29, 2026</span>
          </div>
          <div className="gc-row">
            Total Stays <span>4</span>
          </div>
          <div className="gc-row">
            Total Spent <span>Rs. 42,000</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <span className="pill p-cfm">Current Stay</span>
          </div>
        </div>
        <div className="gc">
          <div className="gc-top">
            <div className="gc-av" style={{ background: 'rgba(92,158,224,0.15)', color: 'var(--blue)' }}>
              DL
            </div>
            <div>
              <div className="gc-name">David Lee</div>
              <div className="gc-since">Guest since Mar 2026</div>
            </div>
          </div>
          <div className="gc-row">
            Room <span>310 – Suite</span>
          </div>
          <div className="gc-row">
            Check-out <span>Apr 1, 2026</span>
          </div>
          <div className="gc-row">
            Total Stays <span>1</span>
          </div>
          <div className="gc-row">
            Total Spent <span>Rs. 42,000</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <span className="pill p-cfm">Current Stay</span>
          </div>
        </div>
        <div className="gc">
          <div className="gc-top">
            <div className="gc-av" style={{ background: 'rgba(76,175,125,0.15)', color: 'var(--green)' }}>
              AG
            </div>
            <div>
              <div className="gc-name">Aisha Gurung</div>
              <div className="gc-since">Guest since Nov 2024</div>
            </div>
          </div>
          <div className="gc-row">
            Room <span>208 – Standard</span>
          </div>
          <div className="gc-row">
            Check-out <span>Mar 30, 2026</span>
          </div>
          <div className="gc-row">
            Total Stays <span>7</span>
          </div>
          <div className="gc-row">
            Total Spent <span>Rs. 89,600</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <span className="pill p-cfm">Current Stay</span>
          </div>
        </div>
        <div className="gc">
          <div className="gc-top">
            <div className="gc-av" style={{ background: 'rgba(155,127,232,0.15)', color: 'var(--blue)' }}>
              MK
            </div>
            <div>
              <div className="gc-name">Maya Karki</div>
              <div className="gc-since">Guest since Feb 2026</div>
            </div>
          </div>
          <div className="gc-row">
            Room <span>217 – Standard</span>
          </div>
          <div className="gc-row">
            Check-out <span>Mar 29, 2026</span>
          </div>
          <div className="gc-row">
            Total Stays <span>2</span>
          </div>
          <div className="gc-row">
            Total Spent <span>Rs. 8,400</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <span className="pill p-pnd">Pending Check-in</span>
          </div>
        </div>
        <div className="gc">
          <div className="gc-top">
            <div className="gc-av" style={{ background: 'rgba(44,62,80,0.1)', color: 'var(--accent)' }}>
              RT
            </div>
            <div>
              <div className="gc-name">Rajan Thapa</div>
              <div className="gc-since">Guest since Aug 2023</div>
            </div>
          </div>
          <div className="gc-row">
            Room <span>305 – Standard</span>
          </div>
          <div className="gc-row">
            Check-out <span>Today</span>
          </div>
          <div className="gc-row">
            Total Stays <span>12</span>
          </div>
          <div className="gc-row">
            Total Spent <span>Rs. 1,12,000</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <span className="pill p-out">Checking Out</span>
          </div>
        </div>
        <div className="gc">
          <div className="gc-top">
            <div className="gc-av" style={{ background: 'rgba(224,92,92,0.1)', color: 'var(--red)' }}>
              SP
            </div>
            <div>
              <div className="gc-name">Sujan Poudel</div>
              <div className="gc-since">Guest since Jun 2024</div>
            </div>
          </div>
          <div className="gc-row">
            Room <span>—</span>
          </div>
          <div className="gc-row">
            Last Stay <span>Mar 27, 2026</span>
          </div>
          <div className="gc-row">
            Total Stays <span>5</span>
          </div>
          <div className="gc-row">
            Total Spent <span>Rs. 67,200</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <span className="pill p-can">Checked Out</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestsPage;
