import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}
