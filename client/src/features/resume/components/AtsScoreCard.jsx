import Card from '../../../components/ui/Card';

const checks = [
  { label: 'Summary section included',          pass: true  },
  { label: 'Skills section is comprehensive',   pass: true  },
  { label: 'Contact details complete',          pass: true  },
  { label: 'Quantify achievements with numbers', pass: false },
  { label: 'Add more role-specific keywords',   pass: false },
];

export default function AtsScoreCard() {
  const score = 78;

  return (
    <Card padding={false} className="p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">ATS Score</p>
        <span className="text-lg font-bold text-brand-600">{score}<span className="text-xs text-neutral-400 font-normal">/100</span></span>
      </div>

      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-brand-600 rounded-full transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>

      <ul className="space-y-1.5">
        {checks.map(({ label, pass }) => (
          <li key={label} className="flex items-start gap-2">
            <span className={`mt-0.5 flex-shrink-0 text-xs font-bold ${pass ? 'text-success-500' : 'text-warning-500'}`}>
              {pass ? '✓' : '!'}
            </span>
            <span className={`text-xs ${pass ? 'text-neutral-600' : 'text-neutral-700'}`}>{label}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
