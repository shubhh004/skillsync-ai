import Card from '../../../components/ui/Card';

// Template thumbnails use hardcoded colors so they look like mini white documents
// regardless of app theme. The neutral classes on bg-* would be remapped to dark
// values in the dark theme, making the thumbnails invisible on white.
const templates = [
  {
    id: 1,
    label: 'Classic',
    preview: (
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ height: '8px', width: '75%', background: '#1F2937', borderRadius: '2px' }} />
        <div style={{ height: '4px', width: '50%', background: '#9CA3AF', borderRadius: '2px' }} />
        <div style={{ height: '1px', background: '#D1D5DB', margin: '4px 0 2px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ height: '4px', width: '33%', background: '#6B7280', borderRadius: '2px' }} />
          <div style={{ height: '4px', width: '100%', background: '#E5E7EB', borderRadius: '2px' }} />
          <div style={{ height: '4px', width: '83%', background: '#E5E7EB', borderRadius: '2px' }} />
        </div>
        <div style={{ height: '1px', background: '#D1D5DB', margin: '2px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ height: '4px', width: '33%', background: '#6B7280', borderRadius: '2px' }} />
          <div style={{ height: '4px', width: '100%', background: '#E5E7EB', borderRadius: '2px' }} />
        </div>
      </div>
    ),
  },
  {
    id: 2,
    label: 'Modern',
    preview: (
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ background: '#4338CA', borderRadius: '3px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ height: '8px', width: '75%', background: 'rgba(255,255,255,0.8)', borderRadius: '2px' }} />
          <div style={{ height: '4px', width: '50%', background: 'rgba(255,255,255,0.5)', borderRadius: '2px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
          <div style={{ height: '4px', width: '33%', background: '#6366F1', borderRadius: '2px' }} />
          <div style={{ height: '4px', width: '100%', background: '#E5E7EB', borderRadius: '2px' }} />
          <div style={{ height: '4px', width: '83%', background: '#E5E7EB', borderRadius: '2px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ height: '4px', width: '33%', background: '#6366F1', borderRadius: '2px' }} />
          <div style={{ height: '4px', width: '100%', background: '#E5E7EB', borderRadius: '2px' }} />
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
                ? 'border-brand-500'
                : 'border-neutral-200 hover:border-neutral-300',
            ].join(' ')}
          >
            {/* White document thumbnail — isolated from app theme */}
            <div style={{ background: '#ffffff' }}>{preview}</div>
            <div
              className={[
                'px-2 py-1 text-xs font-medium text-center',
                activeTemplate === id
                  ? 'bg-brand-500 text-white'
                  : 'bg-neutral-200 text-neutral-600',
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
