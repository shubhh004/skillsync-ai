import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Label from '../../../../components/ui/Label';
import Card from '../../../../components/ui/Card';

const TEXTAREA = 'w-full px-3 py-2.5 rounded-md text-sm border border-neutral-300 bg-white text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500 focus:border-brand-500 transition-colors duration-150 resize-none';

const emptyEntry = () => ({ id: Date.now(), role: '', company: '', duration: '', description: '' });

export default function ExperienceSection({ data, onChange }) {
  const handleField = (id, field) => (e) =>
    onChange(data.map((item) => (item.id === id ? { ...item, [field]: e.target.value } : item)));

  return (
    <div className="space-y-4">
      {data.map((item, idx) => (
        <Card key={item.id} padding={false} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Entry {idx + 1}</p>
            {data.length > 0 && (
              <button
                type="button"
                onClick={() => onChange(data.filter((i) => i.id !== item.id))}
                className="text-xs text-danger-500 hover:text-danger-700 font-medium transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`exp-role-${item.id}`} required>Role / Title</Label>
                <Input id={`exp-role-${item.id}`} placeholder="Software Engineering Intern" value={item.role} onChange={handleField(item.id, 'role')} />
              </div>
              <div>
                <Label htmlFor={`exp-company-${item.id}`} required>Company</Label>
                <Input id={`exp-company-${item.id}`} placeholder="TCS" value={item.company} onChange={handleField(item.id, 'company')} />
              </div>
            </div>
            <div>
              <Label htmlFor={`exp-dur-${item.id}`}>Duration</Label>
              <Input id={`exp-dur-${item.id}`} placeholder="May 2024 – Aug 2024" value={item.duration} onChange={handleField(item.id, 'duration')} />
            </div>
            <div>
              <Label htmlFor={`exp-desc-${item.id}`}>Description</Label>
              <textarea id={`exp-desc-${item.id}`} rows={3} placeholder="Describe your responsibilities and achievements..." value={item.description} onChange={handleField(item.id, 'description')} className={TEXTAREA} />
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...data, emptyEntry()])}>
        + Add Experience
      </Button>
    </div>
  );
}
