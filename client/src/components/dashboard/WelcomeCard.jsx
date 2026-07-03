import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useUser } from '../../context/UserContext';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getMotivationalMessage(readiness) {
  if (readiness === null || readiness === undefined) return "You're making great progress. Keep the momentum going.";
  if (readiness <= 30) return "Let's build your placement profile.";
  if (readiness <= 60) return "You're making good progress.";
  if (readiness <= 80) return "Great work! You're interview ready.";
  return "Outstanding! Keep applying.";
}

function getSmartAction(data) {
  if (!data) return { to: '/dsa', label: 'Continue Practicing' };
  if (data.resumeCompletion < 80) return { to: '/resume',    label: 'Complete Resume'  };
  if (data.dsa.todo > 0)          return { to: '/dsa',       label: 'Continue DSA'     };
  if (data.jobs.total < 5)        return { to: '/jobs',      label: 'Apply to Jobs'    };
  return                                 { to: '/interview', label: 'Start Interview'  };
}

export default function WelcomeCard({ readiness = null, data = null }) {
  const { user }        = useUser();
  const navigate        = useNavigate();
  const firstName       = user?.name?.split(' ')[0] || 'there';
  const { to, label }   = getSmartAction(data);
  const message         = getMotivationalMessage(readiness);

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-neutral-900">
            👋 {getGreeting()}, {firstName}!
          </h2>
          {readiness !== null && (
            <p className="text-xs font-semibold text-brand-400 mt-0.5">
              Placement Readiness: {readiness}%
            </p>
          )}
          <p className="mt-1.5 text-sm text-neutral-500">{message}</p>
        </div>

        <div className="flex items-center gap-5 sm:flex-shrink-0">
          <div className="text-center">
            <p className="text-3xl font-bold text-brand-400 leading-none">7</p>
            <p className="text-xs text-neutral-500 mt-1">day streak</p>
          </div>
          <div className="h-10 w-px bg-neutral-200" />
          <Button size="sm" onClick={() => navigate(to)}>{label}</Button>
        </div>
      </div>
    </Card>
  );
}
