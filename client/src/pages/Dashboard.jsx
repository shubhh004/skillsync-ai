import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import StatCard from '../components/dashboard/StatCard';
import DsaStatsCard from '../components/dashboard/DsaStatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import { getProblems } from '../services/dsaService';

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-neutral-100 rounded-xl ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
      </div>
      <Skeleton className="h-28" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getProblems()
      .then(setProblems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total     = problems.length;
    const solved    = problems.filter((p) => p.status === 'Solved').length;
    const attempted = problems.filter((p) => p.status === 'Attempted').length;
    const todo      = problems.filter((p) => p.status === 'Todo').length;
    const solvedPct = total ? Math.round((solved / total) * 100) : 0;
    return { total, solved, attempted, todo, solvedPct };
  }, [problems]);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <WelcomeCard />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            label="Total Problems"
            value={String(stats.total)}
            delta="problems logged"
            positive={true}
            icon="code"
          />
          <StatCard
            label="Solved"
            value={String(stats.solved)}
            delta={stats.total ? `${stats.solvedPct}% of total` : 'none yet'}
            positive={true}
            icon="code"
          />
          <StatCard
            label="Attempted"
            value={String(stats.attempted)}
            delta="in progress"
            positive={true}
            icon="code"
          />
          <StatCard
            label="Todo"
            value={String(stats.todo)}
            delta="remaining"
            positive={stats.todo === 0}
            icon="code"
          />
        </div>

        <DsaStatsCard problems={problems} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity problems={problems} />
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
}
