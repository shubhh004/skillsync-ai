import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useUser } from '../../context/UserContext';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function WelcomeCard() {
  const { user } = useUser();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            👋 {getGreeting()}, {firstName}!
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            You're making great progress. Keep the momentum going.
          </p>
        </div>

        <div className="flex items-center gap-5 sm:flex-shrink-0">
          {/* Streak */}
          <div className="text-center">
            <p className="text-3xl font-bold text-brand-600 leading-none">7</p>
            <p className="text-xs text-neutral-500 mt-1">day streak</p>
          </div>

          <div className="h-10 w-px bg-neutral-200" />

          <Link to="/dsa">
            <Button size="sm">Continue Practicing</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
