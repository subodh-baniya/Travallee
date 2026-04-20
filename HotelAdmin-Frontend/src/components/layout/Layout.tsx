import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <TopBar title={title} />
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          background: 'var(--bg)',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
