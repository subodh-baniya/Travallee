import React from 'react';

const ReportsPage: React.FC = () => {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Reports</div>
          <div className="page-sub">Performance analytics and insights</div>
        </div>
        <div className="header-right">
          <select className="select-mini">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
          <button className="btn-primary">⬇ Export Report</button>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card c1">
          <div className="stat-label">Revenue</div>
          <div className="stat-value">Rs. 1,25,018</div>
          <div className="badge up">↑ 12.4%</div>
        </div>
        <div className="stat-card c2">
          <div className="stat-label">Avg Occupancy</div>
          <div className="stat-value">74%</div>
          <div className="badge up">↑ 5% vs last</div>
        </div>
        <div className="stat-card c3">
          <div className="stat-label">Total Guests</div>
          <div className="stat-value">142</div>
          <div className="badge up">↑ 18 new</div>
        </div>
        <div className="stat-card c4">
          <div className="stat-label">Avg Rating</div>
          <div className="stat-value">4.7</div>
          <div className="badge up">↑ 0.2 points</div>
        </div>
      </div>
      <div className="rp-grid">
        <div className="rp-card">
          <div className="rp-title">
            Revenue by Room Type{' '}
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: "'DM Sans'" }}>
              This Month
            </span>
          </div>
          <div className="br-row">
            <div className="br-lbl">Suite</div>
            <div className="br-trk">
              <div className="br-fill" style={{ width: '82%' }}></div>
            </div>
            <div className="br-val">Rs. 84,000</div>
          </div>
          <div className="br-row">
            <div className="br-lbl">Deluxe</div>
            <div className="br-trk">
              <div className="br-fill" style={{ width: '55%' }}></div>
            </div>
            <div className="br-val">Rs. 56,700</div>
          </div>
          <div className="br-row">
            <div className="br-lbl">Standard</div>
            <div className="br-trk">
              <div className="br-fill g" style={{ width: '34%' }}></div>
            </div>
            <div className="br-val">Rs. 35,700</div>
          </div>
          <div className="br-row">
            <div className="br-lbl">Restaurant</div>
            <div className="br-trk">
              <div className="br-fill b" style={{ width: '28%' }}></div>
            </div>
            <div className="br-val">Rs. 18,400</div>
          </div>
        </div>
        <div className="rp-card">
          <div className="rp-title">
            Occupancy by Day{' '}
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: "'DM Sans'" }}>
              This Week
            </span>
          </div>
          <div className="br-row">
            <div className="br-lbl">Mon</div>
            <div className="br-trk">
              <div className="br-fill g" style={{ width: '62%' }}></div>
            </div>
            <div className="br-val">62%</div>
          </div>
          <div className="br-row">
            <div className="br-lbl">Tue</div>
            <div className="br-trk">
              <div className="br-fill g" style={{ width: '70%' }}></div>
            </div>
            <div className="br-val">70%</div>
          </div>
          <div className="br-row">
            <div className="br-lbl">Wed</div>
            <div className="br-trk">
              <div className="br-fill g" style={{ width: '68%' }}></div>
            </div>
            <div className="br-val">68%</div>
          </div>
          <div className="br-row">
            <div className="br-lbl">Thu</div>
            <div className="br-trk">
              <div className="br-fill g" style={{ width: '76%' }}></div>
            </div>
            <div className="br-val">76%</div>
          </div>
          <div className="br-row">
            <div className="br-lbl">Fri</div>
            <div className="br-trk">
              <div className="br-fill g" style={{ width: '88%' }}></div>
            </div>
            <div className="br-val">88%</div>
          </div>
          <div className="br-row">
            <div className="br-lbl">Sat</div>
            <div className="br-trk">
              <div className="br-fill" style={{ width: '94%' }}></div>
            </div>
            <div className="br-val">94%</div>
          </div>
          <div className="br-row">
            <div className="br-lbl">Sun</div>
            <div className="br-trk">
              <div className="br-fill" style={{ width: '80%' }}></div>
            </div>
            <div className="br-val">80%</div>
          </div>
        </div>
        <div className="rp-card">
          <div className="rp-title">Financial Summary</div>
          <div className="sum-rows">
            <div className="sum-row">
              <span>Total Revenue</span>
              <span className="sum-val" style={{ color: 'var(--green)' }}>
                Rs. 1,25,018
              </span>
            </div>
            <div className="sum-row">
              <span>Total Expenses</span>
              <span className="sum-val" style={{ color: 'var(--red)' }}>
                Rs. 37,505
              </span>
            </div>
            <div className="sum-row">
              <span>Net Profit</span>
              <span className="sum-val" style={{ color: 'var(--accent)' }}>
                Rs. 87,513
              </span>
            </div>
            <div className="sum-row">
              <span>Commission Paid</span>
              <span className="sum-val" style={{ color: 'var(--muted)' }}>
                Rs. 9,243
              </span>
            </div>
            <div className="sum-row">
              <span>Restaurant Revenue</span>
              <span className="sum-val" style={{ color: 'var(--blue)' }}>
                Rs. 18,400
              </span>
            </div>
          </div>
        </div>
        <div className="rp-card">
          <div className="rp-title">Top Performing Rooms</div>
          <div className="br-row">
            <div className="br-lbl">Room 310</div>
            <div className="br-trk">
              <div className="br-fill" style={{ width: '90%' }}></div>
            </div>
            <div className="br-val">Rs. 42,000</div>
          </div>
          <div className="br-row">
            <div className="br-lbl">Room 402</div>
            <div className="br-trk">
              <div className="br-fill" style={{ width: '72%' }}></div>
            </div>
            <div className="br-val">Rs. 33,600</div>
          </div>
          <div className="br-row">
            <div className="br-lbl">Room 101</div>
            <div className="br-trk">
              <div className="br-fill g" style={{ width: '58%' }}></div>
            </div>
            <div className="br-val">Rs. 16,800</div>
          </div>
          <div className="br-row">
            <div className="br-lbl">Room 208</div>
            <div className="br-trk">
              <div className="br-fill g" style={{ width: '44%' }}></div>
            </div>
            <div className="br-val">Rs. 10,500</div>
          </div>
          <div className="br-row">
            <div className="br-lbl">Room 105</div>
            <div className="br-trk">
              <div className="br-fill b" style={{ width: '38%' }}></div>
            </div>
            <div className="br-val">Rs. 12,600</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
