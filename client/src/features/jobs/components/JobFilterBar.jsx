import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const selectClass = [
  'h-10 px-3 rounded-md text-sm border border-neutral-300 bg-white',
  'text-neutral-800 cursor-pointer',
  'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500 focus:border-brand-500',
  'transition-colors duration-150',
].join(' ');

const STATUSES = ['Applied', 'OA', 'Interview', 'HR', 'Offer', 'Rejected', 'Accepted'];

export default function JobFilterBar({ search, status, company, companies, onChange, onClear, hasActiveFilters }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      <div className="flex-1 min-w-48">
        <Input
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => onChange('search', e.target.value)}
        />
      </div>

      <select
        value={status}
        onChange={(e) => onChange('status', e.target.value)}
        className={selectClass}
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <select
        value={company}
        onChange={(e) => onChange('company', e.target.value)}
        className={selectClass}
        aria-label="Filter by company"
      >
        <option value="">All Companies</option>
        {companies.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={onClear}>Clear</Button>
      )}
    </div>
  );
}
