import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { pageTransition } from '../motion/variants';

export default function DashboardLayout({ children, title, noPadding = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen gradient-mesh overflow-hidden p-3 gap-3">

      {/* Mobile backdrop — animated */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating glass sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden gap-3">

        {/* Floating glass header */}
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content — animated on route change */}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageTransition}
            initial="hidden"
            animate="show"
            exit="exit"
            className={
              noPadding
                ? 'flex-1 flex flex-col overflow-hidden min-h-0'
                : 'flex-1 overflow-y-auto scrollbar-thin p-5 sm:p-6'
            }
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
