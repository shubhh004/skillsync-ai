import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';
import { UserProvider } from './context/UserContext';
import { useLenis } from './hooks/useLenis';

function AppInner() {
  // Global Lenis instance — applies window-level smooth scroll to all pages.
  // Dashboard pages use h-screen overflow-hidden (no window scroll), so Lenis
  // auto-detects nested overflow-y-auto containers and passes wheel events through
  // to native scroll — no conflict.
  useLenis();
  return <AppRoutes />;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <UserProvider>
          <AppInner />
        </UserProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}
