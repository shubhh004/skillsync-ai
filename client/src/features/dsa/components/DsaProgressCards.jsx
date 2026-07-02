import Card from '../../../components/ui/Card';

function ProgressCard({ label, solved, total, color }) {
  const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
  return (
    <Card>
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-neutral-900 leading-none">{solved}</p>
      <p className="mt-1 text-xs text-neutral-400">of {total} problems</p>
      <div className="mt-3 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={`mt-1 text-xs font-medium ${color.replace('bg-', 'text-')}`}>{pct}% solved</p>
    </Card>
  );
}

export default function DsaProgressCards({ problems }) {
  const total   = problems.length;
  const easy    = problems.filter((p) => p.difficulty === 'Easy');
  const medium  = problems.filter((p) => p.difficulty === 'Medium');
  const hard    = problems.filter((p) => p.difficulty === 'Hard');

  const solvedOf = (arr) => arr.filter((p) => p.status === 'Solved').length;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <Card>
        <p className="text-sm font-medium text-neutral-500">Total Logged</p>
        <p className="mt-2 text-3xl font-bold text-neutral-900 leading-none">{total}</p>
        <p className="mt-1 text-xs text-neutral-400">across all topics</p>
        <p className="mt-4 text-xs font-medium text-brand-600">
          {solvedOf(problems)} solved · {problems.filter((p) => p.status === 'Attempted').length} attempted
        </p>
      </Card>

      <ProgressCard label="Easy"   solved={solvedOf(easy)}   total={easy.length}   color="bg-success-500" />
      <ProgressCard label="Medium" solved={solvedOf(medium)} total={medium.length} color="bg-warning-500" />
      <ProgressCard label="Hard"   solved={solvedOf(hard)}   total={hard.length}   color="bg-danger-500"  />
    </div>
  );
}
