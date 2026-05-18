import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        {children}
      </main>
      <style>{`
        .app-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .app-main {
          flex: 1;
          padding: 2rem 0;
        }

        @media (max-width: 640px) {
          .app-main {
            padding: 1.25rem 0 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
