function ProgressCard({ label, solved, total, barClass, textClass }) {
  const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
  return (
    <div className="card p-5">
      <p className="text-xs font-medium text-neutral-500 tracking-wide">{label}</p>
      <p className="mt-2.5 text-3xl font-bold text-neutral-900 leading-none tracking-tight">{solved}</p>
      <p className="mt-1 text-xs text-neutral-400">of {total} problems</p>
      <div className="mt-3.5 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
        <div
          className={`h-full rounded-full ${barClass} transition-all duration-500 ease-smooth`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={`mt-1.5 text-xs font-semibold ${textClass}`}>{pct}% solved</p>
    </div>
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
      {/* Total */}
      <div className="card-brand p-5">
        <p className="text-xs font-medium text-neutral-500 tracking-wide">Total Logged</p>
        <p className="mt-2.5 text-3xl font-bold text-neutral-900 leading-none tracking-tight">{total}</p>
        <p className="mt-1 text-xs text-neutral-400">across all topics</p>
        <p className="mt-3.5 text-xs font-semibold text-brand-400">
          {solvedOf(problems)} solved · {problems.filter((p) => p.status === 'Attempted').length} attempted
        </p>
      </div>

      <ProgressCard label="Easy"   solved={solvedOf(easy)}   total={easy.length}   barClass="bg-success-500" textClass="text-success-700" />
      <ProgressCard label="Medium" solved={solvedOf(medium)} total={medium.length} barClass="bg-warning-500" textClass="text-warning-700" />
      <ProgressCard label="Hard"   solved={solvedOf(hard)}   total={hard.length}   barClass="bg-danger-500"  textClass="text-danger-700"  />
    </div>
  );
}
