import React from 'react';

const BookingsPage: React.FC = () => {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Reservations</div>
          <div className="page-sub">All guest bookings</div>
        </div>
        <div className="header-right">
          <button className="btn-primary">+ New Reservation</button>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card c1">
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">
            142 <small>this month</small>
          </div>
          <div className="badge up">↑ 8% vs last</div>
        </div>
        <div className="stat-card c2">
          <div className="stat-label">Confirmed</div>
          <div className="stat-value">98</div>
          <div className="badge up">69% of total</div>
        </div>
        <div className="stat-card c3">
          <div className="stat-label">Pending</div>
          <div className="stat-value">31</div>
          <div className="badge ne">Awaiting confirm</div>
        </div>
        <div className="stat-card c4">
          <div className="stat-label">Cancelled</div>
          <div className="stat-value">13</div>
          <div className="badge dn">↑ 2 today</div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            All Reservations{' '}
            <span style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: "'DM Sans'" }}>
              (142)
            </span>
          </div>
        </div>
        <div className="fbar">
          <input type="text" placeholder="🔍  Search guest or room..." />
          <select>
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Cancelled</option>
            <option>Checked Out</option>
          </select>
          <select>
            <option>All Room Types</option>
            <option>Standard</option>
            <option>Deluxe</option>
            <option>Suite</option>
          </select>
          <input type="date" style={{ width: '140px' }} />
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>#</th>
              <th>Guest</th>
              <th>Room</th>
              <th>Type</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: 'var(--muted)' }}>R-1081</td>
              <td>Priya Sharma</td>
              <td>101</td>
              <td>Deluxe</td>
              <td>Mar 27</td>
              <td>Mar 29</td>
              <td>Rs. 8,400</td>
              <td>
                <span className="pill p-cfm">Confirmed</span>
              </td>
              <td>
                <span style={{ cursor: 'pointer', color: 'var(--accent)', fontSize: '12px' }}>
                  ✏ Edit
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>R-1082</td>
              <td>David Lee</td>
              <td>310</td>
              <td>Suite</td>
              <td>Mar 27</td>
              <td>Apr 1</td>
              <td>Rs. 42,000</td>
              <td>
                <span className="pill p-cfm">Confirmed</span>
              </td>
              <td>
                <span style={{ cursor: 'pointer', color: 'var(--accent)', fontSize: '12px' }}>
                  ✏ Edit
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>R-1083</td>
              <td>Maya Karki</td>
              <td>217</td>
              <td>Standard</td>
              <td>Mar 27</td>
              <td>Mar 29</td>
              <td>Rs. 4,200</td>
              <td>
                <span className="pill p-pnd">Pending</span>
              </td>
              <td>
                <span style={{ cursor: 'pointer', color: 'var(--accent)', fontSize: '12px' }}>
                  ✏ Edit
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>R-1084</td>
              <td>Raj Maharjan</td>
              <td>105</td>
              <td>Deluxe</td>
              <td>Mar 28</td>
              <td>Mar 31</td>
              <td>Rs. 12,600</td>
              <td>
                <span className="pill p-pnd">Pending</span>
              </td>
              <td>
                <span style={{ cursor: 'pointer', color: 'var(--accent)', fontSize: '12px' }}>
                  ✏ Edit
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>R-1079</td>
              <td>Aisha Gurung</td>
              <td>208</td>
              <td>Standard</td>
              <td>Mar 25</td>
              <td>Mar 30</td>
              <td>Rs. 10,500</td>
              <td>
                <span className="pill p-cfm">Confirmed</span>
              </td>
              <td>
                <span style={{ cursor: 'pointer', color: 'var(--accent)', fontSize: '12px' }}>
                  ✏ Edit
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>R-1078</td>
              <td>Sujan Poudel</td>
              <td>402</td>
              <td>Suite</td>
              <td>Mar 24</td>
              <td>Mar 27</td>
              <td>Rs. 25,200</td>
              <td>
                <span className="pill p-out">Checked Out</span>
              </td>
              <td>
                <span style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: '12px' }}>
                  View
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>R-1077</td>
              <td>Karen White</td>
              <td>304</td>
              <td>Deluxe</td>
              <td>Mar 23</td>
              <td>Mar 26</td>
              <td>Rs. 12,600</td>
              <td>
                <span className="pill p-can">Cancelled</span>
              </td>
              <td>
                <span style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: '12px' }}>
                  View
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BookingsPage;
