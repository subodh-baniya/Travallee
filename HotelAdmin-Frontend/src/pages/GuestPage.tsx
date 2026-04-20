import { useState } from 'react';
import Layout from '../components/layout/Layout';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastStay: string;
  totalSpent: number;
  status: 'active' | 'inactive';
}

const GuestPage: React.FC = () => {
  const [guests] = useState<Guest[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234-567-8901',
      lastStay: '2025-03-15',
      totalSpent: 2450,
      status: 'active',
    },
    {
      id: '2',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      phone: '+1 234-567-8902',
      lastStay: '2025-02-10',
      totalSpent: 1850,
      status: 'active',
    },
    {
      id: '3',
      name: 'Michael Johnson',
      email: 'michael@example.com',
      phone: '+1 234-567-8903',
      lastStay: '2024-12-01',
      totalSpent: 3200,
      status: 'inactive',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { background: 'rgba(76, 175, 125, 0.15)', color: 'var(--green)' };
      case 'inactive':
        return { background: 'rgba(122, 112, 96, 0.15)', color: 'var(--muted)' };
      default:
        return { background: 'transparent', color: 'var(--text)' };
    }
  };

  return (
    <Layout title="Guests">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '26px',
            color: 'var(--text)',
          }}>
            Guest Management
          </h1>
          <button style={{
            background: 'var(--accent)',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '9px',
            fontWeight: 500,
            fontSize: '13px',
            cursor: 'pointer',
          }}>
            + Add Guest
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
          marginBottom: '20px',
        }}>
          {[
            { label: 'Total Guests', value: guests.length, color: 'var(--text)' },
            { label: 'Active', value: guests.filter((g) => g.status === 'active').length, color: 'var(--green)' },
            { label: 'Total Revenue', value: '$' + guests.reduce((sum, g) => sum + g.totalSpent, 0), color: 'var(--accent)' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div style={{
                fontSize: '10px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '8px',
              }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: 600,
                color: stat.color,
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Guests Table */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '18px',
              color: 'var(--text)',
            }}>
              All Guests
            </h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Last Stay</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.id}>
                    <td style={{ color: 'var(--text)', fontWeight: 500 }}>{guest.name}</td>
                    <td style={{ color: 'var(--muted)' }}>{guest.email}</td>
                    <td style={{ color: 'var(--muted)' }}>{guest.phone}</td>
                    <td style={{ color: 'var(--muted)' }}>{guest.lastStay}</td>
                    <td style={{ color: 'var(--accent)' }}>${guest.totalSpent}</td>
                    <td>
                      <span
                        className="pill"
                        style={{
                          ...getStatusColor(guest.status),
                          textTransform: 'capitalize',
                        }}
                      >
                        {guest.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--accent)', cursor: 'pointer' }}>View</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GuestPage;
