import React from 'react';

const EarningsPage: React.FC = () => {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Finance</div>
          <div className="page-sub">Transaction history and wallet details</div>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card c1">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value">Rs. 1,25,018</div>
          <div className="badge up">↑ 12% this month</div>
        </div>
        <div className="stat-card c2">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">Rs. 37,505</div>
          <div className="badge ne">0.0% Last Week</div>
        </div>
        <div className="stat-card c3">
          <div className="stat-label">Net Profit</div>
          <div className="stat-value">Rs. 87,513</div>
          <div className="badge up">↑ 70% margin</div>
        </div>
        <div className="stat-card c4">
          <div className="stat-label">Pending Payouts</div>
          <div className="stat-value">Rs. 4,200</div>
          <div className="badge dn">2 pending</div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Transaction Details</div>
        </div>
        <div className="fbar">
          <select>
            <option>Status: All</option>
            <option>Success</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
          <select>
            <option>Type: All</option>
            <option>Credit</option>
            <option>Debit</option>
          </select>
          <input type="date" style={{ width: '140px' }} />
          <input type="date" style={{ width: '140px' }} />
          <button className="btn-export" style={{ marginLeft: 'auto' }}>
            ⬇ Export CSV
          </button>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>SN</th>
              <th>Amount</th>
              <th>Processor</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: 'var(--muted)' }}>1</td>
              <td>Rs. 243.00</td>
              <td style={{ color: 'var(--muted)' }}>Wallet</td>
              <td>
                <span className="pill p-dbt">debit</span>
              </td>
              <td>
                <span className="pill p-suc">success</span>
              </td>
              <td style={{ color: 'var(--muted)' }}>Mar 8, 12:50 PM</td>
              <td style={{ color: 'var(--muted)' }}>commission</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>2</td>
              <td>Rs. 810.00</td>
              <td style={{ color: 'var(--muted)' }}>Wallet</td>
              <td>
                <span className="pill p-crd">credit</span>
              </td>
              <td>
                <span className="pill p-suc">success</span>
              </td>
              <td style={{ color: 'var(--muted)' }}>Mar 8, 12:50 PM</td>
              <td style={{ color: 'var(--muted)' }}>payment</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>3</td>
              <td>Rs. 27.00</td>
              <td style={{ color: 'var(--muted)' }}>Wallet</td>
              <td>
                <span className="pill p-dbt">debit</span>
              </td>
              <td>
                <span className="pill p-suc">success</span>
              </td>
              <td style={{ color: 'var(--muted)' }}>Mar 8, 12:40 PM</td>
              <td style={{ color: 'var(--muted)' }}>commission</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>4</td>
              <td>Rs. 90.00</td>
              <td style={{ color: 'var(--muted)' }}>Wallet</td>
              <td>
                <span className="pill p-crd">credit</span>
              </td>
              <td>
                <span className="pill p-suc">success</span>
              </td>
              <td style={{ color: 'var(--muted)' }}>Mar 8, 12:40 PM</td>
              <td style={{ color: 'var(--muted)' }}>payment</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>5</td>
              <td>Rs. 2,700.00</td>
              <td style={{ color: 'var(--muted)' }}>Wallet</td>
              <td>
                <span className="pill p-dbt">debit</span>
              </td>
              <td>
                <span className="pill p-suc">success</span>
              </td>
              <td style={{ color: 'var(--muted)' }}>Mar 8, 11:14 AM</td>
              <td style={{ color: 'var(--muted)' }}>commission</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>6</td>
              <td>Rs. 9,000.00</td>
              <td style={{ color: 'var(--muted)' }}>Wallet</td>
              <td>
                <span className="pill p-crd">credit</span>
              </td>
              <td>
                <span className="pill p-suc">success</span>
              </td>
              <td style={{ color: 'var(--muted)' }}>Mar 8, 11:14 AM</td>
              <td style={{ color: 'var(--muted)' }}>payment</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>7</td>
              <td>Rs. 8,100.00</td>
              <td style={{ color: 'var(--muted)' }}>Wallet</td>
              <td>
                <span className="pill p-dbt">debit</span>
              </td>
              <td>
                <span className="pill p-suc">success</span>
              </td>
              <td style={{ color: 'var(--muted)' }}>Mar 8, 11:14 AM</td>
              <td style={{ color: 'var(--muted)' }}>commission</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>8</td>
              <td>Rs. 27,000.00</td>
              <td style={{ color: 'var(--muted)' }}>Wallet</td>
              <td>
                <span className="pill p-crd">credit</span>
              </td>
              <td>
                <span className="pill p-suc">success</span>
              </td>
              <td style={{ color: 'var(--muted)' }}>Mar 8, 11:14 AM</td>
              <td style={{ color: 'var(--muted)' }}>payment</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>9</td>
              <td>Rs. 8,100.00</td>
              <td style={{ color: 'var(--muted)' }}>Wallet</td>
              <td>
                <span className="pill p-dbt">debit</span>
              </td>
              <td>
                <span className="pill p-pnd">pending</span>
              </td>
              <td style={{ color: 'var(--muted)' }}>Mar 7, 10:39 AM</td>
              <td style={{ color: 'var(--muted)' }}>commission</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--muted)' }}>10</td>
              <td>Rs. 27,000.00</td>
              <td style={{ color: 'var(--muted)' }}>Wallet</td>
              <td>
                <span className="pill p-crd">credit</span>
              </td>
              <td>
                <span className="pill p-suc">success</span>
              </td>
              <td style={{ color: 'var(--muted)' }}>Mar 7, 10:30 AM</td>
              <td style={{ color: 'var(--muted)' }}>payment</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EarningsPage;
