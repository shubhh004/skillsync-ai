import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const TOPICS = [
  'Array', 'String', 'Linked List', 'Stack', 'Queue',
  'Binary Tree', 'Graph', 'Dynamic Programming', 'Binary Search',
  'Two Pointer', 'Heap', 'Design', 'Greedy', 'Sliding Window', 'Backtracking',
];

const selectClass = [
  'h-10 px-3 rounded-md text-sm border border-neutral-300 bg-neutral-100 text-neutral-900',
  'text-neutral-800 cursor-pointer',
  'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500 focus:border-brand-500',
  'transition-colors duration-150',
].join(' ');

export default function DsaFilterBar({ search, topic, difficulty, status, onChange, onClear, hasActiveFilters }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      <div className="flex-1 min-w-48">
        <Input
          placeholder="Search problems or topics..."
          value={search}
          onChange={(e) => onChange('search', e.target.value)}
        />
      </div>

      <select
        value={topic}
        onChange={(e) => onChange('topic', e.target.value)}
        className={selectClass}
        aria-label="Filter by topic"
      >
        <option value="">All Topics</option>
        {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      <select
        value={difficulty}
        onChange={(e) => onChange('difficulty', e.target.value)}
        className={selectClass}
        aria-label="Filter by difficulty"
      >
        <option value="">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <select
        value={status}
        onChange={(e) => onChange('status', e.target.value)}
        className={selectClass}
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        <option value="Solved">Solved</option>
        <option value="Attempted">Attempted</option>
        <option value="Todo">Todo</option>
      </select>

      {hasActiveFilters && (
        <Button variant="ghost" size="md" onClick={onClear}>
          Clear
        </Button>
      )}
    </div>
  );
}
