import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

export default function DashboardLayout({ children, title, noPadding = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen gradient-mesh overflow-hidden p-3 gap-3">

      {/* Mobile backdrop — blur overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Floating glass sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden gap-3">

        {/* Floating glass header */}
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main
          className={
            noPadding
              ? 'flex-1 flex flex-col overflow-hidden min-h-0'
              : 'flex-1 overflow-y-auto scrollbar-thin p-5 sm:p-6'
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
