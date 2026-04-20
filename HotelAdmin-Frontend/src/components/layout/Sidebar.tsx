import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div style={{
      width: '240px',
      height: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: '16px 14px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--accent)',
        }}>
          Luxe
        </div>
        <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
          HOTEL MANAGEMENT
        </div>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Main Section */}
        <div
          onClick={() => toggleSection('main')}
          style={{
            padding: '12px 14px',
            fontSize: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
          }}
        >
          <span>Main</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
            transform: expandedSections.includes('main') ? 'rotate(180deg)' : 'rotate(0)',
          }}>
            ▼
          </span>
        </div>
        {expandedSections.includes('main') && (
          <div>
            {[
              { label: 'Dashboard', path: '/dashboard', icon: '■' },
              { label: 'Reservations', path: '/bookings', icon: '▬' },
              { label: 'Guests', path: '/guests', icon: '●' },
              { label: 'Messages', path: '/chat', icon: '◆' },
            ].map((item) => (
              <a
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  marginLeft: '8px',
                  marginTop: '6px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  textDecoration: 'none',
                  color: isActive(item.path) ? 'var(--accent)' : 'var(--text)',
                  background: isActive(item.path) ? 'rgba(44, 62, 80, 0.1)' : 'transparent',
                  border: isActive(item.path) ? '1px solid rgba(44, 62, 80, 0.2)' : 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* Operations Section */}}
        <div
          onClick={() => toggleSection('operations')}
          style={{
            padding: '12px 14px',
            fontSize: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
          }}
        >
          <span>Operations</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
            transform: expandedSections.includes('operations') ? 'rotate(180deg)' : 'rotate(0)',
          }}>
            ▼
          </span>
        </div>
        {expandedSections.includes('operations') && (
          <div>
            {[
              { label: 'Rooms', path: '/rooms', icon: '■' },
              { label: 'Reviews', path: '/reviews', icon: '★' },
            ].map((item) => (
              <a
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  marginLeft: '8px',
                  marginTop: '6px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  textDecoration: 'none',
                  color: isActive(item.path) ? 'var(--accent)' : 'var(--text)',
                  background: isActive(item.path) ? 'rgba(44, 62, 80, 0.1)' : 'transparent',
                  border: isActive(item.path) ? '1px solid rgba(44, 62, 80, 0.2)' : 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* Business Section */}}
        <div
          onClick={() => toggleSection('business')}
          style={{
            padding: '12px 14px',
            fontSize: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
          }}
        >
          <span>Business</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
            transform: expandedSections.includes('business') ? 'rotate(180deg)' : 'rotate(0)',
          }}>
            ▼
          </span>
        </div>
        {expandedSections.includes('business') && (
          <div>
            {[
              { label: 'Finance', path: '/earnings', icon: '◈' },
            ].map((item) => (
              <a
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  marginLeft: '8px',
                  marginTop: '6px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  textDecoration: 'none',
                  color: isActive(item.path) ? 'var(--accent)' : 'var(--text)',
                  background: isActive(item.path) ? 'rgba(201, 168, 76, 0.1)' : 'transparent',
                  border: isActive(item.path) ? '1px solid rgba(201, 168, 76, 0.2)' : 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--border)',
        fontSize: '12px',
      }}>
        <div style={{ color: 'var(--text)' }}>Admin</div>
        <div style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '2px' }}>
          profile@luxe.com
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
