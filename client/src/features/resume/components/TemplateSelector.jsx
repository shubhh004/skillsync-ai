import Card from '../../../components/ui/Card';

const templates = [
  {
    id: 1,
    label: 'Classic',
    preview: (
      <div className="space-y-1 p-2">
        <div className="h-2 w-3/4 bg-neutral-800 rounded" />
        <div className="h-1 w-1/2 bg-neutral-300 rounded" />
        <div className="mt-2 h-px bg-neutral-300" />
        <div className="mt-1 space-y-0.5">
          <div className="h-1 w-1/3 bg-neutral-500 rounded" />
          <div className="h-1 w-full bg-neutral-200 rounded" />
          <div className="h-1 w-5/6 bg-neutral-200 rounded" />
        </div>
        <div className="mt-2 h-px bg-neutral-300" />
        <div className="mt-1 space-y-0.5">
          <div className="h-1 w-1/3 bg-neutral-500 rounded" />
          <div className="h-1 w-full bg-neutral-200 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 2,
    label: 'Modern',
    preview: (
      <div className="space-y-1 p-2">
        <div className="bg-brand-600 rounded px-1.5 py-1 space-y-0.5">
          <div className="h-2 w-3/4 bg-white/80 rounded" />
          <div className="h-1 w-1/2 bg-white/50 rounded" />
        </div>
        <div className="mt-1 space-y-0.5">
          <div className="h-1 w-1/3 bg-brand-500 rounded" />
          <div className="h-1 w-full bg-neutral-200 rounded" />
          <div className="h-1 w-5/6 bg-neutral-200 rounded" />
        </div>
        <div className="mt-1 space-y-0.5">
          <div className="h-1 w-1/3 bg-brand-500 rounded" />
          <div className="h-1 w-full bg-neutral-200 rounded" />
        </div>
      </div>
    ),
  },
];

export default function TemplateSelector({ activeTemplate, onSelect }) {
  return (
    <Card padding={false} className="p-4">
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Template</p>
      <div className="flex gap-3">
        {templates.map(({ id, label, preview }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={[
              'flex-1 rounded-lg border-2 overflow-hidden transition-colors duration-150 text-left',
              activeTemplate === id
                ? 'border-brand-600'
                : 'border-neutral-200 hover:border-neutral-300',
            ].join(' ')}
          >
            <div className="bg-white">{preview}</div>
            <div
              className={[
                'px-2 py-1 text-xs font-medium text-center',
                activeTemplate === id
                  ? 'bg-brand-600 text-white'
                  : 'bg-neutral-50 text-neutral-600',
              ].join(' ')}
            >
              {label}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
