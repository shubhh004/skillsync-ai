import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const difficultyStyle = {
  Easy:   'bg-success-100 text-success-700',
  Medium: 'bg-warning-100 text-warning-700',
  Hard:   'bg-danger-100  text-danger-700',
};

const statusStyle = {
  Scheduled:     'bg-brand-50    text-brand-700',
  'In Progress': 'bg-warning-100 text-warning-700',
  Completed:     'bg-success-100 text-success-700',
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

function computeDuration(startedAt, completedAt) {
  if (!startedAt || !completedAt) return null;
  const mins = Math.round((new Date(completedAt) - new Date(startedAt)) / 60000);
  return mins > 0 ? `${mins} min` : null;
}

export default function InterviewCard({ interview, onEdit, onDelete, onView }) {
  const navigate = useNavigate();
  const duration = computeDuration(interview.startedAt, interview.completedAt);
  const qCount   = interview.questions?.length || 0;

  const handleStart = (e) => {
    e.stopPropagation();
    navigate('/interview/session', {
      state: {
        role:        interview.role,
        difficulty:  interview.difficulty,
        interviewId: interview._id,
      },
    });
  };

  return (
    <Card
      padding={false}
      className="p-5 flex flex-col gap-3 cursor-pointer hover:border-neutral-300 hover:shadow-md transition-all duration-150"
      onClick={() => onView(interview)}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-neutral-900 truncate">
            {interview.role || '—'}
          </p>
          <p className="text-sm text-neutral-500 truncate mt-0.5">
            {interview.company || '—'}
          </p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            type="button"
            aria-label="Edit"
            onClick={(e) => { e.stopPropagation(); onEdit(interview); }}
            className="p-1.5 rounded-md text-neutral-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Delete"
            onClick={(e) => { e.stopPropagation(); onDelete(interview); }}
            className="p-1.5 rounded-md text-neutral-400 hover:text-danger-700 hover:bg-danger-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${difficultyStyle[interview.difficulty] ?? 'bg-neutral-100 text-neutral-600'}`}>
          {interview.difficulty}
        </span>
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[interview.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
          {interview.status}
        </span>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-100 pt-2 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>Score: <span className="font-medium text-neutral-700">{interview.score ?? 0}</span></span>
          <span>{formatDate(interview.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span>{qCount} question{qCount !== 1 ? 's' : ''}</span>
          {duration && <><span>·</span><span>{duration}</span></>}
        </div>
      </div>

      {/* Start button */}
      <Button size="sm" fullWidth onClick={handleStart}>
        Start Interview
      </Button>
    </Card>
  );
}
