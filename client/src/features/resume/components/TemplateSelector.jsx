// Template thumbnails use hardcoded inline styles — isolated from app dark theme
const templates = [
  {
    id: 1,
    label: 'Classic',
    preview: (
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ height: '9px', width: '70%', background: '#1F2937', borderRadius: '2px' }} />
        <div style={{ height: '4px', width: '45%', background: '#9CA3AF', borderRadius: '2px' }} />
        <div style={{ height: '1px', background: '#D1D5DB', margin: '4px 0 3px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ height: '4px', width: '30%', background: '#6B7280', borderRadius: '2px' }} />
          <div style={{ height: '3px', width: '100%', background: '#E5E7EB', borderRadius: '2px' }} />
          <div style={{ height: '3px', width: '80%', background: '#E5E7EB', borderRadius: '2px' }} />
        </div>
        <div style={{ height: '1px', background: '#D1D5DB', margin: '2px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ height: '4px', width: '30%', background: '#6B7280', borderRadius: '2px' }} />
          <div style={{ height: '3px', width: '100%', background: '#E5E7EB', borderRadius: '2px' }} />
        </div>
      </div>
    ),
  },
  {
    id: 2,
    label: 'Modern',
    preview: (
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ background: '#4338CA', borderRadius: '4px', padding: '7px 8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ height: '8px', width: '70%', background: 'rgba(255,255,255,0.85)', borderRadius: '2px' }} />
          <div style={{ height: '3px', width: '45%', background: 'rgba(255,255,255,0.5)', borderRadius: '2px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
          <div style={{ height: '4px', width: '30%', background: '#6366F1', borderRadius: '2px' }} />
          <div style={{ height: '3px', width: '100%', background: '#E5E7EB', borderRadius: '2px' }} />
          <div style={{ height: '3px', width: '80%', background: '#E5E7EB', borderRadius: '2px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ height: '4px', width: '30%', background: '#6366F1', borderRadius: '2px' }} />
          <div style={{ height: '3px', width: '100%', background: '#E5E7EB', borderRadius: '2px' }} />
        </div>
      </div>
    ),
  },
];

export default function TemplateSelector({ activeTemplate, onSelect }) {
  return (
    <div className="card p-4">
      <p className="text-label text-neutral-500 mb-3">Template</p>
      <div className="flex gap-2.5">
        {templates.map(({ id, label, preview }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={[
              'flex-1 rounded-xl overflow-hidden transition-all duration-200 text-left',
              activeTemplate === id
                ? '-translate-y-0.5 shadow-glow-sm'
                : 'hover:-translate-y-0.5 hover:shadow-card-hover',
            ].join(' ')}
            style={activeTemplate === id
              ? { outline: '2px solid #6366f1', outlineOffset: '1px', boxShadow: '0 0 14px rgba(99,102,241,0.3)' }
              : { outline: '1px solid rgba(255,255,255,0.1)' }
            }
          >
            {/* White doc thumbnail — must stay white regardless of app theme */}
            <div style={{ background: '#ffffff' }}>{preview}</div>
            <div
              className="px-2 py-1.5 text-[11px] font-semibold text-center transition-all duration-200"
              style={activeTemplate === id
                ? { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white' }
                : { background: 'rgba(255,255,255,0.04)', color: '#6b7280' }
              }
            >
              {label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
