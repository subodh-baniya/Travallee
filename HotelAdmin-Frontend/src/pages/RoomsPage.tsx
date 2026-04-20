import React from 'react';

const RoomsPage: React.FC = () => {
  const rooms = [
    { number: '101', type: 'Deluxe', capacity: 2, price: 'Rs. 4,200', status: 'available' },
    { number: '102', type: 'Standard', capacity: 1, price: 'Rs. 2,100', status: 'booked' },
    { number: '103', type: 'Suite', capacity: 4, price: 'Rs. 8,400', status: 'available' },
    { number: '105', type: 'Deluxe', capacity: 2, price: 'Rs. 4,200', status: 'maintenance' },
    { number: '208', type: 'Standard', capacity: 1, price: 'Rs. 2,100', status: 'booked' },
    { number: '217', type: 'Standard', capacity: 1, price: 'Rs. 2,100', status: 'available' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Rooms</div>
          <div className="page-sub">Room inventory management</div>
        </div>
        <div className="header-right">
          <button className="btn-primary">+ Add Room</button>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card c1">
          <div className="stat-label">Total Rooms</div>
          <div className="stat-value">50</div>
          <div className="badge ne">All properties</div>
        </div>
        <div className="stat-card c2">
          <div className="stat-label">Available</div>
          <div className="stat-value">13</div>
          <div className="badge up">26% vacancy</div>
        </div>
        <div className="stat-card c3">
          <div className="stat-label">Booked</div>
          <div className="stat-value">37</div>
          <div className="badge up">74% occupied</div>
        </div>
        <div className="stat-card c4">
          <div className="stat-label">Maintenance</div>
          <div className="stat-value">2</div>
          <div className="badge dn">Needs attention</div>
        </div>
      </div>
      <div style={{ marginBottom: '14px' }}>
        <input
          type="text"
          placeholder="🔍  Search room number..."
          style={{ minWidth: '300px' }}
        />
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '14px',
      }}>
        {rooms.map((room) => (
          <div
            key={room.number}
            className="panel"
            style={{
              borderColor: 'var(--border)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'var(--accent)';
              el.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'var(--border)';
              el.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '32px',
                fontWeight: 500,
                color: 'var(--accent)',
                marginBottom: '6px',
              }}>
                {room.number}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--muted)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}>
                {room.type}
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              marginBottom: '10px',
              color: 'var(--muted)',
            }}>
              <span>Capacity: {room.capacity}</span>
              <span style={{ color: 'var(--accent)' }}>{room.price}</span>
            </div>
            <span
              className={`pill ${
                room.status === 'available'
                  ? 'p-avl'
                  : room.status === 'booked'
                  ? 'p-occ'
                  : 'p-mnt'
              }`}
            >
              {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default RoomsPage;
