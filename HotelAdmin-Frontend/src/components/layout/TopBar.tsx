import React from 'react';

interface TopBarProps {
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  return (
    <div style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '20px',
        fontWeight: 500,
        color: 'var(--text)',
      }}>
        {title}
      </h1>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '6px 12px',
        }}>
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>🔍</span>
          <input
            type="text"
            placeholder="Search..."
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text)',
              fontSize: '12px',
              outline: 'none',
              width: '150px',
            }}
          />
        </div>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '14px',
        }}>
          A
        </div>
      </div>
    </div>
  );
};

export default TopBar;
