import DashboardLayout from '../layouts/DashboardLayout';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import StatCard from '../components/dashboard/StatCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';

const stats = [
  { label: 'Problems Solved',  value: '142', delta: '12 this week',  positive: true, icon: 'code'      },
  { label: 'Job Applications', value: '18',  delta: '3 this week',   positive: true, icon: 'briefcase' },
  { label: 'Resume Score',     value: '78%', delta: '5 pts improved', positive: true, icon: 'document'  },
  { label: 'Mock Interviews',  value: '7',   delta: '2 completed',   positive: true, icon: 'chat'      },
];

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <WelcomeCard />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
}
